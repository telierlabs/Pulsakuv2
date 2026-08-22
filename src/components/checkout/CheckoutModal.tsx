import React, { useState, useEffect } from 'react';
import { 
  X, 
  AlertTriangle, 
  QrCode, 
  Wallet, 
  Building2, 
  ArrowRight, 
  Check, 
  Bookmark
} from 'lucide-react';
import { Product, PaymentMethodId } from '../../types';
import { PAYMENT_METHODS } from '../../data/mockData';
import { formatRupiah } from '../../utils/formatters';
import { ProviderIcon } from '../common/ProviderIcon';
import { saveFavorite, getStoredFavorites } from '../../services/storage';

interface CheckoutModalProps {
  isOpen: boolean;
  product: Product | null;
  destination: string;
  secondaryDestination?: string;
  customerName?: string;
  onClose: () => void;
  onConfirmPayment: (method: PaymentMethodId, methodTitle: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  product,
  destination,
  secondaryDestination,
  customerName,
  onClose,
  onConfirmPayment
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodId>('qris');
  const [saveToFav, setSaveToFav] = useState(false);
  const [favLabel, setFavLabel] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSelectedMethod('qris');
      setSaveToFav(false);
      setFavLabel('');
    }
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const currentMethod = PAYMENT_METHODS.find(m => m.id === selectedMethod)!;
  const adminFee = currentMethod.adminFee;
  const totalAmount = product.price + adminFee;

  const handlePay = () => {
    if (saveToFav && destination) {
      const existing = getStoredFavorites().some(f => f.targetValue === destination);
      if (!existing) {
        saveFavorite({
          type: product.category === 'pln' ? 'pln' : product.category === 'game' ? 'game' : 'phone',
          label: favLabel.trim() || `${product.provider.toUpperCase()} (${destination.slice(-4)})`,
          targetValue: destination,
          secondaryValue: secondaryDestination,
          provider: product.provider,
          category: product.category
        });
      }
    }
    onConfirmPayment(selectedMethod, currentMethod.name);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-neutral-950/70 backdrop-blur-xs p-0 sm:p-4">
      <div 
        className="w-full max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[92vh] animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200"
        id="checkout-modal"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-neutral-900 tracking-tight">Konfirmasi Pembayaran</h3>
            <p className="text-[11px] text-neutral-400">Pilih metode pembayaran dan selesaikan transaksi</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          
          {/* Destination & Product Summary Card */}
          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  {product.category === 'pln' ? 'No. Meter / ID Pelanggan' : product.category === 'game' ? 'ID Akun Game' : 'Nomor Tujuan'}
                </span>
                <div className="text-base font-black font-mono text-neutral-900 mt-0.5">
                  {destination}
                  {secondaryDestination && (
                    <span className="text-neutral-500 font-normal ml-1.5 text-xs">
                      (Zone: {secondaryDestination})
                    </span>
                  )}
                </div>
                {customerName && (
                  <div className="text-xs font-bold text-neutral-800 mt-0.5">
                    Nama: {customerName}
                  </div>
                )}
              </div>
              <ProviderIcon provider={product.provider} size="md" />
            </div>

            <div className="pt-3 border-t border-neutral-200/60 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-neutral-900">{product.name}</span>
                <p className="text-[11px] text-neutral-500">{product.description}</p>
              </div>
              <span className="text-xs font-black text-neutral-900 font-mono">
                {formatRupiah(product.price)}
              </span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2.5">
              Metode Pembayaran
            </label>
            <div className="space-y-2">
              {PAYMENT_METHODS.map((method) => {
                const isSelected = selectedMethod === method.id;
                return (
                  <div
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900 shadow-2xs'
                        : 'border-neutral-200 hover:border-neutral-400 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isSelected ? 'bg-[#0B1220] text-white' : 'bg-neutral-100 text-neutral-600'
                      }`}>
                        {method.id === 'qris' && <QrCode className="w-4 h-4" />}
                        {method.id === 'dana' && <Wallet className="w-4 h-4" />}
                        {method.id === 'gopay' && <Wallet className="w-4 h-4" />}
                        {(method.id === 'bca_va' || method.id === 'mandiri_va') && <Building2 className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-neutral-900">{method.name}</span>
                          {method.badge && (
                            <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-emerald-100 text-emerald-800">
                              {method.badge}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-neutral-500">{method.description}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-neutral-600">
                        {method.adminFee === 0 ? 'Gratis' : formatRupiah(method.adminFee)}
                      </span>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-300'
                      }`}>
                        {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Save to Favorites Toggle */}
          <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80 flex flex-col gap-2">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={saveToFav}
                onChange={(e) => setSaveToFav(e.target.checked)}
                className="w-4 h-4 rounded text-neutral-900 focus:ring-neutral-900 border-neutral-300"
              />
              <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-800">
                <Bookmark className="w-3.5 h-3.5 text-neutral-500" />
                <span>Simpan nomor ini ke Daftar Favorit</span>
              </div>
            </label>

            {saveToFav && (
              <input
                type="text"
                value={favLabel}
                onChange={(e) => setFavLabel(e.target.value)}
                placeholder="Contoh: Nomor Kantor, HP Ayah, dll"
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-300 bg-white focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
              />
            )}
          </div>

          {/* Payment Cost Breakdown */}
          <div className="p-3.5 rounded-xl border border-neutral-200/80 bg-neutral-50/50 space-y-2 text-xs">
            <div className="flex justify-between text-neutral-600">
              <span>Harga Produk</span>
              <span className="font-mono">{formatRupiah(product.price)}</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Biaya Transaksi ({currentMethod.name})</span>
              <span className="font-mono">{adminFee === 0 ? 'Rp 0' : formatRupiah(adminFee)}</span>
            </div>
            <div className="pt-2 border-t border-neutral-200 flex justify-between font-bold text-sm text-neutral-900">
              <span>Total Pembayaran</span>
              <span className="text-neutral-900 font-mono font-black">{formatRupiah(totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Action Button CTA */}
        <div className="p-4 border-t border-neutral-100 bg-white">
          <button
            onClick={handlePay}
            className="w-full py-3 rounded-xl bg-[#0B1220] hover:bg-neutral-900 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all cursor-pointer focus:outline-hidden"
            id="btn-confirm-pay"
          >
            <span>
              {selectedMethod === 'dana' ? 'Bayar via DANA' : selectedMethod === 'qris' ? 'Bayar via QRIS' : 'Lanjut Pembayaran'}
            </span>
            <span className="font-mono font-semibold text-neutral-300">({formatRupiah(totalAmount)})</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};
