/**
 * Intelligent Data Cleaning Engine
 * Cleans messy raw XLSX/CSV tables into structured, typed, publication-ready datasets
 * following the principles outlined in Stephanie Evergreen's "Effective Data Visualization".
 */

import * as XLSX from 'xlsx';
import {
  CleanedDataset,
  CleaningLogEntry,
  CleaningOptions,
  ColumnDataType,
  DataColumnSummary,
} from '../types/data';

export const DEFAULT_CLEANING_OPTIONS: CleaningOptions = {
  trimWhitespace: true,
  normalizeHeaders: true,
  stripCurrencyAndPercent: true,
  deduplicateRows: true,
  missingDataStrategy: 'keep_annotated',
  filterEmptyRows: true,
  detectOutliers: true,
  standardizeDates: true,
};

/**
 * Parses raw ArrayBuffer (from XLSX/CSV file) into raw rows and sheet names
 */
export function parseXlsxBuffer(buffer: ArrayBuffer, fileName: string): { sheetNames: string[]; activeSheet: string; rawRows: Record<string, any>[] } {
  const workbook = XLSX.read(buffer, { type: 'array' });
  const sheetNames = workbook.SheetNames;
  if (!sheetNames || sheetNames.length === 0) {
    throw new Error('No sheets found in workbook.');
  }

  const activeSheet = sheetNames[0];
  const worksheet = workbook.Sheets[activeSheet];
  
  // Convert worksheet to JSON rows with raw headers
  const rawRows: Record<string, any>[] = XLSX.utils.sheet_to_json(worksheet, {
    defval: '',
    raw: false, // get formatted text representations so we can inspect currencies/percents
  });

  return { sheetNames, activeSheet, rawRows };
}

/**
 * Clean and normalize a raw dataset according to options
 */
export function cleanDataset(
  rawRows: Record<string, any>[],
  fileName: string,
  sheetName: string = 'Sheet1',
  options: CleaningOptions = DEFAULT_CLEANING_OPTIONS,
  sheetNames: string[] = [sheetName]
): CleanedDataset {
  const logs: CleaningLogEntry[] = [];
  let correctedValuesCount = 0;
  let duplicatesRemovedCount = 0;

  if (!rawRows || rawRows.length === 0) {
    return {
      id: `ds-${Date.now()}`,
      fileName,
      sheetName,
      sheetNames,
      rawRows: [],
      cleanedRows: [],
      rawHeaders: [],
      cleanedHeaders: [],
      columns: [],
      logs: [{ id: '1', type: 'warning', message: 'The uploaded sheet is empty.' }],
      cleaningOptions: options,
      timestamp: Date.now(),
      summary: {
        totalRawRows: 0,
        totalCleanedRows: 0,
        totalColumns: 0,
        missingCellsCount: 0,
        correctedValuesCount: 0,
        duplicatesRemovedCount: 0,
      },
    };
  }

  // 1. Identify raw headers
  const rawHeaders = Object.keys(rawRows[0] || {});
  
  // 2. Clean headers if requested
  const cleanedHeaderMap = new Map<string, string>();
  const cleanedHeaders: string[] = [];

  rawHeaders.forEach((header, index) => {
    let cleanHeader = header;
    if (options.normalizeHeaders) {
      cleanHeader = header
        .replace(/\s+/g, ' ')
        .trim();
      // Remove trailing punctuation or redundant symbols
      cleanHeader = cleanHeader.replace(/[._-]+$/, '');
      if (!cleanHeader) cleanHeader = `Column_${index + 1}`;
    }
    // Avoid header collision
    let uniqueHeader = cleanHeader;
    let collisionCount = 1;
    while (cleanedHeaders.includes(uniqueHeader)) {
      uniqueHeader = `${cleanHeader}_${collisionCount++}`;
    }
    cleanedHeaderMap.set(header, uniqueHeader);
    cleanedHeaders.push(uniqueHeader);
  });

  if (options.normalizeHeaders) {
    const renamedCount = rawHeaders.filter((h) => h !== cleanedHeaderMap.get(h)).length;
    if (renamedCount > 0) {
      logs.push({
        id: `h-norm-${Date.now()}`,
        type: 'info',
        message: `Normalized and standardized ${renamedCount} column header name(s) (trimmed whitespace and trailing artifacts).`,
        cellsAffected: renamedCount,
      });
    }
  }

  // 3. Process Rows
  let workingRows: Record<string, any>[] = [];

  for (let r = 0; r < rawRows.length; r++) {
    const rawRow = rawRows[r];
    const newRow: Record<string, any> = {};
    let isRowEntirelyEmpty = true;

    for (const rawCol of rawHeaders) {
      const cleanCol = cleanedHeaderMap.get(rawCol) || rawCol;
      let val = rawRow[rawCol];

      if (val !== undefined && val !== null && String(val).trim() !== '') {
        isRowEntirelyEmpty = false;
      }

      if (typeof val === 'string') {
        if (options.trimWhitespace) {
          const trimmed = val.trim();
          if (trimmed !== val) correctedValuesCount++;
          val = trimmed;
        }

        // Clean currency and percentage if requested
        if (options.stripCurrencyAndPercent) {
          // Check for pattern like "$12,345.67", "34%", " 45.2% "
          const isPercent = /^-?\s*\$?\s*[\d,.]+\s*%\s*$/.test(val);
          const isCurrency = /^-?\s*\$\s*[\d,.]+\s*$/.test(val);
          const isStandardNumber = /^-?\s*[\d,]+\.?\d*\s*$/.test(val) && !isNaN(Number(val.replace(/,/g, '')));

          if (isPercent) {
            const numericStr = val.replace(/[%$,\s]/g, '');
            const parsed = parseFloat(numericStr);
            if (!isNaN(parsed)) {
              val = parsed;
              correctedValuesCount++;
            }
          } else if (isCurrency) {
            const numericStr = val.replace(/[\$,\s]/g, '');
            const parsed = parseFloat(numericStr);
            if (!isNaN(parsed)) {
              val = parsed;
              correctedValuesCount++;
            }
          } else if (isStandardNumber && val.includes(',')) {
            const numericStr = val.replace(/,/g, '');
            const parsed = parseFloat(numericStr);
            if (!isNaN(parsed)) {
              val = parsed;
              correctedValuesCount++;
            }
          } else if (!isNaN(Number(val)) && val.trim() !== '') {
            val = Number(val);
          }
        }
      }

      newRow[cleanCol] = val;
    }

    if (options.filterEmptyRows && isRowEntirelyEmpty) {
      // skip entirely empty row
      continue;
    }

    workingRows.push(newRow);
  }

  // 4. Deduplicate rows if requested
  if (options.deduplicateRows) {
    const seen = new Set<string>();
    const deduplicated: Record<string, any>[] = [];

    for (const row of workingRows) {
      const rowKey = JSON.stringify(row);
      if (!seen.has(rowKey)) {
        seen.add(rowKey);
        deduplicated.push(row);
      } else {
        duplicatesRemovedCount++;
      }
    }

    if (duplicatesRemovedCount > 0) {
      logs.push({
        id: `dedup-${Date.now()}`,
        type: 'info',
        message: `Removed ${duplicatesRemovedCount} duplicate row(s) to guarantee accurate reporting.`,
        cellsAffected: duplicatesRemovedCount,
      });
    }

    workingRows = deduplicated;
  }

  // 5. Analyze Columns & Types
  let totalMissingCells = 0;
  const columnSummaries: DataColumnSummary[] = cleanedHeaders.map((colName) => {
    let missingCount = 0;
    const values: any[] = [];
    const numericValues: number[] = [];
    let isPercentCol = false;
    let isCurrencyCol = false;

    // Check header for % or $ indicators
    if (colName.includes('%') || colName.toLowerCase().includes('percent') || colName.toLowerCase().includes('rate')) {
      isPercentCol = true;
    }
    if (colName.includes('$') || colName.toLowerCase().includes('cost') || colName.toLowerCase().includes('sales') || colName.toLowerCase().includes('price')) {
      isCurrencyCol = true;
    }

    for (const row of workingRows) {
      const v = row[colName];
      if (v === undefined || v === null || v === '' || v === 'N/A' || v === 'NA' || v === '-' || v === 'null') {
        missingCount++;
        totalMissingCells++;
      } else {
        values.push(v);
        if (typeof v === 'number' && !isNaN(v)) {
          numericValues.push(v);
        } else if (!isNaN(Number(v))) {
          numericValues.push(Number(v));
        }
      }
    }

    const totalCount = workingRows.length;
    const validCount = totalCount - missingCount;
    const missingPercentage = totalCount > 0 ? (missingCount / totalCount) * 100 : 0;
    const uniqueCount = new Set(values).size;

    // Type inference
    let type: ColumnDataType = 'text';
    if (numericValues.length > validCount * 0.7 && validCount > 0) {
      if (isPercentCol || numericValues.every((n) => n >= 0 && n <= 100 && (n % 1 !== 0 || n <= 1))) {
        type = 'percentage';
      } else if (isCurrencyCol) {
        type = 'currency';
      } else {
        type = 'number';
      }
    } else if (uniqueCount < Math.min(15, totalCount * 0.5)) {
      type = 'category';
    }

    // Statistics
    let mean: number | undefined;
    let median: number | undefined;
    let stdDev: number | undefined;
    let min: number | undefined;
    let max: number | undefined;
    let outlierIndices: number[] = [];

    if (numericValues.length > 0) {
      const sum = numericValues.reduce((a, b) => a + b, 0);
      mean = sum / numericValues.length;

      const sorted = [...numericValues].sort((a, b) => a - b);
      min = sorted[0];
      max = sorted[sorted.length - 1];

      const mid = Math.floor(sorted.length / 2);
      median = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

      // Variance & StdDev
      const variance = numericValues.reduce((acc, val) => acc + Math.pow(val - mean!, 2), 0) / numericValues.length;
      stdDev = Math.sqrt(variance);

      // IQR Outlier detection
      if (sorted.length >= 4 && options.detectOutliers) {
        const q1 = sorted[Math.floor(sorted.length * 0.25)];
        const q3 = sorted[Math.floor(sorted.length * 0.75)];
        const iqr = q3 - q1;
        const lowerBound = q1 - 1.5 * iqr;
        const upperBound = q3 + 1.5 * iqr;

        workingRows.forEach((r, idx) => {
          const val = Number(r[colName]);
          if (!isNaN(val) && (val < lowerBound || val > upperBound)) {
            outlierIndices.push(idx);
          }
        });
      }
    }

    return {
      name: colName,
      originalName: rawHeaders.find((h) => cleanedHeaderMap.get(h) === colName) || colName,
      type,
      totalCount,
      validCount,
      missingCount,
      missingPercentage,
      uniqueCount,
      numericValues,
      mean: mean !== undefined ? Number(mean.toFixed(2)) : undefined,
      median: median !== undefined ? Number(median.toFixed(2)) : undefined,
      stdDev: stdDev !== undefined ? Number(stdDev.toFixed(2)) : undefined,
      min,
      max,
      outlierIndices,
      sampleValues: values.slice(0, 5),
    };
  });

  // 6. Apply Missing Data Strategy
  if (options.missingDataStrategy !== 'keep_annotated') {
    columnSummaries.forEach((col) => {
      if (col.missingCount > 0 && col.numericValues.length > 0) {
        const fillValue =
          options.missingDataStrategy === 'impute_mean'
            ? col.mean ?? 0
            : options.missingDataStrategy === 'impute_median'
            ? col.median ?? 0
            : 0; // 'fill_zero'

        workingRows.forEach((row) => {
          const val = row[col.name];
          if (val === undefined || val === null || val === '' || val === 'N/A' || val === 'NA') {
            row[col.name] = fillValue;
            correctedValuesCount++;
          }
        });
      }
    });

    if (options.missingDataStrategy === 'drop_row') {
      const initialCount = workingRows.length;
      workingRows = workingRows.filter((row) => {
        return Object.values(row).every((v) => v !== undefined && v !== null && v !== '' && v !== 'N/A' && v !== 'NA');
      });
      const dropped = initialCount - workingRows.length;
      if (dropped > 0) {
        logs.push({
          id: `drop-${Date.now()}`,
          type: 'warning',
          message: `Dropped ${dropped} row(s) containing missing or N/A values.`,
          cellsAffected: dropped,
        });
      }
    }
  }

  // 7. Add Evergreen Best-Practice Logs
  if (totalMissingCells > 0) {
    const overallMissingPct = ((totalMissingCells / (workingRows.length * cleanedHeaders.length)) * 100).toFixed(1);
    if (Number(overallMissingPct) < 15) {
      logs.push({
        id: `ev-missing-small-${Date.now()}`,
        type: 'info',
        message: `Evergreen Principle applied: Missing data is small (${overallMissingPct}%). Best practice is to note this in chart subtitles rather than distorting bars.`,
      });
    } else {
      logs.push({
        id: `ev-missing-large-${Date.now()}`,
        type: 'warning',
        message: `Evergreen Principle: Noticeable missing data (${overallMissingPct}%). Add sample size (n=...) to axis labels to preserve reader credibility.`,
      });
    }
  }

  if (correctedValuesCount > 0) {
    logs.push({
      id: `clean-success-${Date.now()}`,
      type: 'success',
      message: `Cleaned and normalized ${correctedValuesCount} cells (converted percentages, removed currency signs, trimmed whitespace).`,
      cellsAffected: correctedValuesCount,
    });
  }

  return {
    id: `ds-${Date.now()}`,
    fileName,
    sheetName,
    sheetNames,
    rawRows,
    cleanedRows: workingRows,
    rawHeaders,
    cleanedHeaders,
    columns: columnSummaries,
    logs,
    cleaningOptions: options,
    timestamp: Date.now(),
    summary: {
      totalRawRows: rawRows.length,
      totalCleanedRows: workingRows.length,
      totalColumns: cleanedHeaders.length,
      missingCellsCount: totalMissingCells,
      correctedValuesCount,
      duplicatesRemovedCount,
    },
  };
}

/**
 * Download dataset as XLSX file
 */
export function exportToXlsx(dataset: CleanedDataset, isCleaned = true) {
  const data = isCleaned ? dataset.cleanedRows : dataset.rawRows;
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, dataset.sheetName || 'Data');
  
  const baseName = dataset.fileName.replace(/\.[^/.]+$/, '');
  const outFileName = `${baseName}_${isCleaned ? 'cleaned_VisiNinja' : 'raw'}.xlsx`;
  XLSX.writeFile(workbook, outFileName);
}

/**
 * Download dataset as CSV file
 */
export function exportToCsv(dataset: CleanedDataset, isCleaned = true) {
  const data = isCleaned ? dataset.cleanedRows : dataset.rawRows;
  const worksheet = XLSX.utils.json_to_sheet(data);
  const csvContent = XLSX.utils.sheet_to_csv(worksheet);
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const baseName = dataset.fileName.replace(/\.[^/.]+$/, '');
  a.href = url;
  a.download = `${baseName}_${isCleaned ? 'cleaned_VisiNinja' : 'raw'}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
