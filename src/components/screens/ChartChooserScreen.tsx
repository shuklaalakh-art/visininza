import React, { useState } from 'react';
import { CleanedDataset, EvergreenCategory, EvergreenChartMeta } from '../../types/data';
import { EVERGREEN_CHARTS_CATALOG, recommendChartsForDataset } from '../../utils/chartChooser';
import {
  Compass,
  Sparkles,
  Award,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  BarChart3,
  PieChart,
  Percent,
  Sliders,
} from 'lucide-react';

interface ChartChooserScreenProps {
  dataset: CleanedDataset;
  onSelectChart: (chartId: string) => void;
}

export const ChartChooserScreen: React.FC<ChartChooserScreenProps> = ({
  dataset,
  onSelectChart,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<EvergreenCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const recommendation = recommendChartsForDataset(dataset);
  const recommendedIds = new Set(recommendation.recommendedCharts.map((c) => c.id));

  const categories: { id: EvergreenCategory | 'all'; label: string; icon: string }[] = [
    { id: 'all', label: 'All Charts (18)', icon: '✨' },
    { id: 'single_number', label: 'Single Number', icon: '1️⃣' },
    { id: 'comparison', label: 'Comparisons', icon: '⚖️' },
    { id: 'benchmark', label: 'Benchmarks & Goals', icon: '🎯' },
    { id: 'survey_likert', label: 'Survey & Likert', icon: '📋' },
    { id: 'parts_of_whole', label: 'Parts of Whole', icon: '🍰' },
    { id: 'time_trend', label: 'Trends Over Time', icon: '📈' },
  ];

  const filteredCharts = EVERGREEN_CHARTS_CATALOG.filter((chart) => {
    if (selectedCategory !== 'all' && chart.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        chart.name.toLowerCase().includes(q) ||
        chart.description.toLowerCase().includes(q) ||
        chart.clevelandMcGillTier.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-4 pb-20">
      {/* Stephanie Evergreen Recommendation Banner */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-slate-900 border border-teal-500/30 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider mb-1">
          <Award className="w-4 h-4 text-teal-300" />
          <span>Evergreen Recommendation Engine</span>
        </div>
        <h2 className="text-base sm:text-lg font-bold text-white font-['Cabinet_Grotesk']">
          Primary Pick: <span className="text-teal-300">{recommendation.primaryRecommendation.name}</span>
        </h2>
        <p className="text-xs text-slate-300 mt-1 max-w-2xl">
          {recommendation.reasoning}
        </p>

        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={() => onSelectChart(recommendation.primaryRecommendation.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-md shadow-teal-950/40 transition-all"
          >
            <span>Open {recommendation.primaryRecommendation.name}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Cleveland & McGill Perceptual Hierarchy Explainer */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 text-xs text-slate-400 flex items-start gap-2.5">
        <Compass className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-200">Cleveland & McGill (1984) Hierarchy: </span>
          <span>
            Human brains decode data most accurately by: <strong className="text-teal-300">1. Position on common scale (Dot plot)</strong> → <strong>2. Length (Bar/Lollipop)</strong> → <strong>3. Direction (Slope/Line)</strong> → <strong>4. Angle (Pie/Donut)</strong> → <strong>5. Area/Volume (Bubble/3D)</strong>. VisiNinja prioritizes charts from the top tiers.
          </span>
        </div>
      </div>

      {/* Category Filter Carousel */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
              selectedCategory === cat.id
                ? 'bg-teal-600 text-white shadow-md shadow-teal-950/40 font-bold'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter charts by story, metric, or technique..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filteredCharts.map((chart) => {
          const isRecommended = recommendedIds.has(chart.id);
          const isPrimary = recommendation.primaryRecommendation.id === chart.id;

          return (
            <div
              key={chart.id}
              onClick={() => onSelectChart(chart.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between hover:scale-[1.01] ${
                isPrimary
                  ? 'bg-teal-950/30 border-teal-500/60 shadow-lg shadow-teal-950/30 ring-1 ring-teal-500/40'
                  : isRecommended
                  ? 'bg-slate-900 border-teal-500/30 hover:border-teal-500/50'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      Ch. {chart.chapter}
                    </span>
                    <span className="text-[11px] font-semibold text-teal-400">
                      Ninja Lvl {chart.ninjaLevel}/10
                    </span>
                  </div>

                  {isPrimary ? (
                    <span className="text-[10px] font-bold bg-teal-500 text-slate-950 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Best Match
                    </span>
                  ) : isRecommended ? (
                    <span className="text-[10px] font-semibold text-teal-400 bg-teal-500/10 border border-teal-500/30 px-2 py-0.5 rounded-full">
                      Sensible
                    </span>
                  ) : null}
                </div>

                <h3 className="text-sm font-bold text-slate-100 font-['Cabinet_Grotesk'] mb-1">
                  {chart.name}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 mb-2.5">
                  {chart.description}
                </p>

                <div className="text-[11px] text-slate-400/90 bg-slate-950/40 p-2 rounded-lg border border-slate-800/80 mb-2">
                  <strong className="text-slate-300">Why it works:</strong> {chart.rationale}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400 truncate max-w-[200px]">
                  {chart.clevelandMcGillTier}
                </span>
                <span className="font-bold text-teal-400 flex items-center gap-1 shrink-0">
                  <span>Render</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
