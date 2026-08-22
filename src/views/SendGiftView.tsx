import React, { useState, useEffect, useMemo } from 'react';
import { 
  ArrowLeft, 
  Heart, 
  Wifi, 
  Smartphone, 
  Bookmark, 
  Check, 
  Sparkles, 
  MessageSquareHeart, 
  AlertCircle,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { Product, ProviderId, FavoriteTarget } from '../types';
import { PROVIDERS, detectProviderFromPhone, ALL_PRODUCTS, KUOTA_PRODUCTS } from '../data/mockData';
import { formatRupiah, cleanNumeric } from '../utils/formatters';
import { ProviderIcon } from '../components/common/ProviderIcon';
import { getStoredFavorites } from '../services/storage';

interface SendGiftViewProps {
  onBack: () => void;
  onSelectProduct: (product: Product, destination: string, customerNote?: string) => void;
  initialType?: 'data' | 'pulsa';
  initialPhone?: string;
  initialProvider?: ProviderId;
}

export const SendGiftView: React.FC<SendGiftViewProps> = ({
  onBack,
  onSelectProduct,
  initialType = 'data',
  initialPhone = '',
  initialProvider = 'telkomsel'
}) => {
  const [giftType, setGiftType] = useState<'data' | 'pulsa'>(initialType);
  const [phone, setPhone] = useState(initialPhone);
  const [selectedProvider, setSelectedProvider] = useState<ProviderId>(initialProvider);
  const [recipientLabel, setRecipientLabel] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showFavoritePicker, setShowFavoritePicker] = useState(false);
  const [favorites, setFavorites] = useState<FavoriteTarget[]>([]);
  const [quotaTab, setQuotaTab] = useState<'all' | 'harian' | 'mingguan' | 'bulanan' | 'unlimited'>('all');

  const telcoProviders = PROVIDERS.filter(p => p.category === 'pulsa');

  useEffect(() => {
    setFavorites(getStoredFavorites().filter(f => f.type === 'phone'));
  }, []);

  // Preset relationship chips
  const relationshipPresets = [
    { label: 'Ibu 👩', value: 'Ibu' },
    { label: 'Ayah 👨', value: 'Ayah' },
    { label: 'Pasangan ❤️', value: 'Pasangan' },
    { label: 'Adik 👦', value: 'Adik' },
    { label: 'Sahabat 🤝', value: 'Sahabat' },
    { label: 'Keluarga 🏡', value: 'Keluarga' },
  ];

  // Preset greeting messages
  const messagePresets = [
    'Semangat hari ini ya! ❤️',
    'Hadiah kuota biar lancar nugasnya ✨',
    'Selamat ulang tahun! Panjang umur & sehat selalu 🎉',
    'Pulsa buat teleponan & kabari rumah 📞',
    'Jangan lupa istirahat, have a nice day! 😊'
  ];

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
    setRecipientLabel(fav.label);
    setShowFavoritePicker(false);
  };

  // Products available based on mode
  const availableProducts = useMemo(() => {
    if (giftType === 'pulsa') {
      return ALL_PRODUCTS.filter(
        p => p.category === 'pulsa' && p.provider === selectedProvider
      );
    } else {
      return KUOTA_PRODUCTS.filter(p => {
        const matchProv = p.provider === selectedProvider;
        const matchTab = quotaTab === 'all' || p.quotaCategory === quotaTab;
        return matchProv && matchTab;
      });
    }
  }, [giftType, selectedProvider, quotaTab]);

  const isValidPhone = phone.length >= 10 && phone.length <= 14;
  const currentProviderInfo = PROVIDERS.find(p => p.id === selectedProvider)!;

  const handleCheckout = () => {
    if (!selectedProduct || !isValidPhone) return;
    const note = [recipientLabel ? `Untuk: ${recipientLabel}` : '', customMessage ? `Pesan: "${customMessage}"` : '']
      .filter(Boolean)
      .join(' | ');
    onSelectProduct(selectedProduct, phone, note || undefined);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200" id="send-gift-view">
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
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-rose-50 border border-rose-200/60 text-rose-700 text-[10px] font-black uppercase tracking-wider mb-0.5">
            <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
            <span>Kirim Orang Terdekat</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
            Hadiah Digital Spesial
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Isikan paket data atau pulsa langsung untuk orang tersayang dengan pesan ucapan
          </p>
        </div>
      </div>

      {/* Main Mode Toggle: [Kirim Paket Data] vs [Kirim Pulsa] */}
      <div className="p-1.5 rounded-2xl bg-neutral-200/70 grid grid-cols-2 gap-1.5 max-w-md">
        <button
          onClick={() => {
            setGiftType('data');
            setSelectedProduct(null);
          }}
          className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            giftType === 'data'
              ? 'bg-[#0B1220] text-white shadow-2xs'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/50'
          }`}
          id="tab-gift-data"
        >
          <Wifi className="w-4 h-4 stroke-[2.2]" />
          <span>Kirim Paket Data</span>
        </button>

        <button
          onClick={() => {
            setGiftType('pulsa');
            setSelectedProduct(null);
          }}
          className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            giftType === 'pulsa'
              ? 'bg-[#0B1220] text-white shadow-2xs'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/50'
          }`}
          id="tab-gift-pulsa"
        >
          <Smartphone className="w-4 h-4 stroke-[2.2]" />
          <span>Kirim Pulsa Reguler</span>
        </button>
      </div>

      {/* Section 1: Data Penerima & Pesan Hadiah */}
      <div className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div>
            <h3 className="text-sm font-black text-neutral-900">
              1. Nomor HP & Data Penerima
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Masukkan nomor HP orang yang ingin kamu kirimkan
            </p>
          </div>

          {favorites.length > 0 && (
            <button
              onClick={() => setShowFavoritePicker(!showFavoritePicker)}
              className="text-xs font-bold text-neutral-900 hover:text-neutral-600 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-100 cursor-pointer"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Favorit ({favorites.length})</span>
            </button>
          )}
        </div>

        {/* Favorite Dropdown Modal */}
        {showFavoritePicker && favorites.length > 0 && (
          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
              Pilih dari kontak tersimpan:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {favorites.map((fav) => (
                <button
                  key={fav.id}
                  onClick={() => handleSelectFavorite(fav)}
                  className="p-2.5 rounded-lg bg-white border border-neutral-200 hover:border-neutral-900 text-left flex items-center gap-2.5 transition-all cursor-pointer"
                >
                  <ProviderIcon provider={fav.provider} size="sm" />
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-bold text-neutral-900 block truncate">{fav.label}</span>
                    <span className="text-[11px] font-mono text-neutral-500">{fav.targetValue}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quick Relationship Chips */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1.5">
            Kirim Untuk Siapa? (Opsional)
          </label>
          <div className="flex flex-wrap gap-1.5">
            {relationshipPresets.map((rel) => (
              <button
                key={rel.value}
                onClick={() => setRecipientLabel(recipientLabel === rel.value ? '' : rel.value)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  recipientLabel === rel.value
                    ? 'bg-neutral-900 text-white shadow-2xs'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {rel.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input Phone Number */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1.5">
            Nomor Handphone Penerima
          </label>
          <div className="relative">
            <input
              type="tel"
              value={phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              placeholder="Contoh: 081234567890"
              maxLength={15}
              className="w-full pl-4 pr-24 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-base font-mono font-bold text-neutral-900 focus:outline-hidden focus:bg-white focus:border-neutral-900 transition-all tracking-wider"
              id="input-gift-phone"
            />
            {/* Auto-detected Provider Badge */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
              <ProviderIcon provider={selectedProvider} size="sm" />
              <span className="text-xs font-bold text-neutral-800">
                {currentProviderInfo?.name}
              </span>
            </div>
          </div>
          {phone.length > 0 && !isValidPhone && (
            <p className="text-[11px] text-amber-600 flex items-center gap-1 mt-1.5 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              Nomor handphone biasanya terdiri dari 10 - 13 digit
            </p>
          )}
        </div>

        {/* Optional Gift Message / Greetings */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1 mb-1.5">
            <MessageSquareHeart className="w-3.5 h-3.5 text-rose-500" />
            <span>Pesan / Ucapan Spesial (Opsional)</span>
          </label>
          <input
            type="text"
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder="Tulis ucapan singkat (contoh: Semangat kerjanya ya! ❤️)"
            maxLength={80}
            className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm font-medium text-neutral-900 focus:outline-hidden focus:bg-white focus:border-neutral-900"
          />

          {/* Quick preset message pills */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {messagePresets.map((msg, i) => (
              <button
                key={i}
                onClick={() => setCustomMessage(msg)}
                className="px-2.5 py-1 rounded-lg bg-neutral-50 hover:bg-neutral-100 text-[11px] text-neutral-600 border border-neutral-200 transition-colors cursor-pointer"
              >
                {msg}
              </button>
            ))}
          </div>
        </div>

        {/* Provider Switcher Tabs if manual change is needed */}
        <div className="pt-2 border-t border-neutral-100">
          <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-2">
            Ganti Operator Seluler Secara Manual:
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {telcoProviders.map((prov) => (
              <button
                key={prov.id}
                onClick={() => {
                  setSelectedProvider(prov.id);
                  setSelectedProduct(null);
                }}
                className={`p-2 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                  selectedProvider === prov.id
                    ? 'border-neutral-900 bg-neutral-900 text-white shadow-2xs'
                    : 'border-neutral-200 bg-neutral-50 text-neutral-700 hover:border-neutral-400'
                }`}
              >
                <ProviderIcon provider={prov.id} size="sm" />
                <span className="text-[11px] font-bold mt-1 truncate">{prov.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Section 2: Pilih Paket / Nominal */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-neutral-900">
              2. Pilih {giftType === 'data' ? 'Paket Data Internet' : 'Nominal Pulsa'}
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Tersedia untuk operator {currentProviderInfo?.name}
            </p>
          </div>
        </div>

        {/* Quota Category Tabs if in 'data' mode */}
        {giftType === 'data' && (
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {[
              { id: 'all', label: 'Semua Paket' },
              { id: 'harian', label: 'Harian (1-3 Hari)' },
              { id: 'mingguan', label: 'Mingguan (7 Hari)' },
              { id: 'bulanan', label: 'Bulanan (30 Hari)' },
              { id: 'unlimited', label: 'Unlimited' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setQuotaTab(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  quotaTab === tab.id
                    ? 'bg-[#0B1220] text-white shadow-2xs'
                    : 'bg-white border border-neutral-200 text-neutral-600 hover:border-neutral-400'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Product Cards Grid */}
        {giftType === 'pulsa' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {availableProducts.map((prod) => {
              const isSelected = selectedProduct?.id === prod.id;
              return (
                <div
                  key={prod.id}
                  onClick={() => setSelectedProduct(prod)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                    isSelected
                      ? 'border-neutral-900 bg-neutral-900 text-white shadow-2xs'
                      : 'border-neutral-200/90 bg-white hover:border-neutral-900 hover:shadow-2xs text-neutral-900'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-white text-neutral-900 flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}

                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider block ${isSelected ? 'text-neutral-300' : 'text-neutral-400'}`}>
                      Pulsa Reguler
                    </span>
                    <h4 className="text-base sm:text-lg font-black font-mono mt-0.5">
                      {formatRupiah(prod.denomination)}
                    </h4>
                  </div>

                  <div className="pt-3 mt-3 border-t border-neutral-100/20">
                    <span className={`text-xs font-bold block ${isSelected ? 'text-white' : 'text-neutral-900'}`}>
                      Harga: {formatRupiah(prod.price)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {availableProducts.map((prod) => {
              const isSelected = selectedProduct?.id === prod.id;
              return (
                <div
                  key={prod.id}
                  onClick={() => setSelectedProduct(prod)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                    isSelected
                      ? 'border-neutral-900 bg-neutral-900 text-white shadow-2xs'
                      : 'border-neutral-200/90 bg-white hover:border-neutral-900 hover:shadow-2xs text-neutral-900'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-white text-neutral-900 flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-700'
                      }`}>
                        {prod.quotaAmount || 'Data'}
                      </span>
                      {prod.validityDays && (
                        <span className={`text-[10px] flex items-center gap-1 ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                          <Clock className="w-3 h-3" />
                          {prod.validityDays} Hari
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-black mt-1 line-clamp-1">
                      {prod.name}
                    </h4>
                    <p className={`text-xs mt-1 line-clamp-2 leading-relaxed ${
                      isSelected ? 'text-neutral-300' : 'text-neutral-500'
                    }`}>
                      {prod.description}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-neutral-100/20 flex items-center justify-between">
                    <span className={`text-xs font-black font-mono ${isSelected ? 'text-white' : 'text-neutral-900'}`}>
                      {formatRupiah(prod.price)}
                    </span>
                    <span className={`text-[10px] font-bold ${isSelected ? 'text-neutral-300' : 'text-neutral-400'}`}>
                      Tanpa Admin
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Bottom Sticky Bar / Checkout Summary */}
      {selectedProduct && (
        <div className="sticky bottom-4 z-20 p-4 rounded-2xl bg-[#0B1220] text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in slide-in-from-bottom-2 duration-150">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Kirim Ke: {phone || '(Nomor belum diisi)'}
              </span>
              {recipientLabel && (
                <span className="px-1.5 py-0.2 rounded bg-white/20 text-white text-[9px] font-bold">
                  {recipientLabel}
                </span>
              )}
            </div>
            <h4 className="text-sm font-bold text-white truncate mt-0.5">
              {selectedProduct.name}
            </h4>
            <div className="text-xs font-black font-mono text-white mt-0.5">
              Total: {formatRupiah(selectedProduct.price)}
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={!isValidPhone}
            className={`px-6 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
              isValidPhone
                ? 'bg-white text-neutral-950 hover:bg-neutral-100 shadow-sm'
                : 'bg-neutral-700 text-neutral-400 cursor-not-allowed'
            }`}
            id="btn-confirm-send-gift"
          >
            {isValidPhone ? 'Lanjutkan Pembayaran' : 'Lengkapi Nomor HP'}
          </button>
        </div>
      )}
    </div>
  );
};
