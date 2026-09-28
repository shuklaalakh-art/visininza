import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showSubtitle?: boolean;
  showCreatedBy?: boolean;
  className?: string;
  onClick?: () => void;
}

export const VisiNinjaAppIcon: React.FC<{ size?: number; className?: string }> = ({
  size = 48,
  className = '',
}) => {
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative rounded-2xl bg-gradient-to-br from-slate-900 via-slate-850 to-teal-950 p-2 shadow-lg shadow-teal-950/40 border border-teal-500/30 flex items-center justify-center overflow-hidden shrink-0 select-none ${className}`}
    >
      {/* Background Subtle Grid Pattern */}
      <svg
        className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
      >
        <line x1="20" y1="0" x2="20" y2="100" stroke="#38bdf8" strokeWidth="0.5" strokeDasharray="2 2" />
        <line x1="50" y1="0" x2="50" y2="100" stroke="#38bdf8" strokeWidth="0.5" strokeDasharray="2 2" />
        <line x1="80" y1="0" x2="80" y2="100" stroke="#38bdf8" strokeWidth="0.5" strokeDasharray="2 2" />
        <line x1="0" y1="35" x2="100" y2="35" stroke="#38bdf8" strokeWidth="0.5" strokeDasharray="2 2" />
        <line x1="0" y1="65" x2="100" y2="65" stroke="#38bdf8" strokeWidth="0.5" strokeDasharray="2 2" />
      </svg>

      {/* Main Vector Artwork: Ninja Headband + Bar Chart + Cleveland McGill Dot Node */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full relative z-10 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Stephanie Evergreen Muted Bars */}
        <rect x="20" y="48" width="12" height="32" rx="3" fill="#64748b" />
        <rect x="38" y="32" width="12" height="48" rx="3" fill="#94a3b8" />
        {/* Action Color Bar (Evergreen Blue) */}
        <rect x="56" y="20" width="12" height="60" rx="3" fill="#0284c7" />
        {/* Benchmark Reference Target Line (Stephen Few style) */}
        <line x1="14" y1="30" x2="74" y2="30" stroke="#f43f5e" strokeWidth="2.5" strokeDasharray="3 2" />

        {/* Ninja Headband Band across top */}
        <path
          d="M 12 18 Q 50 14 88 18 L 86 28 Q 50 24 14 28 Z"
          fill="#0f172a"
          stroke="#0d9488"
          strokeWidth="1.5"
        />

        {/* Headband Ties / Ribbon Flying Right */}
        <path
          d="M 86 23 C 94 20, 96 14, 99 15 C 97 22, 93 25, 87 26 Z"
          fill="#14b8a6"
        />
        <path
          d="M 87 25 C 93 28, 97 32, 98 38 C 94 34, 91 30, 85 27 Z"
          fill="#0d9488"
        />

        {/* Cleveland-McGill Dot Plot Node with Golden Glow */}
        <circle cx="56" cy="20" r="5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
        <circle cx="74" cy="30" r="4" fill="#f43f5e" stroke="#ffffff" strokeWidth="1.2" />

        {/* Ninja Mask Gaze Slit / Focus Glow */}
        <ellipse cx="44" cy="21" rx="4" ry="2" fill="#38bdf8" opacity="0.9" />
        <ellipse cx="62" cy="21" rx="4" ry="2" fill="#38bdf8" opacity="0.9" />
      </svg>
    </div>
  );
};

export const VisiNinjaLogo: React.FC<LogoProps> = ({
  size = 'md',
  showSubtitle = true,
  showCreatedBy = true,
  className = '',
  onClick,
}) => {
  const iconSize = size === 'sm' ? 36 : size === 'md' ? 44 : size === 'lg' ? 56 : 72;
  const titleSize =
    size === 'sm'
      ? 'text-base font-bold'
      : size === 'md'
      ? 'text-lg font-extrabold'
      : size === 'lg'
      ? 'text-2xl font-black'
      : 'text-3xl font-black';

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      <VisiNinjaAppIcon size={iconSize} />

      <div className="flex flex-col justify-center leading-tight">
        <div className="flex items-center gap-2">
          <span className={`tracking-tight text-white font-['Cabinet_Grotesk'] ${titleSize}`}>
            Visi<span className="text-teal-400">Ninja</span>
          </span>
          <span className="text-[10px] font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/40 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
            Android
          </span>
        </div>

        {showSubtitle && (
          <span className="text-[11px] text-slate-400 font-medium tracking-tight truncate max-w-[240px]">
            The Stephanie Evergreen Data Engine
          </span>
        )}

        {/* CRITICAL USER REQUIREMENT: Below the logo mention that it's created by Alakh */}
        {showCreatedBy && (
          <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-slate-400 font-medium">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            <span>
              Created by <span className="text-teal-300 font-semibold underline decoration-teal-500/50 underline-offset-2">Alakh</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
