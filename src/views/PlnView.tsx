import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  ArrowLeft, 
  Bookmark, 
  CheckCircle2, 
  Loader2, 
  Info 
} from 'lucide-react';
import { Product, FavoriteTarget } from '../types';
import { PLN_PRODUCTS } from '../data/mockData';
import { formatRupiah, cleanNumeric } from '../utils/formatters';
import { getStoredFavorites } from '../services/storage';

interface PlnViewProps {
  onBack: () => void;
  onSelectProduct: (product: Product, destination: string, customerName?: string) => void;
  initialMeterNo?: string;
}

export const PlnView: React.FC<PlnViewProps> = ({
  onBack,
  onSelectProduct,
  initialMeterNo = ''
}) => {
  const [meterNo, setMeterNo] = useState(initialMeterNo);
  const [customerName, setCustomerName] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [showFavoritePicker, setShowFavoritePicker] = useState(false);
  const [favorites, setFavorites] = useState<FavoriteTarget[]>([]);

  useEffect(() => {
    setFavorites(getStoredFavorites().filter(f => f.type === 'pln'));
  }, []);

  const handleMeterChange = (val: string) => {
    const clean = cleanNumeric(val);
    setMeterNo(clean);
    
    if (clean.length >= 11) {
      setIsChecking(true);
      setTimeout(() => {
        setIsChecking(false);
        setCustomerName('H. BAMBANG SUTOPO / R1M 900VA');
      }, 400);
    } else {
      setCustomerName(null);
    }
  };

  const handleSelectFavorite = (fav: FavoriteTarget) => {
    setMeterNo(fav.targetValue);
    setCustomerName('H. BAMBANG SUTOPO / R1M 900VA');
    setShowFavoritePicker(false);
  };

  const isValidMeter = meterNo.length >= 11 && meterNo.length <= 12;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200" id="pln-view">
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
            Token Listrik PLN
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Beli token listrik prabayar 24 jam dengan 20 digit kode instan
          </p>
        </div>
      </div>

      {/* Meter Number Input Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            No. Meter / ID Pelanggan (11-12 Digit)
          </label>
          {favorites.length > 0 && (
            <button
              onClick={() => setShowFavoritePicker(!showFavoritePicker)}
              className="text-xs font-bold text-neutral-900 hover:text-blue-600 flex items-center gap-1 focus:outline-hidden cursor-pointer"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Favorit PLN ({favorites.length})</span>
            </button>
          )}
        </div>

        {showFavoritePicker && (
          <div className="p-2 rounded-xl bg-neutral-50 border border-neutral-200/80 space-y-1 animate-in fade-in">
            <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider px-2 py-1">
              Daftar Favorit PLN
            </div>
            {favorites.map((fav) => (
              <button
                key={fav.id}
                onClick={() => handleSelectFavorite(fav)}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white text-left text-xs cursor-pointer"
              >
                <div>
                  <div className="font-bold text-neutral-900">{fav.label}</div>
                  <div className="font-mono text-neutral-500">{fav.targetValue}</div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-200 text-neutral-700">
                  PLN
                </span>
              </button>
            ))}
          </div>
        )}

        <div className="relative flex items-center">
          <div className="absolute left-3.5 pointer-events-none text-neutral-400">
            <Zap className="w-5 h-5 stroke-[1.8]" />
          </div>
          <input
            type="tel"
            value={meterNo}
            onChange={(e) => handleMeterChange(e.target.value)}
            placeholder="Contoh: 32145678901"
            maxLength={12}
            className="w-full pl-11 pr-12 py-3 text-base sm:text-lg font-bold font-mono text-neutral-900 bg-neutral-50/80 border border-neutral-200 rounded-xl focus:bg-white focus:border-neutral-900 focus:outline-hidden transition-all placeholder:text-neutral-400 placeholder:font-normal"
            id="input-pln-meter"
          />
          <div className="absolute right-3">
            {isChecking ? (
              <Loader2 className="w-4 h-4 text-neutral-600 animate-spin" />
            ) : customerName ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            ) : null}
          </div>
        </div>

        {/* Customer Validation Inquire Result */}
        {customerName && (
          <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80 flex items-center justify-between text-xs animate-in fade-in">
            <div>
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">
                ID Pelanggan Terverifikasi
              </span>
              <span className="font-bold text-neutral-900">{customerName}</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
              Valid
            </span>
          </div>
        )}

        {/* Notice */}
        <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80 text-xs text-neutral-600 flex items-start gap-2">
          <Info className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed text-neutral-500">
            Pastikan meteran dalam kondisi normal. Kode 20 digit token listrik akan diterbitkan instan setelah pembayaran terkonfirmasi.
          </p>
        </div>
      </div>

      {/* Denominations Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold tracking-tight text-neutral-900">
            Pilihan Nominal Token Listrik
          </h3>
          <span className="text-xs text-neutral-400 font-medium">Bebas Biaya Admin QRIS</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {PLN_PRODUCTS.map((prod) => (
            <button
              key={prod.id}
              onClick={() => {
                if (!meterNo || !isValidMeter) {
                  const input = document.getElementById('input-pln-meter');
                  input?.focus();
                  return;
                }
                onSelectProduct(prod, meterNo, customerName || undefined);
              }}
              className="p-3.5 sm:p-4 rounded-xl bg-white border border-neutral-200/80 hover:border-neutral-900 hover:shadow-xs transition-all text-left flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">Token PLN</span>
                  {prod.isPopular && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-neutral-100 text-neutral-800">
                      Populer
                    </span>
                  )}
                </div>
                <div className="text-base sm:text-lg font-black text-neutral-900 font-mono">
                  {formatRupiah(prod.denomination)}
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-neutral-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-neutral-400 block font-medium uppercase tracking-wider">Bayar</span>
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
