import React, { useRef, useState } from 'react';
import { CleanedDataset, CleaningOptions } from '../../types/data';
import { SAMPLE_DATASETS, SampleDatasetDefinition } from '../../data/sampleDatasets';
import { cleanDataset, parseXlsxBuffer, DEFAULT_CLEANING_OPTIONS } from '../../utils/dataCleaner';
import {
  Upload,
  FileSpreadsheet,
  Sparkles,
  ClipboardPaste,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  FileCheck,
  AlertCircle,
} from 'lucide-react';

interface FeedDataScreenProps {
  currentDataset: CleanedDataset;
  onDatasetLoaded: (dataset: CleanedDataset) => void;
  onNavigateToTab: (tabId: string) => void;
}

export const FeedDataScreen: React.FC<FeedDataScreenProps> = ({
  currentDataset,
  onDatasetLoaded,
  onNavigateToTab,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [pasteModalOpen, setPasteModalOpen] = useState(false);
  const [pastedText, setPastedText] = useState('');
  const [loadingFile, setLoadingFile] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // File Upload Handler (XLSX, XLS, CSV)
  const processUploadedFile = async (file: File) => {
    setLoadingFile(true);
    setErrorMsg(null);
    try {
      const buffer = await file.arrayBuffer();
      const { sheetNames, activeSheet, rawRows } = parseXlsxBuffer(buffer, file.name);

      if (rawRows.length === 0) {
        throw new Error('No data rows found in the selected spreadsheet.');
      }

      const cleaned = cleanDataset(rawRows, file.name, activeSheet, DEFAULT_CLEANING_OPTIONS, sheetNames);
      onDatasetLoaded(cleaned);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to read spreadsheet file. Please check file format.');
    } finally {
      setLoadingFile(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
  };

  // Load Pre-configured Sample Dataset from the Book
  const handleLoadSample = (sample: SampleDatasetDefinition) => {
    const cleaned = cleanDataset(
      sample.rawRows,
      `${sample.name}.xlsx`,
      'SampleData',
      DEFAULT_CLEANING_OPTIONS,
      ['SampleData']
    );
    onDatasetLoaded(cleaned);
  };

  // Process Pasted Tab-Separated or CSV text
  const handleProcessPastedText = () => {
    if (!pastedText.trim()) return;
    try {
      const lines = pastedText.trim().split('\n').map((l) => l.trim()).filter(Boolean);
      if (lines.length < 2) {
        throw new Error('Please paste at least a header row and one data row.');
      }

      // Check delimiter (tab or comma)
      const isTab = lines[0].includes('\t');
      const delimiter = isTab ? '\t' : ',';
      const headers = lines[0].split(delimiter).map((h) => h.trim());

      const rawRows: Record<string, any>[] = [];
      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(delimiter);
        const rowObj: Record<string, any> = {};
        headers.forEach((h, idx) => {
          rowObj[h] = parts[idx] !== undefined ? parts[idx].trim() : '';
        });
        rawRows.push(rowObj);
      }

      const cleaned = cleanDataset(rawRows, 'Pasted_Data.xlsx', 'Sheet1', DEFAULT_CLEANING_OPTIONS);
      onDatasetLoaded(cleaned);
      setPasteModalOpen(false);
      setPastedText('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not parse pasted table.');
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Hero Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-teal-950/70 border border-teal-500/20 rounded-2xl p-4 sm:p-5 shadow-lg">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-teal-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Mobile XLSX Intake</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white font-['Cabinet_Grotesk'] tracking-tight">
              Feed Raw Data & Clean for Evergreen Viz
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Attach raw Excel (.xlsx, .xls) or CSV files. VisiNinja auto-sanitizes headers, fixes currency/percent strings, detects outliers, and matches your data with Stephanie Evergreen's research-proven charts.
            </p>
          </div>
        </div>
      </div>

      {/* Active Dataset Status Chip */}
      {currentDataset && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 border border-teal-500/30">
              <FileCheck className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-100 truncate">{currentDataset.fileName}</div>
              <div className="text-[11px] text-slate-400">
                {currentDataset.summary.totalCleanedRows} rows · {currentDataset.summary.totalColumns} columns · {currentDataset.sheetName}
              </div>
            </div>
          </div>
          <button
            onClick={() => onNavigateToTab('clean')}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 transition-colors shrink-0"
          >
            <span>Review Cleaned</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Attachment Drag & Drop Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[170px] ${
          isDragging
            ? 'border-teal-400 bg-teal-500/10 scale-[0.99]'
            : 'border-slate-700/80 bg-slate-900/40 hover:bg-slate-900/80 hover:border-teal-500/50'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".xlsx,.xls,.csv"
          className="hidden"
        />

        <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center mb-2.5 shadow-inner">
          {loadingFile ? (
            <div className="w-6 h-6 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Upload className="w-6 h-6" />
          )}
        </div>

        <h3 className="text-sm font-bold text-slate-100">
          {loadingFile ? 'Reading & Cleaning Spreadsheet...' : 'Attach / Tap to Upload Raw XLSX'}
        </h3>
        <p className="text-xs text-slate-400 mt-1 max-w-sm">
          Supports Microsoft Excel (.xlsx, .xls) and CSV spreadsheets. Mobile file attachment or drag & drop.
        </p>

        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setPasteModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
          >
            <ClipboardPaste className="w-3.5 h-3.5 text-teal-400" />
            <span>Paste Table Text</span>
          </button>
        </div>
      </div>

      {/* Preloaded Realistic Book Datasets */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-teal-400" />
            <h2 className="text-sm font-bold text-slate-200">
              Or Load Case Studies From Evergreen's Book
            </h2>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">1-Tap Load</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {SAMPLE_DATASETS.map((sample) => {
            const isSelected = currentDataset?.fileName?.includes(sample.name);
            return (
              <div
                key={sample.id}
                onClick={() => handleLoadSample(sample)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-teal-950/40 border-teal-500/50 shadow-md shadow-teal-950/30'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-100 truncate">{sample.name}</span>
                    <span className="text-[10px] font-semibold text-teal-400/90 bg-teal-500/10 px-1.5 py-0.5 rounded border border-teal-500/20 shrink-0">
                      {sample.chapterSource.split(':')[0]}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mb-2">{sample.description}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[10px] text-slate-500">
                  <span className="italic truncate max-w-[200px] text-teal-400/80">
                    "{sample.defaultTakeaway}"
                  </span>
                  <span className="font-semibold text-slate-300 ml-2 shrink-0 flex items-center gap-1">
                    {isSelected ? 'Loaded' : 'Load'} <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Paste Table Modal */}
      {pasteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ClipboardPaste className="w-4 h-4 text-teal-400" />
                <span>Paste Tabular Data</span>
              </h3>
              <button
                onClick={() => setPasteModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded"
              >
                Cancel
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Copy rows directly from Excel or Google Sheets and paste them below (tab or comma separated).
            </p>
            <textarea
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              rows={8}
              placeholder="Department&#9;Old Site&#9;New Site&#10;Packaged&#9;$61&#9;$72&#10;Meat&#9;$82&#9;$88"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-200 focus:outline-none focus:border-teal-500"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setPasteModalOpen(false)}
                className="px-3 py-2 text-xs rounded-lg text-slate-300 hover:bg-slate-800"
              >
                Close
              </button>
              <button
                onClick={handleProcessPastedText}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-teal-600 hover:bg-teal-500 text-white"
              >
                Parse & Clean
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
