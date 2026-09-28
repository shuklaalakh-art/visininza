/**
 * Stephanie Evergreen Chart Chooser & Recommendation Engine
 * Connects data shapes with the exact visual models from
 * "Effective Data Visualization: The Right Chart for the Right Data"
 */

import { CleanedDataset, EvergreenChartMeta, EvergreenCategory, ChartConfig } from '../types/data';

export const EVERGREEN_CHARTS_CATALOG: EvergreenChartMeta[] = [
  // Chapter 2: Single Number
  {
    id: 'single_number',
    name: 'A Single Large Number',
    category: 'single_number',
    chapter: 2,
    ninjaLevel: 0,
    description: 'Displays one critical statistic at massive typographic scale with a concise explanatory label.',
    rationale: 'Zikmund-Fisher (2014) showed a single large number beat icon arrays and pie charts for immediate significance retention.',
    clevelandMcGillTier: 'Direct Numeric Encoding (Zero Cognitive Load)',
    bestFor: ['Key take-home KPI', 'Shocking stat or single prevalence rate', 'Natural probability ratio (e.g., 1 in 50 million)'],
    pros: ['Burns directly into audience memory', 'No visual clutter or distortion', 'Takes 30 seconds to read'],
    watchOut: 'Use sparingly. If everything is large, size no longer commands attention.',
  },
  {
    id: 'icon_array',
    name: 'Icon Array (Waffle/100 Dots)',
    category: 'single_number',
    chapter: 2,
    ninjaLevel: 1,
    description: 'A 10, 100, or 1000-icon grid where selected icons are color-coded in an action color to represent a proportion.',
    rationale: 'Galesic et al. (2009) proved icon arrays dramatically elevate comprehension for low and high-numeracy audiences alike.',
    clevelandMcGillTier: 'Area / Discrete Unit Counting',
    bestFor: ['Health risk communication', 'Consumer preference (e.g. 9 out of 10)', 'Accessibility for diverse stakeholders'],
    pros: ['Very accessible for data-anxious viewers', 'Humanizes abstract percentages', 'Engaging infographic feel'],
    watchOut: 'Keep icons consistent and avoid clip-art styles. Limit color coding to at most 2-3 groups.',
  },
  {
    id: 'donut_slice',
    name: 'Focused Donut (Single Chunk)',
    category: 'single_number',
    chapter: 2,
    ninjaLevel: 3,
    description: 'A single colored segment wrapped around the focal number, with the remainder muted in gray.',
    rationale: 'Donuts are acceptable ONLY when highlighting one chunk with the rest muted, so viewers only judge one curve.',
    clevelandMcGillTier: 'Curvature & Angle (Tolerable for single segment)',
    bestFor: ['Single percentage highlight with context', 'Executive dashboard KPI with visual anchor'],
    pros: ['Provides eye-candy without cognitive overload', 'Leaves center room for large stat label'],
    watchOut: 'Never compare multiple unmuted slices in a donut; curvature judgment induces severe errors.',
  },
  {
    id: 'action_bar',
    name: 'Highlighted Action Bar',
    category: 'single_number',
    chapter: 2,
    ninjaLevel: 3,
    description: 'A standard bar chart where all bars are muted gray except ONE category dressed in the vibrant action color.',
    rationale: 'Cleveland & McGill #3 (Length). Keeps contextual comparison while giving laser focus to the headline takeaway.',
    clevelandMcGillTier: 'Length on Common Scale',
    bestFor: ['Highlighting your organization or priority issue among peers', 'Survey takeaway focus'],
    pros: ['Audience instantly knows where to look', 'Avoids rainbow bar overload', 'Sorted from greatest to least'],
    watchOut: 'Always sort the bars so the eye glides naturally down the ranking.',
  },

  // Chapter 3: Comparisons
  {
    id: 'dot_plot',
    name: 'Cleveland-McGill Dot Plot',
    category: 'comparison',
    chapter: 3,
    ninjaLevel: 8,
    description: 'Dots placed along a common continuous horizontal scale for each category.',
    rationale: 'Top of Cleveland & McGill (1984) hierarchy: Position on a common scale is decoded with the highest human perceptual accuracy.',
    clevelandMcGillTier: 'Tier 1: Position on Common Scale (Gold Standard)',
    bestFor: ['Comparing two or three points across 5–25 categories', 'Pre-test vs Post-test growth', 'Subgroup comparisons'],
    pros: ['Far less ink than clustered bar charts', 'Allows multiple comparison points on each line without clutter', 'Highest accuracy'],
    watchOut: 'Anchor with a light 0-100 baseline so readers feel grounded.',
  },
  {
    id: 'dumbbell_dot_plot',
    name: 'Connected Dumbbell Dot Plot',
    category: 'comparison',
    chapter: 3,
    ninjaLevel: 10,
    description: 'Two dots connected by a horizontal line that emphasizes the gap, growth, or distance between two time points or groups.',
    rationale: 'Draws explicit visual attention to the length of the connecting bar (growth/gap) rather than isolated coordinates.',
    clevelandMcGillTier: 'Position on Common Scale + Length of Connector',
    bestFor: ['Measuring intervention impact (Before vs After)', 'Wage gap or disparity reporting', 'Benchmarking progress'],
    pros: ['Makes positive vs negative change unmistakable', 'Extremely elegant and modern', 'Accommodates many rows cleanly'],
    watchOut: 'Sort rows by the size of the gap/growth, not alphabetically, to reveal the story immediately.',
  },
  {
    id: 'slopegraph',
    name: 'Slopegraph',
    category: 'comparison',
    chapter: 3,
    ninjaLevel: 5,
    description: 'Two vertical scales connected by diagonal lines. Line slope accentuates rapid increases, decreases, and crossovers.',
    rationale: 'Relies on human ability to judge angle/direction (Cleveland & McGill #4) to isolate divergent rates of change.',
    clevelandMcGillTier: 'Direction & Position on Non-Aligned Scales',
    bestFor: ['Before vs After two-point comparisons', 'Detecting which category decreased while all others grew', 'Grocery relocation sales'],
    pros: ['Eliminates the spaghetti of clustered bar charts', 'Reveals rank shifts and crossovers at a glance', 'Clean direct labels at ends'],
    watchOut: 'Use action color for the surprising line and quiet gray for the rest. Check spacing so labels do not overlap.',
  },
  {
    id: 'back_to_back',
    name: 'Back-to-Back Bars (Shared Spine)',
    category: 'comparison',
    chapter: 3,
    ninjaLevel: 7,
    description: 'Two sets of horizontal bars sharing a central spine, extending left and right (population pyramid style).',
    rationale: 'Enables quick symmetrical comparison of the overall distribution shape between two distinct groups (e.g. Male vs Female, Teachers vs Principals).',
    clevelandMcGillTier: 'Length on Opposed Scales',
    bestFor: ['Comparing demographic distributions', 'Comparing two respondent cohorts on identical items', 'Age/gender profiles'],
    pros: ['Impartial central placement of item labels', 'Shows holistic shape symmetry without overlap'],
    watchOut: 'Not intended for comparing exact millimeter heights across sides; designed for overall profile shape.',
  },
  {
    id: 'side_by_side_col',
    name: 'Side-by-Side Column (Max 2 Series)',
    category: 'comparison',
    chapter: 3,
    ninjaLevel: 2,
    description: 'Clustered column chart strictly limited to two comparisons (e.g. Youth vs Adult, Treatment vs Control).',
    rationale: 'Cowan (2000): Short-term memory limits comparison to 2 items within 3–5 groups. 3+ clustered bars overwhelm working memory.',
    clevelandMcGillTier: 'Length on Common Scale',
    bestFor: ['Strictly 2 series comparison across a few groups', 'Clear binary evaluation (e.g. Pre vs Post)'],
    pros: ['Instantly recognizable by any audience', 'Direct length comparison'],
    watchOut: 'BANNED by Evergreen: 3+ columns per group. If you have 3+ series, use small multiples or dot plots.',
  },
  {
    id: 'small_multiples',
    name: 'Small Multiples (Identical Scale)',
    category: 'comparison',
    chapter: 3,
    ninjaLevel: 4,
    description: 'A series of mini charts side-by-side or in a clean grid, all sharing identical axes and scale.',
    rationale: 'The secret weapon to uncomplicating any spaghetti chart. Keeps cognitive load low while enabling cross-category scan.',
    clevelandMcGillTier: 'Position on Non-Aligned Uniform Scales',
    bestFor: ['Tangled time series with 5+ categories', 'Comparing regional trends without overlapping lines'],
    pros: ['Zero line clutter', 'Immediately highlights individual anomalies', 'High reader trust'],
    watchOut: 'All small multiple facets MUST share identical minimum and maximum scales.',
  },

  // Chapter 4: Benchmarks
  {
    id: 'bullet_graph',
    name: 'Stephen Few Bullet Graph',
    category: 'benchmark',
    chapter: 4,
    ninjaLevel: 7,
    description: 'A dark actual value bar plotted against a target marker line, with qualitative shaded background zones (Poor/Satisfactory/Good).',
    rationale: 'Invented by Stephen Few as a high-density, context-rich replacement for cluttered dashboard gauges and thermometers.',
    clevelandMcGillTier: 'Length + Position against Reference Scale',
    bestFor: ['KPI tracking against targets', 'Quarterly sales/grants vs goals', 'Performance monitoring dashboards'],
    pros: ['Extreme information density in minimal vertical space', 'Shows status, target, and performance zones simultaneously'],
    watchOut: 'Keep background zones in subtle shades of gray so the black actual bar and target line stand out.',
  },
  {
    id: 'benchmark_line',
    name: 'Benchmark Line on Column',
    category: 'benchmark',
    chapter: 4,
    ninjaLevel: 2,
    description: 'A bold horizontal target line cutting across column bars to give immediate reference context.',
    rationale: 'Answers the first question every decision-maker asks: "Compared to what?"',
    clevelandMcGillTier: 'Length vs Linear Target Anchor',
    bestFor: ['Comparing actual department metrics to a common standard or national average', 'Fundraising goals'],
    pros: ['Simple to build and read', 'Viewer instantly sees who met the goal and who fell short'],
    watchOut: 'Label the line directly with "Target" or "Benchmark: X%" to eliminate a separate legend.',
  },
  {
    id: 'indicator_table',
    name: 'Indicator Dots & Sparklines',
    category: 'benchmark',
    chapter: 4,
    ninjaLevel: 7,
    description: 'Table with in-cell trend sparklines and selective indicator dots that alert only when metrics fall below acceptable thresholds.',
    rationale: 'Avoids traffic-light red/yellow/green chaos. Only sounds the alarm where action is required.',
    clevelandMcGillTier: 'Direct Tabular + Micro Trend',
    bestFor: ['Teacher gradebooks monitoring struggling students', 'Executive KPI review tables', 'Operational scorecards'],
    pros: ['Allows seeing raw numbers + micro trend + alerts simultaneously', 'No visual noise on satisfactory items'],
    watchOut: 'Do not put colored dots on passing rows; only use dots for items requiring intervention.',
  },

  // Chapter 5: Survey & Likert
  {
    id: 'diverging_stacked_bar',
    name: 'Diverging Stacked Bar',
    category: 'survey_likert',
    chapter: 5,
    ninjaLevel: 9,
    description: 'Stacked bar diverging around a 0% center spine, sending negative sentiments left (red/orange) and positive sentiments right (blue/teal).',
    rationale: 'Heiberger & Robbins (2014): Solves the floating baseline problem of regular stacked bars for middle response categories.',
    clevelandMcGillTier: 'Length from Bilateral Midpoint',
    bestFor: ['Likert scales (Strongly Disagree to Strongly Agree)', 'Satisfaction surveys', 'Cultural & organizational sentiment'],
    pros: ['Instant visual comparison of positive vs negative balance', 'Solves middle category readability'],
    watchOut: 'Handle neutral properly by placing it centrally or reporting separately.',
  },
  {
    id: 'aggregated_stacked_bar',
    name: 'Aggregated Stacked Bar',
    category: 'survey_likert',
    chapter: 5,
    ninjaLevel: 2,
    description: 'Combines Agree + Strongly Agree into one prominent positive chunk on the left, graying out neutral/disagree on the right.',
    rationale: 'Audiences usually care whether people agreed or disagreed, not subtle 5-point nuances. Collapsing reduces cognitive drag.',
    clevelandMcGillTier: 'Length with Unified Baseline',
    bestFor: ['Camp, donor, and stakeholder outcome reports', 'Executive presentations where brevity rules'],
    pros: ['Shares a single common left baseline for all positive scores', 'Enables easy greatest-to-least sorting'],
    watchOut: 'Check for reverse-coded questions and handle them with explicit notes.',
  },
  {
    id: 'lollipop',
    name: 'The Lollipop Variation',
    category: 'survey_likert',
    chapter: 5,
    ninjaLevel: 3,
    description: 'A dot indicating value at the end of a thin stick connecting to the axis, replacing ink-heavy bars.',
    rationale: 'Drastically reduces ink-to-data ratio when values are all high (e.g. 70%-90%), avoiding aggressive heavy blocks of color.',
    clevelandMcGillTier: 'Position on Common Scale + Supporting Line',
    bestFor: ['Check-all-that-apply survey rankings', 'Lengthy lists of priorities', 'High percentage rankings'],
    pros: ['Delightful, light visual weight', 'Focuses eye on exact value circle', 'Can be ordered greatest to least'],
    watchOut: 'Keep marker circle small enough so it does not span an ambiguous range of the axis.',
  },

  // Chapter 6: Parts of a Whole
  {
    id: 'stacked_bar_100',
    name: '100% Unwrapped Stacked Bar',
    category: 'parts_of_whole',
    chapter: 6,
    ninjaLevel: 2,
    description: 'A single horizontal rectangle showing length slices that sum to 100%, unwrapping a pie into a clean bar.',
    rationale: 'Humans interpret length significantly better than angles and wedge curvature.',
    clevelandMcGillTier: 'Length on 100% Baseline',
    bestFor: ['Demographic breakdowns (income brackets, education levels, market shares)'],
    pros: ['Obvious that parts sum to 100%', 'Sequential shade progression', 'Direct labels above each chunk'],
    watchOut: 'If slices are very thin, angle or lead lines to prevent text collisions.',
  },
  {
    id: 'pie_done_right',
    name: 'Pie Chart Done Right',
    category: 'parts_of_whole',
    chapter: 6,
    ninjaLevel: 1,
    description: 'Strictly $\\le 4$ slices, largest wedge starting at 12 o\'clock noon, descending clockwise, with 1 focal action color.',
    rationale: 'Evergreen rule: Pie charts are acceptable ONLY when slices are $\\le 4$, differences are pronounced, and largest starts at 12:00.',
    clevelandMcGillTier: 'Angle & Area (Acceptable under strict constraints)',
    bestFor: ['Binary or 3-way demographic splits (e.g. 75% vs 25%, Male vs Female, Yes/No/Undecided)'],
    pros: ['Familiar for mainstream readers', 'Shows part-to-whole immediately'],
    watchOut: 'Never use 3D pie charts! Never use more than 4 slices; switch to 100% stacked bar instead.',
  },
  {
    id: 'histogram',
    name: 'Histogram (0% Gap Binned)',
    category: 'parts_of_whole',
    chapter: 6,
    ninjaLevel: 2,
    description: 'Column chart with zero space between bars, representing continuous binned quantitative ranges.',
    rationale: 'The proper statistical format for continuous binned variables (e.g. age brackets, salary tiers).',
    clevelandMcGillTier: 'Length on Continuous Interval Scale',
    bestFor: ['Age brackets (0-5, 6-10, 11-15)', 'Income distribution bins', 'Score distributions'],
    pros: ['Accentuates the overall distribution shape of the dataset', 'Highlight key demographics in action color'],
    watchOut: 'Do not use a histogram for unordered categorical data; only for continuous binned numbers.',
  },

  // Chapter 9: Trends Over Time
  {
    id: 'clean_line',
    name: 'Clean Line Graph (Max 4 Lines)',
    category: 'time_trend',
    chapter: 9,
    ninjaLevel: 2,
    description: 'Time series with maximum 4 lines, direct end labels (no disconnected legend), and markers on actual data points.',
    rationale: 'APA Style Guide & Evergreen: Never exceed 4 lines per graph to prevent spaghetti syndrome.',
    clevelandMcGillTier: 'Direction & Position over Time',
    bestFor: ['Tracking 1 to 4 categories over years, quarters, or months', 'Longitudinal evaluation'],
    pros: ['Intuitive time progression along x-axis', 'Direct labels at right end remove eye gymnastics'],
    watchOut: 'If you have 5+ lines, switch to Small Multiples!',
  },
  {
    id: 'deviation_bar',
    name: 'Deviation Bar Graph',
    category: 'time_trend',
    chapter: 9,
    ninjaLevel: 3,
    description: 'Displays ONLY the net change (positive or negative) from baseline to final time point, sorted greatest to least.',
    rationale: 'Instead of forcing viewers to mentally subtract before and after numbers, directly graph the difference that matters.',
    clevelandMcGillTier: 'Length on Bipolar Scale (+/- from zero)',
    bestFor: ['Census demographic growth projections (2012 to 2060)', 'Net change across programs or regions'],
    pros: ['Relieves the audience from doing mental arithmetic', 'Highlights which groups gained and which lost'],
    watchOut: 'Zero line must be clearly anchored in the center; positive bars right/up, negative bars left/down.',
  },
];

/**
 * Intelligent Chart Chooser Recommendation:
 * Analyzes dataset characteristics and suggests the most sensible Evergreen charts
 */
export function recommendChartsForDataset(dataset: CleanedDataset): {
  recommendedCharts: EvergreenChartMeta[];
  primaryRecommendation: EvergreenChartMeta;
  reasoning: string;
} {
  const numericCols = dataset.columns.filter((c) => c.type === 'number' || c.type === 'percentage' || c.type === 'currency');
  const categoryCols = dataset.columns.filter((c) => c.type === 'category' || c.type === 'text');
  const rowCount = dataset.cleanedRows.length;

  // Case 1: Likert scale data (headers like Strongly Agree, Agree, Disagree)
  const isLikert = dataset.cleanedHeaders.some(
    (h) =>
      h.toLowerCase().includes('strongly agree') ||
      h.toLowerCase().includes('agree') ||
      h.toLowerCase().includes('fair') ||
      h.toLowerCase().includes('poor')
  );
  if (isLikert) {
    const primary = EVERGREEN_CHARTS_CATALOG.find((c) => c.id === 'diverging_stacked_bar')!;
    const others = EVERGREEN_CHARTS_CATALOG.filter((c) =>
      ['diverging_stacked_bar', 'aggregated_stacked_bar', 'lollipop', 'small_multiples'].includes(c.id)
    );
    return {
      recommendedCharts: others,
      primaryRecommendation: primary,
      reasoning: 'Detected Likert rating survey data. Stephanie Evergreen Chapter 5 recommends Diverging Stacked Bars around a center spine to solve the floating baseline flaw of standard stacked bars.',
    };
  }

  // Case 2: Two comparison columns across categories (e.g. Old vs New, Fall vs Spring, Parents vs Students)
  if (numericCols.length === 2 && rowCount >= 3) {
    const primary = EVERGREEN_CHARTS_CATALOG.find((c) => c.id === 'dumbbell_dot_plot')!;
    const others = EVERGREEN_CHARTS_CATALOG.filter((c) =>
      ['dumbbell_dot_plot', 'dot_plot', 'slopegraph', 'deviation_bar', 'side_by_side_col'].includes(c.id)
    );
    return {
      recommendedCharts: others,
      primaryRecommendation: primary,
      reasoning: `Found 2 numeric comparison columns ("${numericCols[0].name}" and "${numericCols[1].name}") across ${rowCount} categories. Stephanie Evergreen Chapter 3 recommends Connected Dumbbell Dot Plots or Slopegraphs to spotlight gap and growth without bar clutter.`,
    };
  }

  // Case 3: Benchmark comparison (contains target/benchmark column or name)
  const benchmarkCol = dataset.columns.find((c) => c.name.toLowerCase().includes('target') || c.name.toLowerCase().includes('benchmark') || c.name.toLowerCase().includes('goal'));
  if (benchmarkCol && numericCols.length >= 2) {
    const primary = EVERGREEN_CHARTS_CATALOG.find((c) => c.id === 'bullet_graph')!;
    const others = EVERGREEN_CHARTS_CATALOG.filter((c) =>
      ['bullet_graph', 'benchmark_line', 'indicator_table', 'dumbbell_dot_plot'].includes(c.id)
    );
    return {
      recommendedCharts: others,
      primaryRecommendation: primary,
      reasoning: `Identified benchmark / target column ("${benchmarkCol.name}"). Stephanie Evergreen Chapter 4 recommends Stephen Few Bullet Graphs or Benchmark Line Combos to provide clear performance context.`,
    };
  }

  // Case 4: Time series columns (years, months, e.g. 2011, 2012, 2013 or Date column)
  const hasTimeHeaders = dataset.cleanedHeaders.some((h) => /^(19|20)\d{2}$/.test(h) || h.toLowerCase().includes('year') || h.toLowerCase().includes('month'));
  if (hasTimeHeaders || (categoryCols.length === 1 && numericCols.length >= 3)) {
    const primary = EVERGREEN_CHARTS_CATALOG.find((c) => c.id === 'clean_line')!;
    const others = EVERGREEN_CHARTS_CATALOG.filter((c) =>
      ['clean_line', 'small_multiples', 'deviation_bar', 'stacked_bar_100'].includes(c.id)
    );
    return {
      recommendedCharts: others,
      primaryRecommendation: primary,
      reasoning: 'Longitudinal or multi-period dataset detected. Stephanie Evergreen Chapter 9 recommends Clean Line Graphs with direct end labels (max 4 lines) or Small Multiples to avoid spaghetti lines.',
    };
  }

  // Case 5: Single numeric column with categories (Ranking or Parts of Whole)
  if (numericCols.length === 1 && rowCount > 4) {
    const primary = EVERGREEN_CHARTS_CATALOG.find((c) => c.id === 'lollipop')!;
    const others = EVERGREEN_CHARTS_CATALOG.filter((c) =>
      ['lollipop', 'action_bar', 'single_number', 'icon_array', 'stacked_bar_100'].includes(c.id)
    );
    return {
      recommendedCharts: others,
      primaryRecommendation: primary,
      reasoning: `Found ${rowCount} items with 1 numeric metric ("${numericCols[0].name}"). Stephanie Evergreen Chapter 5 recommends Lollipop Graphs or Focused Action Bars to save ink and isolate the highest performers.`,
    };
  }

  // Case 6: 4 or fewer items (Parts of whole or single number)
  if (rowCount <= 4) {
    const primary = EVERGREEN_CHARTS_CATALOG.find((c) => c.id === 'pie_done_right')!;
    const others = EVERGREEN_CHARTS_CATALOG.filter((c) =>
      ['pie_done_right', 'stacked_bar_100', 'single_number', 'icon_array'].includes(c.id)
    );
    return {
      recommendedCharts: others,
      primaryRecommendation: primary,
      reasoning: `Only ${rowCount} items in dataset. Stephanie Evergreen Chapter 6 approves Pie Charts ONLY when slices are 4 or fewer, starting at 12 o'clock noon in descending clockwise order.`,
    };
  }

  // Default fallback recommendation
  const primary = EVERGREEN_CHARTS_CATALOG.find((c) => c.id === 'dot_plot')!;
  return {
    recommendedCharts: EVERGREEN_CHARTS_CATALOG.slice(0, 6),
    primaryRecommendation: primary,
    reasoning: 'Standard multi-variable data. Cleveland & McGill ranking places Dot Plots on a common scale at the absolute top for perceptual decoding accuracy.',
  };
}

/**
 * Build default chart configuration for a given chart type and dataset
 */
export function buildDefaultChartConfig(chartMeta: EvergreenChartMeta, dataset: CleanedDataset): ChartConfig {
  const categoryCol = dataset.columns.find((c) => c.type === 'category' || c.type === 'text')?.name || dataset.cleanedHeaders[0];
  const numericCols = dataset.columns.filter((c) => c.type === 'number' || c.type === 'percentage' || c.type === 'currency');
  
  const valCols = numericCols.length > 0 ? numericCols.map((c) => c.name) : [dataset.cleanedHeaders[1] || dataset.cleanedHeaders[0]];

  // Detect benchmark if any
  const benchmarkCol = dataset.columns.find((c) => c.name.toLowerCase().includes('benchmark') || c.name.toLowerCase().includes('target'));
  let benchmarkValue: number | undefined;
  if (benchmarkCol && benchmarkCol.numericValues.length > 0) {
    benchmarkValue = benchmarkCol.numericValues[0];
  } else if (numericCols.length > 0 && numericCols[0].mean) {
    benchmarkValue = Math.round(numericCols[0].mean);
  }

  // Detect default action category (e.g. College or top item)
  const firstRow = dataset.cleanedRows[0];
  const actionCat = firstRow ? String(firstRow[categoryCol] || '') : undefined;

  // Formulate declarative title in Evergreen style
  let defaultTitle = `${dataset.fileName.replace(/\.[^/.]+$/, '')} Insights`;
  if (chartMeta.id === 'slopegraph') {
    defaultTitle = `Significant shift observed between baseline and follow-up`;
  } else if (chartMeta.id === 'dumbbell_dot_plot') {
    defaultTitle = `Performance growth varied significantly across categories`;
  } else if (chartMeta.id === 'bullet_graph') {
    defaultTitle = `Most areas met or exceeded the established benchmark target`;
  } else if (chartMeta.id === 'diverging_stacked_bar') {
    defaultTitle = `Strong positive agreement outweighed critical concerns`;
  } else if (chartMeta.id === 'lollipop') {
    defaultTitle = `Top ranked items commanded majority focus`;
  }

  return {
    id: `cfg-${chartMeta.id}-${Date.now()}`,
    chartType: chartMeta.id,
    title: defaultTitle,
    subtitle: dataset.summary.missingCellsCount > 0 ? `Note: Excludes minor missing responses (<${((dataset.summary.missingCellsCount / (dataset.cleanedRows.length * dataset.cleanedHeaders.length)) * 100).toFixed(0)}%)` : 'All figures cleaned and verified by VisiNinja',
    labelColumn: categoryCol,
    valueColumns: valCols.slice(0, 4),
    actionCategory: actionCat,
    actionColor: '#0284c7', // Evergreen Signature Electric Blue
    mutedColor: '#94a3b8',  // Stephanie's Muted Slate Gray
    benchmarkValue: benchmarkValue || 75,
    benchmarkLabel: benchmarkCol?.name || 'Target Goal (75%)',
    sortOrder: 'desc',
    showDataLabels: true,
    dataLabelPosition: 'inside',
    isPercentage: numericCols.some((c) => c.type === 'percentage'),
  };
}
