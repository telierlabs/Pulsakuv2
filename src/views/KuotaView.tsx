import React, { useState, useEffect } from 'react';
import { 
  Wifi, 
  ArrowLeft, 
  Smartphone, 
  Bookmark, 
  Clock, 
  AlertCircle
} from 'lucide-react';
import { Product, ProviderId, FavoriteTarget } from '../types';
import { PROVIDERS, KUOTA_PRODUCTS, detectProviderFromPhone } from '../data/mockData';
import { formatRupiah, cleanNumeric } from '../utils/formatters';
import { ProviderIcon } from '../components/common/ProviderIcon';
import { getStoredFavorites } from '../services/storage';

interface KuotaViewProps {
  onBack: () => void;
  onSelectProduct: (product: Product, destination: string) => void;
  initialPhone?: string;
  initialProvider?: ProviderId;
}

export const KuotaView: React.FC<KuotaViewProps> = ({
  onBack,
  onSelectProduct,
  initialPhone = '',
  initialProvider = 'telkomsel'
}) => {
  const [phone, setPhone] = useState(initialPhone);
  const [selectedProvider, setSelectedProvider] = useState<ProviderId>(initialProvider);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'harian' | 'mingguan' | 'bulanan' | 'unlimited'>('all');
  const [showFavoritePicker, setShowFavoritePicker] = useState(false);
  const [favorites, setFavorites] = useState<FavoriteTarget[]>([]);

  const telcoProviders = PROVIDERS.filter(p => p.category === 'pulsa');

  useEffect(() => {
    setFavorites(getStoredFavorites().filter(f => f.type === 'phone'));
  }, []);

  const handlePhoneChange = (val: string) => {
    const num = cleanNumeric(val);
    setPhone(num);

    if (num.length >= 4) {
      const detected = detectProviderFromPhone(num);
      if (detected && detected.category === 'pulsa') {
        setSelectedProvider(detected.id);
      }
    }
  };

  const handleSelectFavorite = (fav: FavoriteTarget) => {
    setPhone(fav.targetValue);
    setSelectedProvider(fav.provider);
    setShowFavoritePicker(false);
  };

  // Filter products by selected provider & category
  const filteredPackages = KUOTA_PRODUCTS.filter(p => {
    if (p.provider !== selectedProvider) return false;
    if (selectedFilter === 'all') return true;
    return p.quotaCategory === selectedFilter;
  });

  const isValidPhone = phone.length >= 10 && phone.length <= 14;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200" id="kuota-view">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-100 text-neutral-700 transition-colors cursor-pointer"
          aria-label="Kembali"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2]" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
            Semua Paket Kuota Data
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Pilihan paket internet harian, mingguan, bulanan, & unlimited
          </p>
        </div>
      </div>

      {/* Phone Input Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            Nomor Handphone Tujuan
          </label>
          {favorites.length > 0 && (
            <button
              onClick={() => setShowFavoritePicker(!showFavoritePicker)}
              className="text-xs font-bold text-neutral-900 hover:text-blue-600 flex items-center gap-1 focus:outline-hidden cursor-pointer"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Favorit ({favorites.length})</span>
            </button>
          )}
        </div>

        {showFavoritePicker && (
          <div className="p-2 rounded-xl bg-neutral-50 border border-neutral-200/80 space-y-1 animate-in fade-in">
            <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider px-2 py-1">
              Daftar Favorit Tersimpan
            </div>
            {favorites.map((fav) => (
              <button
                key={fav.id}
                onClick={() => handleSelectFavorite(fav)}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white transition-all text-left text-xs cursor-pointer"
              >
                <div>
                  <div className="font-bold text-neutral-900">{fav.label}</div>
                  <div className="font-mono text-neutral-500">{fav.targetValue}</div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-200 text-neutral-700 uppercase">
                  {fav.provider}
                </span>
              </button>
            ))}
          </div>
        )}

        <div className="relative flex items-center">
          <div className="absolute left-3.5 pointer-events-none text-neutral-400">
            <Smartphone className="w-5 h-5 stroke-[1.8]" />
          </div>
          <input
            type="tel"
            value={phone}
            onChange={(e) => handlePhoneChange(e.target.value)}
            placeholder="Contoh: 081234567890"
            maxLength={14}
            className="w-full pl-11 pr-20 py-3 text-base sm:text-lg font-bold font-mono text-neutral-900 bg-neutral-50/80 border border-neutral-200 rounded-xl focus:bg-white focus:border-neutral-900 focus:outline-hidden transition-all placeholder:text-neutral-400 placeholder:font-normal"
            id="input-kuota-phone"
          />
          <div className="absolute right-3 flex items-center">
            {selectedProvider && (
              <ProviderIcon provider={selectedProvider} size="sm" />
            )}
          </div>
        </div>

        {phone.length > 0 && !isValidPhone && (
          <div className="flex items-center gap-1.5 text-xs text-amber-700 font-medium">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Nomor ponsel umumnya terdiri dari 10 - 13 digit angka</span>
          </div>
        )}
      </div>

      {/* Provider Selector (Horizontal chips) */}
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2.5">
          Pilih Operator
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {telcoProviders.map((prov) => {
            const isSelected = selectedProvider === prov.id;
            return (
              <button
                key={prov.id}
                onClick={() => setSelectedProvider(prov.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-[#0B1220] text-white border-neutral-900 shadow-2xs'
                    : 'bg-white text-neutral-700 border-neutral-200/80 hover:border-neutral-400'
                }`}
              >
                <ProviderIcon provider={prov.id} size="sm" />
                <span>{prov.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Duration Filter Chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'all', label: 'Semua Durasi' },
          { id: 'harian', label: 'Harian' },
          { id: 'mingguan', label: 'Mingguan' },
          { id: 'bulanan', label: 'Bulanan (30 Hari)' },
          { id: 'unlimited', label: 'Unlimited' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setSelectedFilter(f.id as any)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedFilter === f.id
                ? 'bg-neutral-900 text-white'
                : 'bg-white text-neutral-600 border border-neutral-200/80 hover:border-neutral-400'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Package Cards List */}
      <div className="space-y-3">
        {filteredPackages.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-neutral-200">
            <Wifi className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
            <div className="text-sm font-bold text-neutral-800">Paket Belum Tersedia</div>
            <p className="text-xs text-neutral-500 mt-1">
              Silakan pilih kategori durasi lain atau ubah operator.
            </p>
          </div>
        ) : (
          filteredPackages.map((pkg) => (
            <div
              key={pkg.id}
              onClick={() => {
                if (!phone) {
                  const input = document.getElementById('input-kuota-phone');
                  input?.focus();
                  return;
                }
                onSelectProduct(pkg, phone);
              }}
              className="p-4 sm:p-5 rounded-xl bg-white border border-neutral-200/80 hover:border-neutral-900 hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer group"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm sm:text-base font-bold text-neutral-900 group-hover:text-neutral-950 transition-colors">
                    {pkg.name}
                  </h4>
                  {pkg.isPopular && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-100 text-neutral-800">
                      Populer
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold text-neutral-700">
                  <span className="inline-flex items-center gap-1 bg-neutral-100 px-2 py-0.5 rounded-md font-mono">
                    {pkg.quotaAmount}
                  </span>
                  <span className="text-neutral-300">•</span>
                  <span className="inline-flex items-center gap-1 text-neutral-500">
                    <Clock className="w-3.5 h-3.5" />
                    {pkg.validityDays} Hari
                  </span>
                </div>

                <p className="text-xs text-neutral-500 leading-relaxed max-w-xl">
                  {pkg.description}
                </p>
              </div>

              {/* Price & Buy Button */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between pt-3 sm:pt-0 border-t sm:border-t-0 border-neutral-100 shrink-0 gap-3">
                <div className="text-left sm:text-right">
                  <span className="text-[10px] text-neutral-400 block uppercase font-medium tracking-wider">Harga</span>
                  <span className="text-base sm:text-lg font-black text-neutral-900 font-mono">
                    {formatRupiah(pkg.price)}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!phone) {
                      const input = document.getElementById('input-kuota-phone');
                      input?.focus();
                      return;
                    }
                    onSelectProduct(pkg, phone);
                  }}
                  className="px-5 py-2 rounded-xl bg-[#0B1220] hover:bg-neutral-900 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer"
                >
                  Beli
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
