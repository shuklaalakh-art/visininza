import React, { useState } from 'react';
import { CleanedDataset, CleaningOptions } from '../../types/data';
import { cleanDataset, exportToXlsx, exportToCsv } from '../../utils/dataCleaner';
import {
  Sparkles,
  Download,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  SlidersHorizontal,
  Table as TableIcon,
  HelpCircle,
  ArrowRight,
  Filter,
  FileSpreadsheet,
} from 'lucide-react';

interface CleanAuditScreenProps {
  dataset: CleanedDataset;
  onUpdateDataset: (cleaned: CleanedDataset) => void;
  onNavigateToVisualizations: () => void;
}

export const CleanAuditScreen: React.FC<CleanAuditScreenProps> = ({
  dataset,
  onUpdateDataset,
  onNavigateToVisualizations,
}) => {
  const [activeView, setActiveView] = useState<'cleaned' | 'raw' | 'summary'>('cleaned');
  const [showConfig, setShowConfig] = useState(false);
  const [options, setOptions] = useState<CleaningOptions>(dataset.cleaningOptions);

  const handleToggleOption = (key: keyof CleaningOptions) => {
    const updated = { ...options, [key]: !options[key] };
    setOptions(updated);
    const reCleaned = cleanDataset(
      dataset.rawRows,
      dataset.fileName,
      dataset.sheetName,
      updated,
      dataset.sheetNames
    );
    onUpdateDataset(reCleaned);
  };

  const handleMissingStrategyChange = (strategy: CleaningOptions['missingDataStrategy']) => {
    const updated = { ...options, missingDataStrategy: strategy };
    setOptions(updated);
    const reCleaned = cleanDataset(
      dataset.rawRows,
      dataset.fileName,
      dataset.sheetName,
      updated,
      dataset.sheetNames
    );
    onUpdateDataset(reCleaned);
  };

  const handleReset = () => {
    const defaultOpts: CleaningOptions = {
      trimWhitespace: true,
      normalizeHeaders: true,
      stripCurrencyAndPercent: true,
      deduplicateRows: true,
      missingDataStrategy: 'keep_annotated',
      filterEmptyRows: true,
      detectOutliers: true,
      standardizeDates: true,
    };
    setOptions(defaultOpts);
    const reCleaned = cleanDataset(
      dataset.rawRows,
      dataset.fileName,
      dataset.sheetName,
      defaultOpts,
      dataset.sheetNames
    );
    onUpdateDataset(reCleaned);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Header & Metric Counter Cards */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-1.5 text-teal-400 text-xs font-bold uppercase tracking-wider mb-0.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Data Sanitization & Usability Audit</span>
            </div>
            <h2 className="text-lg font-black text-white font-['Cabinet_Grotesk']">
              {dataset.fileName}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowConfig(!showConfig)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                showConfig
                  ? 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Cleaning Rules</span>
            </button>

            <button
              onClick={() => exportToXlsx(dataset, true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-colors"
              title="Download Cleaned XLSX File"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Clean XLSX</span>
            </button>
          </div>
        </div>

        {/* 4 Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
            <div className="text-[11px] text-slate-400 font-medium">Cells Normalized</div>
            <div className="text-xl font-black text-teal-400 font-['Cabinet_Grotesk'] tabular-nums">
              {dataset.summary.correctedValuesCount}
            </div>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
            <div className="text-[11px] text-slate-400 font-medium">Clean Rows</div>
            <div className="text-xl font-black text-slate-200 font-['Cabinet_Grotesk'] tabular-nums">
              {dataset.summary.totalCleanedRows}
            </div>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
            <div className="text-[11px] text-slate-400 font-medium">Missing Cells</div>
            <div className="text-xl font-black text-amber-400 font-['Cabinet_Grotesk'] tabular-nums">
              {dataset.summary.missingCellsCount}
            </div>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
            <div className="text-[11px] text-slate-400 font-medium">Duplicates Purged</div>
            <div className="text-xl font-black text-indigo-400 font-['Cabinet_Grotesk'] tabular-nums">
              {dataset.summary.duplicatesRemovedCount}
            </div>
          </div>
        </div>
      </div>

      {/* Cleaning Config Options Drawer */}
      {showConfig && (
        <div className="bg-slate-900 border border-teal-500/30 rounded-2xl p-4 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-teal-400" />
              <span>Active Cleaning Rules</span>
            </h3>
            <button
              onClick={handleReset}
              className="text-xs text-slate-400 hover:text-teal-400 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Defaults</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <label className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-950/60 border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={options.normalizeHeaders}
                onChange={() => handleToggleOption('normalizeHeaders')}
                className="rounded accent-teal-500 w-4 h-4"
              />
              <div>
                <div className="font-semibold text-slate-200">Standardize & Trim Headers</div>
                <div className="text-[10px] text-slate-400">Removes trailing punctuation, extra spaces, and handles merged headers</div>
              </div>
            </label>

            <label className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-950/60 border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={options.stripCurrencyAndPercent}
                onChange={() => handleToggleOption('stripCurrencyAndPercent')}
                className="rounded accent-teal-500 w-4 h-4"
              />
              <div>
                <div className="font-semibold text-slate-200">Parse Numbers & Strip '$' / '%'</div>
                <div className="text-[10px] text-slate-400">Converts formatted string currencies and percentages into clean calculable floats</div>
              </div>
            </label>

            <label className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-950/60 border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={options.deduplicateRows}
                onChange={() => handleToggleOption('deduplicateRows')}
                className="rounded accent-teal-500 w-4 h-4"
              />
              <div>
                <div className="font-semibold text-slate-200">Remove Exact Duplicate Rows</div>
                <div className="text-[10px] text-slate-400">Prevents distorted counts and double-counted survey entries</div>
              </div>
            </label>

            <label className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-950/60 border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={options.detectOutliers}
                onChange={() => handleToggleOption('detectOutliers')}
                className="rounded accent-teal-500 w-4 h-4"
              />
              <div>
                <div className="font-semibold text-slate-200">1.5 × IQR Outlier Detection</div>
                <div className="text-[10px] text-slate-400">Identifies extreme values for honest reporting without hidden bias</div>
              </div>
            </label>
          </div>

          {/* Missing Data Strategy (Evergreen Principles) */}
          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200">
                Evergreen Missing Data Handling (Chapter 5)
              </span>
              <span className="text-[11px] text-teal-400">Research Best Practice</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              {[
                { id: 'keep_annotated', label: 'Keep & Annotate in Subtitle', desc: 'Note small missing (<15%) or add sample size (n=X)' },
                { id: 'impute_median', label: 'Impute Median', desc: 'Robust against skewed distributions' },
                { id: 'drop_row', label: 'Drop Incomplete Rows', desc: 'Only when completeness is mandatory' },
              ].map((strat) => (
                <button
                  key={strat.id}
                  onClick={() => handleMissingStrategyChange(strat.id as any)}
                  className={`p-2.5 text-left rounded-lg border transition-all ${
                    options.missingDataStrategy === strat.id
                      ? 'bg-teal-500/20 border-teal-500/60 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-semibold text-slate-200">{strat.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{strat.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Evergreen Audit Logs */}
      {dataset.logs.length > 0 && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 space-y-2">
          <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
            <span>Automated Cleaning Log & Evergreen Guidance</span>
          </div>
          <div className="space-y-1.5">
            {dataset.logs.map((log) => (
              <div
                key={log.id}
                className={`text-xs p-2 rounded-lg flex items-start gap-2 ${
                  log.type === 'warning'
                    ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                    : log.type === 'success'
                    ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                    : 'bg-slate-800/60 text-slate-300'
                }`}
              >
                <span className="font-semibold shrink-0">
                  {log.type === 'warning' ? '⚠️' : log.type === 'success' ? '✓' : 'ℹ'}
                </span>
                <span>{log.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Table View Tabs */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-3 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between">
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setActiveView('cleaned')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                activeView === 'cleaned' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Cleaned Data ({dataset.cleanedRows.length} rows)
            </button>
            <button
              onClick={() => setActiveView('raw')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                activeView === 'raw' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Raw Input ({dataset.rawRows.length} rows)
            </button>
            <button
              onClick={() => setActiveView('summary')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                activeView === 'summary' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Column Statistics
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => exportToCsv(dataset, activeView !== 'raw')}
              className="px-2.5 py-1 text-[11px] font-medium rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
            >
              CSV
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto max-h-[380px]">
          {activeView === 'cleaned' && (
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-950 sticky top-0 border-b border-slate-800 text-slate-400 font-semibold">
                <tr>
                  <th className="py-2.5 px-3 w-10 text-slate-600">#</th>
                  {dataset.cleanedHeaders.map((h) => {
                    const col = dataset.columns.find((c) => c.name === h);
                    return (
                      <th key={h} className="py-2.5 px-3">
                        <div className="flex items-center gap-1 text-slate-200">
                          <span>{h}</span>
                        </div>
                        <div className="text-[10px] text-teal-400 font-normal">
                          {col?.type}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                {dataset.cleanedRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-850/50">
                    <td className="py-2 px-3 text-slate-600">{idx + 1}</td>
                    {dataset.cleanedHeaders.map((h) => {
                      const val = row[h];
                      const isNum = typeof val === 'number';
                      return (
                        <td
                          key={h}
                          className={`py-2 px-3 ${
                            isNum ? 'text-teal-300 font-semibold tabular-nums' : 'text-slate-300'
                          }`}
                        >
                          {val !== undefined && val !== null ? String(val) : <span className="text-slate-600 italic">null</span>}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeView === 'raw' && (
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-950 sticky top-0 border-b border-slate-800 text-slate-400 font-semibold">
                <tr>
                  <th className="py-2.5 px-3 w-10 text-slate-600">#</th>
                  {dataset.rawHeaders.map((h) => (
                    <th key={h} className="py-2.5 px-3 text-slate-300">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                {dataset.rawRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-850/50">
                    <td className="py-2 px-3 text-slate-600">{idx + 1}</td>
                    {dataset.rawHeaders.map((h) => (
                      <td key={h} className="py-2 px-3 text-slate-400">
                        {row[h] !== undefined ? String(row[h]) : ''}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeView === 'summary' && (
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-950 sticky top-0 border-b border-slate-800 text-slate-400 font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Column</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Missing</th>
                  <th className="py-2.5 px-3 text-right">Mean</th>
                  <th className="py-2.5 px-3 text-right">Median</th>
                  <th className="py-2.5 px-3 text-right">Min / Max</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {dataset.columns.map((col) => (
                  <tr key={col.name} className="hover:bg-slate-850/50">
                    <td className="py-2.5 px-3 font-semibold text-slate-200">{col.name}</td>
                    <td className="py-2.5 px-3 text-teal-400 font-mono text-[11px]">{col.type}</td>
                    <td className="py-2.5 px-3 text-slate-400">
                      {col.missingCount > 0 ? (
                        <span className="text-amber-400 font-semibold">{col.missingCount} ({col.missingPercentage.toFixed(0)}%)</span>
                      ) : (
                        '0 (0%)'
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-300">
                      {col.mean !== undefined ? col.mean : '-'}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-300">
                      {col.median !== undefined ? col.median : '-'}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-400">
                      {col.min !== undefined ? `${col.min} / ${col.max}` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Floating CTA to View Evergreen Charts */}
      <div className="pt-2">
        <button
          onClick={onNavigateToVisualizations}
          className="w-full py-3.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 active:scale-[0.99] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-900/30 transition-all"
        >
          <span>Generate Evergreen Charts for this Data</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
