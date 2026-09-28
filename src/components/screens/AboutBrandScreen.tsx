import React from 'react';
import { VisiNinjaAppIcon, VisiNinjaLogo } from '../VisiNinjaLogo';
import {
  Sparkles,
  Award,
  BookOpen,
  CheckCircle2,
  Download,
  ShieldCheck,
  Zap,
  User,
} from 'lucide-react';

export const AboutBrandScreen: React.FC = () => {
  return (
    <div className="space-y-6 pb-20">
      {/* Brand & Creator Showcase Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-teal-950 border border-teal-500/30 rounded-3xl p-6 shadow-2xl text-center flex flex-col items-center">
        {/* App Icon Large */}
        <div className="p-3 bg-slate-950/80 rounded-3xl border border-teal-500/40 shadow-xl mb-4">
          <VisiNinjaAppIcon size={96} />
        </div>

        {/* Brand Name Logo */}
        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-black text-white font-['Cabinet_Grotesk'] tracking-tight">
            Visi<span className="text-teal-400">Ninja</span>
          </h1>
          <p className="text-xs text-slate-300 font-medium mt-1">
            Effective Data Visualization & XLSX Cleaner for Android
          </p>

          {/* CRITICAL USER REQUIREMENT: Below the logo mention that it's created by Alakh */}
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold shadow-inner">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            <span>Created by <strong className="font-bold text-white tracking-wide">Alakh</strong></span>
          </div>
        </div>

        <p className="text-xs text-slate-300 mt-4 max-w-md mx-auto leading-relaxed">
          Inspired by Dr. Stephanie Evergreen's landmark book <em>Effective Data Visualization: The Right Chart for the Right Data</em> (SAGE). Built to turn raw, messy spreadsheets into clean, high-impact, research-backed visual stories.
        </p>
      </div>

      {/* Suggested Name & App Icon Details */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-teal-400" />
          <h2 className="text-base font-bold text-white">Suggested Name & Icon Architecture</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1.5">
            <div className="font-bold text-teal-300 text-sm">App Name: VisiNinja</div>
            <p className="text-slate-400 leading-relaxed">
              Synthesizes <strong>Visualization</strong> with Stephanie Evergreen's iconic <strong>"Excel Ninja"</strong> skill ratings (Ninja Level 0 to 10) featured across every chapter of the book.
            </p>
          </div>

          <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1.5">
            <div className="font-bold text-teal-300 text-sm">App Icon Design Concept</div>
            <p className="text-slate-400 leading-relaxed">
              Combines a minimalist ninja headband tie with Cleveland-McGill dot plot markers, Evergreen action-color bars, and benchmark lines in an Android Material You squircle.
            </p>
          </div>
        </div>
      </div>

      {/* Principles from the Attached Book */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-teal-400" />
          <h2 className="text-base font-bold text-white">Principles from the Attached Book</h2>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-start gap-3 p-3 bg-slate-950/40 rounded-xl border border-slate-800/80">
            <div className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 font-bold flex items-center justify-center shrink-0 text-xs">
              1
            </div>
            <div>
              <div className="font-bold text-slate-100">"What's Your Point?" (Declarative Headlines)</div>
              <p className="text-slate-400 mt-0.5">
                Never use generic labels like "Sales by Department". Replace with the headline finding: <em>"Packaged goods surged while Cheese was the only department that dropped."</em>
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-slate-950/40 rounded-xl border border-slate-800/80">
            <div className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 font-bold flex items-center justify-center shrink-0 text-xs">
              2
            </div>
            <div>
              <div className="font-bold text-slate-100">The Cleveland & McGill (1984) Perception Hierarchy</div>
              <p className="text-slate-400 mt-0.5">
                Human eyes decode <strong>Position on Common Scale (Dot Plots)</strong> and <strong>Length (Bars)</strong> with far greater precision than Angles (Pie charts) and Areas (Bubbles).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-slate-950/40 rounded-xl border border-slate-800/80">
            <div className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 font-bold flex items-center justify-center shrink-0 text-xs">
              3
            </div>
            <div>
              <div className="font-bold text-slate-100">The Action Color Rule</div>
              <p className="text-slate-400 mt-0.5">
                Ditch rainbow palettes. Mute 90% of series in quiet grays and dress ONLY the focal finding in one vibrant action color.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-slate-950/40 rounded-xl border border-slate-800/80">
            <div className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 font-bold flex items-center justify-center shrink-0 text-xs">
              4
            </div>
            <div>
              <div className="font-bold text-slate-100">Eliminating the Disconnected Legend</div>
              <p className="text-slate-400 mt-0.5">
                Forcing readers to glance back and forth between a graph and a legend causes cognitive gymnastics. Place data labels directly inside bar ends or at line termini.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-slate-950/40 rounded-xl border border-slate-800/80">
            <div className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 font-bold flex items-center justify-center shrink-0 text-xs">
              5
            </div>
            <div>
              <div className="font-bold text-slate-100">Zero-Baseline Rule for Bars</div>
              <p className="text-slate-400 mt-0.5">
                Bar and column graphs must ALWAYS start at 0 to avoid misleading length distortions. Truncated axes are permitted only on line charts when detecting subtle variations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Creator Credits Footer */}
      <div className="text-center pt-2">
        <p className="text-xs text-slate-500">
          VisiNinja Android Web Edition · Created with dedication by <strong className="text-teal-400">Alakh</strong>
        </p>
      </div>
    </div>
  );
};
