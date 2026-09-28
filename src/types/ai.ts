/**
 * Multi-AI Decision Making Council Types
 * Integrates Gemini, Claude, Perplexity, Copilot, and ChatGPT
 */

export type AIModelId = 'gemini' | 'claude' | 'perplexity' | 'copilot' | 'chatgpt';

export interface AIAdvisorVerdict {
  id: AIModelId;
  name: string;
  provider: string;
  role: string;
  avatarColor: string;
  recommendedChartId: string;
  recommendedChartName: string;
  confidenceScore: number; // 0-100
  declarativeTitle: string;
  keyInsight: string;
  dataHygieneWarning?: string;
  evergreenQuote: string;
}

export interface ConsensusDecisionResult {
  unanimous: boolean;
  consensusChartId: string;
  consensusChartName: string;
  consensusConfidence: number;
  executiveHeadline: string;
  recommendedActionColor: string;
  strategicJustification: string;
  actionPlan: string[];
  advisors: AIAdvisorVerdict[];
  timestamp: number;
}
