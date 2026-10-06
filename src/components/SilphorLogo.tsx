import React from 'react';

interface SilphorLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'full' | 'exact-badge' | 'horizontal' | 'mark-only';
  theme?: 'dark' | 'light' | 'original';
}

export const SilphorLogo: React.FC<SilphorLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'full',
  theme = 'original',
}) => {
  // Dimension scales
  const sizeMap = {
    sm: { width: 140, height: 42, mark: 36, badge: 44 },
    md: { width: 220, height: 66, mark: 48, badge: 60 },
    lg: { width: 300, height: 90, mark: 64, badge: 84 },
    xl: { width: 380, height: 114, mark: 80, badge: 120 },
    '2xl': { width: 480, height: 144, mark: 110, badge: 180 },
  };

  // Authentic Brand Colors matching silphor_logo_1790265984763.jpg
  const navyColor = theme === 'dark' ? '#F1F5F9' : '#082142';
  const sLetterColor = theme === 'dark' ? '#F8FAFC' : '#082142';
  const tealColor = '#008080'; // Exact Silphor Teal
  const chipBg = theme === 'dark' ? '#0F172A' : '#082142';
  const traceNavy = theme === 'dark' ? '#94A3B8' : '#082142';

  // EXACT BADGE VARIANT: 100% Exact Replica on Crisp White Square Badge
  if (variant === 'exact-badge') {
    return (
      <div
        className={`inline-block overflow-hidden rounded-xl shadow-md border border-slate-200/80 bg-white p-1.5 transition-transform hover:scale-[1.02] ${className}`}
        style={{ width: sizeMap[size].badge, height: sizeMap[size].badge }}
      >
        <img
          src="/silphor-logo-badge.svg"
          alt="Silphor Technologies - Design Innovate Verify Deliver"
          className="w-full h-full object-contain"
        />
      </div>
    );
  }

  // MARK ONLY: SP Circuit Traces & Microchip Package
  if (variant === 'mark-only') {
    return (
      <svg
        viewBox="0 0 660 360"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 ${className}`}
        style={{ height: sizeMap[size].mark, width: (sizeMap[size].mark * 660) / 360 }}
        aria-label="Silphor Technologies SP Mark"
      >
        {/* Left Circuit Traces to S */}
        <g stroke={traceNavy} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round">
          <path d="M 60 100 L 120 100 L 170 137 L 200 137" fill="none" />
          <path d="M 30 185 L 170 185" fill="none" />
          <path d="M 60 270 L 120 270 L 170 233 L 190 233" fill="none" />
        </g>
        <circle cx="60" cy="100" r="14" fill={traceNavy} />
        <circle cx="30" cy="185" r="14" fill={traceNavy} />
        <circle cx="60" cy="270" r="14" fill={traceNavy} />

        {/* Letter S */}
        <path
          d="M 200 75
             C 200 30 240 0 305 0
             C 345 0 375 15 395 40
             L 340 80
             C 330 65 315 55 300 55
             C 270 55 260 70 260 85
             C 260 105 280 120 325 135
             C 380 155 415 190 415 240
             C 415 300 365 340 295 340
             C 245 340 200 315 175 275
             L 230 235
             C 245 260 265 280 295 280
             C 325 280 350 260 350 240
             C 350 215 330 200 290 185
             C 230 165 200 130 200 75 Z"
          fill={sLetterColor}
        />

        {/* Letter P (Teal #008080) */}
        <path
          d="M 315 0
             L 465 0
             C 530 0 575 40 575 110
             C 575 180 530 220 465 220
             L 380 220
             L 380 340
             L 315 340
             Z
             M 380 60
             L 380 160
             L 455 160
             C 490 160 510 140 510 110
             C 510 80 490 60 455 60
             Z"
          fill={tealColor}
        />

        {/* Right Circuit Traces from P */}
        <g stroke={tealColor} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round">
          <path d="M 560 113 L 595 80 L 650 80" fill="none" />
          <path d="M 575 175 L 670 175" fill="none" />
          <path d="M 525 220 L 570 260 L 650 260" fill="none" />
        </g>
        <circle cx="650" cy="80" r="14" fill={tealColor} />
        <circle cx="670" cy="175" r="14" fill={tealColor} />
        <circle cx="650" cy="260" r="14" fill={tealColor} />

        {/* Center Microchip Package */}
        <g transform="translate(330, 325)">
          <circle cx="0" cy="0" r="44" fill={theme === 'dark' ? '#030712' : '#FFFFFF'} />

          {/* 8 Pins */}
          <rect x="-14" y="-36" width="6" height="12" rx="2" fill={chipBg} />
          <rect x="8" y="-36" width="6" height="12" rx="2" fill={chipBg} />
          <rect x="-14" y="24" width="6" height="12" rx="2" fill={chipBg} />
          <rect x="8" y="24" width="6" height="12" rx="2" fill={chipBg} />
          <rect x="-36" y="-14" width="12" height="6" rx="2" fill={chipBg} />
          <rect x="-36" y="8" width="12" height="6" rx="2" fill={chipBg} />
          <rect x="24" y="-14" width="12" height="6" rx="2" fill={chipBg} />
          <rect x="24" y="8" width="12" height="6" rx="2" fill={chipBg} />

          <rect x="-26" y="-26" width="52" height="52" rx="8" fill={chipBg} />
          <rect x="-15" y="-15" width="30" height="30" rx="4" fill="#FFFFFF" />
          <rect x="-8" y="-8" width="16" height="16" rx="2" fill={chipBg} />
        </g>
      </svg>
    );
  }

  // HORIZONTAL / HEADER LOCKUP
  if (variant === 'horizontal') {
    return (
      <div className={`flex items-center gap-3 select-none ${className}`}>
        {/* SP Mark */}
        <svg
          viewBox="0 0 660 360"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0"
          style={{ height: sizeMap[size].mark, width: (sizeMap[size].mark * 660) / 360 }}
        >
          {/* Traces */}
          <g stroke={traceNavy} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 60 100 L 120 100 L 170 137 L 200 137" fill="none" />
            <path d="M 30 185 L 170 185" fill="none" />
            <path d="M 60 270 L 120 270 L 170 233 L 190 233" fill="none" />
          </g>
          <circle cx="60" cy="100" r="14" fill={traceNavy} />
          <circle cx="30" cy="185" r="14" fill={traceNavy} />
          <circle cx="60" cy="270" r="14" fill={traceNavy} />

          {/* S */}
          <path
            d="M 200 75
               C 200 30 240 0 305 0
               C 345 0 375 15 395 40
               L 340 80
               C 330 65 315 55 300 55
               C 270 55 260 70 260 85
               C 260 105 280 120 325 135
               C 380 155 415 190 415 240
               C 415 300 365 340 295 340
               C 245 340 200 315 175 275
               L 230 235
               C 245 260 265 280 295 280
               C 325 280 350 260 350 240
               C 350 215 330 200 290 185
               C 230 165 200 130 200 75 Z"
            fill={sLetterColor}
          />

          {/* P */}
          <path
            d="M 315 0
               L 465 0
               C 530 0 575 40 575 110
               C 575 180 530 220 465 220
               L 380 220
               L 380 340
               L 315 340
               Z
               M 380 60
               L 380 160
               L 455 160
               C 490 160 510 140 510 110
               C 510 80 490 60 455 60
               Z"
            fill={tealColor}
          />

          {/* Traces */}
          <g stroke={tealColor} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 560 113 L 595 80 L 650 80" fill="none" />
            <path d="M 575 175 L 670 175" fill="none" />
            <path d="M 525 220 L 570 260 L 650 260" fill="none" />
          </g>
          <circle cx="650" cy="80" r="14" fill={tealColor} />
          <circle cx="670" cy="175" r="14" fill={tealColor} />
          <circle cx="650" cy="260" r="14" fill={tealColor} />

          {/* Microchip */}
          <g transform="translate(330, 325)">
            <circle cx="0" cy="0" r="44" fill={theme === 'dark' ? '#030712' : '#FFFFFF'} />
            <rect x="-14" y="-36" width="6" height="12" rx="2" fill={chipBg} />
            <rect x="8" y="-36" width="6" height="12" rx="2" fill={chipBg} />
            <rect x="-14" y="24" width="6" height="12" rx="2" fill={chipBg} />
            <rect x="8" y="24" width="6" height="12" rx="2" fill={chipBg} />
            <rect x="-36" y="-14" width="12" height="6" rx="2" fill={chipBg} />
            <rect x="-36" y="8" width="12" height="6" rx="2" fill={chipBg} />
            <rect x="24" y="-14" width="12" height="6" rx="2" fill={chipBg} />
            <rect x="24" y="8" width="12" height="6" rx="2" fill={chipBg} />
            <rect x="-26" y="-26" width="52" height="52" rx="8" fill={chipBg} />
            <rect x="-15" y="-15" width="30" height="30" rx="4" fill="#FFFFFF" />
            <rect x="-8" y="-8" width="16" height="16" rx="2" fill={chipBg} />
          </g>
        </svg>

        {/* Text */}
        <div className="flex flex-col justify-center">
          <div className="flex items-baseline">
            <span
              className="text-lg md:text-xl font-black tracking-wider leading-none"
              style={{ color: navyColor, letterSpacing: '0.12em' }}
            >
              SILPHOR
            </span>
          </div>
          <div className="flex items-center gap-1.5 my-1">
            <div className="h-[2px] w-3 bg-[#008080]" />
            <span
              className="text-[10px] md:text-[11px] font-extrabold tracking-[0.22em] uppercase leading-none"
              style={{ color: tealColor }}
            >
              TECHNOLOGIES
            </span>
            <div className="h-[2px] w-3 bg-[#008080]" />
          </div>
        </div>
      </div>
    );
  }

  // DEFAULT FULL LOCKUP (Exact arrangement matching user's image)
  return (
    <div className={`flex items-center gap-3.5 select-none ${className}`}>
      {/* SP Mark */}
      <svg
        viewBox="0 0 660 360"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
        style={{ height: sizeMap[size].mark, width: (sizeMap[size].mark * 660) / 360 }}
      >
        {/* Traces */}
        <g stroke={traceNavy} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round">
          <path d="M 60 100 L 120 100 L 170 137 L 200 137" fill="none" />
          <path d="M 30 185 L 170 185" fill="none" />
          <path d="M 60 270 L 120 270 L 170 233 L 190 233" fill="none" />
        </g>
        <circle cx="60" cy="100" r="14" fill={traceNavy} />
        <circle cx="30" cy="185" r="14" fill={traceNavy} />
        <circle cx="60" cy="270" r="14" fill={traceNavy} />

        {/* S */}
        <path
          d="M 200 75
             C 200 30 240 0 305 0
             C 345 0 375 15 395 40
             L 340 80
             C 330 65 315 55 300 55
             C 270 55 260 70 260 85
             C 260 105 280 120 325 135
             C 380 155 415 190 415 240
             C 415 300 365 340 295 340
             C 245 340 200 315 175 275
             L 230 235
             C 245 260 265 280 295 280
             C 325 280 350 260 350 240
             C 350 215 330 200 290 185
             C 230 165 200 130 200 75 Z"
          fill={sLetterColor}
        />

        {/* P */}
        <path
          d="M 315 0
             L 465 0
             C 530 0 575 40 575 110
             C 575 180 530 220 465 220
             L 380 220
             L 380 340
             L 315 340
             Z
             M 380 60
             L 380 160
             L 455 160
             C 490 160 510 140 510 110
             C 510 80 490 60 455 60
             Z"
          fill={tealColor}
        />

        {/* Traces */}
        <g stroke={tealColor} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round">
          <path d="M 560 113 L 595 80 L 650 80" fill="none" />
          <path d="M 575 175 L 670 175" fill="none" />
          <path d="M 525 220 L 570 260 L 650 260" fill="none" />
        </g>
        <circle cx="650" cy="80" r="14" fill={tealColor} />
        <circle cx="670" cy="175" r="14" fill={tealColor} />
        <circle cx="650" cy="260" r="14" fill={tealColor} />

        {/* Microchip */}
        <g transform="translate(330, 325)">
          <circle cx="0" cy="0" r="44" fill={theme === 'dark' ? '#030712' : '#FFFFFF'} />
          <rect x="-14" y="-36" width="6" height="12" rx="2" fill={chipBg} />
          <rect x="8" y="-36" width="6" height="12" rx="2" fill={chipBg} />
          <rect x="-14" y="24" width="6" height="12" rx="2" fill={chipBg} />
          <rect x="8" y="24" width="6" height="12" rx="2" fill={chipBg} />
          <rect x="-36" y="-14" width="12" height="6" rx="2" fill={chipBg} />
          <rect x="-36" y="8" width="12" height="6" rx="2" fill={chipBg} />
          <rect x="24" y="-14" width="12" height="6" rx="2" fill={chipBg} />
          <rect x="24" y="8" width="12" height="6" rx="2" fill={chipBg} />
          <rect x="-26" y="-26" width="52" height="52" rx="8" fill={chipBg} />
          <rect x="-15" y="-15" width="30" height="30" rx="4" fill="#FFFFFF" />
          <rect x="-8" y="-8" width="16" height="16" rx="2" fill={chipBg} />
        </g>
      </svg>

      {/* Typography: SILPHOR / — TECHNOLOGIES — / DESIGN • INNOVATE • VERIFY • DELIVER */}
      <div className="flex flex-col justify-center">
        <div className="flex items-baseline">
          <span
            className="text-lg md:text-xl font-black tracking-wider leading-none"
            style={{ color: navyColor, letterSpacing: '0.12em' }}
          >
            SILPHOR
          </span>
        </div>
        <div className="flex items-center gap-1.5 my-1">
          <div className="h-[2px] w-3 bg-[#008080]" />
          <span
            className="text-[10px] md:text-[11px] font-extrabold tracking-[0.22em] uppercase leading-none"
            style={{ color: tealColor }}
          >
            TECHNOLOGIES
          </span>
          <div className="h-[2px] w-3 bg-[#008080]" />
        </div>
        <div
          className="text-[7.5px] md:text-[8.5px] font-bold tracking-[0.16em] uppercase whitespace-nowrap text-slate-400"
        >
          DESIGN • INNOVATE • VERIFY • DELIVER
        </div>
      </div>
    </div>
  );
};
