import React, { useState, useMemo, useRef } from 'react';
import { 
  Search, 
  Calendar, 
  Clock, 
  Zap, 
  Gamepad2, 
  ArrowRight, 
  Check, 
  Sparkles,
  ChevronRight,
  Filter,
  Layers,
  ChevronLeft
} from 'lucide-react';
import { Product, ProductCategory, ProviderId } from '../types';
import { PROVIDERS, ALL_PRODUCTS } from '../data/mockData';
import { ProviderIcon } from '../components/common/ProviderIcon';
import { formatRupiah } from '../utils/formatters';

interface AllProductsViewProps {
  onSelectCategory: (category: ProductCategory, provider?: ProviderId) => void;
  onSelectProduct?: (product: Product) => void;
}

type ProductFilterCategory = 'all' | 'harian' | 'bulanan' | 'game' | 'pln';

export const AllProductsView: React.FC<AllProductsViewProps> = ({ 
  onSelectCategory,
  onSelectProduct 
}) => {
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedCategoryType, setSelectedCategoryType] = useState<ProductFilterCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const brandScrollRef = useRef<HTMLDivElement>(null);

  // All unified brands (Operators + Games + PLN)
  const allBrands = useMemo(() => {
    return [
      { id: 'all', name: 'Semua Brand', category: 'all', badgeLabel: 'Semua' },
      ...PROVIDERS
    ];
  }, []);

  // Category Cards Configuration
  const categoryCards = [
    {
      id: 'harian' as ProductFilterCategory,
      title: 'Harian',
      subtitle: 'Paket 1-7 Hari & Pulsa',
      description: 'Solusi kuota cepat, hemat darurat & pulsa reguler harian',
      icon: Clock,
      gradient: 'from-amber-500/10 to-orange-500/5',
      borderActive: 'border-orange-500 text-orange-950',
      tagColor: 'bg-orange-50 text-orange-700 border-orange-200'
    },
    {
      id: 'bulanan' as ProductFilterCategory,
      title: 'Bulanan',
      subtitle: 'Paket 30 Hari & Jumbo',
      description: 'Kuota utama besar 30 hari, unlimited sosmed & streaming',
      icon: Calendar,
      gradient: 'from-blue-500/10 to-indigo-500/5',
      borderActive: 'border-blue-600 text-blue-950',
      tagColor: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      id: 'game' as ProductFilterCategory,
      title: 'Game',
      subtitle: 'Top Up Diamond & Cash',
      description: 'Diamond MLBB, FF, UC PUBG, Valorant Points & Welkin',
      icon: Gamepad2,
      gradient: 'from-purple-500/10 to-pink-500/5',
      borderActive: 'border-purple-600 text-purple-950',
      tagColor: 'bg-purple-50 text-purple-700 border-purple-200'
    },
    {
      id: 'pln' as ProductFilterCategory,
      title: 'PLN',
      subtitle: 'Token Listrik 24 Jam',
      description: 'Beli token 20rb - 1jt kode 20 digit langsung tampil instan',
      icon: Zap,
      gradient: 'from-emerald-500/10 to-teal-500/5',
      borderActive: 'border-emerald-600 text-emerald-950',
      tagColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    }
  ];

  // Filter products based on active brand, active category, and search query
  const filteredProducts = useMemo(() => {
    return ALL_PRODUCTS.filter((prod) => {
      // 1. Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = prod.name.toLowerCase().includes(q);
        const matchDesc = (prod.description || '').toLowerCase().includes(q);
        const matchProv = prod.provider.toLowerCase().includes(q);
        const matchNominal = String(prod.denomination).includes(q) || String(prod.price).includes(q);
        if (!matchName && !matchDesc && !matchProv && !matchNominal) {
          return false;
        }
      }

      // 2. Brand Filter
      if (selectedBrand !== 'all') {
        if (prod.provider !== selectedBrand) {
          return false;
        }
      }

      // 3. Category Type Filter (Harian, Bulanan, Game, PLN)
      if (selectedCategoryType === 'harian') {
        // Kuota harian/mingguan OR Pulsa reguler
        if (prod.category === 'pulsa') return true;
        if (prod.category === 'kuota') {
          return prod.quotaCategory === 'harian' || prod.quotaCategory === 'mingguan' || (prod.validityDays && prod.validityDays <= 7);
        }
        return false;
      }

      if (selectedCategoryType === 'bulanan') {
        // Kuota bulanan / unlimited
        if (prod.category === 'kuota') {
          return prod.quotaCategory === 'bulanan' || prod.quotaCategory === 'unlimited' || (prod.validityDays && prod.validityDays > 7);
        }
        return false;
      }

      if (selectedCategoryType === 'game') {
        return prod.category === 'game';
      }

      if (selectedCategoryType === 'pln') {
        return prod.category === 'pln';
      }

      return true;
    });
  }, [selectedBrand, selectedCategoryType, searchQuery]);

  const handleScrollBrand = (direction: 'left' | 'right') => {
    if (brandScrollRef.current) {
      const offset = direction === 'left' ? -240 : 240;
      brandScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const handleProductClick = (product: Product) => {
    if (onSelectProduct) {
      onSelectProduct(product);
    } else {
      onSelectCategory(product.category, product.provider);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200 pb-12" id="all-products-view">
      {/* Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
            Katalog Produk & Paket
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Pilih operator seluler atau game, filter jenis paket, dan beli dengan 1-klik instan
          </p>
        </div>

        {/* Search Bar Input inside Products View */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kuota, pulsa, diamond..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white rounded-2xl border border-neutral-200 focus:outline-hidden focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs transition-all placeholder:text-neutral-400 font-medium"
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
      </div>

      {/* 1. TOP COMBINED OPERATOR & GAME HORIZONTAL CAROUSEL */}
      <div className="space-y-2 bg-white/70 backdrop-blur-xs p-3 sm:p-4 rounded-3xl border border-neutral-200/80 shadow-2xs">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-black uppercase tracking-wider text-neutral-800">
              Pilih Operator & Game Seluler
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleScrollBrand('left')}
              className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-600 transition-colors cursor-pointer"
              title="Scroll Kiri"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleScrollBrand('right')}
              className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-600 transition-colors cursor-pointer"
              title="Scroll Kanan"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Brands Track */}
        <div 
          ref={brandScrollRef}
          className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-2 px-1 scroll-smooth"
        >
          {allBrands.map((brand) => {
            const isSelected = selectedBrand === brand.id;
            return (
              <button
                key={brand.id}
                onClick={() => setSelectedBrand(brand.id)}
                className={`flex items-center gap-2.5 px-3.5 py-2 rounded-2xl whitespace-nowrap transition-all duration-150 shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-[#0B1220] text-white shadow-md ring-2 ring-[#0B1220]/20 scale-[1.02]'
                    : 'bg-white text-neutral-700 border border-neutral-200/90 hover:border-neutral-400 hover:bg-neutral-50 shadow-2xs'
                }`}
              >
                {brand.id === 'all' ? (
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-700'
                  }`}>
                    ★
                  </div>
                ) : (
                  <ProviderIcon provider={brand.id as ProviderId} size="sm" />
                )}
                <div className="text-left">
                  <div className="text-xs font-black leading-tight">
                    {brand.name}
                  </div>
                  <span className={`text-[10px] font-medium leading-none ${
                    isSelected ? 'text-neutral-300' : 'text-neutral-400'
                  }`}>
                    {brand.category === 'game' ? 'Game' : brand.category === 'pln' ? 'Listrik' : brand.id === 'all' ? 'Semua' : 'Seluler'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. CATEGORY TITLE CARDS: HARIAN, BULANAN, GAME, PLN */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-black uppercase tracking-wider text-neutral-500">
            Kategori Paket & Layanan
          </h3>
          {selectedCategoryType !== 'all' && (
            <button
              onClick={() => setSelectedCategoryType('all')}
              className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
            >
              Tampilkan Semua ({ALL_PRODUCTS.length})
            </button>
          )}
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {categoryCards.map((card) => {
            const Icon = card.icon;
            const isSelected = selectedCategoryType === card.id;
            return (
              <div
                key={card.id}
                onClick={() => setSelectedCategoryType(isSelected ? 'all' : card.id)}
                className={`relative p-4 rounded-3xl border transition-all duration-200 cursor-pointer group flex flex-col justify-between min-h-[120px] ${
                  isSelected
                    ? `bg-white shadow-md ring-2 ring-blue-500/20 border-blue-600`
                    : 'bg-white border-neutral-200/90 hover:border-neutral-300 hover:shadow-2xs'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-colors ${
                    isSelected 
                      ? 'bg-[#0B1220] text-white' 
                      : 'bg-neutral-100 text-neutral-700 group-hover:bg-neutral-200'
                  }`}>
                    <Icon className="w-4 h-4 stroke-[2.3]" />
                  </div>
                  {isSelected ? (
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  ) : (
                    <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-neutral-600 transition-colors" />
                  )}
                </div>

                <div className="mt-3">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm sm:text-base font-black text-neutral-900">
                      {card.title}
                    </h4>
                  </div>
                  <p className="text-[11px] font-medium text-neutral-500 line-clamp-1 mt-0.5">
                    {card.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. PRODUCT CARDS LIST / GRID (SCROLLABLE VERTICALLY) */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-neutral-900">
              Daftar Pilihan Produk
            </span>
            <span className="px-2 py-0.5 rounded-full bg-neutral-200/70 text-neutral-700 text-xs font-bold">
              {filteredProducts.length} Produk
            </span>
          </div>

          {(selectedBrand !== 'all' || selectedCategoryType !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedBrand('all');
                setSelectedCategoryType('all');
                setSearchQuery('');
              }}
              className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
            >
              Reset Filter
            </button>
          )}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-neutral-200/80 p-6 space-y-3">
            <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
              <Search className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-neutral-900">Produk Tidak Ditemukan</h4>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              Tidak ada produk yang cocok dengan kombinasi filter atau kata kunci pencarian Anda.
            </p>
            <button
              onClick={() => {
                setSelectedBrand('all');
                setSelectedCategoryType('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-2xl bg-neutral-900 text-white text-xs font-bold cursor-pointer"
            >
              Tampilkan Semua Produk
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredProducts.map((product) => {
              const originalPrice = product.price + Math.round(product.price * 0.08);
              return (
                <div
                  key={product.id}
                  onClick={() => handleProductClick(product)}
                  className="p-4 rounded-3xl bg-white border border-neutral-200/80 hover:border-neutral-900 hover:shadow-md transition-all duration-200 flex flex-col justify-between gap-3 cursor-pointer group relative overflow-hidden"
                >
                  {/* Top Bar: Provider + Category Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <ProviderIcon provider={product.provider} size="sm" />
                      <div className="min-w-0">
                        <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block truncate">
                          {product.provider.toUpperCase()}
                        </span>
                        <h4 className="text-xs sm:text-sm font-black text-neutral-900 truncate group-hover:text-blue-600 transition-colors">
                          {product.name}
                        </h4>
                      </div>
                    </div>

                    {product.isPopular && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 text-[10px] font-black border border-amber-500/20 shrink-0">
                        POPULER
                      </span>
                    )}
                  </div>

                  {/* Description / Quota Breakdown */}
                  <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed bg-neutral-50 p-2.5 rounded-2xl border border-neutral-100">
                    {product.description || `Nominal ${formatRupiah(product.denomination)}`}
                  </p>

                  {/* Bottom: Price + Action Button */}
                  <div className="flex items-center justify-between pt-1 border-t border-neutral-100">
                    <div>
                      <span className="text-[10px] text-neutral-400 line-through block leading-none">
                        {formatRupiah(originalPrice)}
                      </span>
                      <div className="text-sm sm:text-base font-black text-neutral-900">
                        {formatRupiah(product.price)}
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProductClick(product);
                      }}
                      className="px-3.5 py-1.5 rounded-2xl bg-[#0B1220] group-hover:bg-blue-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                    >
                      <span>Beli</span>
                      <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
