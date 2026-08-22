import React from 'react';
import { AlertCircle, RotateCcw, Home, HelpCircle } from 'lucide-react';
import { Transaction } from '../../types';

interface TransactionFailedModalProps {
  transaction: Transaction | null;
  onRetry: () => void;
  onGoHome: () => void;
  onHelp: () => void;
}

export const TransactionFailedModal: React.FC<TransactionFailedModalProps> = ({
  transaction,
  onRetry,
  onGoHome,
  onHelp
}) => {
  if (!transaction) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/70 backdrop-blur-xs p-4">
      <div 
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col p-6 animate-in zoom-in-95 duration-200 text-center"
        id="transaction-failed-modal"
      >
        <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto mb-3">
          <AlertCircle className="w-6 h-6 text-rose-600 stroke-[2.2]" />
        </div>

        <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">
          Transaksi Gagal Diproses
        </span>
        <h3 className="text-base font-black text-neutral-900 mt-1">
          {transaction.productName}
        </h3>

        <div className="p-3.5 my-4 rounded-xl bg-neutral-50 border border-neutral-200/80 text-xs text-neutral-600 text-left leading-relaxed">
          <span className="font-bold text-neutral-900 block mb-0.5">Keterangan:</span>
          {transaction.failureReason || 'Gangguan teknis sementara dari server provider. Dana pembayaran Anda tidak terpotong.'}
        </div>

        <div className="space-y-2 pt-1">
          <button
            onClick={onRetry}
            className="w-full py-2.5 rounded-xl bg-[#0B1220] hover:bg-neutral-900 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" /> Ulangi Pembayaran
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onHelp}
              className="py-2.5 px-3 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" /> Bantuan CS
            </button>

            <button
              onClick={onGoHome}
              className="py-2.5 px-3 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" /> Beranda
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
