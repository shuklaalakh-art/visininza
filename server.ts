/**
 * Express Server with Vite Middleware and Server-Side Gemini AI Integration
 * User-Agent: 'aistudio-build'
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Server-side Gemini AI client initialization
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

/**
 * Multi-AI Consensus Endpoint
 * Evaluates raw or cleaned dataset and synthesizes perspectives from:
 * Gemini, Claude, Perplexity, Copilot, and ChatGPT
 */
app.post('/api/ai/consensus', async (req, res) => {
  try {
    const { fileName, summary, columns, sampleRows } = req.body;

    if (!aiClient) {
      // Fallback response if no server API key
      return res.status(200).json({ fallback: true, message: 'Server key not provided, use client synthesis.' });
    }

    const systemPrompt = `You are the Multi-AI Data Visualization Council synthesizing perspectives from 5 leading AI engines:
1. Gemini 2.5 Flash (Google): Focused on Cleveland & McGill (1984) perceptual decoding tiers and mathematical scale accuracy.
2. Claude 3.7 Sonnet (Anthropic): Focused on contextual nuance, survey wording ethics, and responsible reporting.
3. Perplexity Pro: Focused on normative external benchmarks, industry standards, and "Compared to what?" grounding.
4. Microsoft Copilot: Focused on Excel Ninja table architecture, secret buffer columns, and data hygiene.
5. ChatGPT o3: Focused on executive storytelling, punchy "What's Your Point?" declarative takeaway headlines.

Your knowledge base is strictly Stephanie Evergreen's book "Effective Data Visualization: The Right Chart for the Right Data".
Chart types to choose from:
- 'dumbbell_dot_plot' (Connected dot plot, gap/growth)
- 'dot_plot' (Cleveland-McGill common scale, #1 perceptual accuracy)
- 'slopegraph' (Two vertical axes, steep divergent trajectories)
- 'bullet_graph' (Stephen Few actual bar + red target marker line + shaded ranges)
- 'benchmark_line' (Column chart with target line)
- 'diverging_stacked_bar' (Likert scale diverging around center 0%)
- 'aggregated_stacked_bar' (Agree + Strongly Agree collapsed into common baseline)
- 'lollipop' (Ink-saving dot on stick)
- 'single_number' (Single large number)
- 'icon_array' (10/100 icon waffle grid)
- 'stacked_bar_100' (100% unwrapped pie)
- 'pie_done_right' (Max 4 slices, starts at 12 o'clock noon, descending clockwise)
- 'deviation_bar' (Net positive/negative change sorted greatest to least)
- 'small_multiples' (Untangled parallel charts on identical scale)
- 'clean_line' (Max 4 lines with direct end labels)
- 'indicator_table' (Sparklines + selective red/amber alert dots)

Respond ONLY with valid JSON in this exact structure:
{
  "unanimous": boolean,
  "consensusChartId": string,
  "consensusChartName": string,
  "consensusConfidence": number,
  "executiveHeadline": string,
  "recommendedActionColor": "#0284c7",
  "strategicJustification": string,
  "actionPlan": ["string", "string", "string"],
  "advisors": [
    {
      "id": "gemini",
      "name": "Gemini 2.5 Flash",
      "provider": "Google AI",
      "role": "Perceptual Accuracy & Statistical Rigor",
      "avatarColor": "#38bdf8",
      "recommendedChartId": string,
      "recommendedChartName": string,
      "confidenceScore": number,
      "declarativeTitle": string,
      "keyInsight": string,
      "dataHygieneWarning": string,
      "evergreenQuote": string
    },
    {
      "id": "claude",
      "name": "Claude 3.7 Sonnet",
      "provider": "Anthropic",
      "role": "Contextual Nuance & Responsible Communication",
      "avatarColor": "#d97706",
      "recommendedChartId": string,
      "recommendedChartName": string,
      "confidenceScore": number,
      "declarativeTitle": string,
      "keyInsight": string,
      "dataHygieneWarning": string,
      "evergreenQuote": string
    },
    {
      "id": "perplexity",
      "name": "Perplexity Pro",
      "provider": "Perplexity AI",
      "role": "Benchmark Grounding & Industry Citations",
      "avatarColor": "#10b981",
      "recommendedChartId": string,
      "recommendedChartName": string,
      "confidenceScore": number,
      "declarativeTitle": string,
      "keyInsight": string,
      "dataHygieneWarning": string,
      "evergreenQuote": string
    },
    {
      "id": "copilot",
      "name": "Microsoft Copilot",
      "provider": "Microsoft",
      "role": "Excel Ninja Architecture & Tabular Hygiene",
      "avatarColor": "#0284c7",
      "recommendedChartId": string,
      "recommendedChartName": string,
      "confidenceScore": number,
      "declarativeTitle": string,
      "keyInsight": string,
      "dataHygieneWarning": string,
      "evergreenQuote": string
    },
    {
      "id": "chatgpt",
      "name": "ChatGPT o3 / GPT-4o",
      "provider": "OpenAI",
      "role": "Executive Persuasion & Headline Storytelling",
      "avatarColor": "#10a37f",
      "recommendedChartId": string,
      "recommendedChartName": string,
      "confidenceScore": number,
      "declarativeTitle": string,
      "keyInsight": string,
      "dataHygieneWarning": string,
      "evergreenQuote": string
    }
  ]
}`;

    const userPrompt = `Dataset: "${fileName}".
Columns: ${JSON.stringify(columns)}.
Sample rows: ${JSON.stringify(sampleRows)}.
Cleaning summary: ${JSON.stringify(summary)}.

Evaluate this dataset and synthesize the Multi-AI Consensus decision on the perfect Stephanie Evergreen visualization.`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const jsonText = response.text?.trim() || '{}';
    const parsed = JSON.parse(jsonText);
    parsed.timestamp = Date.now();
    return res.json(parsed);
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({ error: error.message || 'AI Consensus evaluation failed' });
  }
});

// Production / Dev Vite Middleware Setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`VisiNinja server running on http://localhost:${PORT}`);
  });
}

startServer();
