import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, ShieldCheck, Zap, CreditCard, Gamepad2, Heart } from 'lucide-react';
import { ProductCategory, PromoBanner } from '../../types';
import { PROMO_BANNERS_16_9 } from '../../data/mockData';

interface WidePromoCarouselProps {
  onSelectCategory: (category: ProductCategory) => void;
}

export const WidePromoCarousel: React.FC<WidePromoCarouselProps> = ({
  onSelectCategory
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const totalSlides = PROMO_BANNERS_16_9.length;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto slide every 5 seconds when not hovered
  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, totalSlides]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const banner = PROMO_BANNERS_16_9[currentIndex] || PROMO_BANNERS_16_9[0];

  // Pick an icon based on banner ID or tag
  const getBannerIcon = (id: string) => {
    switch (id) {
      case 'ad-qris':
        return CreditCard;
      case 'ad-instant':
        return Zap;
      case 'ad-pln':
        return Zap;
      case 'ad-game':
        return Gamepad2;
      case 'ad-favorit':
        return Heart;
      default:
        return Sparkles;
    }
  };

  const BannerIcon = getBannerIcon(banner.id);

  return (
    <section 
      className="my-7" 
      id="wide-promo-16x9-section"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex items-center justify-between mb-3 px-0.5">
        <div>
          <h3 className="text-sm font-bold tracking-tight text-neutral-900">
            Penawaran & Info Eksklusif
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            Keuntungan transaksi digital tanpa hambatan di Pulsaku
          </p>
        </div>

        {/* Counter Badge */}
        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-full">
          <span>{currentIndex + 1}</span>
          <span className="text-neutral-400">/</span>
          <span>{totalSlides}</span>
        </div>
      </div>

      {/* Main 16:9 Aspect Ratio Banner Container */}
      <div className="relative w-full rounded-2xl md:rounded-3xl bg-[#0B1220] text-white overflow-hidden border border-neutral-800 shadow-sm transition-all">
        {/* Content Area */}
        <div className="relative p-6 sm:p-8 md:p-10 min-h-[220px] sm:min-h-[240px] md:min-h-[260px] flex flex-col justify-between z-10">
          <div>
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] sm:text-xs font-bold tracking-wider uppercase bg-white/10 text-neutral-200 border border-white/15 mb-3 backdrop-blur-xs">
              <BannerIcon className="w-3.5 h-3.5 text-amber-400" />
              <span>{banner.tag}</span>
            </div>

            {/* Title */}
            <h2 className="text-lg sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-tight max-w-xl">
              {banner.title}
            </h2>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-neutral-300/90 mt-2 max-w-lg leading-relaxed font-normal">
              {banner.subtitle}
            </p>
          </div>

          {/* Action Row & Nav */}
          <div className="pt-5 flex items-center justify-between gap-4">
            <button
              onClick={() => onSelectCategory(banner.targetCategory)}
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-white hover:bg-neutral-100 text-neutral-950 text-xs sm:text-sm font-bold transition-all transform active:scale-98 focus:outline-hidden cursor-pointer shadow-sm"
            >
              <span>{banner.ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Slide Navigation Controls */}
            <div className="flex items-center gap-3">
              {/* Dot Indicators */}
              <div className="flex items-center gap-1.5">
                {PROMO_BANNERS_16_9.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    aria-label={`Slide ${idx + 1}`}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      currentIndex === idx
                        ? 'w-6 bg-white'
                        : 'w-1.5 bg-white/30 hover:bg-white/50'
                    }`}
                  />
                ))}
              </div>

              {/* Prev / Next Buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={handlePrev}
                  aria-label="Iklan Sebelumnya"
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  aria-label="Iklan Selanjutnya"
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Subtle Background Geometric Glow */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-0 bottom-0 w-1/2 pointer-events-none opacity-15 flex items-center justify-end pr-8">
          <svg viewBox="0 0 200 200" className="w-64 h-64 text-neutral-400">
            <rect x="20" y="20" width="160" height="160" rx="30" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="6 6" />
            <circle cx="100" cy="100" r="45" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M20 100 L180 100 M100 20 L100 180" stroke="currentColor" strokeWidth="0.75" />
          </svg>
        </div>
      </div>
    </section>
  );
};
