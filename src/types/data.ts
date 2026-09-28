/**
 * Data types and interfaces for VisiNinja
 * Based on Stephanie Evergreen's "Effective Data Visualization: The Right Chart for the Right Data"
 */

export type ColumnDataType = 'number' | 'percentage' | 'currency' | 'category' | 'date' | 'text';

export interface DataColumnSummary {
  name: string;
  originalName: string;
  type: ColumnDataType;
  totalCount: number;
  validCount: number;
  missingCount: number;
  missingPercentage: number;
  uniqueCount: number;
  numericValues: number[];
  mean?: number;
  median?: number;
  stdDev?: number;
  min?: number;
  max?: number;
  outlierIndices?: number[];
  sampleValues: (string | number)[];
}

export interface CleaningOptions {
  trimWhitespace: boolean;
  normalizeHeaders: boolean;
  stripCurrencyAndPercent: boolean;
  deduplicateRows: boolean;
  missingDataStrategy: 'keep_annotated' | 'impute_mean' | 'impute_median' | 'fill_zero' | 'drop_row';
  filterEmptyRows: boolean;
  detectOutliers: boolean;
  standardizeDates: boolean;
}

export interface CleaningLogEntry {
  id: string;
  type: 'info' | 'warning' | 'success';
  message: string;
  details?: string;
  cellsAffected?: number;
}

export interface CleanedDataset {
  id: string;
  fileName: string;
  sheetName: string;
  sheetNames: string[];
  rawRows: Record<string, any>[];
  cleanedRows: Record<string, any>[];
  rawHeaders: string[];
  cleanedHeaders: string[];
  columns: DataColumnSummary[];
  logs: CleaningLogEntry[];
  cleaningOptions: CleaningOptions;
  timestamp: number;
  summary: {
    totalRawRows: number;
    totalCleanedRows: number;
    totalColumns: number;
    missingCellsCount: number;
    correctedValuesCount: number;
    duplicatesRemovedCount: number;
  };
}

export type EvergreenCategory =
  | 'single_number'
  | 'comparison'
  | 'benchmark'
  | 'survey_likert'
  | 'parts_of_whole'
  | 'correlation'
  | 'qualitative'
  | 'time_trend';

export interface EvergreenChartMeta {
  id: string;
  name: string;
  category: EvergreenCategory;
  chapter: number;
  ninjaLevel: number; // 0 to 10 scale as in the book
  description: string;
  rationale: string; // Evergreen rationale & Cleveland-McGill tier
  clevelandMcGillTier: string;
  bestFor: string[];
  pros: string[];
  watchOut: string;
}

export interface ChartConfig {
  id: string;
  chartType: string;
  title: string;
  subtitle: string;
  labelColumn: string;
  valueColumns: string[];
  actionCategory?: string;
  actionColor: string; // e.g. #0284c7 (blue), #0d9488 (teal), #f97316 (orange)
  mutedColor: string; // e.g. #94a3b8
  benchmarkValue?: number;
  benchmarkLabel?: string;
  sortOrder: 'none' | 'desc' | 'asc';
  showDataLabels: boolean;
  dataLabelPosition: 'inside' | 'outside' | 'center';
  isPercentage: boolean;
  notes?: string;
}
