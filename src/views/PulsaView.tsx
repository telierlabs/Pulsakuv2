import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Bookmark, 
  ArrowLeft, 
  AlertCircle
} from 'lucide-react';
import { Product, ProviderId, FavoriteTarget } from '../types';
import { PROVIDERS, detectProviderFromPhone, ALL_PRODUCTS } from '../data/mockData';
import { formatRupiah, cleanNumeric } from '../utils/formatters';
import { ProviderIcon } from '../components/common/ProviderIcon';
import { getStoredFavorites } from '../services/storage';

interface PulsaViewProps {
  onBack: () => void;
  onSelectProduct: (product: Product, destination: string) => void;
  initialPhone?: string;
  initialProvider?: ProviderId;
}

export const PulsaView: React.FC<PulsaViewProps> = ({
  onBack,
  onSelectProduct,
  initialPhone = '',
  initialProvider = 'telkomsel'
}) => {
  const [phone, setPhone] = useState(initialPhone);
  const [selectedProvider, setSelectedProvider] = useState<ProviderId>(initialProvider);
  const [showFavoritePicker, setShowFavoritePicker] = useState(false);
  const [favorites, setFavorites] = useState<FavoriteTarget[]>([]);

  const telcoProviders = PROVIDERS.filter(p => p.category === 'pulsa');

  useEffect(() => {
    setFavorites(getStoredFavorites().filter(f => f.type === 'phone'));
  }, []);

  // Auto-detect provider when typing phone number
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

  // Get pulsa products for selected provider
  const pulsaProducts = ALL_PRODUCTS.filter(
    p => p.category === 'pulsa' && p.provider === selectedProvider
  );

  const isValidPhone = phone.length >= 10 && phone.length <= 14;
  const currentProviderInfo = PROVIDERS.find(p => p.id === selectedProvider)!;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200" id="pulsa-view">
      {/* Header Bar */}
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
            Semua Pulsa
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Pilih provider dan nominal pulsa reguler
          </p>
        </div>
      </div>

      {/* Phone Input Section */}
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
              <span>Pilih Favorit ({favorites.length})</span>
            </button>
          )}
        </div>

        {/* Favorite Dropdown List */}
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
            id="input-pulsa-phone"
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

      {/* Provider Selector Tabs (Neutral horizontal chips) */}
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
                id={`btn-prov-${prov.id}`}
              >
                <ProviderIcon provider={prov.id} size="sm" />
                <span>{prov.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Denominations Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold tracking-tight text-neutral-900">
            Pilihan Nominal Pulsa {currentProviderInfo.name}
          </h3>
          <span className="text-xs text-neutral-400 font-medium">Proses Instan</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {pulsaProducts.map((prod) => (
            <button
              key={prod.id}
              onClick={() => {
                if (!phone) {
                  const input = document.getElementById('input-pulsa-phone');
                  input?.focus();
                  return;
                }
                onSelectProduct(prod, phone);
              }}
              className="flex flex-col justify-between p-3.5 sm:p-4 rounded-xl bg-white border border-neutral-200/80 hover:border-neutral-900 hover:shadow-xs transition-all text-left group cursor-pointer"
              id={`btn-pulsa-denom-${prod.denomination}`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">
                    Pulsa
                  </span>
                  {prod.isPopular && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-neutral-100 text-neutral-800">
                      Populer
                    </span>
                  )}
                </div>
                <div className="text-base sm:text-lg font-black text-neutral-900 font-mono">
                  {prod.denomination >= 1000 ? `${prod.denomination / 1000}K` : prod.denomination}
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-neutral-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-neutral-400 block font-medium uppercase tracking-wider">Harga</span>
                  <span className="text-xs sm:text-sm font-bold text-neutral-900 font-mono">
                    {formatRupiah(prod.price)}
                  </span>
                </div>
                <span className="px-3 py-1 rounded-lg bg-[#0B1220] group-hover:bg-neutral-900 text-white text-xs font-bold transition-all">
                  Beli
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
