import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { Product, ProductCategory } from '../../types';
import { ALL_PRODUCTS } from '../../data/mockData';
import { formatRupiah } from '../../utils/formatters';
import { ProviderIcon } from './ProviderIcon';
import { Badge } from './Badge';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct
}) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setSelectedCategory('all');
    }
  }, [isOpen]);

  const filteredProducts = useMemo(() => {
    const q = query.toLowerCase().trim();
    return ALL_PRODUCTS.filter((prod) => {
      const matchCat = selectedCategory === 'all' || prod.category === selectedCategory;
      if (!matchCat) return false;
      if (!q) return true;

      const matchName = prod.name.toLowerCase().includes(q);
      const matchDesc = prod.description.toLowerCase().includes(q);
      const matchProv = prod.provider.toLowerCase().includes(q);
      const matchDenom = prod.denomination.toString().includes(q);

      return matchName || matchDesc || matchProv || matchDenom;
    }).slice(0, 15);
  }, [query, selectedCategory]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 bg-neutral-950/40 backdrop-blur-md">
      <div 
        className="w-full max-w-xl bg-white/85 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/80 overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150"
        id="global-search-modal"
      >
        {/* Search Bar Input - Glassmorphic, no harsh black borders */}
        <div className="p-3.5 sm:p-4 border-b border-neutral-100/80 flex items-center gap-3">
          <div className="flex-1 flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/60 shadow-2xs focus-within:bg-white focus-within:shadow-xs transition-all">
            <Search className="w-4 h-4 text-blue-500 shrink-0 stroke-[2.2]" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari pulsa 10k, kuota 25gb, token pln, mlbb..."
              className="flex-1 bg-transparent border-none outline-none text-neutral-900 placeholder:text-neutral-400 text-xs sm:text-sm font-semibold min-w-0"
            />
            {query && (
              <button 
                onClick={() => setQuery('')}
                className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/60 transition-colors"
                title="Hapus pencarian"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-3.5 py-2 text-xs font-bold rounded-2xl text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/50 transition-colors cursor-pointer shrink-0"
          >
            Tutup
          </button>
        </div>

        {/* Category Filter Chips */}
        <div className="flex gap-1.5 p-3 overflow-x-auto no-scrollbar bg-neutral-50/50">
          {[
            { id: 'all', label: 'Semua' },
            { id: 'pulsa', label: 'Pulsa' },
            { id: 'kuota', label: 'Paket Data' },
            { id: 'pln', label: 'Token PLN' },
            { id: 'game', label: 'Voucher Game' },
          ].map((chip) => (
            <button
              key={chip.id}
              onClick={() => setSelectedCategory(chip.id as any)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === chip.id
                  ? 'bg-[#0B1220] text-white shadow-xs'
                  : 'bg-white/70 text-neutral-600 border border-white/60 hover:bg-white'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5 min-h-[220px]">
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-12 h-12 rounded-full bg-blue-50/80 flex items-center justify-center text-blue-500 mb-3">
                <Search className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-neutral-800">Produk Tidak Ditemukan</h4>
              <p className="text-xs text-neutral-500 max-w-xs mt-1">
                Coba gunakan kata kunci lain seperti nama provider, kuota, atau nominal.
              </p>
            </div>
          ) : (
            filteredProducts.map((prod) => (
              <button
                key={prod.id}
                onClick={() => {
                  onSelectProduct(prod);
                  onClose();
                }}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/50 hover:bg-white border border-transparent hover:border-blue-100 shadow-2xs hover:shadow-xs transition-all text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <ProviderIcon provider={prod.provider} size="md" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-neutral-900 group-hover:text-blue-600 truncate">
                        {prod.name}
                      </span>
                      {prod.isPopular && (
                        <Badge variant="primary" size="sm">Populer</Badge>
                      )}
                    </div>
                    <p className="text-xs text-neutral-500 truncate mt-0.5">
                      {prod.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pl-2 shrink-0">
                  <span className="text-xs sm:text-sm font-bold text-neutral-900">
                    {formatRupiah(prod.price)}
                  </span>
                  <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-blue-600 transition-colors" />
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

