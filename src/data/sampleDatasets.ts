/**
 * Preloaded raw datasets inspired directly by the case studies in Stephanie Evergreen's
 * "Effective Data Visualization: The Right Chart for the Right Data"
 */

export interface SampleDatasetDefinition {
  id: string;
  name: string;
  chapterSource: string;
  description: string;
  defaultTakeaway: string;
  suggestedCharts: string[];
  rawRows: Record<string, any>[];
}

export const SAMPLE_DATASETS: SampleDatasetDefinition[] = [
  {
    id: 'parent-vs-student',
    name: 'Parent vs Student Perspectives (Survey)',
    chapterSource: 'Chapter 1 & 2 (Fig 1.1 - 1.2, Fig 2.10)',
    description: 'Messy raw survey percentages comparing parents and students across key life expectations.',
    defaultTakeaway: 'Surprisingly, students have far lower expectations to attend college (58%) than their parents (89%).',
    suggestedCharts: ['slopegraph', 'dumbbell_dot_plot', 'action_bar', 'dot_plot', 'single_number'],
    rawRows: [
      { 'Category ': 'Eats a well balanced diet ', 'Students (%)': '38%', 'Parents (%)': ' 31% ', 'Notes / Raw': 'Nutrition survey' },
      { 'Category ': 'Is active enough', 'Students (%)': '64%', 'Parents (%)': '54%', 'Notes / Raw': 'Physical health' },
      { 'Category ': 'Hangs out with nice people', 'Students (%)': '85%', 'Parents (%)': '80%', 'Notes / Raw': 'Peer group' },
      { 'Category ': 'Will attend college', 'Students (%)': '58%', 'Parents (%)': '89%', 'Notes / Raw': 'CRITICAL ALARM' },
      { 'Category ': 'Will work during high school', 'Students (%)': '77%', 'Parents (%)': '68%', 'Notes / Raw': 'Employment' },
      { 'Category ': 'Has mentor or advisor', 'Students (%)': '42%', 'Parents (%)': '44%', 'Notes / Raw': 'Guidance' },
    ],
  },
  {
    id: 'department-sales',
    name: 'Department Sales Pre vs Post Relocation',
    chapterSource: 'Chapter 3: Slopegraphs (Fig 3.3 - 3.12)',
    description: 'Grocery store sales before and after moving locations. Clustered bars cloud the finding that Cheese plummeted while Packaged surged.',
    defaultTakeaway: 'Cheese was the only department that dropped ($64k to $58k), while Packaged goods made impressive gains.',
    suggestedCharts: ['slopegraph', 'deviation_bar', 'dumbbell_dot_plot', 'side_by_side_col', 'small_multiples'],
    rawRows: [
      { 'Department ': 'Packaged Goods', 'Old Site ($k)': '$61 ', 'New Site ($k)': ' $72', 'Target Goal': '$70' },
      { 'Department ': 'Meat Department', 'Old Site ($k)': ' $82 ', 'New Site ($k)': '$88', 'Target Goal': '$85' },
      { 'Department ': 'Cheese & Dairy', 'Old Site ($k)': '$64', 'New Site ($k)': '$58', 'Target Goal': '$65' },
      { 'Department ': 'Frozen Foods', 'Old Site ($k)': '$60 ', 'New Site ($k)': '$65', 'Target Goal': '$62' },
      { 'Department ': 'Fresh Produce', 'Old Site ($k)': '$74', 'New Site ($k)': '$80', 'Target Goal': '$78' },
      { 'Department ': 'Deli & Bakery', 'Old Site ($k)': '$50', 'New Site ($k)': '$57', 'Target Goal': '$55' },
    ],
  },
  {
    id: 'kindergarten-readiness',
    name: 'Kindergarten Readiness: Fall vs Spring',
    chapterSource: 'Chapter 3 & 10: Dot Plots on Common Scale (Fig 3.28 - 3.35)',
    description: 'Kindergarten preparedness scores tested at Fall entry and Spring follow-up against the state benchmark.',
    defaultTakeaway: 'Kindergarten readiness increased across all domains, with Literacy showing the largest jump from 34% to 69%.',
    suggestedCharts: ['dot_plot', 'dumbbell_dot_plot', 'bullet_graph', 'benchmark_line'],
    rawRows: [
      { 'Subject Area': 'Literacy Skills', 'Fall Entry (%)': '34%', 'Spring Exit (%)': '69%', 'Benchmark Target (%)': '75%' },
      { 'Subject Area': 'Language Comprehension', 'Fall Entry (%)': '63%', 'Spring Exit (%)': '77%', 'Benchmark Target (%)': '75%' },
      { 'Subject Area': 'Mathematics & Logic', 'Fall Entry (%)': '67%', 'Spring Exit (%)': '75%', 'Benchmark Target (%)': '75%' },
      { 'Subject Area': 'Early Science Observation', 'Fall Entry (%)': '92%', 'Spring Exit (%)': '98%', 'Benchmark Target (%)': '75%' },
      { 'Subject Area': 'Creative Arts & Expression', 'Fall Entry (%)': '96%', 'Spring Exit (%)': '100%', 'Benchmark Target (%)': '75%' },
    ],
  },
  {
    id: 'employee-survey-likert',
    name: 'Data Culture & Skills (Likert Survey)',
    chapterSource: 'Chapter 5: Diverging & Aggregated Stacked Bars (Fig 5.7 - 5.21)',
    description: 'Staff attitudes toward data exploration, tools, and training with 5-point Likert ratings.',
    defaultTakeaway: 'While confident manipulating Excel, 85% of respondents feel under-equipped to choose the right chart without tools.',
    suggestedCharts: ['diverging_stacked_bar', 'aggregated_stacked_bar', 'lollipop', 'small_multiples'],
    rawRows: [
      { 'Statement': 'I enjoy exploring and questioning my data', 'Strongly Agree': '45%', 'Agree': '30%', 'Neutral': '10%', 'Disagree': '10%', 'Strongly Disagree': '5%' },
      { 'Statement': 'I can manipulate Excel to do what I want', 'Strongly Agree': '70%', 'Agree': '10%', 'Neutral': '10%', 'Disagree': '5%', 'Strongly Disagree': '5%' },
      { 'Statement': 'I know exactly which chart type is research-proven', 'Strongly Agree': '15%', 'Agree': '20%', 'Neutral': '20%', 'Disagree': '30%', 'Strongly Disagree': '15%' },
      { 'Statement': 'I consider myself an effective dataviz ninja', 'Strongly Agree': '22%', 'Agree': '28%', 'Neutral': '15%', 'Disagree': '20%', 'Strongly Disagree': '15%' },
      { 'Statement': 'I regularly share visual data with stakeholders', 'Strongly Agree': '50%', 'Agree': '35%', 'Neutral': '8%', 'Disagree': '4%', 'Strongly Disagree': '3%' },
    ],
  },
  {
    id: 'healthcare-costs-time',
    name: 'Hospital Inpatient Unit Costs (2011-2014)',
    chapterSource: 'Chapter 9: Time Trends & Stacked Columns (Fig 9.7 - 9.11)',
    description: 'Inpatient healthcare costs per member per month across departments, demonstrating how stacked columns reveal tiny categories.',
    defaultTakeaway: 'Overall inpatient costs decreased steadily from $87.45 to $74.48, driven by reductions in Medical and Surgical care.',
    suggestedCharts: ['clean_line', 'stacked_bar_100', 'deviation_bar', 'small_multiples'],
    rawRows: [
      { 'Department': 'Medical Care', '2011': '$26.80', '2012': '$24.97', '2013': '$25.69', '2014': '$24.07' },
      { 'Department': 'Surgical Procedures', '2011': '$21.74', '2012': '$19.58', '2013': '$20.70', '2014': '$21.09' },
      { 'Department': 'Physician Services', '2011': '$13.10', '2012': '$12.45', '2013': '$12.75', '2014': '$10.79' },
      { 'Department': 'Newborn Care', '2011': '$9.38', '2012': '$8.18', '2013': '$8.79', '2014': '$6.75' },
      { 'Department': 'Maternity Services', '2011': '$12.10', '2012': '$10.13', '2013': '$10.76', '2014': '$8.03' },
      { 'Department': 'Mental Health', '2011': '$4.33', '2012': '$3.73', '2013': '$3.78', '2014': '$3.75' },
    ],
  },
];
