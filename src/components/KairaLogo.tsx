import React from 'react';

interface KairaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark' | 'gold' | 'badge';
  showTagline?: boolean;
  showDomain?: boolean;
  className?: string;
  onClick?: () => void;
}

export const KairaLogo: React.FC<KairaLogoProps> = ({
  size = 'md',
  variant = 'gold',
  showTagline = true,
  showDomain = true,
  className = '',
  onClick,
}) => {
  // Size configurations
  const logoTextSizes = {
    sm: 'text-xl tracking-[0.18em]',
    md: 'text-2xl sm:text-3xl tracking-[0.22em]',
    lg: 'text-3xl sm:text-4xl tracking-[0.24em]',
    xl: 'text-4xl sm:text-5xl lg:text-6xl tracking-[0.26em]',
  };

  const taglineSizes = {
    sm: 'text-[8px] tracking-[0.2em]',
    md: 'text-[9.5px] sm:text-[10.5px] tracking-[0.25em]',
    lg: 'text-[11px] sm:text-[12px] tracking-[0.28em]',
    xl: 'text-[12px] sm:text-[14px] tracking-[0.3em]',
  };

  const butterflySizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10',
  };

  const dividerWidths = {
    sm: 'w-6 sm:w-8',
    md: 'w-8 sm:w-12',
    lg: 'w-12 sm:w-16',
    xl: 'w-16 sm:w-24',
  };

  // Color configurations
  const textColors = {
    gold: 'text-transparent bg-clip-text bg-gradient-to-r from-[#C59B27] via-[#DFBA53] to-[#A07718]',
    dark: 'text-stone-900',
    light: 'text-white',
    badge: 'text-[#8C6819]',
  };

  const taglineColors = {
    gold: 'text-[#997320]',
    dark: 'text-stone-700',
    light: 'text-amber-200/90',
    badge: 'text-[#8C6819]',
  };

  const strokeColors = {
    gold: '#C59B27',
    dark: '#292524',
    light: '#FDE68A',
    badge: '#A07718',
  };

  const currentStroke = strokeColors[variant];

  // Official Golden Butterfly SVG Vector
  const ButterflyIcon = () => (
    <svg
      viewBox="0 0 100 80"
      className={`${butterflySizes[size]} inline-block transition-transform duration-300 group-hover:scale-105`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="kairaGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#DFBA53" />
          <stop offset="50%" stopColor="#C59B27" />
          <stop offset="100%" stopColor="#8C6514" />
        </linearGradient>
      </defs>
      {/* Top Left Wing */}
      <path
        d="M 50 40 C 35 15, 10 5, 8 28 C 6 42, 28 48, 50 42 Z"
        fill="url(#kairaGoldGrad)"
        stroke={currentStroke}
        strokeWidth="1.5"
      />
      {/* Detail inside Top Left Wing */}
      <path
        d="M 45 36 C 30 20, 18 16, 18 28"
        stroke="#FFF"
        strokeWidth="1"
        strokeOpacity="0.6"
        fill="none"
      />
      {/* Top Right Wing */}
      <path
        d="M 50 40 C 65 15, 90 5, 92 28 C 94 42, 72 48, 50 42 Z"
        fill="url(#kairaGoldGrad)"
        stroke={currentStroke}
        strokeWidth="1.5"
      />
      {/* Detail inside Top Right Wing */}
      <path
        d="M 55 36 C 70 20, 82 16, 82 28"
        stroke="#FFF"
        strokeWidth="1"
        strokeOpacity="0.6"
        fill="none"
      />
      {/* Bottom Left Wing */}
      <path
        d="M 48 42 C 32 46, 20 62, 30 72 C 40 78, 48 58, 48 42 Z"
        fill="url(#kairaGoldGrad)"
        stroke={currentStroke}
        strokeWidth="1.5"
      />
      {/* Bottom Right Wing */}
      <path
        d="M 52 42 C 68 46, 80 62, 70 72 C 60 78, 52 58, 52 42 Z"
        fill="url(#kairaGoldGrad)"
        stroke={currentStroke}
        strokeWidth="1.5"
      />
      {/* Butterfly Body & Antennae */}
      <ellipse cx="50" cy="42" rx="2.5" ry="14" fill="#63450B" stroke="url(#kairaGoldGrad)" strokeWidth="1" />
      <path d="M 49 30 C 44 22, 38 18, 36 16" stroke={currentStroke} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="35" cy="15" r="1.5" fill="url(#kairaGoldGrad)" />
      <path d="M 51 30 C 56 22, 62 18, 64 16" stroke={currentStroke} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="65" cy="15" r="1.5" fill="url(#kairaGoldGrad)" />
    </svg>
  );

  // 8-Petal Starburst / Flower Divider SVG Icon
  const FlowerStarburst = () => (
    <svg
      viewBox="0 0 40 40"
      className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline-block my-0.5"
      fill="url(#kairaGoldGrad)"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M 20 0 L 23 14 L 37 9 L 26 20 L 37 31 L 23 26 L 20 40 L 17 26 L 3 31 L 14 20 L 3 9 L 17 14 Z" opacity="0.9" />
      <circle cx="20" cy="20" r="3" fill="#FFFFFF" />
    </svg>
  );

  if (variant === 'badge') {
    return (
      <div
        onClick={onClick}
        className={`relative inline-flex flex-col items-center justify-center p-6 sm:p-8 rounded-full bg-[#FAF7F2] border-4 border-[#E5D7BE] shadow-xl text-center group cursor-pointer ${className}`}
      >
        {/* Fine Inner Circle Line */}
        <div className="absolute inset-1.5 rounded-full border border-[#D8C7A5]/60 pointer-events-none" />

        {/* Top Butterfly Header */}
        <div className="flex items-center justify-center gap-3 mb-1">
          <div className="h-[1px] w-8 sm:w-12 bg-gradient-to-r from-transparent via-[#C59B27] to-[#C59B27]" />
          <ButterflyIcon />
          <div className="h-[1px] w-8 sm:w-12 bg-gradient-to-l from-transparent via-[#C59B27] to-[#C59B27]" />
        </div>

        {/* Main Brand Title */}
        <h1 className={`font-serif font-bold ${logoTextSizes[size]} ${textColors.gold} drop-shadow-2xs uppercase my-0.5`}>
          KAIRA
        </h1>

        {/* Divider Flower */}
        <div className="flex items-center justify-center gap-3 my-1">
          <div className="h-[1px] w-12 sm:w-16 bg-gradient-to-r from-transparent via-[#C59B27] to-[#C59B27]" />
          <FlowerStarburst />
          <div className="h-[1px] w-12 sm:w-16 bg-gradient-to-l from-transparent via-[#C59B27] to-[#C59B27]" />
        </div>

        {/* Tagline */}
        {showTagline && (
          <p className={`font-serif uppercase ${taglineSizes[size]} ${taglineColors[variant]} font-medium tracking-[0.28em]`}>
            Elegance is an Attitude
          </p>
        )}
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`inline-flex flex-col items-center select-none group ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Top Butterfly & Accent Lines */}
      <div className="flex items-center justify-center gap-2 mb-0.5">
        <div className={`h-[1px] ${dividerWidths[size]} bg-gradient-to-r from-transparent via-[#C59B27] to-[#C59B27] opacity-80`} />
        <ButterflyIcon />
        <div className={`h-[1px] ${dividerWidths[size]} bg-gradient-to-l from-transparent via-[#C59B27] to-[#C59B27] opacity-80`} />
      </div>

      {/* KAIRA Text */}
      <span className={`font-serif font-bold ${logoTextSizes[size]} ${textColors[variant]} leading-none`}>
        KAIRA
      </span>

      {/* Flower Divider & Tagline */}
      {showTagline && (
        <>
          <div className="flex items-center justify-center gap-2 my-1">
            <div className={`h-[1px] ${dividerWidths[size]} bg-gradient-to-r from-transparent via-[#C59B27] to-[#C59B27] opacity-60`} />
            <FlowerStarburst />
            <div className={`h-[1px] ${dividerWidths[size]} bg-gradient-to-l from-transparent via-[#C59B27] to-[#C59B27] opacity-60`} />
          </div>
          <span className={`font-serif uppercase ${taglineSizes[size]} ${taglineColors[variant]} font-medium`}>
            Elegance is an Attitude
          </span>
        </>
      )}

      {showDomain && (
        <span className="text-[9px] sm:text-[10px] text-[#C59B27] font-semibold tracking-widest lowercase mt-0.5 opacity-90">
          kairajewelry.in
        </span>
      )}
    </div>
  );
};
