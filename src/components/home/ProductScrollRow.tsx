import React, { useRef } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Product } from '../../types';
import { formatRupiah } from '../../utils/formatters';
import { ProviderIcon } from '../common/ProviderIcon';

interface ProductScrollRowProps {
  title: string;
  subtitle?: string;
  badge?: string;
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onViewAll: () => void;
  viewAllLabel?: string;
  viewAllCategory?: string;
  sectionId?: string;
}

export const ProductScrollRow: React.FC<ProductScrollRowProps> = ({
  title,
  subtitle,
  badge,
  products,
  onSelectProduct,
  onViewAll,
  viewAllLabel = 'Lihat Semua',
  viewAllCategory = 'Katalog',
  sectionId
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Limit to max 5 items in front of the 6th "View All" card
  const displayProducts = products.slice(0, 5);

  return (
    <section className="my-6" id={sectionId}>
      {/* Header with Title, Badge, and Action Buttons */}
      <div className="flex items-end justify-between mb-3.5 px-0.5">
        <div>
          {badge && (
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-800 text-[10px] font-bold tracking-wider uppercase mb-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>{badge}</span>
            </div>
          )}
          <h3 className="text-base sm:text-lg font-black tracking-tight text-neutral-900">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-neutral-500 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Scroll Navigation Arrows for Desktop/Tablet */}
          <div className="hidden sm:flex items-center gap-1 mr-1">
            <button
              onClick={() => scroll('left')}
              aria-label="Geser ke kiri"
              className="p-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              aria-label="Geser ke kanan"
              className="p-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onViewAll}
            className="text-xs font-bold text-neutral-900 hover:text-neutral-600 flex items-center gap-1 focus:outline-hidden cursor-pointer transition-colors"
          >
            <span>Lihat semua</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.2]" />
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Track */}
      <div
        ref={scrollContainerRef}
        className="flex items-stretch gap-3 overflow-x-auto no-scrollbar scroll-smooth py-1 px-0.5 -mx-1"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {/* Product Cards (1 to 5) */}
        {displayProducts.map((prod, idx) => {
          // Fake a realistic original price for visual discount delight
          const originalPrice = Math.round(prod.price * 1.15 / 1000) * 1000;

          return (
            <div
              key={prod.id || idx}
              onClick={() => onSelectProduct(prod)}
              className="flex flex-col justify-between p-4 rounded-2xl bg-white border border-neutral-200/90 hover:border-neutral-900 hover:shadow-2xs transition-all cursor-pointer group min-w-[210px] sm:min-w-[225px] max-w-[235px] shrink-0"
              style={{ scrollSnapAlign: 'start' }}
            >
              <div>
                {/* Provider Icon & Badge */}
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <ProviderIcon provider={prod.provider} size="sm" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    {prod.provider.toUpperCase()}
                  </span>
                </div>

                {/* Name */}
                <h4 className="text-xs sm:text-sm font-black text-neutral-900 line-clamp-1 group-hover:text-neutral-950 transition-colors">
                  {prod.name}
                </h4>

                {/* Description */}
                <p className="text-[11px] text-neutral-500 line-clamp-2 mt-1 leading-relaxed">
                  {prod.description}
                </p>
              </div>

              {/* Price & Action Row */}
              <div className="pt-3 mt-3 border-t border-neutral-100 flex items-end justify-between gap-2">
                <div>
                  <span className="text-[10px] text-neutral-400 line-through block font-mono">
                    {formatRupiah(originalPrice)}
                  </span>
                  <span className="text-xs sm:text-sm font-black text-neutral-900 font-mono">
                    {formatRupiah(prod.price)}
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectProduct(prod);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-[#0B1220] hover:bg-neutral-900 text-white text-xs font-bold transition-all focus:outline-hidden cursor-pointer shrink-0 shadow-2xs"
                >
                  Beli
                </button>
              </div>
            </div>
          );
        })}

        {/* 6th Card: "Lihat Semua" CTA Card */}
        <div
          onClick={onViewAll}
          className="flex flex-col items-center justify-center p-5 rounded-2xl bg-neutral-50 border-2 border-dashed border-neutral-300 hover:border-neutral-900 hover:bg-neutral-100/80 transition-all cursor-pointer group min-w-[170px] sm:min-w-[185px] shrink-0 text-center"
          style={{ scrollSnapAlign: 'start' }}
        >
          <div className="w-11 h-11 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-neutral-800 mb-3 group-hover:bg-[#0B1220] group-hover:text-white group-hover:border-[#0B1220] transition-colors shadow-2xs">
            <ArrowRight className="w-5 h-5 stroke-[2.2] group-hover:translate-x-0.5 transition-transform" />
          </div>

          <span className="text-xs sm:text-sm font-black text-neutral-900 block">
            {viewAllLabel}
          </span>
          <span className="text-[11px] text-neutral-500 mt-0.5 block">
            Buka {viewAllCategory}
          </span>
        </div>
      </div>
    </section>
  );
};
