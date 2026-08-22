import React, { useState, useMemo } from 'react';
import { 
  X, 
  Search, 
  Clock, 
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { NewsArticle, NewsCategory, ProductCategory } from '../../types';
import { TELIER_NEWS } from '../../data/mockData';

interface AllNewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectArticle: (article: NewsArticle) => void;
  onSelectCategory?: (cat: ProductCategory) => void;
}

const CATEGORIES: NewsCategory[] = ['Semua', 'Sains', 'Teknologi', 'Ekonomi', 'Finansial'];

export const AllNewsModal: React.FC<AllNewsModalProps> = ({
  isOpen,
  onClose,
  onSelectArticle,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory>('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNews = useMemo(() => {
    return TELIER_NEWS.filter((item) => {
      // Category filter
      if (selectedCategory !== 'Semua' && item.category !== selectedCategory) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchSummary = item.summary.toLowerCase().includes(q);
        const matchContent = item.content.toLowerCase().includes(q);
        const matchTags = item.tags.some(t => t.toLowerCase().includes(q));
        if (!matchTitle && !matchSummary && !matchContent && !matchTags) {
          return false;
        }
      }
      return true;
    });
  }, [selectedCategory, searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-neutral-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[88vh] animate-in zoom-in-95 duration-200"
        id="all-news-modal"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/70 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-neutral-900 text-white flex items-center justify-center shadow-xs">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-neutral-900">
                  Teliernews Hub
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-neutral-200 text-neutral-800 text-[10px] font-black">
                  {filteredNews.length} Artikel
                </span>
              </div>
              <p className="text-xs text-neutral-500 font-medium">
                Pusat artikel sains, teknologi komputasi, dan literasi ekonomi digital
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/60 transition-colors cursor-pointer"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Categories Bar */}
        <div className="p-4 border-b border-neutral-100 space-y-3 bg-white shrink-0">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari artikel sains, teknologi 6G, QRIS, baterai solid-state, AI..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-neutral-50 rounded-2xl border border-neutral-200 focus:outline-hidden focus:border-neutral-900 focus:bg-white transition-all placeholder:text-neutral-400 font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-700 font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-neutral-900 text-white shadow-2xs'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* News Grid Feed */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1 min-h-[300px]">
          {filteredNews.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-neutral-900">Tidak Ada Artikel Ditemukan</h3>
              <p className="text-xs text-neutral-500">
                Coba gunakan kata kunci lain atau pilih kategori Semua.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredNews.map((item) => (
                <article
                  key={item.id}
                  onClick={() => {
                    onSelectArticle(item);
                  }}
                  className="p-3.5 rounded-2xl bg-white border border-neutral-200/90 hover:border-neutral-900 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between gap-2.5 group"
                >
                  {/* Top: Category Badge & Read Time */}
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-800 text-[10px] font-black uppercase tracking-wider">
                      {item.category}
                    </span>
                    <span className="text-[11px] text-neutral-400 flex items-center gap-1 font-medium">
                      <Clock className="w-3 h-3" />
                      {item.readTime}
                    </span>
                  </div>

                  {/* Title & Summary */}
                  <div className="space-y-1">
                    <h3 className="text-xs sm:text-sm font-black text-neutral-900 group-hover:text-neutral-600 transition-colors leading-snug line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-neutral-400">{item.date}</span>
                    <span className="font-bold text-neutral-900 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      <span>Baca</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 border-t border-neutral-100 bg-neutral-50/70 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-2xl bg-neutral-900 text-white text-xs font-bold cursor-pointer hover:bg-neutral-800 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
