import React, { useRef, useState } from 'react';
import { ChartConfig, CleanedDataset, EvergreenChartMeta } from '../../types/data';
import { Download, Copy, Check, Sparkles, AlertCircle, Eye, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface ChartProps {
  dataset: CleanedDataset;
  config: ChartConfig;
  meta: EvergreenChartMeta;
  onUpdateConfig?: (newConfig: Partial<ChartConfig>) => void;
}

/**
 * Utility to download an SVG element as SVG file
 */
export function downloadSvg(svgElement: SVGSVGElement | null, fileName: string) {
  if (!svgElement) return;
  const serializer = new XMLSerializer();
  const source = serializer.serializeToString(svgElement);
  const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${fileName.replace(/[^a-zA-Z0-9_-]/g, '_')}_VisiNinja.svg`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Utility to rasterize SVG into High-Res PNG (2x scale for sharp printing/presentations)
 */
export function downloadPng(svgElement: SVGSVGElement | null, fileName: string) {
  if (!svgElement) return;
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svgElement);
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);
  const img = new Image();

  img.onload = () => {
    const scale = 2; // High-res retina
    const canvas = document.createElement('canvas');
    canvas.width = svgElement.clientWidth * scale || 1600;
    canvas.height = svgElement.clientHeight * scale || 1000;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#0f172a'; // Slate-900 high contrast dark background
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const pngUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = pngUrl;
      a.download = `${fileName.replace(/[^a-zA-Z0-9_-]/g, '_')}_VisiNinja.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
    URL.revokeObjectURL(url);
  };
  img.src = url;
}

/**
 * Main Chart Renderer Container with Action Bar & Evergreen Rule Badges
 */
export const EvergreenChartViewer: React.FC<ChartProps> = ({
  dataset,
  config,
  meta,
  onUpdateConfig,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [copied, setCopied] = useState(false);
  const [showConfig, setShowConfig] = useState(false);

  const handleCopySvg = () => {
    if (!svgRef.current) return;
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svgRef.current);
    navigator.clipboard.writeText(source).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownloadSvg = () => {
    downloadSvg(svgRef.current, config.title || meta.name);
  };

  const handleDownloadPng = () => {
    downloadPng(svgRef.current, config.title || meta.name);
  };

  // Helper data extraction
  const labelCol = config.labelColumn || dataset.cleanedHeaders[0];
  const valCol1 = config.valueColumns[0] || dataset.cleanedHeaders[1];
  const valCol2 = config.valueColumns[1] || dataset.cleanedHeaders[2] || valCol1;

  // Render chart body based on type
  const renderChartGraphic = () => {
    switch (meta.id) {
      case 'dumbbell_dot_plot':
        return <DumbbellDotPlotGraphic dataset={dataset} config={config} svgRef={svgRef} />;
      case 'dot_plot':
        return <DotPlotGraphic dataset={dataset} config={config} svgRef={svgRef} />;
      case 'slopegraph':
        return <SlopegraphGraphic dataset={dataset} config={config} svgRef={svgRef} />;
      case 'bullet_graph':
        return <BulletGraphGraphic dataset={dataset} config={config} svgRef={svgRef} />;
      case 'benchmark_line':
        return <BenchmarkLineGraphic dataset={dataset} config={config} svgRef={svgRef} />;
      case 'diverging_stacked_bar':
        return <DivergingStackedBarGraphic dataset={dataset} config={config} svgRef={svgRef} />;
      case 'aggregated_stacked_bar':
        return <AggregatedStackedBarGraphic dataset={dataset} config={config} svgRef={svgRef} />;
      case 'lollipop':
        return <LollipopGraphic dataset={dataset} config={config} svgRef={svgRef} />;
      case 'single_number':
        return <SingleNumberGraphic dataset={dataset} config={config} svgRef={svgRef} />;
      case 'icon_array':
        return <IconArrayGraphic dataset={dataset} config={config} svgRef={svgRef} />;
      case 'donut_slice':
      case 'pie_done_right':
        return <FocusedDonutOrPieGraphic dataset={dataset} config={config} isPie={meta.id === 'pie_done_right'} svgRef={svgRef} />;
      case 'action_bar':
        return <ActionBarGraphic dataset={dataset} config={config} svgRef={svgRef} />;
      case 'stacked_bar_100':
        return <StackedBar100Graphic dataset={dataset} config={config} svgRef={svgRef} />;
      case 'histogram':
        return <HistogramGraphic dataset={dataset} config={config} svgRef={svgRef} />;
      case 'deviation_bar':
        return <DeviationBarGraphic dataset={dataset} config={config} svgRef={svgRef} />;
      case 'clean_line':
        return <CleanLineGraphic dataset={dataset} config={config} svgRef={svgRef} />;
      case 'small_multiples':
        return <SmallMultiplesGraphic dataset={dataset} config={config} svgRef={svgRef} />;
      case 'indicator_table':
        return <IndicatorTableGraphic dataset={dataset} config={config} svgRef={svgRef} />;
      default:
        return <DotPlotGraphic dataset={dataset} config={config} svgRef={svgRef} />;
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col">
      {/* Top Bar for Chart Card */}
      <div className="p-3.5 sm:p-4 border-b border-slate-800/80 bg-slate-900/60 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/30">
            Ch. {meta.chapter}
          </span>
          <span className="text-xs text-slate-400">
            Ninja Lvl {meta.ninjaLevel}/10
          </span>
          <span className="text-xs text-slate-500">·</span>
          <span className="text-xs text-slate-400 font-medium truncate max-w-[200px]">
            {meta.clevelandMcGillTier}
          </span>
        </div>

        {/* Action Buttons: Download SVG, Download PNG, Config */}
        <div className="flex items-center gap-1.5 ml-auto">
          <button
            onClick={handleDownloadSvg}
            title="Download Clean Vector SVG (Best for reports & presentations)"
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-teal-400" />
            <span>SVG</span>
          </button>

          <button
            onClick={handleDownloadPng}
            title="Download High-Res 2x PNG"
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-teal-600 hover:bg-teal-500 text-white shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>PNG</span>
          </button>

          <button
            onClick={handleCopySvg}
            title="Copy SVG to Clipboard"
            className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setShowConfig(!showConfig)}
            title="Customize Chart & Title"
            className={`p-1.5 rounded-lg transition-colors ${
              showConfig ? 'bg-teal-500/20 text-teal-300' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Optional In-Place Configuration Drawer */}
      {showConfig && onUpdateConfig && (
        <div className="p-3 bg-slate-950/80 border-b border-slate-800 text-xs flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[240px]">
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Declarative Takeaway Headline (Evergreen Rule)
            </label>
            <input
              type="text"
              value={config.title}
              onChange={(e) => onUpdateConfig({ title: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-teal-500 font-medium"
              placeholder="State the point directly..."
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Action Color
            </label>
            <div className="flex items-center gap-1.5">
              {[
                { hex: '#0284c7', label: 'Evergreen Electric Blue' },
                { hex: '#0d9488', label: 'Teal' },
                { hex: '#10b981', label: 'Emerald' },
                { hex: '#f97316', label: 'Amber Orange' },
                { hex: '#8b5cf6', label: 'Purple' },
              ].map((c) => (
                <button
                  key={c.hex}
                  onClick={() => onUpdateConfig({ actionColor: c.hex })}
                  style={{ backgroundColor: c.hex }}
                  className={`w-6 h-6 rounded-full border-2 transition-transform ${
                    config.actionColor === c.hex ? 'border-white scale-110' : 'border-transparent opacity-80'
                  }`}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Sort Order
            </label>
            <div className="flex bg-slate-900 p-0.5 rounded-lg border border-slate-700">
              <button
                onClick={() => onUpdateConfig({ sortOrder: 'desc' })}
                className={`px-2 py-1 rounded text-xs font-medium ${
                  config.sortOrder === 'desc' ? 'bg-slate-800 text-white' : 'text-slate-400'
                }`}
              >
                High → Low
              </button>
              <button
                onClick={() => onUpdateConfig({ sortOrder: 'asc' })}
                className={`px-2 py-1 rounded text-xs font-medium ${
                  config.sortOrder === 'asc' ? 'bg-slate-800 text-white' : 'text-slate-400'
                }`}
              >
                Low → High
              </button>
              <button
                onClick={() => onUpdateConfig({ sortOrder: 'none' })}
                className={`px-2 py-1 rounded text-xs font-medium ${
                  config.sortOrder === 'none' ? 'bg-slate-800 text-white' : 'text-slate-400'
                }`}
              >
                Raw
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SVG Canvas Body */}
      <div className="p-3 sm:p-5 flex items-center justify-center bg-slate-950/40 min-h-[340px]">
        {renderChartGraphic()}
      </div>

      {/* Stephanie Evergreen Pedagogical Context Card */}
      <div className="p-3 bg-slate-900/40 border-t border-slate-800/80 text-xs text-slate-400 flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-medium text-slate-300">
            <span className="text-teal-400 font-semibold">{meta.name}:</span> {meta.description}
          </p>
          <p className="text-slate-400/90 text-[11px]">
            <strong className="text-slate-300">Research Backbone:</strong> {meta.rationale}
          </p>
          {meta.watchOut && (
            <p className="text-amber-400/90 text-[11px] flex items-center gap-1">
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span>{meta.watchOut}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 1. DUMBBELL DOT PLOT (Chapter 3 - Ninja Level 10)                           */
/* -------------------------------------------------------------------------- */
function DumbbellDotPlotGraphic({
  dataset,
  config,
  svgRef,
}: {
  dataset: CleanedDataset;
  config: ChartConfig;
  svgRef: React.RefObject<SVGSVGElement | null>;
}) {
  const labelCol = config.labelColumn;
  const col1 = config.valueColumns[0];
  const col2 = config.valueColumns[1] || config.valueColumns[0];

  let rows = dataset.cleanedRows
    .map((r) => {
      const v1 = Number(r[col1]) || 0;
      const v2 = Number(r[col2]) || 0;
      return {
        label: String(r[labelCol] || ''),
        val1: v1,
        val2: v2,
        diff: v2 - v1,
      };
    })
    .filter((r) => r.label);

  if (config.sortOrder === 'desc') {
    rows.sort((a, b) => b.diff - a.diff);
  } else if (config.sortOrder === 'asc') {
    rows.sort((a, b) => a.diff - b.diff);
  }

  const allVals = rows.flatMap((r) => [r.val1, r.val2]);
  const minVal = Math.min(0, ...allVals);
  const maxVal = Math.max(100, ...(allVals.map((v) => v * 1.1)));

  const width = 640;
  const rowHeight = 44;
  const height = Math.max(260, rows.length * rowHeight + 90);
  const paddingLeft = 140;
  const paddingRight = 50;
  const chartWidth = width - paddingLeft - paddingRight;

  const scaleX = (val: number) => paddingLeft + ((val - minVal) / (maxVal - minVal)) * chartWidth;

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-auto max-w-[640px] font-sans"
    >
      {/* Title & Subtitle */}
      <text x={paddingLeft} y="24" fill="#f8fafc" fontSize="15" fontWeight="700">
        {config.title}
      </text>
      <text x={paddingLeft} y="42" fill="#94a3b8" fontSize="11" fontWeight="500">
        Comparing <tspan fill="#64748b" fontWeight="600">{col1}</tspan> (gray) vs{' '}
        <tspan fill={config.actionColor} fontWeight="600">{col2}</tspan> (action blue)
      </text>

      {/* Axis Baseline & Grid */}
      <line x1={paddingLeft} y1={height - 30} x2={width - paddingRight} y2={height - 30} stroke="#334155" strokeWidth="1" />
      {[minVal, (minVal + maxVal) / 2, maxVal].map((tick, i) => {
        const x = scaleX(tick);
        return (
          <g key={i}>
            <line x1={x} y1={60} x2={x} y2={height - 30} stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
            <text x={x} y={height - 14} fill="#64748b" fontSize="10" textAnchor="middle" className="tabular-nums">
              {Math.round(tick)}{config.isPercentage ? '%' : ''}
            </text>
          </g>
        );
      })}

      {/* Dumbbell Rows */}
      {rows.map((row, idx) => {
        const y = 72 + idx * rowHeight;
        const x1 = scaleX(row.val1);
        const x2 = scaleX(row.val2);
        const isGrowing = row.diff >= 0;

        return (
          <g key={idx}>
            {/* Category Label */}
            <text
              x={paddingLeft - 12}
              y={y + 4}
              fill="#cbd5e1"
              fontSize="11"
              fontWeight="500"
              textAnchor="end"
            >
              {row.label.length > 20 ? `${row.label.substring(0, 19)}…` : row.label}
            </text>

            {/* Connecting Bar */}
            <line
              x1={x1}
              y1={y}
              x2={x2}
              y2={y}
              stroke="#475569"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Baseline Dot (Val 1) */}
            <circle cx={x1} cy={y} r="8" fill="#64748b" />
            <text x={x1} y={y + 3.5} fill="#ffffff" fontSize="9" fontWeight="700" textAnchor="middle" className="tabular-nums">
              {Math.round(row.val1)}
            </text>

            {/* Target / Final Dot (Val 2) */}
            <circle cx={x2} cy={y} r="9" fill={config.actionColor} />
            <text x={x2} y={y + 3.5} fill="#ffffff" fontSize="9" fontWeight="700" textAnchor="middle" className="tabular-nums">
              {Math.round(row.val2)}
            </text>

            {/* Growth difference indicator */}
            <text
              x={Math.max(x1, x2) + 16}
              y={y + 3.5}
              fill={isGrowing ? '#38bdf8' : '#f43f5e'}
              fontSize="10"
              fontWeight="600"
              className="tabular-nums"
            >
              {isGrowing ? `+${Math.round(row.diff)}` : `${Math.round(row.diff)}`}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* 2. CLEVELAND & MCGILL DOT PLOT (Chapter 3 - Ninja Level 8)                  */
/* -------------------------------------------------------------------------- */
function DotPlotGraphic({
  dataset,
  config,
  svgRef,
}: {
  dataset: CleanedDataset;
  config: ChartConfig;
  svgRef: React.RefObject<SVGSVGElement | null>;
}) {
  const labelCol = config.labelColumn;
  const col1 = config.valueColumns[0];
  const col2 = config.valueColumns[1];

  const rows = dataset.cleanedRows
    .map((r) => ({
      label: String(r[labelCol] || ''),
      v1: Number(r[col1]) || 0,
      v2: col2 ? Number(r[col2]) || 0 : undefined,
    }))
    .filter((r) => r.label);

  const width = 640;
  const rowHeight = 40;
  const height = Math.max(260, rows.length * rowHeight + 90);
  const paddingLeft = 140;
  const paddingRight = 40;
  const chartWidth = width - paddingLeft - paddingRight;

  const maxVal = 100;
  const scaleX = (val: number) => paddingLeft + (val / maxVal) * chartWidth;

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-auto max-w-[640px] font-sans"
    >
      <text x={paddingLeft} y="24" fill="#f8fafc" fontSize="15" fontWeight="700">
        {config.title}
      </text>
      <text x={paddingLeft} y="40" fill="#94a3b8" fontSize="11">
        Cleveland-McGill Gold Standard: Position on a common 0–100 scale
      </text>

      {/* Axis Baseline */}
      <line x1={paddingLeft} y1={height - 25} x2={width - paddingRight} y2={height - 25} stroke="#334155" strokeWidth="1" />
      {[0, 20, 40, 60, 80, 100].map((t) => {
        const x = scaleX(t);
        return (
          <g key={t}>
            <line x1={x} y1={55} x2={x} y2={height - 25} stroke="#1e293b" strokeWidth="1" />
            <text x={x} y={height - 10} fill="#64748b" fontSize="10" textAnchor="middle" className="tabular-nums">
              {t}%
            </text>
          </g>
        );
      })}

      {/* Rows */}
      {rows.map((row, idx) => {
        const y = 68 + idx * rowHeight;
        const x1 = scaleX(row.v1);
        const x2 = row.v2 !== undefined ? scaleX(row.v2) : null;

        return (
          <g key={idx}>
            {/* Guide line */}
            <line x1={paddingLeft} y1={y} x2={width - paddingRight} y2={y} stroke="#1e293b" strokeWidth="0.8" />
            
            {/* Label */}
            <text x={paddingLeft - 12} y={y + 4} fill="#cbd5e1" fontSize="11" textAnchor="end">
              {row.label.length > 20 ? `${row.label.substring(0, 19)}…` : row.label}
            </text>

            {/* Dot 1 */}
            <circle cx={x1} cy={y} r="9" fill={config.actionColor} />
            <text x={x1} y={y + 3.5} fill="#ffffff" fontSize="9" fontWeight="700" textAnchor="middle" className="tabular-nums">
              {Math.round(row.v1)}
            </text>

            {/* Optional Dot 2 */}
            {x2 !== null && (
              <>
                <circle cx={x2} cy={y} r="8" fill="#64748b" />
                <text x={x2} y={y + 3.5} fill="#ffffff" fontSize="9" fontWeight="700" textAnchor="middle" className="tabular-nums">
                  {Math.round(row.v2!)}
                </text>
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* 3. SLOPEGRAPH (Chapter 3 - Ninja Level 5)                                   */
/* -------------------------------------------------------------------------- */
function SlopegraphGraphic({
  dataset,
  config,
  svgRef,
}: {
  dataset: CleanedDataset;
  config: ChartConfig;
  svgRef: React.RefObject<SVGSVGElement | null>;
}) {
  const labelCol = config.labelColumn;
  const col1 = config.valueColumns[0];
  const col2 = config.valueColumns[1] || config.valueColumns[0];

  const items = dataset.cleanedRows
    .map((r) => ({
      name: String(r[labelCol] || ''),
      start: Number(r[col1]) || 0,
      end: Number(r[col2]) || 0,
    }))
    .filter((i) => i.name);

  const allVals = items.flatMap((i) => [i.start, i.end]);
  const minVal = Math.min(...allVals) * 0.9;
  const maxVal = Math.max(...allVals) * 1.1;

  const width = 640;
  const height = 360;
  const leftX = 180;
  const rightX = 460;
  const topY = 70;
  const bottomY = 310;

  const scaleY = (v: number) => bottomY - ((v - minVal) / (maxVal - minVal || 1)) * (bottomY - topY);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-auto max-w-[640px] font-sans"
    >
      <text x="320" y="24" fill="#f8fafc" fontSize="15" fontWeight="700" textAnchor="middle">
        {config.title}
      </text>
      <text x="320" y="42" fill="#94a3b8" fontSize="11" textAnchor="middle">
        Slope lines isolate steep gains and drops at a glance
      </text>

      {/* Vertical Spine Lines */}
      <line x1={leftX} y1={topY - 10} x2={leftX} y2={bottomY + 10} stroke="#334155" strokeWidth="2" />
      <line x1={rightX} y1={topY - 10} x2={rightX} y2={bottomY + 10} stroke="#334155" strokeWidth="2" />

      {/* Axis Headers */}
      <text x={leftX} y={topY - 20} fill="#f1f5f9" fontSize="12" fontWeight="700" textAnchor="middle">
        {col1}
      </text>
      <text x={rightX} y={topY - 20} fill="#f1f5f9" fontSize="12" fontWeight="700" textAnchor="middle">
        {col2}
      </text>

      {/* Slopes */}
      {items.map((item, idx) => {
        const y1 = scaleY(item.start);
        const y2 = scaleY(item.end);
        const isDecreasing = item.end < item.start;
        // Stephanie Evergreen: Give action color to the outlier / significant decrease or top growth
        const isFocal = isDecreasing || idx === 0;
        const color = isDecreasing ? '#f43f5e' : isFocal ? config.actionColor : '#64748b';

        return (
          <g key={idx}>
            {/* Left Label + Value */}
            <text
              x={leftX - 12}
              y={y1 + 4}
              fill={isFocal ? '#f8fafc' : '#94a3b8'}
              fontSize="11"
              fontWeight={isFocal ? '700' : '400'}
              textAnchor="end"
            >
              {item.name} <tspan fill={color} fontWeight="700">{Math.round(item.start)}</tspan>
            </text>

            {/* Connecting Slope */}
            <line
              x1={leftX}
              y1={y1}
              x2={rightX}
              y2={y2}
              stroke={color}
              strokeWidth={isFocal ? '3.5' : '1.5'}
              strokeOpacity={isFocal ? 1 : 0.6}
            />

            {/* Left Dot */}
            <circle cx={leftX} cy={y1} r={isFocal ? '5' : '3.5'} fill={color} />

            {/* Right Dot */}
            <circle cx={rightX} cy={y2} r={isFocal ? '5' : '3.5'} fill={color} />

            {/* Right Label + Value */}
            <text
              x={rightX + 12}
              y={y2 + 4}
              fill={isFocal ? '#f8fafc' : '#94a3b8'}
              fontSize="11"
              fontWeight={isFocal ? '700' : '400'}
              textAnchor="start"
            >
              <tspan fill={color} fontWeight="700">{Math.round(item.end)}</tspan> {item.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* 4. STEPHEN FEW BULLET GRAPH (Chapter 4 - Ninja Level 7)                     */
/* -------------------------------------------------------------------------- */
function BulletGraphGraphic({
  dataset,
  config,
  svgRef,
}: {
  dataset: CleanedDataset;
  config: ChartConfig;
  svgRef: React.RefObject<SVGSVGElement | null>;
}) {
  const labelCol = config.labelColumn;
  const actualCol = config.valueColumns[0];
  const targetVal = config.benchmarkValue || 75;

  const rows = dataset.cleanedRows
    .map((r) => ({
      label: String(r[labelCol] || ''),
      actual: Number(r[actualCol]) || 0,
      target: targetVal,
    }))
    .filter((r) => r.label);

  const width = 640;
  const rowHeight = 52;
  const height = Math.max(260, rows.length * rowHeight + 90);
  const paddingLeft = 140;
  const paddingRight = 40;
  const barWidth = width - paddingLeft - paddingRight;

  const maxScale = 100;
  const scaleX = (val: number) => paddingLeft + (val / maxScale) * barWidth;

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-auto max-w-[640px] font-sans"
    >
      <text x={paddingLeft} y="24" fill="#f8fafc" fontSize="15" fontWeight="700">
        {config.title}
      </text>
      <text x={paddingLeft} y="40" fill="#94a3b8" fontSize="11">
        Stephen Few Bullet Graph: Shaded gray ranges (Poor/Good), dark actual bar, red target marker
      </text>

      {rows.map((row, idx) => {
        const y = 65 + idx * rowHeight;
        const actualWidth = (row.actual / maxScale) * barWidth;
        const targetX = scaleX(row.target);
        const metTarget = row.actual >= row.target;

        return (
          <g key={idx}>
            {/* Label */}
            <text x={paddingLeft - 12} y={y + 16} fill="#cbd5e1" fontSize="11" fontWeight="600" textAnchor="end">
              {row.label.length > 20 ? `${row.label.substring(0, 19)}…` : row.label}
            </text>

            {/* Qualitative Ranges in Background (33%, 66%, 100%) */}
            <rect x={paddingLeft} y={y} width={barWidth * 0.4} height="26" fill="#334155" />
            <rect x={paddingLeft + barWidth * 0.4} y={y} width={barWidth * 0.35} height="26" fill="#475569" />
            <rect x={paddingLeft + barWidth * 0.75} y={y} width={barWidth * 0.25} height="26" fill="#64748b" />

            {/* Actual Value Bar (Foreground Black/Teal) */}
            <rect
              x={paddingLeft}
              y={y + 6}
              width={actualWidth}
              height="14"
              fill={metTarget ? config.actionColor : '#0f172a'}
              stroke="#38bdf8"
              strokeWidth={metTarget ? '1' : '0.5'}
            />

            {/* Target Line Marker (Red Dash as in Evergreen/Few) */}
            <line
              x1={targetX}
              y1={y - 2}
              x2={targetX}
              y2={y + 28}
              stroke="#f43f5e"
              strokeWidth="3.5"
            />

            {/* Direct Data Value */}
            <text
              x={paddingLeft + actualWidth - 6}
              y={y + 17}
              fill="#ffffff"
              fontSize="9"
              fontWeight="700"
              textAnchor="end"
              className="tabular-nums"
            >
              {Math.round(row.actual)}%
            </text>
          </g>
        );
      })}

      {/* Legend below */}
      <g transform={`translate(${paddingLeft}, ${height - 20})`}>
        <rect x="0" y="0" width="12" height="8" fill="#334155" />
        <text x="16" y="7" fill="#94a3b8" fontSize="10">Needs Attention</text>

        <rect x="110" y="0" width="12" height="8" fill="#64748b" />
        <text x="126" y="7" fill="#94a3b8" fontSize="10">Acceptable</text>

        <line x1="200" y1="4" x2="215" y2="4" stroke="#f43f5e" strokeWidth="3" />
        <text x="222" y="7" fill="#f43f5e" fontSize="10" fontWeight="600">Target ({targetVal}%)</text>
      </g>
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* 5. BENCHMARK LINE COLUMN (Chapter 4 - Ninja Level 2)                        */
/* -------------------------------------------------------------------------- */
function BenchmarkLineGraphic({
  dataset,
  config,
  svgRef,
}: {
  dataset: CleanedDataset;
  config: ChartConfig;
  svgRef: React.RefObject<SVGSVGElement | null>;
}) {
  const labelCol = config.labelColumn;
  const valCol = config.valueColumns[0];
  const targetVal = config.benchmarkValue || 75;

  const rows = dataset.cleanedRows
    .map((r) => ({
      label: String(r[labelCol] || ''),
      val: Number(r[valCol]) || 0,
    }))
    .filter((r) => r.label);

  const width = 640;
  const height = 340;
  const paddingLeft = 60;
  const paddingRight = 40;
  const topY = 60;
  const bottomY = 280;

  const maxVal = Math.max(100, ...(rows.map((r) => r.val * 1.1)));
  const scaleY = (v: number) => bottomY - (v / maxVal) * (bottomY - topY);
  const targetY = scaleY(targetVal);

  const colWidth = (width - paddingLeft - paddingRight) / (rows.length || 1);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-auto max-w-[640px] font-sans"
    >
      <text x={paddingLeft} y="24" fill="#f8fafc" fontSize="15" fontWeight="700">
        {config.title}
      </text>
      <text x={paddingLeft} y="40" fill="#94a3b8" fontSize="11">
        Target line provides instant performance context without guessing
      </text>

      {/* Benchmark Line */}
      <line
        x1={paddingLeft}
        y1={targetY}
        x2={width - paddingRight}
        y2={targetY}
        stroke="#f43f5e"
        strokeWidth="2.5"
        strokeDasharray="4 3"
      />
      <text
        x={width - paddingRight - 6}
        y={targetY - 6}
        fill="#f43f5e"
        fontSize="11"
        fontWeight="700"
        textAnchor="end"
      >
        Target: {targetVal}%
      </text>

      {/* Columns */}
      {rows.map((row, idx) => {
        const x = paddingLeft + idx * colWidth + colWidth * 0.15;
        const barW = colWidth * 0.7;
        const barH = (row.val / maxVal) * (bottomY - topY);
        const y = bottomY - barH;
        const metTarget = row.val >= targetVal;

        return (
          <g key={idx}>
            <rect
              x={x}
              y={y}
              width={barW}
              height={barH}
              rx="4"
              fill={metTarget ? config.actionColor : '#64748b'}
            />
            {/* Direct Label Inside Top */}
            <text
              x={x + barW / 2}
              y={y + 16}
              fill="#ffffff"
              fontSize="10"
              fontWeight="700"
              textAnchor="middle"
              className="tabular-nums"
            >
              {Math.round(row.val)}%
            </text>
            {/* Category Name Below */}
            <text
              x={x + barW / 2}
              y={bottomY + 18}
              fill="#cbd5e1"
              fontSize="11"
              textAnchor="middle"
            >
              {row.label.length > 12 ? `${row.label.substring(0, 11)}…` : row.label}
            </text>
          </g>
        );
      })}

      {/* Baseline */}
      <line x1={paddingLeft} y1={bottomY} x2={width - paddingRight} y2={bottomY} stroke="#334155" strokeWidth="1" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* 6. DIVERGING STACKED BAR (Chapter 5 - Ninja Level 9)                       */
/* -------------------------------------------------------------------------- */
function DivergingStackedBarGraphic({
  dataset,
  config,
  svgRef,
}: {
  dataset: CleanedDataset;
  config: ChartConfig;
  svgRef: React.RefObject<SVGSVGElement | null>;
}) {
  const labelCol = config.labelColumn;
  // Look for Disagree, Agree columns or standard headers
  const headers = dataset.cleanedHeaders;
  const stronglyDisagreeCol = headers.find((h) => h.toLowerCase().includes('strongly disagree')) || headers[5];
  const disagreeCol = headers.find((h) => h.toLowerCase().includes('disagree') && !h.toLowerCase().includes('strongly')) || headers[4];
  const neutralCol = headers.find((h) => h.toLowerCase().includes('neutral') || h.toLowerCase().includes('sorta')) || headers[3];
  const agreeCol = headers.find((h) => h.toLowerCase().includes('agree') && !h.toLowerCase().includes('strongly')) || headers[2];
  const stronglyAgreeCol = headers.find((h) => h.toLowerCase().includes('strongly agree')) || headers[1];

  const rows = dataset.cleanedRows
    .map((r) => {
      const sd = Number(r[stronglyDisagreeCol]) || 0;
      const d = Number(r[disagreeCol]) || 0;
      const n = Number(r[neutralCol]) || 0;
      const a = Number(r[agreeCol]) || 0;
      const sa = Number(r[stronglyAgreeCol]) || 0;
      return {
        label: String(r[labelCol] || ''),
        sd,
        d,
        n,
        a,
        sa,
        totalNeg: sd + d + n / 2,
        totalPos: sa + a + n / 2,
      };
    })
    .filter((r) => r.label);

  const width = 640;
  const rowHeight = 44;
  const height = Math.max(260, rows.length * rowHeight + 100);
  const centerX = 330;
  const maxSpan = 100;
  const scale = 2.4; // pixels per percent

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-auto max-w-[640px] font-sans"
    >
      <text x={centerX} y="22" fill="#f8fafc" fontSize="15" fontWeight="700" textAnchor="middle">
        {config.title}
      </text>
      <text x={centerX} y="38" fill="#94a3b8" fontSize="11" textAnchor="middle">
        Diverging Stacked Bar: Negative sentiments left (Warm), Positive sentiments right (Evergreen Blue)
      </text>

      {/* Center 0% Midpoint Line */}
      <line x1={centerX} y1={55} x2={centerX} y2={height - 35} stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" />
      <text x={centerX} y={height - 20} fill="#38bdf8" fontSize="10" fontWeight="700" textAnchor="middle">
        0% Midpoint
      </text>

      {/* Column header legend at top */}
      <g transform="translate(180, 52)">
        <text x="-40" y="0" fill="#f43f5e" fontSize="10" fontWeight="600" textAnchor="end">← Disagree</text>
        <text x="340" y="0" fill="#0284c7" fontSize="10" fontWeight="600" textAnchor="start">Agree →</text>
      </g>

      {rows.map((row, idx) => {
        const y = 68 + idx * rowHeight;
        const sdW = row.sd * scale;
        const dW = row.d * scale;
        const aW = row.a * scale;
        const saW = row.sa * scale;

        return (
          <g key={idx}>
            {/* Question Label */}
            <text x={centerX - (sdW + dW) - 8} y={y + 14} fill="#e2e8f0" fontSize="10.5" fontWeight="500" textAnchor="end">
              {row.label.length > 24 ? `${row.label.substring(0, 23)}…` : row.label}
            </text>

            {/* Negative Stack: Strongly Disagree (Dark Coral) */}
            <rect
              x={centerX - (sdW + dW)}
              y={y}
              width={sdW}
              height="20"
              fill="#e11d48"
            />

            {/* Negative Stack: Disagree (Soft Orange) */}
            <rect
              x={centerX - dW}
              y={y}
              width={dW}
              height="20"
              fill="#fb923c"
            />

            {/* Positive Stack: Agree (Light Teal/Blue) */}
            <rect
              x={centerX}
              y={y}
              width={aW}
              height="20"
              fill="#38bdf8"
            />

            {/* Positive Stack: Strongly Agree (Deep Action Blue) */}
            <rect
              x={centerX + aW}
              y={y}
              width={saW}
              height="20"
              fill={config.actionColor}
            />

            {/* Total Positive Label at right */}
            <text x={centerX + aW + saW + 8} y={y + 14} fill="#38bdf8" fontSize="10" fontWeight="700">
              {Math.round(row.a + row.sa)}%
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* 7. AGGREGATED STACKED BAR (Chapter 5 - Ninja Level 2)                      */
/* -------------------------------------------------------------------------- */
function AggregatedStackedBarGraphic({
  dataset,
  config,
  svgRef,
}: {
  dataset: CleanedDataset;
  config: ChartConfig;
  svgRef: React.RefObject<SVGSVGElement | null>;
}) {
  const labelCol = config.labelColumn;
  const rows = dataset.cleanedRows
    .map((r) => {
      // Look for Agree + Strongly Agree
      let pos = 0;
      let neg = 0;
      Object.entries(r).forEach(([k, v]) => {
        const key = k.toLowerCase();
        const num = Number(v) || 0;
        if (key.includes('agree') || key.includes('yes') || key.includes('high')) {
          pos += num;
        } else if (key.includes('disagree') || key.includes('no') || key.includes('poor')) {
          neg += num;
        }
      });
      if (pos === 0) pos = Number(r[config.valueColumns[0]]) || 65;
      return {
        label: String(r[labelCol] || ''),
        positive: Math.min(100, pos),
        other: Math.max(0, 100 - Math.min(100, pos)),
      };
    })
    .filter((r) => r.label);

  rows.sort((a, b) => b.positive - a.positive);

  const width = 640;
  const rowHeight = 40;
  const height = Math.max(260, rows.length * rowHeight + 90);
  const paddingLeft = 160;
  const paddingRight = 40;
  const barWidth = width - paddingLeft - paddingRight;

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-auto max-w-[640px] font-sans"
    >
      <text x={paddingLeft} y="24" fill="#f8fafc" fontSize="15" fontWeight="700">
        {config.title}
      </text>
      <text x={paddingLeft} y="40" fill="#94a3b8" fontSize="11">
        Aggregated Stacked Bar: Collapses positive responses on a common left baseline
      </text>

      {rows.map((row, idx) => {
        const y = 60 + idx * rowHeight;
        const posW = (row.positive / 100) * barWidth;
        const otherW = barWidth - posW;

        return (
          <g key={idx}>
            <text x={paddingLeft - 10} y={y + 14} fill="#cbd5e1" fontSize="11" textAnchor="end">
              {row.label.length > 22 ? `${row.label.substring(0, 21)}…` : row.label}
            </text>

            {/* Positive Segment (Action Color) */}
            <rect x={paddingLeft} y={y} width={posW} height="20" fill={config.actionColor} rx="2" />
            
            {/* Other / Muted Segment (Gray) */}
            <rect x={paddingLeft + posW} y={y} width={otherW} height="20" fill="#334155" rx="2" />

            {/* Data Label Inside Positive Chunk */}
            <text x={paddingLeft + posW - 8} y={y + 14} fill="#ffffff" fontSize="10" fontWeight="700" textAnchor="end" className="tabular-nums">
              {Math.round(row.positive)}%
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* 8. THE LOLLIPOP VARIATION (Chapter 5 - Ninja Level 3)                      */
/* -------------------------------------------------------------------------- */
function LollipopGraphic({
  dataset,
  config,
  svgRef,
}: {
  dataset: CleanedDataset;
  config: ChartConfig;
  svgRef: React.RefObject<SVGSVGElement | null>;
}) {
  const labelCol = config.labelColumn;
  const valCol = config.valueColumns[0];

  const rows = dataset.cleanedRows
    .map((r) => ({
      label: String(r[labelCol] || ''),
      val: Number(r[valCol]) || 0,
    }))
    .filter((r) => r.label);

  if (config.sortOrder === 'desc') rows.sort((a, b) => b.val - a.val);
  else if (config.sortOrder === 'asc') rows.sort((a, b) => a.val - b.val);

  const width = 640;
  const rowHeight = 36;
  const height = Math.max(260, rows.length * rowHeight + 80);
  const paddingLeft = 150;
  const paddingRight = 50;
  const chartWidth = width - paddingLeft - paddingRight;

  const maxVal = Math.max(100, ...(rows.map((r) => r.val * 1.05)));
  const scaleX = (v: number) => paddingLeft + (v / maxVal) * chartWidth;

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-auto max-w-[640px] font-sans"
    >
      <text x={paddingLeft} y="22" fill="#f8fafc" fontSize="15" fontWeight="700">
        {config.title}
      </text>
      <text x={paddingLeft} y="38" fill="#94a3b8" fontSize="11">
        Lollipop Chart: Eliminates ink overload; sharp circle focuses eye on the true value
      </text>

      {/* Axis Baseline */}
      <line x1={paddingLeft} y1={55} x2={paddingLeft} y2={height - 20} stroke="#334155" strokeWidth="1.5" />

      {rows.map((row, idx) => {
        const y = 62 + idx * rowHeight;
        const x = scaleX(row.val);
        const isTop = idx === 0;

        return (
          <g key={idx}>
            <text x={paddingLeft - 10} y={y + 4} fill="#cbd5e1" fontSize="11" textAnchor="end">
              {row.label.length > 20 ? `${row.label.substring(0, 19)}…` : row.label}
            </text>

            {/* Lollipop Stick */}
            <line x1={paddingLeft} y1={y} x2={x} stroke="#475569" strokeWidth="2" />

            {/* Lollipop Head */}
            <circle cx={x} cy={y} r={isTop ? '8.5' : '7'} fill={isTop ? config.actionColor : '#38bdf8'} />

            {/* Direct Label */}
            <text x={x + 12} y={y + 3.5} fill="#f1f5f9" fontSize="10.5" fontWeight="700" className="tabular-nums">
              {Math.round(row.val)}{config.isPercentage ? '%' : ''}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* 9. A SINGLE LARGE NUMBER (Chapter 2 - Ninja Level 0)                       */
/* -------------------------------------------------------------------------- */
function SingleNumberGraphic({
  dataset,
  config,
  svgRef,
}: {
  dataset: CleanedDataset;
  config: ChartConfig;
  svgRef: React.RefObject<SVGSVGElement | null>;
}) {
  const valCol = config.valueColumns[0];
  const firstRow = dataset.cleanedRows[0] || {};
  const focalVal = Math.round(Number(firstRow[valCol]) || 58);
  const focalLabel = String(firstRow[config.labelColumn] || 'Key finding');

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 600 320"
      className="w-full h-auto max-w-[600px] font-sans"
    >
      <rect x="20" y="20" width="560" height="280" rx="16" fill="#0f172a" stroke="#1e293b" />
      
      {/* Decorative subtle arc */}
      <circle cx="500" cy="80" r="100" fill="none" stroke="#0284c7" strokeWidth="40" opacity="0.1" />

      <text x="60" y="70" fill="#94a3b8" fontSize="13" fontWeight="600" letterSpacing="1.5">
        KEY METRIC TAKEAWAY
      </text>

      {/* Massive Typographic Number */}
      <text
        x="60"
        y="180"
        fill={config.actionColor}
        fontSize="96"
        fontWeight="900"
        className="tabular-nums font-['Cabinet_Grotesk']"
      >
        {focalVal}{config.isPercentage ? '%' : ''}
      </text>

      {/* Contextual Narrative Phrase */}
      <text x="60" y="225" fill="#f8fafc" fontSize="18" fontWeight="700">
        {config.title || focalLabel}
      </text>
      <text x="60" y="250" fill="#94a3b8" fontSize="12">
        {config.subtitle || 'Research shows a single large number commands maximum retention for key statistics.'}
      </text>
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* 10. ICON ARRAY (Chapter 2 - Ninja Level 1)                                  */
/* -------------------------------------------------------------------------- */
function IconArrayGraphic({
  dataset,
  config,
  svgRef,
}: {
  dataset: CleanedDataset;
  config: ChartConfig;
  svgRef: React.RefObject<SVGSVGElement | null>;
}) {
  const valCol = config.valueColumns[0];
  const firstRow = dataset.cleanedRows[0] || {};
  const pct = Math.min(100, Math.max(0, Math.round(Number(firstRow[valCol]) || 62)));

  // 10 x 10 grid of 100 circles
  const cols = 10;
  const rows = 10;
  const dotRadius = 8;
  const gap = 24;
  const startX = 60;
  const startY = 80;

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 600 360"
      className="w-full h-auto max-w-[600px] font-sans"
    >
      <text x="60" y="32" fill="#f8fafc" fontSize="16" fontWeight="700">
        {config.title}
      </text>
      <text x="60" y="52" fill="#94a3b8" fontSize="12">
        {pct} out of 100 individuals ({pct}%) represented in action color
      </text>

      {/* Icon Grid */}
      {Array.from({ length: 100 }).map((_, i) => {
        const c = i % cols;
        const r = Math.floor(i / cols);
        const x = startX + c * gap;
        const y = startY + r * gap;
        const isFilled = i < pct;

        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={dotRadius}
            fill={isFilled ? config.actionColor : '#334155'}
            stroke={isFilled ? '#38bdf8' : '#1e293b'}
            strokeWidth="0.8"
          />
        );
      })}

      {/* Accompanying Big Stat on the right */}
      <g transform="translate(360, 140)">
        <text x="0" y="0" fill={config.actionColor} fontSize="64" fontWeight="900" className="font-['Cabinet_Grotesk']">
          {pct}%
        </text>
        <text x="0" y="30" fill="#f8fafc" fontSize="14" fontWeight="600">
          {String(firstRow[config.labelColumn] || 'Affirmative Response')}
        </text>
        <text x="0" y="50" fill="#94a3b8" fontSize="11">
          High accessibility for all numeracy levels
        </text>
      </g>
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* 11. FOCUSED DONUT OR PIE DONE RIGHT (Chapter 2 & 6 - Ninja 1/3)            */
/* -------------------------------------------------------------------------- */
function FocusedDonutOrPieGraphic({
  dataset,
  config,
  isPie = false,
  svgRef,
}: {
  dataset: CleanedDataset;
  config: ChartConfig;
  isPie: boolean;
  svgRef: React.RefObject<SVGSVGElement | null>;
}) {
  const labelCol = config.labelColumn;
  const valCol = config.valueColumns[0];

  const rows = dataset.cleanedRows
    .map((r) => ({
      label: String(r[labelCol] || ''),
      val: Number(r[valCol]) || 0,
    }))
    .filter((r) => r.label)
    .slice(0, 4); // Max 4 slices as per Evergreen Rule!

  const total = rows.reduce((acc, r) => acc + r.val, 0) || 100;
  
  // Sort descending clockwise starting at 12 o'clock noon!
  rows.sort((a, b) => b.val - a.val);

  const cx = 300;
  const cy = 180;
  const r = 90;
  const innerR = isPie ? 0 : 55;

  let currentAngle = -Math.PI / 2; // Start at 12 o'clock noon!

  const slices = rows.map((row, idx) => {
    const sliceAngle = (row.val / total) * 2 * Math.PI;
    const start = currentAngle;
    const end = currentAngle + sliceAngle;
    currentAngle = end;

    const x1 = cx + r * Math.cos(start);
    const y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(end);
    const y2 = cy + r * Math.sin(end);

    const ix1 = cx + innerR * Math.cos(end);
    const iy1 = cy + innerR * Math.sin(end);
    const ix2 = cx + innerR * Math.cos(start);
    const iy2 = cy + innerR * Math.sin(start);

    const largeArc = sliceAngle > Math.PI ? 1 : 0;

    const pathData = isPie
      ? `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`
      : `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} L ${ix1} ${iy1} A ${innerR} ${innerR} 0 ${largeArc} 0 ${ix2} ${iy2} Z`;

    const isFirst = idx === 0;
    const color = isFirst ? config.actionColor : idx === 1 ? '#64748b' : idx === 2 ? '#475569' : '#334155';

    return {
      pathData,
      color,
      label: row.label,
      val: row.val,
      pct: Math.round((row.val / total) * 100),
      isFirst,
    };
  });

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 600 360"
      className="w-full h-auto max-w-[600px] font-sans"
    >
      <text x="300" y="24" fill="#f8fafc" fontSize="15" fontWeight="700" textAnchor="middle">
        {config.title}
      </text>
      <text x="300" y="42" fill="#94a3b8" fontSize="11" textAnchor="middle">
        {isPie ? 'Pie Done Right: Max 4 slices, starts at 12 o\'clock noon' : 'Donut Done Right: Single focal chunk highlighted, center stat'}
      </text>

      {/* Slices */}
      {slices.map((s, i) => (
        <path key={i} d={s.pathData} fill={s.color} stroke="#0f172a" strokeWidth="2" />
      ))}

      {/* Center Text for Donut */}
      {!isPie && (
        <g>
          <text x={cx} y={cy - 4} fill="#ffffff" fontSize="22" fontWeight="800" textAnchor="middle" className="tabular-nums">
            {slices[0]?.pct}%
          </text>
          <text x={cx} y={cy + 14} fill="#94a3b8" fontSize="9" fontWeight="600" textAnchor="middle">
            {slices[0]?.label}
          </text>
        </g>
      )}

      {/* Direct Labels Legend */}
      <g transform="translate(430, 110)">
        {slices.map((s, i) => (
          <g key={i} transform={`translate(0, ${i * 26})`}>
            <circle cx="6" cy="6" r="5" fill={s.color} />
            <text x="18" y="10" fill={s.isFirst ? '#ffffff' : '#cbd5e1'} fontSize="11" fontWeight={s.isFirst ? '700' : '400'}>
              {s.label}: <tspan fontWeight="700">{s.pct}%</tspan>
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* 12. HIGHLIGHTED ACTION BAR (Chapter 2 - Ninja Level 3)                      */
/* -------------------------------------------------------------------------- */
function ActionBarGraphic({
  dataset,
  config,
  svgRef,
}: {
  dataset: CleanedDataset;
  config: ChartConfig;
  svgRef: React.RefObject<SVGSVGElement | null>;
}) {
  const labelCol = config.labelColumn;
  const valCol = config.valueColumns[0];

  const rows = dataset.cleanedRows
    .map((r) => ({
      label: String(r[labelCol] || ''),
      val: Number(r[valCol]) || 0,
    }))
    .filter((r) => r.label);

  rows.sort((a, b) => b.val - a.val);

  const width = 640;
  const rowHeight = 38;
  const height = Math.max(260, rows.length * rowHeight + 80);
  const paddingLeft = 140;
  const paddingRight = 40;
  const chartWidth = width - paddingLeft - paddingRight;

  const maxVal = Math.max(100, ...(rows.map((r) => r.val * 1.05)));

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-auto max-w-[640px] font-sans"
    >
      <text x={paddingLeft} y="24" fill="#f8fafc" fontSize="15" fontWeight="700">
        {config.title}
      </text>
      <text x={paddingLeft} y="40" fill="#94a3b8" fontSize="11">
        Action Color Focus: Only the priority metric is highlighted; rest are muted gray
      </text>

      {/* Axis Baseline */}
      <line x1={paddingLeft} y1={55} x2={paddingLeft} y2={height - 20} stroke="#334155" strokeWidth="1.5" />

      {rows.map((row, idx) => {
        const y = 62 + idx * rowHeight;
        const barW = (row.val / maxVal) * chartWidth;
        // Priority action category: selected row or top row
        const isAction = config.actionCategory ? row.label === config.actionCategory : idx === 0;

        return (
          <g key={idx}>
            <text
              x={paddingLeft - 10}
              y={y + 14}
              fill={isAction ? '#ffffff' : '#94a3b8'}
              fontSize="11"
              fontWeight={isAction ? '700' : '400'}
              textAnchor="end"
            >
              {row.label.length > 20 ? `${row.label.substring(0, 19)}…` : row.label}
            </text>

            <rect
              x={paddingLeft}
              y={y}
              width={barW}
              height="20"
              rx="3"
              fill={isAction ? config.actionColor : '#475569'}
            />

            {/* Direct Label */}
            <text
              x={paddingLeft + barW + 8}
              y={y + 14}
              fill={isAction ? '#38bdf8' : '#94a3b8'}
              fontSize="11"
              fontWeight="700"
              className="tabular-nums"
            >
              {Math.round(row.val)}{config.isPercentage ? '%' : ''}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* 13. 100% UNWRAPPED STACKED BAR (Chapter 6 - Ninja Level 2)                 */
/* -------------------------------------------------------------------------- */
function StackedBar100Graphic({
  dataset,
  config,
  svgRef,
}: {
  dataset: CleanedDataset;
  config: ChartConfig;
  svgRef: React.RefObject<SVGSVGElement | null>;
}) {
  const labelCol = config.labelColumn;
  const valCol = config.valueColumns[0];

  const rows = dataset.cleanedRows
    .map((r) => ({
      label: String(r[labelCol] || ''),
      val: Number(r[valCol]) || 0,
    }))
    .filter((r) => r.label);

  const total = rows.reduce((a, b) => a + b.val, 0) || 100;

  const width = 640;
  const height = 280;
  const paddingX = 40;
  const barY = 120;
  const barH = 50;
  const barW = width - paddingX * 2;

  let currentX = paddingX;
  const colors = [config.actionColor, '#0284c7', '#38bdf8', '#7dd3fc', '#bae6fd', '#e2e8f0'];

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-auto max-w-[640px] font-sans"
    >
      <text x={paddingX} y="32" fill="#f8fafc" fontSize="15" fontWeight="700">
        {config.title}
      </text>
      <text x={paddingX} y="52" fill="#94a3b8" fontSize="11">
        100% Stacked Bar (Unwrapped Pie): Avoids angle confusion while showing parts of a whole
      </text>

      {rows.map((row, idx) => {
        const segW = (row.val / total) * barW;
        const x = currentX;
        currentX += segW;
        const color = colors[idx % colors.length];

        return (
          <g key={idx}>
            <rect x={x} y={barY} width={segW} height={barH} fill={color} stroke="#0f172a" strokeWidth="1" />
            
            {/* Top Label */}
            <text
              x={x + segW / 2}
              y={barY - 14}
              fill="#cbd5e1"
              fontSize="10"
              fontWeight="600"
              textAnchor="middle"
            >
              {row.label.length > 12 ? `${row.label.substring(0, 11)}…` : row.label}
            </text>

            {/* Percentage Inside Bar */}
            {segW > 28 && (
              <text
                x={x + segW / 2}
                y={barY + 30}
                fill="#0f172a"
                fontSize="11"
                fontWeight="800"
                textAnchor="middle"
                className="tabular-nums"
              >
                {Math.round((row.val / total) * 100)}%
              </text>
            )}
          </g>
        );
      })}

      {/* Axis markers */}
      <line x1={paddingX} y1={barY + barH + 8} x2={width - paddingX} y2={barY + barH + 8} stroke="#334155" strokeWidth="1" />
      {[0, 25, 50, 75, 100].map((t) => (
        <text
          key={t}
          x={paddingX + (t / 100) * barW}
          y={barY + barH + 24}
          fill="#64748b"
          fontSize="10"
          textAnchor="middle"
        >
          {t}%
        </text>
      ))}
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* 14. DEVIATION BAR GRAPH (Chapter 9 - Ninja Level 3)                        */
/* -------------------------------------------------------------------------- */
function DeviationBarGraphic({
  dataset,
  config,
  svgRef,
}: {
  dataset: CleanedDataset;
  config: ChartConfig;
  svgRef: React.RefObject<SVGSVGElement | null>;
}) {
  const labelCol = config.labelColumn;
  const col1 = config.valueColumns[0];
  const col2 = config.valueColumns[1] || config.valueColumns[0];

  const rows = dataset.cleanedRows
    .map((r) => {
      const v1 = Number(r[col1]) || 0;
      const v2 = Number(r[col2]) || 0;
      return {
        label: String(r[labelCol] || ''),
        diff: v2 - v1,
      };
    })
    .filter((r) => r.label);

  rows.sort((a, b) => b.diff - a.diff);

  const width = 640;
  const rowHeight = 36;
  const height = Math.max(260, rows.length * rowHeight + 90);
  const centerX = 330;
  const maxDiff = Math.max(...rows.map((r) => Math.abs(r.diff)), 10) * 1.2;
  const scale = 220 / maxDiff;

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-auto max-w-[640px] font-sans"
    >
      <text x={centerX} y="24" fill="#f8fafc" fontSize="15" fontWeight="700" textAnchor="middle">
        {config.title}
      </text>
      <text x={centerX} y="42" fill="#94a3b8" fontSize="11" textAnchor="middle">
        Deviation Bar: Directly graphs net change (+/-) so viewers don't do mental subtraction
      </text>

      {/* Center 0 Line */}
      <line x1={centerX} y1={55} x2={centerX} y2={height - 25} stroke="#475569" strokeWidth="1.5" />
      <text x={centerX} y={height - 10} fill="#94a3b8" fontSize="10" fontWeight="700" textAnchor="middle">
        0 Net Change
      </text>

      {rows.map((row, idx) => {
        const y = 62 + idx * rowHeight;
        const isPos = row.diff >= 0;
        const barW = Math.abs(row.diff) * scale;
        const barX = isPos ? centerX : centerX - barW;
        const color = isPos ? config.actionColor : '#f43f5e';

        return (
          <g key={idx}>
            {/* Label placed on left if positive, on right if negative */}
            <text
              x={isPos ? centerX - 12 : centerX + 12}
              y={y + 14}
              fill="#cbd5e1"
              fontSize="11"
              textAnchor={isPos ? 'end' : 'start'}
            >
              {row.label.length > 20 ? `${row.label.substring(0, 19)}…` : row.label}
            </text>

            <rect x={barX} y={y} width={barW} height="18" fill={color} rx="2" />

            {/* Value annotation at end of bar */}
            <text
              x={isPos ? barX + barW + 6 : barX - 6}
              y={y + 13}
              fill={color}
              fontSize="10.5"
              fontWeight="700"
              textAnchor={isPos ? 'start' : 'end'}
              className="tabular-nums"
            >
              {isPos ? `+${Math.round(row.diff)}` : `${Math.round(row.diff)}`}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* 15. CLEAN LINE GRAPH (Chapter 9 - Ninja Level 2)                           */
/* -------------------------------------------------------------------------- */
function CleanLineGraphic({
  dataset,
  config,
  svgRef,
}: {
  dataset: CleanedDataset;
  config: ChartConfig;
  svgRef: React.RefObject<SVGSVGElement | null>;
}) {
  // Max 4 series as per APA & Stephanie Evergreen rule!
  const labelCol = config.labelColumn;
  const timeCols = dataset.cleanedHeaders.filter((h) => h !== labelCol && dataset.columns.find((c) => c.name === h)?.type === 'number').slice(0, 4);

  const series = dataset.cleanedRows.slice(0, 4).map((r) => ({
    name: String(r[labelCol] || ''),
    points: timeCols.map((col) => Number(r[col]) || 0),
  }));

  const allVals = series.flatMap((s) => s.points);
  const minVal = Math.min(...allVals) * 0.9;
  const maxVal = Math.max(...allVals) * 1.1;

  const width = 640;
  const height = 320;
  const paddingLeft = 50;
  const paddingRight = 130;
  const topY = 60;
  const bottomY = 270;

  const scaleX = (idx: number) => paddingLeft + (idx / Math.max(1, timeCols.length - 1)) * (width - paddingLeft - paddingRight);
  const scaleY = (v: number) => bottomY - ((v - minVal) / (maxVal - minVal || 1)) * (bottomY - topY);

  const colors = [config.actionColor, '#38bdf8', '#94a3b8', '#64748b'];

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-auto max-w-[640px] font-sans"
    >
      <text x={paddingLeft} y="24" fill="#f8fafc" fontSize="15" fontWeight="700">
        {config.title}
      </text>
      <text x={paddingLeft} y="40" fill="#94a3b8" fontSize="11">
        Clean Line Graph: Direct end labeling replaces disconnected legends (Max 4 lines)
      </text>

      {/* Time x-axis ticks */}
      {timeCols.map((col, idx) => {
        const x = scaleX(idx);
        return (
          <g key={idx}>
            <line x1={x} y1={topY} x2={x} y2={bottomY} stroke="#1e293b" strokeDasharray="3 3" />
            <text x={x} y={bottomY + 18} fill="#64748b" fontSize="11" textAnchor="middle">
              {col}
            </text>
          </g>
        );
      })}

      {/* Series Lines */}
      {series.map((s, sIdx) => {
        const color = colors[sIdx % colors.length];
        const pathData = s.points
          .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(i)} ${scaleY(pt)}`)
          .join(' ');

        const lastX = scaleX(s.points.length - 1);
        const lastY = scaleY(s.points[s.points.length - 1]);

        return (
          <g key={sIdx}>
            <path d={pathData} fill="none" stroke={color} strokeWidth={sIdx === 0 ? '3.5' : '2'} />

            {/* Markers */}
            {s.points.map((pt, i) => (
              <circle key={i} cx={scaleX(i)} cy={scaleY(pt)} r="4.5" fill={color} stroke="#0f172a" strokeWidth="1.5" />
            ))}

            {/* Direct End Label (Evergreen principle: no separate legend!) */}
            <text
              x={lastX + 8}
              y={lastY + 4}
              fill={color}
              fontSize="11"
              fontWeight={sIdx === 0 ? '700' : '500'}
            >
              {s.name}
            </text>
          </g>
        );
      })}

      <line x1={paddingLeft} y1={bottomY} x2={width - paddingRight} y2={bottomY} stroke="#334155" strokeWidth="1.5" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* 16. HISTOGRAM (Chapter 6 - Ninja Level 2)                                  */
/* -------------------------------------------------------------------------- */
function HistogramGraphic({
  dataset,
  config,
  svgRef,
}: {
  dataset: CleanedDataset;
  config: ChartConfig;
  svgRef: React.RefObject<SVGSVGElement | null>;
}) {
  const labelCol = config.labelColumn;
  const valCol = config.valueColumns[0];

  const rows = dataset.cleanedRows
    .map((r) => ({
      bin: String(r[labelCol] || ''),
      val: Number(r[valCol]) || 0,
    }))
    .filter((r) => r.bin);

  const width = 640;
  const height = 300;
  const paddingLeft = 50;
  const paddingRight = 40;
  const bottomY = 250;
  const topY = 60;

  const maxVal = Math.max(...rows.map((r) => r.val)) * 1.15;
  const colWidth = (width - paddingLeft - paddingRight) / (rows.length || 1);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-auto max-w-[640px] font-sans"
    >
      <text x={paddingLeft} y="24" fill="#f8fafc" fontSize="15" fontWeight="700">
        {config.title}
      </text>
      <text x={paddingLeft} y="40" fill="#94a3b8" fontSize="11">
        Histogram: 0% gap width between continuous quantitative brackets
      </text>

      {rows.map((row, idx) => {
        const x = paddingLeft + idx * colWidth;
        const barH = (row.val / maxVal) * (bottomY - topY);
        const y = bottomY - barH;
        const isFocal = idx === Math.floor(rows.length / 2);

        return (
          <g key={idx}>
            <rect
              x={x}
              y={y}
              width={colWidth}
              height={barH}
              fill={isFocal ? config.actionColor : '#38bdf8'}
              stroke="#0f172a"
              strokeWidth="1.5"
            />
            {/* Label inside bar top */}
            <text x={x + colWidth / 2} y={y - 6} fill="#ffffff" fontSize="9.5" fontWeight="600" textAnchor="middle">
              {Math.round(row.val)}%
            </text>
            {/* Bin label */}
            <text x={x + colWidth / 2} y={bottomY + 16} fill="#94a3b8" fontSize="9.5" textAnchor="middle">
              {row.bin}
            </text>
          </g>
        );
      })}

      <line x1={paddingLeft} y1={bottomY} x2={width - paddingRight} y2={bottomY} stroke="#334155" strokeWidth="1" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* 17. SMALL MULTIPLES (Chapter 3 & 9 - Ninja Level 4)                        */
/* -------------------------------------------------------------------------- */
function SmallMultiplesGraphic({
  dataset,
  config,
  svgRef,
}: {
  dataset: CleanedDataset;
  config: ChartConfig;
  svgRef: React.RefObject<SVGSVGElement | null>;
}) {
  const labelCol = config.labelColumn;
  const timeCols = dataset.cleanedHeaders.filter((h) => h !== labelCol && dataset.columns.find((c) => c.name === h)?.type === 'number').slice(0, 4);

  const series = dataset.cleanedRows.slice(0, 6).map((r) => ({
    name: String(r[labelCol] || ''),
    points: timeCols.map((col) => Number(r[col]) || 0),
  }));

  const allVals = series.flatMap((s) => s.points);
  const minVal = 0;
  const maxVal = Math.max(100, ...allVals);

  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-base font-bold text-slate-100">{config.title}</h3>
        <p className="text-xs text-slate-400">
          Small Multiples: Breaking tangled spaghetti lines into identical-scale micro panels
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {series.map((s, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-3">
            <div className="text-xs font-semibold text-slate-200 mb-1 truncate">{s.name}</div>
            <svg viewBox="0 0 160 80" className="w-full h-16">
              <line x1="10" y1="70" x2="150" y2="70" stroke="#334155" strokeWidth="1" />
              {/* Line */}
              <polyline
                fill="none"
                stroke={idx === 0 ? config.actionColor : '#38bdf8'}
                strokeWidth="2.5"
                points={s.points
                  .map((p, i) => {
                    const x = 15 + (i / Math.max(1, s.points.length - 1)) * 130;
                    const y = 65 - (p / maxVal) * 55;
                    return `${x},${y}`;
                  })
                  .join(' ')}
              />
              {/* End Point */}
              {s.points.length > 0 && (
                <circle
                  cx={145}
                  cy={65 - (s.points[s.points.length - 1] / maxVal) * 55}
                  r="3.5"
                  fill={config.actionColor}
                />
              )}
            </svg>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>{timeCols[0]}</span>
              <span className="font-bold text-slate-200">{Math.round(s.points[s.points.length - 1])}%</span>
              <span>{timeCols[timeCols.length - 1]}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 18. INDICATOR DOTS & SPARKLINES TABLE (Chapter 4 - Ninja Level 7)           */
/* -------------------------------------------------------------------------- */
function IndicatorTableGraphic({
  dataset,
  config,
  svgRef,
}: {
  dataset: CleanedDataset;
  config: ChartConfig;
  svgRef: React.RefObject<SVGSVGElement | null>;
}) {
  const labelCol = config.labelColumn;
  const numCols = dataset.columns.filter((c) => c.type === 'number' || c.type === 'percentage');
  const targetVal = config.benchmarkValue || 60;

  const rows = dataset.cleanedRows.slice(0, 6).map((r) => {
    const scores = numCols.map((c) => Number(r[c.name]) || 0);
    const avg = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    return {
      label: String(r[labelCol] || ''),
      scores,
      avg: Math.round(avg),
      isFailing: avg < targetVal,
      isWarning: avg >= targetVal && avg < targetVal + 10,
    };
  });

  return (
    <div className="w-full overflow-x-auto text-xs">
      <div className="mb-3">
        <h4 className="font-bold text-slate-100">{config.title}</h4>
        <p className="text-[11px] text-slate-400">
          Selective indicator dots only sound the alarm when metrics fall below target ({targetVal}%)
        </p>
      </div>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-800 text-slate-400 font-semibold text-[11px]">
            <th className="py-2 px-2.5">Category</th>
            <th className="py-2 px-2.5">Micro Trend (Sparkline)</th>
            <th className="py-2 px-2.5 text-right">Average</th>
            <th className="py-2 px-2.5 text-center">Alert Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {rows.map((row, idx) => (
            <tr key={idx} className="hover:bg-slate-900/40">
              <td className="py-2.5 px-2.5 font-medium text-slate-200">{row.label}</td>
              <td className="py-2.5 px-2.5">
                <svg viewBox="0 0 100 24" className="w-24 h-6">
                  <polyline
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2"
                    points={row.scores
                      .map((sc, i) => {
                        const x = 5 + (i / Math.max(1, row.scores.length - 1)) * 90;
                        const y = 20 - (sc / 100) * 16;
                        return `${x},${y}`;
                      })
                      .join(' ')}
                  />
                  {/* Target reference line */}
                  <line x1="0" y1={20 - (targetVal / 100) * 16} x2="100" y2={20 - (targetVal / 100) * 16} stroke="#f43f5e" strokeWidth="0.8" strokeDasharray="2 2" />
                </svg>
              </td>
              <td className="py-2.5 px-2.5 text-right font-bold tabular-nums text-slate-200">
                {row.avg}%
              </td>
              <td className="py-2.5 px-2.5 text-center">
                {row.isFailing ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    Needs Intervention
                  </span>
                ) : row.isWarning ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    Borderline
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-500">On Target</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
