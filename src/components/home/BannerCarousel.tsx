import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { PromoBanner, ProductCategory } from '../../types';
import { PROMO_BANNERS } from '../../data/mockData';

interface BannerCarouselProps {
  onSelectCategory: (category: ProductCategory) => void;
}

export const BannerCarousel: React.FC<BannerCarouselProps> = ({ onSelectCategory }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % PROMO_BANNERS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const banner = PROMO_BANNERS[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? PROMO_BANNERS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % PROMO_BANNERS.length);
  };

  return (
    <section className="relative w-full rounded-2xl md:rounded-3xl bg-[#0B1220] text-white overflow-hidden border border-neutral-800 shadow-sm" id="hero-banner-section">
      {/* Content Area with expanded breathing room & increased scale */}
      <div className="relative p-6 sm:p-8 md:p-10 min-h-[220px] sm:min-h-[250px] md:min-h-[270px] flex flex-col justify-between z-10">
        <div>
          {/* Subtle Tag Badge */}
          <div className="inline-flex items-center px-3 py-1 rounded-md text-[10px] sm:text-xs font-bold tracking-widest uppercase bg-white/10 text-neutral-200 border border-white/15 mb-3.5 backdrop-blur-xs">
            {banner.tag}
          </div>

          {/* Main Headline */}
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight max-w-xl">
            {banner.title}
          </h2>

          {/* Clear Subheadline */}
          <p className="text-xs sm:text-sm md:text-base text-neutral-300/90 mt-2.5 max-w-lg leading-relaxed font-normal">
            {banner.subtitle}
          </p>
        </div>

        {/* Action Row */}
        <div className="pt-6 flex items-center justify-between gap-4">
          <button
            onClick={() => onSelectCategory(banner.targetCategory)}
            className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3.5 rounded-xl bg-white hover:bg-neutral-100 text-neutral-950 text-xs sm:text-sm font-bold transition-all transform active:scale-98 focus:outline-hidden cursor-pointer shadow-sm"
          >
            <span>{banner.ctaText}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Minimal slide indicator & arrows */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              {PROMO_BANNERS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Slide ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    currentIndex === idx ? 'w-6 bg-white' : 'w-1.5 bg-neutral-700 hover:bg-neutral-600'
                  }`}
                />
              ))}
            </div>
            <div className="hidden sm:flex items-center gap-1">
              <button
                onClick={handlePrev}
                aria-label="Slide Sebelumnya"
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-white transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Slide Selanjutnya"
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-white transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Elegant geometric SVG background pattern */}
      <div className="absolute top-0 right-0 bottom-0 w-1/2 pointer-events-none opacity-20 flex items-center justify-end pr-6">
        <svg viewBox="0 0 200 200" className="w-72 h-72 text-neutral-500">
          <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="100" cy="100" r="50" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M40 100 L160 100 M100 40 L100 160" stroke="currentColor" strokeWidth="0.75" />
        </svg>
      </div>
      <div className="absolute top-0 right-0 w-80 h-full bg-linear-to-l from-blue-950/20 to-transparent pointer-events-none" />
    </section>
  );
};
