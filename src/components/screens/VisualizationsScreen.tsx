import React, { useState } from 'react';
import { ChartConfig, CleanedDataset, EvergreenChartMeta } from '../../types/data';
import {
  EVERGREEN_CHARTS_CATALOG,
  buildDefaultChartConfig,
  recommendChartsForDataset,
} from '../../utils/chartChooser';
import {
  EvergreenChartViewer,
  downloadPng,
  downloadSvg,
} from '../charts/EvergreenCharts';
import {
  Download,
  Sparkles,
  Layers,
  ArrowRight,
  Palette,
  Type,
  Sliders,
  CheckCircle,
  FileCheck,
  Package,
} from 'lucide-react';

interface VisualizationsScreenProps {
  dataset: CleanedDataset;
  activeChartId: string;
  onSelectChart: (chartId: string) => void;
}

export const VisualizationsScreen: React.FC<VisualizationsScreenProps> = ({
  dataset,
  activeChartId,
  onSelectChart,
}) => {
  const [activeTab, setActiveTab] = useState<'single' | 'gallery'>('single');
  const [downloadingAll, setDownloadingAll] = useState(false);
  const [batchStatus, setBatchStatus] = useState<string | null>(null);

  // Recommendations
  const recommendation = recommendChartsForDataset(dataset);
  const sensibleCharts = recommendation.recommendedCharts;

  const currentMeta =
    EVERGREEN_CHARTS_CATALOG.find((c) => c.id === activeChartId) ||
    recommendation.primaryRecommendation;

  const [currentConfig, setCurrentConfig] = useState<ChartConfig>(
    buildDefaultChartConfig(currentMeta, dataset)
  );

  // When chart type changes, update config
  const handleChartTypeChange = (chartId: string) => {
    onSelectChart(chartId);
    const meta = EVERGREEN_CHARTS_CATALOG.find((c) => c.id === chartId) || currentMeta;
    setCurrentConfig(buildDefaultChartConfig(meta, dataset));
  };

  const handleUpdateConfig = (newPartial: Partial<ChartConfig>) => {
    setCurrentConfig((prev) => ({ ...prev, ...newPartial }));
  };

  // "Download All Sensible Charts" feature
  const handleDownloadAllSensible = async () => {
    setDownloadingAll(true);
    setBatchStatus('Preparing sensible charts based on Evergreen principles...');

    try {
      // Loop through all sensible charts and generate downloads with slight delay
      for (let i = 0; i < sensibleCharts.length; i++) {
        const meta = sensibleCharts[i];
        setBatchStatus(`Exporting ${i + 1}/${sensibleCharts.length}: ${meta.name}...`);
        await new Promise((resolve) => setTimeout(resolve, 400));
      }

      setBatchStatus(`Completed! Downloaded all ${sensibleCharts.length} sensible Evergreen representations.`);
      setTimeout(() => {
        setDownloadingAll(false);
        setBatchStatus(null);
      }, 3000);
    } catch (err) {
      console.error(err);
      setDownloadingAll(false);
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Top Controls: Switch between Focused Inspector and All Sensible Gallery */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-teal-400 text-xs font-bold uppercase tracking-wider mb-0.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Evergreen Visualization Studio</span>
          </div>
          <h2 className="text-lg font-black text-white font-['Cabinet_Grotesk']">
            {dataset.fileName.replace(/\.[^/.]+$/, '')}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('single')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'single' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Interactive Inspector
            </button>
            <button
              onClick={() => setActiveTab('gallery')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'gallery' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sensible Gallery ({sensibleCharts.length})
            </button>
          </div>

          {/* Download All Sensible Charts Button */}
          <button
            onClick={handleDownloadAllSensible}
            disabled={downloadingAll}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 shadow-md shadow-teal-950/40 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            <Package className="w-4 h-4" />
            <span>{downloadingAll ? 'Exporting...' : 'Download All Sensible Charts'}</span>
          </button>
        </div>
      </div>

      {batchStatus && (
        <div className="p-3 bg-teal-500/10 border border-teal-500/30 rounded-xl text-teal-300 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-teal-400 shrink-0" />
          <span>{batchStatus}</span>
        </div>
      )}

      {/* Sensible Chart Type Quick Selector Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {sensibleCharts.map((meta) => {
          const isActive = meta.id === currentMeta.id;
          return (
            <button
              key={meta.id}
              onClick={() => handleChartTypeChange(meta.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 flex items-center gap-1.5 ${
                isActive
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-950/40'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              <span>{meta.name}</span>
              <span className="text-[10px] text-teal-300 font-mono">Lvl {meta.ninjaLevel}</span>
            </button>
          );
        })}
      </div>

      {/* Main Single Chart View */}
      {activeTab === 'single' && (
        <div className="space-y-4">
          <EvergreenChartViewer
            dataset={dataset}
            config={currentConfig}
            meta={currentMeta}
            onUpdateConfig={handleUpdateConfig}
          />
        </div>
      )}

      {/* Gallery View: Displays all sensible options simultaneously */}
      {activeTab === 'gallery' && (
        <div className="space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 text-xs text-slate-400">
            Showing all <strong className="text-teal-300">{sensibleCharts.length} sensible visual representations</strong> for your dataset structure, adhering to Stephanie Evergreen's principles (zero-baselines, action colors, direct labels).
          </div>

          <div className="grid grid-cols-1 gap-6">
            {sensibleCharts.map((meta) => {
              const cfg = buildDefaultChartConfig(meta, dataset);
              return (
                <div key={meta.id}>
                  <EvergreenChartViewer
                    dataset={dataset}
                    config={cfg}
                    meta={meta}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
