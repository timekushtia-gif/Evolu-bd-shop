import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark' | 'auto';
  showSubtitle?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  variant = 'auto',
  showSubtitle = true,
  className = '',
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  const isLight = variant === 'light';

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Dynamic Geometric Monogram Icon */}
      <div className={`relative ${iconSizes[size]} shrink-0 group`}>
        {/* Ambient Glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 rounded-xl blur-xs opacity-75 group-hover:opacity-100 transition-opacity" />

        {/* Crisp Vector Symbol Container */}
        <div className="relative w-full h-full rounded-xl bg-gradient-to-tr from-neutral-950 via-indigo-950 to-neutral-900 border border-white/20 p-1.5 flex items-center justify-center shadow-md shadow-indigo-950/30 overflow-hidden">
          {/* Subtle inner reflex sheen */}
          <div className="absolute -top-3 -right-3 w-6 h-6 bg-cyan-400/30 rounded-full blur-xs" />

          {/* Precision SVG Brand Mark (Interlocking E & V Evolution Prism) */}
          <svg
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full drop-shadow-sm"
          >
            <defs>
              <linearGradient id="evoluGradient" x1="2" y1="2" x2="30" y2="30" gradientUnits="userSpaceOnUse">
                <stop stopColor="#818CF8" />
                <stop offset="0.5" stopColor="#6366F1" />
                <stop offset="1" stopColor="#38BDF8" />
              </linearGradient>
              <linearGradient id="evoluAccent" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F472B6" />
                <stop offset="1" stopColor="#A855F7" />
              </linearGradient>
            </defs>

            {/* Stylized Futuristic E Bar (Upper Horizon) */}
            <path
              d="M6 8C6 6.89543 6.89543 6 8 6H24C24.5523 6 25 6.44772 25 7C25 7.55228 24.5523 8 24 8H8C7.44772 8 7 8.44772 7 9V23C7 23.5523 6.55228 24 6 24C5.44772 24 5 23.5523 5 23V8C5 6.89543 5.89543 6 6 8Z"
              fill="url(#evoluGradient)"
            />

            {/* Angular Dynamic 'V' Chevron (Evolution Vector) */}
            <path
              d="M10 11L16 23L22 11"
              stroke="url(#evoluGradient)"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Precision Center Energy Diamond Core */}
            <circle cx="16" cy="14" r="2" fill="url(#evoluAccent)" />
            <path
              d="M26 12L24 16L26 20"
              stroke="#38BDF8"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.85"
            />
          </svg>
        </div>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col text-left">
        <div className="flex items-center gap-1.5 leading-none">
          <span
            className={`font-display font-extrabold tracking-tight ${textSizes[size]} ${
              isLight
                ? 'text-white'
                : 'bg-gradient-to-r from-neutral-950 via-indigo-950 to-neutral-900 bg-clip-text text-transparent'
            }`}
          >
            EVolu
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
        </div>

        {showSubtitle && (
          <span
            className={`text-[9px] font-mono tracking-widest uppercase font-semibold mt-0.5 ${
              isLight ? 'text-neutral-400' : 'text-indigo-600/90'
            }`}
          >
            Online Market
          </span>
        )}
      </div>
    </div>
  );
};
