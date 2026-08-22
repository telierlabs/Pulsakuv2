import React from 'react';
import { 
  X, 
  Clock, 
  Calendar, 
  User, 
  Share2, 
  ArrowRight, 
  Tag, 
  Bookmark,
  Check
} from 'lucide-react';
import { NewsArticle, ProductCategory } from '../../types';
import { useToast } from './Toast';

interface NewsDetailModalProps {
  article: NewsArticle | null;
  onClose: () => void;
  onSelectCategory?: (cat: ProductCategory) => void;
}

export const NewsDetailModal: React.FC<NewsDetailModalProps> = ({
  article,
  onClose,
  onSelectCategory
}) => {
  const { showToast } = useToast();
  const [copied, setCopied] = React.useState(false);

  if (!article) return null;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${article.title} - Teliernews Pulsaku`);
      setCopied(true);
      showToast('Tautan artikel berhasil disalin!', 'success');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAction = () => {
    if (article.relatedCategory && onSelectCategory) {
      onSelectCategory(article.relatedCategory);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-neutral-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        id="news-detail-modal"
      >
        {/* Header Hero Banner */}
        <div className={`p-5 bg-gradient-to-br ${article.coverGradient} text-white relative overflow-hidden shrink-0`}>
          <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-white/10 blur-md pointer-events-none" />

          {/* Close & Share Buttons */}
          <div className="flex items-center justify-between relative z-10 mb-4">
            <span className="px-3 py-1 rounded-full bg-black/25 backdrop-blur-md text-[11px] font-black uppercase tracking-wider text-white border border-white/20">
              {article.category}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleShare}
                className="p-1.5 rounded-full bg-black/25 hover:bg-black/40 text-white backdrop-blur-xs transition-colors cursor-pointer"
                title="Bagikan Berita"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Share2 className="w-4 h-4" />}
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full bg-black/25 hover:bg-black/40 text-white backdrop-blur-xs transition-colors cursor-pointer"
                title="Tutup"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Article Title */}
          <h2 className="text-base sm:text-lg font-black leading-snug relative z-10">
            {article.title}
          </h2>

          {/* Meta: Author & Date */}
          <div className="flex items-center gap-3 mt-3 text-xs text-white/80 font-medium relative z-10">
            <span>{article.author}</span>
            <span>•</span>
            <span>{article.date}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {article.readTime}
            </span>
          </div>
        </div>

        {/* Article Body Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 leading-relaxed text-neutral-700 text-xs sm:text-sm">
          {/* Summary Excerpt */}
          <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-100 text-neutral-600 font-medium italic">
            "{article.summary}"
          </div>

          {/* Content Paragraphs */}
          <div className="space-y-3 whitespace-pre-line text-neutral-800 leading-relaxed font-normal">
            {article.content}
          </div>

          {/* Tags */}
          <div className="pt-3 border-t border-neutral-100 flex items-center gap-1.5 flex-wrap">
            <Tag className="w-3.5 h-3.5 text-neutral-400" />
            {article.tags.map((tag, idx) => (
              <span 
                key={idx}
                className="px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-600 text-[11px] font-semibold"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-3.5 sm:p-4 border-t border-neutral-100 bg-neutral-50/70 flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-2xl text-neutral-600 text-xs font-bold hover:bg-neutral-200/60 transition-colors cursor-pointer"
          >
            Tutup
          </button>

          {article.relatedCategory && (
            <button
              onClick={handleAction}
              className="px-5 py-2.5 rounded-2xl bg-[#0B1220] hover:bg-neutral-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <span>{article.relatedCategoryLabel || 'Lihat Layanan Terkait'}</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
