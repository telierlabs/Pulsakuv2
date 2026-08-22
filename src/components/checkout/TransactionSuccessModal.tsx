import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  Copy, 
  Share2, 
  Home, 
  Receipt
} from 'lucide-react';
import { Transaction } from '../../types';
import { formatRupiah, formatDateIndo, copyToClipboard } from '../../utils/formatters';
import { useToast } from '../common/Toast';

interface TransactionSuccessModalProps {
  transaction: Transaction | null;
  onClose: () => void;
  onGoHome: () => void;
  onViewHistory: () => void;
}

export const TransactionSuccessModal: React.FC<TransactionSuccessModalProps> = ({
  transaction,
  onGoHome,
  onViewHistory
}) => {
  const { showToast } = useToast();

  useEffect(() => {
    if (transaction) {
      try {
        confetti({
          particleCount: 30,
          spread: 50,
          origin: { y: 0.7 },
          colors: ['#0B1220', '#10B981', '#64748B']
        });
      } catch (e) {}
    }
  }, [transaction]);

  if (!transaction) return null;

  const handleCopy = (text: string, label: string) => {
    copyToClipboard(text);
    showToast(`${label} berhasil disalin!`, 'success');
  };

  const handleShare = () => {
    const text = `Struk Transaksi Pulsaku\nProduk: ${transaction.productName}\nTujuan: ${transaction.destination}\nTotal: ${formatRupiah(transaction.total)}\nStatus: BERHASIL\nSN: ${transaction.serialNumber || '-'}\nID: ${transaction.transactionId}`;
    copyToClipboard(text);
    showToast('Ringkasan struk disalin ke clipboard', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/70 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div 
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col my-auto animate-in zoom-in-95 duration-200"
        id="transaction-success-modal"
      >
        {/* Success Header */}
        <div className="p-6 bg-[#0B1220] text-white text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-3 text-emerald-400">
            <CheckCircle2 className="w-7 h-7 stroke-[2.5]" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1">
            Transaksi Sukses
          </span>
          <h3 className="text-2xl font-black font-mono tracking-tight">
            {formatRupiah(transaction.total)}
          </h3>
          <p className="text-[11px] text-neutral-400 mt-1 font-mono">
            ID: {transaction.transactionId}
          </p>
        </div>

        {/* Digital Receipt Details */}
        <div className="p-5 space-y-4 text-xs">
          
          {/* PLN Token Special Box */}
          {transaction.tokenPLN && (
            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-300 text-center space-y-1.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                Kode Token Listrik (20 Digit)
              </div>
              <div className="font-mono text-lg sm:text-xl font-black text-neutral-900 tracking-wider select-all">
                {transaction.tokenPLN}
              </div>
              {transaction.kwhPLN && (
                <div className="text-[11px] text-neutral-600 font-semibold">
                  Estimasi Daya: {transaction.kwhPLN}
                </div>
              )}
              <button
                onClick={() => handleCopy(transaction.tokenPLN!, 'Token PLN')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold transition-colors cursor-pointer mt-1"
              >
                <Copy className="w-3.5 h-3.5" /> Salin Token
              </button>
            </div>
          )}

          {/* Serial Number (SN) for Telco / Game */}
          {transaction.serialNumber && !transaction.tokenPLN && (
            <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-400 block">Serial Number (SN)</span>
                <span className="font-mono text-xs font-bold text-neutral-900">{transaction.serialNumber}</span>
              </div>
              <button
                onClick={() => handleCopy(transaction.serialNumber!, 'Serial Number')}
                className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200/60 rounded-lg transition-colors cursor-pointer"
                title="Salin SN"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Transaction Metadata List */}
          <div className="space-y-2.5 pt-1">
            <div className="flex justify-between items-center text-neutral-500">
              <span>Produk</span>
              <span className="font-bold text-neutral-900 text-right">{transaction.productName}</span>
            </div>

            <div className="flex justify-between items-center text-neutral-500">
              <span>Tujuan</span>
              <span className="font-mono font-bold text-neutral-900">
                {transaction.destination}
                {transaction.secondaryDestination && ` (${transaction.secondaryDestination})`}
              </span>
            </div>

            {transaction.customerName && (
              <div className="flex justify-between items-center text-neutral-500">
                <span>Nama Pelanggan</span>
                <span className="font-bold text-neutral-900">{transaction.customerName}</span>
              </div>
            )}

            <div className="flex justify-between items-center text-neutral-500">
              <span>Waktu Transaksi</span>
              <span className="text-neutral-900 font-medium">{formatDateIndo(transaction.createdAt)}</span>
            </div>

            <div className="flex justify-between items-center text-neutral-500">
              <span>Metode Pembayaran</span>
              <span className="font-bold text-neutral-900">{transaction.paymentMethodName}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-neutral-200/80 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleShare}
                className="py-2.5 px-3 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-800 font-bold flex items-center justify-center gap-1.5 transition-colors text-xs cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" /> Bagikan Struk
              </button>

              <button
                onClick={onViewHistory}
                className="py-2.5 px-3 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-800 font-bold flex items-center justify-center gap-1.5 transition-colors text-xs cursor-pointer"
              >
                <Receipt className="w-3.5 h-3.5" /> Riwayat
              </button>
            </div>

            <button
              onClick={onGoHome}
              className="w-full py-2.5 rounded-xl bg-[#0B1220] hover:bg-neutral-900 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Home className="w-4 h-4" /> Kembali ke Beranda
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
