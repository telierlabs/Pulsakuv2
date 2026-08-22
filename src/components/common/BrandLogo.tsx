import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ size = 'md', showTagline = false }) => {
  const iconSize = size === 'sm' ? 24 : size === 'lg' ? 36 : 28;
  const textSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl';

  return (
    <div className="flex items-center gap-2.5 select-none" id="brand-logo-container">
      {/* Sleek minimalist brand mark */}
      <div 
        className="relative flex items-center justify-center bg-[#0B1220] text-white rounded-xl shadow-xs shrink-0"
        style={{ width: iconSize, height: iconSize }}
      >
        <svg 
          width={iconSize * 0.6} 
          height={iconSize * 0.6} 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          {/* Minimalist geometric pulse mark */}
          <path d="M3 13h4l3-8 4 14 3-6h4" />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          <span className={`font-black tracking-tight text-neutral-900 ${textSize}`}>
            Pulsaku
          </span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-600"></span>
        </div>
        {showTagline && (
          <span className="text-[10px] font-semibold text-neutral-400 tracking-wider uppercase">
            Produk Digital Cepat
          </span>
        )}
      </div>
    </div>
  );
};
