import React, { useRef } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Clock, 
  ArrowRight
} from 'lucide-react';
import { NewsArticle } from '../../types';
import { TELIER_NEWS } from '../../data/mockData';

interface TelierNewsSectionProps {
  onSelectArticle: (article: NewsArticle) => void;
  onViewAllNews: () => void;
}

export const TelierNewsSection: React.FC<TelierNewsSectionProps> = ({
  onSelectArticle,
  onViewAllNews,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 260;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="space-y-2.5" id="telier-news-section">
      {/* Section Header - Single title only */}
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm sm:text-base font-black text-neutral-900 tracking-tight">
          Teliernews
        </h2>

        {/* Right Controls: Arrow Buttons & View All */}
        <div className="flex items-center gap-1.5">
          <div className="hidden sm:flex items-center gap-1">
            <button
              onClick={() => handleScroll('left')}
              className="w-6 h-6 rounded-full bg-white border border-neutral-200 hover:bg-neutral-100 flex items-center justify-center text-neutral-700 transition-colors shadow-2xs cursor-pointer"
              title="Scroll Kiri"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              className="w-6 h-6 rounded-full bg-white border border-neutral-200 hover:bg-neutral-100 flex items-center justify-center text-neutral-700 transition-colors shadow-2xs cursor-pointer"
              title="Scroll Kanan"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={onViewAllNews}
            className="text-[11px] sm:text-xs font-bold text-neutral-800 hover:text-black flex items-center gap-0.5 py-1 px-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 transition-all cursor-pointer whitespace-nowrap"
            id="btn-view-all-news"
          >
            <span>Semua</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Track of News Cards */}
      <div 
        ref={scrollContainerRef}
        className="flex items-stretch gap-3 overflow-x-auto no-scrollbar py-1 px-0.5 scroll-smooth"
      >
        {TELIER_NEWS.map((item) => {
          return (
            <article
              key={item.id}
              onClick={() => onSelectArticle(item)}
              className="w-[210px] sm:w-[230px] shrink-0 bg-white rounded-2xl border border-neutral-200/90 shadow-2xs hover:shadow-md hover:border-neutral-900 transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden group select-none"
            >
              {/* Card Top Image/Banner - Spacious and Clean */}
              <div className={`h-24 sm:h-26 bg-gradient-to-br ${item.coverGradient} p-3 flex flex-col justify-between relative overflow-hidden text-white`}>
                {/* Decorative subtle ambient circle */}
                <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-white/10 blur-sm pointer-events-none" />

                {/* Top Badges */}
                <div className="flex items-center justify-between relative z-10">
                  <span className="px-2 py-0.5 rounded-md bg-black/40 backdrop-blur-xs text-[9.5px] font-black uppercase tracking-wider text-white border border-white/15">
                    {item.category}
                  </span>
                  <div className="flex items-center gap-1 text-[9.5px] font-medium text-white/90 bg-black/30 px-2 py-0.5 rounded-md backdrop-blur-xs">
                    <Clock className="w-2.5 h-2.5" />
                    <span>{item.readTime}</span>
                  </div>
                </div>

                {/* Ambient Tag on bottom banner */}
                <div className="text-[10px] font-semibold text-white/70 tracking-wide relative z-10">
                  #{item.tags[0] || item.category}
                </div>
              </div>

              {/* Card Body: Title ONLY (No summary/description as requested) */}
              <div className="p-3 flex-1 flex flex-col justify-between gap-3">
                <h3 className="text-xs sm:text-[13px] font-black text-neutral-900 leading-snug line-clamp-3 group-hover:text-neutral-700 transition-colors">
                  {item.title}
                </h3>

                {/* Card Footer: Date + Read Link */}
                <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[10px]">
                  <span className="text-neutral-400 font-medium">
                    {item.date}
                  </span>
                  <span className="font-bold text-neutral-900 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                    <span>Baca</span>
                    <ArrowRight className="w-3 h-3 stroke-[2.5]" />
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
