import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, Bell, HelpCircle, X, ArrowRight } from 'lucide-react';
import { AppActiveTab, Product, ProductCategory } from '../../types';
import { ALL_PRODUCTS } from '../../data/mockData';
import { formatRupiah } from '../../utils/formatters';
import { ProviderIcon } from '../common/ProviderIcon';

interface HeaderProps {
  onOpenSearch?: () => void;
  onNavigate: (tab: AppActiveTab) => void;
  activeTab: AppActiveTab;
  unreadNotifsCount: number;
  onSelectProduct?: (product: Product) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNavigate,
  activeTab,
  unreadNotifsCount,
  onSelectProduct
}) => {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const inputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Scroll-based show/hide behavior
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (isSearchActive) {
        setIsVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      if (currentScrollY < 10) {
        setIsVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      if (currentScrollY > lastScrollY.current + 5) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY.current - 3) {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isSearchActive]);

  // Dynamic time-based greeting text
  const [greetingText, setGreetingText] = useState<string>('Selamat Datang');

  useEffect(() => {
    const calculateGreeting = () => {
      const now = new Date();
      const hour = now.getHours();
      const minute = now.getMinutes();
      const timeVal = hour + minute / 60;

      if (timeVal >= 4 && timeVal < 11) {
        setGreetingText('Selamat Pagi');
      } else if (timeVal >= 11 && timeVal < 15) {
        setGreetingText('Selamat Siang');
      } else if (timeVal >= 15 && timeVal < 18.5) {
        setGreetingText('Selamat Sore');
      } else {
        setGreetingText('Selamat Malam');
      }
    };

    calculateGreeting();
    const interval = setInterval(calculateGreeting, 60000);
    return () => clearInterval(interval);
  }, []);

  // Auto-focus when search opens
  useEffect(() => {
    if (isSearchActive) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setSelectedCategory('all');
    }
  }, [isSearchActive]);

  // Handle ESC key and click outside
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchActive) {
        setIsSearchActive(false);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchActive(prev => !prev);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current && 
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsSearchActive(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    if (isSearchActive) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchActive]);

  // Filter products based on search query and category
  const filteredProducts = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q && selectedCategory === 'all') return [];

    return ALL_PRODUCTS.filter((prod) => {
      const matchCat = selectedCategory === 'all' || prod.category === selectedCategory;
      if (!matchCat) return false;
      if (!q) return true;

      const matchName = prod.name.toLowerCase().includes(q);
      const matchDesc = prod.description.toLowerCase().includes(q);
      const matchProv = prod.provider.toLowerCase().includes(q);
      const matchDenom = prod.denomination.toString().includes(q);

      return matchName || matchDesc || matchProv || matchDenom;
    }).slice(0, 10);
  }, [query, selectedCategory]);

  const handleProductClick = (prod: Product) => {
    setIsSearchActive(false);
    if (onSelectProduct) {
      onSelectProduct(prod);
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 bg-white/70 backdrop-blur-2xl border-b border-white/60 transition-transform duration-300 ease-in-out pt-[env(safe-area-inset-top)] ${
        isVisible ? 'translate-y-0' : '-translate-y-full pointer-events-none'
      }`}
      ref={searchContainerRef}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
        {/* Normal Mode vs Active Search Header */}
        {!isSearchActive ? (
          <>
            {/* Left: Dynamic Clean Greeting without logo/borders/icons */}
            <div 
              onClick={() => onNavigate('home')} 
              className="text-left cursor-pointer focus:outline-hidden transition-opacity hover:opacity-90 shrink-0 select-none py-1"
              id="btn-header-home"
            >
              <h1 className="text-base sm:text-lg font-black tracking-tight text-neutral-900">
                {greetingText}
              </h1>
            </div>

            {/* Right: Actions (Search Icon, Notif Icon, Help Icon) */}
            <div className="flex items-center gap-1.5">
              {/* Search Icon Button - transforms header into search input */}
              <button
                onClick={() => setIsSearchActive(true)}
                aria-label="Buka Pencarian"
                className="p-2 rounded-xl text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/50 backdrop-blur-xs transition-colors focus:outline-hidden cursor-pointer"
                id="btn-header-search"
                title="Cari Produk (⌘K)"
              >
                <Search className="w-5 h-5 stroke-[2]" />
              </button>

              {/* Notification Button */}
              <button
                onClick={() => onNavigate('settings')}
                aria-label="Notifikasi & Akun"
                className={`relative p-2 rounded-xl text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/50 backdrop-blur-xs transition-colors focus:outline-hidden cursor-pointer ${
                  activeTab === 'settings' ? 'bg-neutral-200/60 text-neutral-900 font-bold' : ''
                }`}
                id="btn-header-notif"
              >
                <Bell className="w-5 h-5 stroke-[1.8]" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
                )}
              </button>

              {/* Help Button */}
              <button
                onClick={() => onNavigate('help')}
                aria-label="Pusat Bantuan"
                className={`p-2 rounded-xl text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/50 backdrop-blur-xs transition-colors focus:outline-hidden cursor-pointer ${
                  activeTab === 'help' ? 'bg-neutral-200/60 text-neutral-900 font-bold' : ''
                }`}
                id="btn-header-help"
              >
                <HelpCircle className="w-5 h-5 stroke-[1.8]" />
              </button>
            </div>
          </>
        ) : (
          /* Active Search Pill in Header - Glassmorphic with no harsh black lines */
          <div className="w-full flex items-center gap-2 animate-in fade-in zoom-in-98 duration-150">
            <div className="flex-1 flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white/70 backdrop-blur-md border border-white/60 shadow-sm focus-within:bg-white focus-within:shadow-md transition-all">
              <Search className="w-4 h-4 text-blue-500 shrink-0 stroke-[2.2]" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari pulsa, paket data, PLN, game..."
                className="flex-1 bg-transparent border-none outline-none text-xs sm:text-sm font-semibold text-neutral-900 placeholder:text-neutral-400 min-w-0"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="p-1 rounded-full text-neutral-400 hover:text-neutral-800 hover:bg-neutral-200/50 transition-colors cursor-pointer"
                  title="Hapus pencarian"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Cancel Button */}
            <button
              onClick={() => setIsSearchActive(false)}
              className="px-3.5 py-2 text-xs font-bold text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/50 rounded-2xl transition-colors cursor-pointer shrink-0"
            >
              Batal
            </button>
          </div>
        )}
      </div>

      {/* Glassmorphic Dropdown Results when search is active */}
      {isSearchActive && (
        <div className="absolute top-full left-0 right-0 max-w-6xl mx-auto px-3 sm:px-6 z-50">
          <div className="bg-white/85 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/80 p-4 sm:p-5 space-y-3.5 max-h-[75vh] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Category Filter Chips */}
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {[
                { id: 'all', label: 'Semua Produk' },
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
                      : 'bg-neutral-100/80 text-neutral-600 hover:bg-neutral-200/80'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Results or Quick Suggestions */}
            {query.trim() === '' && selectedCategory === 'all' ? (
              <div className="py-3 text-xs text-neutral-500">
                <p className="font-bold text-neutral-700 mb-2.5">Pencarian Populer:</p>
                <div className="flex flex-wrap gap-2">
                  {['Telkomsel 25GB', 'Pulsa Indosat 50rb', 'Token PLN 100rb', 'Mobile Legends 86 Diamond', 'Tri 32GB Happy'].map((sug) => (
                    <button
                      key={sug}
                      onClick={() => setQuery(sug)}
                      className="px-3 py-1.5 rounded-xl bg-white/80 border border-neutral-200/60 text-neutral-700 hover:bg-white hover:border-blue-300 text-xs font-medium cursor-pointer transition-all shadow-2xs"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-xs font-bold text-neutral-800">Tidak ada produk yang cocok</p>
                <p className="text-[11px] text-neutral-500 mt-0.5">Coba cari dengan kata kunci lain atau pilih kategori di atas.</p>
              </div>
            ) : (
              <div className="space-y-1.5 pt-1">
                {filteredProducts.map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => handleProductClick(prod)}
                    className="flex items-center justify-between p-3 rounded-2xl bg-white/50 hover:bg-white border border-transparent hover:border-blue-100 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <ProviderIcon provider={prod.provider} size="sm" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-neutral-900 truncate">
                            {prod.name}
                          </span>
                          {prod.isPopular && (
                            <span className="px-1.5 py-0.2 rounded bg-neutral-900 text-white text-[9px] font-bold">
                              Populer
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-neutral-500 truncate mt-0.5">
                          {prod.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 pl-2 shrink-0">
                      <span className="text-xs font-black font-mono text-neutral-900">
                        {formatRupiah(prod.price)}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
