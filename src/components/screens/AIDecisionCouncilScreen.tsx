import React, { useState } from 'react';
import { CleanedDataset } from '../../types/data';
import { ConsensusDecisionResult } from '../../types/ai';
import { requestAIConsensusDecision } from '../../utils/aiConsensus';
import {
  Sparkles,
  Bot,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  BrainCircuit,
  Award,
  Layers,
  ShieldAlert,
  Compass,
} from 'lucide-react';

interface AIDecisionCouncilScreenProps {
  dataset: CleanedDataset;
  onApplyConsensus: (chartId: string, headline?: string) => void;
}

export const AIDecisionCouncilScreen: React.FC<AIDecisionCouncilScreenProps> = ({
  dataset,
  onApplyConsensus,
}) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ConsensusDecisionResult | null>(null);

  const handleRunConsensus = async () => {
    setLoading(true);
    try {
      const decision = await requestAIConsensusDecision(dataset);
      setResult(decision);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-teal-950 border border-teal-500/30 rounded-2xl p-4 sm:p-5 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-teal-400 text-xs font-bold uppercase tracking-wider mb-1">
              <BrainCircuit className="w-4 h-4 text-teal-300" />
              <span>5-Model AI Decision Council</span>
            </div>
            <h2 className="text-xl font-black text-white font-['Cabinet_Grotesk']">
              Gemini + Claude + Perplexity + Copilot + ChatGPT
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Each AI examines your cleaned dataset from its specialized angle (Cleveland-McGill perception, nuance, external benchmarks, Excel ninja architecture, and executive storytelling) to deliver the perfect decision.
            </p>
          </div>

          <button
            onClick={handleRunConsensus}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-teal-950/40 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Consulting 5 AIs...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{result ? 'Re-Consult Council' : 'Run Multi-AI Consensus'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Consensus Result Card */}
      {result && (
        <div className="bg-slate-900 border border-teal-500/50 rounded-2xl p-5 shadow-2xl space-y-4 ring-1 ring-teal-500/30 animate-in fade-in duration-300">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Consensus Verdict: <span className="text-teal-300">{result.consensusChartName}</span>
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 font-semibold tabular-nums">
                {result.consensusConfidence}% Council Confidence
              </span>
              {result.unanimous && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold">
                  Unanimous
                </span>
              )}
            </div>
          </div>

          {/* Headline Takeaway */}
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <div className="text-[11px] font-bold text-teal-400 uppercase tracking-wider">
              Perfect Declarative Takeaway Headline
            </div>
            <p className="text-sm sm:text-base font-bold text-slate-100">
              "{result.executiveHeadline}"
            </p>
          </div>

          {/* Strategic Rationale */}
          <div className="text-xs text-slate-300 leading-relaxed">
            <strong className="text-slate-200">Council Synthesis:</strong> {result.strategicJustification}
          </div>

          {/* Action Plan */}
          <div className="space-y-1.5 pt-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Stephanie Evergreen Action Plan
            </div>
            {result.actionPlan.map((step, idx) => (
              <div key={idx} className="text-xs text-slate-300 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>{step}</span>
              </div>
            ))}
          </div>

          {/* Apply Button */}
          <div className="pt-2">
            <button
              onClick={() => onApplyConsensus(result.consensusChartId, result.executiveHeadline)}
              className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-teal-950/40 transition-colors"
            >
              <span>Apply Consensus Decision & Render Chart</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Individual 5 AI Advisor Cards */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Individual AI Advisor Perspectives
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(result ? result.advisors : [
            {
              id: 'gemini',
              name: 'Gemini 2.5 Flash',
              provider: 'Google AI',
              role: 'Perceptual Accuracy & Statistical Rigor',
              avatarColor: '#38bdf8',
              recommendedChartId: 'dot_plot',
              recommendedChartName: 'Cleveland-McGill Dot Plot',
              confidenceScore: 97,
              declarativeTitle: 'Position on a common scale delivers highest decoding accuracy',
              keyInsight: 'Evaluates Cleveland & McGill (1984) hierarchy and enforces strict zero-baselines for honest comparison.',
              evergreenQuote: '"Position on a common scale was the easiest visualization for people to interpret with accuracy." (Ch. 1, p. 7)',
            },
            {
              id: 'claude',
              name: 'Claude 3.7 Sonnet',
              provider: 'Anthropic',
              role: 'Contextual Nuance & Responsible Communication',
              avatarColor: '#d97706',
              recommendedChartId: 'dumbbell_dot_plot',
              recommendedChartName: 'Connected Dumbbell Dot Plot',
              confidenceScore: 95,
              declarativeTitle: 'Preserves the authentic voice and disparities across cohorts',
              keyInsight: 'Guards against oversimplification and ensures survey nuance is respectfully communicated.',
              evergreenQuote: '"Visualizing data effectively changes the conversation. It shapes organizational culture." (Ch. 10, p. 227)',
            },
            {
              id: 'perplexity',
              name: 'Perplexity Pro',
              provider: 'Perplexity AI',
              role: 'Benchmark Grounding & Industry Citations',
              avatarColor: '#10b981',
              recommendedChartId: 'bullet_graph',
              recommendedChartName: 'Stephen Few Bullet Graph',
              confidenceScore: 94,
              declarativeTitle: 'Anchors every metric against an external normative target',
              keyInsight: 'Answers the critical "Compared to what?" question by evaluating against benchmarks.',
              evergreenQuote: '"Adding benchmark information answers the first question readers are likely to ask: Compared to what?" (Ch. 4, p. 72)',
            },
            {
              id: 'copilot',
              name: 'Microsoft Copilot',
              provider: 'Microsoft',
              role: 'Excel Ninja Architecture & Tabular Hygiene',
              avatarColor: '#0284c7',
              recommendedChartId: 'slopegraph',
              recommendedChartName: 'Slopegraph (Ninja Level 5)',
              confidenceScore: 92,
              declarativeTitle: 'Streamlined table structure optimizes data-to-ink ratio',
              keyInsight: 'Designs secret buffer column structures and eliminates tick-mark friction in enterprise spreadsheets.',
              evergreenQuote: '"Buffer columns are a secret ninja move that you can use to force Excel to make visualizations." (Ch. 3, p. 49)',
            },
            {
              id: 'chatgpt',
              name: 'ChatGPT o3 / GPT-4o',
              provider: 'OpenAI',
              role: 'Executive Persuasion & Headline Storytelling',
              avatarColor: '#10a37f',
              recommendedChartId: 'dumbbell_dot_plot',
              recommendedChartName: 'Connected Dumbbell Dot Plot',
              confidenceScore: 96,
              declarativeTitle: 'Burns the takeaway finding into decision-maker memory',
              keyInsight: 'Replaces generic chart headers with bottom-line takeaway punchlines for boardroom impact.',
              evergreenQuote: '"What\'s your point? Seriously, that\'s the most important question to ask when creating a data visualization." (Ch. 1, p. 1)',
            },
          ]).map((adv: any) => (
            <div
              key={adv.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span
                      style={{ backgroundColor: adv.avatarColor }}
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                    />
                    <span className="text-xs font-bold text-slate-100">{adv.name}</span>
                    <span className="text-[10px] text-slate-400">({adv.provider})</span>
                  </div>
                  <span className="text-[11px] font-mono text-teal-400 font-semibold tabular-nums">
                    {adv.confidenceScore}%
                  </span>
                </div>

                <div className="text-[11px] text-slate-400 font-medium mb-1.5">
                  {adv.role}
                </div>

                <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800/80 mb-2">
                  <div className="text-[10px] text-teal-400 font-bold uppercase">Recommended Format</div>
                  <div className="text-xs font-bold text-slate-200">{adv.recommendedChartName}</div>
                </div>

                <p className="text-xs text-slate-300 leading-snug mb-2">
                  {adv.keyInsight}
                </p>
              </div>

              <div className="text-[10px] text-slate-400 italic pt-2 border-t border-slate-800/60">
                {adv.evergreenQuote}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
