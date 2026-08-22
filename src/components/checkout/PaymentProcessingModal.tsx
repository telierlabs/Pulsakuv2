import React, { useState, useEffect } from 'react';
import { 
  Loader2, 
  CheckCircle2, 
  Clock, 
  Copy 
} from 'lucide-react';
import { Transaction } from '../../types';
import { formatRupiah, copyToClipboard } from '../../utils/formatters';
import { useToast } from '../common/Toast';

interface PaymentProcessingModalProps {
  transaction: Transaction | null;
  stage: 'idle' | 'waiting_payment' | 'verifying' | 'fulfilling' | 'complete';
  onSimulatePay: () => void;
  onCancel: () => void;
}

export const PaymentProcessingModal: React.FC<PaymentProcessingModalProps> = ({
  transaction,
  stage,
  onSimulatePay,
  onCancel
}) => {
  const [countdown, setCountdown] = useState(900); // 15 minutes
  const { showToast } = useToast();

  useEffect(() => {
    if (stage === 'waiting_payment') {
      const timer = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [stage]);

  if (!transaction || stage === 'idle') return null;

  const minutes = Math.floor(countdown / 60).toString().padStart(2, '0');
  const seconds = (countdown % 60).toString().padStart(2, '0');

  const handleCopy = (text: string, label: string) => {
    copyToClipboard(text);
    showToast(`${label} disalin`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/70 backdrop-blur-xs p-4">
      <div 
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col p-5 sm:p-6 animate-in zoom-in-95 duration-200 text-center"
        id="payment-processing-modal"
      >
        {stage === 'waiting_payment' ? (
          <div className="space-y-4">
            {/* Payment Header */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-800 mb-2">
                <Clock className="w-3.5 h-3.5" />
                <span className="font-mono">Batas Waktu {minutes}:{seconds}</span>
              </div>
              <h3 className="text-lg font-black text-neutral-900 tracking-tight">
                {transaction.paymentMethod === 'qris' 
                  ? 'Scan QRIS untuk Membayar' 
                  : transaction.paymentMethod === 'dana' 
                  ? 'Menunggu Otorisasi DANA' 
                  : 'Transfer Virtual Account'}
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Total Tagihan: <span className="font-bold text-neutral-900 font-mono">{formatRupiah(transaction.total)}</span>
              </p>
            </div>

            {/* QRIS Display or VA Display */}
            {transaction.paymentMethod === 'qris' ? (
              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80 flex flex-col items-center">
                {/* Clean QR code simulation */}
                <div className="relative p-3 bg-white rounded-xl shadow-2xs border border-neutral-200/80">
                  <svg className="w-48 h-48 sm:w-52 sm:h-52" viewBox="0 0 200 200" fill="none">
                    {/* Outer corners */}
                    <rect x="15" y="15" width="40" height="40" rx="4" fill="#0B1220" />
                    <rect x="23" y="23" width="24" height="24" rx="2" fill="#ffffff" />
                    <rect x="27" y="27" width="16" height="16" rx="1" fill="#0B1220" />

                    <rect x="145" y="15" width="40" height="40" rx="4" fill="#0B1220" />
                    <rect x="153" y="23" width="24" height="24" rx="2" fill="#ffffff" />
                    <rect x="157" y="27" width="16" height="16" rx="1" fill="#0B1220" />

                    <rect x="15" y="145" width="40" height="40" rx="4" fill="#0B1220" />
                    <rect x="23" y="153" width="24" height="24" rx="2" fill="#ffffff" />
                    <rect x="27" y="157" width="16" height="16" rx="1" fill="#0B1220" />

                    {/* Data patterns */}
                    <circle cx="100" cy="35" r="4" fill="#0B1220" />
                    <circle cx="120" cy="35" r="3" fill="#0B1220" />
                    <circle cx="80" cy="50" r="5" fill="#0B1220" />
                    <circle cx="100" cy="100" r="12" fill="#0B1220" />
                    <circle cx="100" cy="100" r="7" fill="#ffffff" />
                    <circle cx="100" cy="100" r="3" fill="#0B1220" />

                    <rect x="70" y="70" width="12" height="12" rx="2" fill="#0B1220" />
                    <rect x="120" y="70" width="16" height="12" rx="2" fill="#0B1220" />
                    <rect x="70" y="120" width="16" height="12" rx="2" fill="#0B1220" />
                    <rect x="120" y="120" width="12" height="12" rx="2" fill="#0B1220" />
                    <rect x="145" y="145" width="18" height="18" rx="2" fill="#0B1220" />
                    <rect x="168" y="168" width="18" height="18" rx="2" fill="#0B1220" />
                    <rect x="35" y="80" width="8" height="25" rx="2" fill="#0B1220" />
                    <rect x="155" y="80" width="8" height="25" rx="2" fill="#0B1220" />
                  </svg>
                  
                  <div className="absolute inset-x-0 bottom-1 flex justify-center">
                    <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">
                      QRIS Standard
                    </span>
                  </div>
                </div>
                <div className="mt-2 text-xs font-mono font-medium text-neutral-600">
                  NMID: ID102030491823 • Pulsaku
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80 text-left space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-neutral-400 font-bold uppercase tracking-wider">Nomor Virtual Account</span>
                  <button 
                    onClick={() => handleCopy('880128918291028', 'Nomor VA')}
                    className="text-xs font-bold text-neutral-900 flex items-center gap-1 hover:text-blue-600 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" /> Salin
                  </button>
                </div>
                <div className="font-mono text-lg font-black text-neutral-900 tracking-wider">
                  8801 2891 8291 028
                </div>
                <p className="text-[11px] text-neutral-500">
                  Salin nomor VA di atas dan transfer via ATM atau mobile banking Anda.
                </p>
              </div>
            )}

            {/* Simulation action button */}
            <div className="pt-2 space-y-2">
              <button
                onClick={onSimulatePay}
                className="w-full py-3 rounded-xl bg-[#0B1220] hover:bg-neutral-900 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer focus:outline-hidden"
                id="btn-simulate-payment"
              >
                {transaction.paymentMethod === 'dana' ? 'Simulasi Bayar via DANA' : 'Saya Sudah Bayar (Cek Otomatis)'}
              </button>

              <button
                onClick={onCancel}
                className="w-full py-2 text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
              >
                Batalkan Transaksi
              </button>
            </div>
          </div>
        ) : (
          /* Verification & Fulfillment Animation */
          <div className="py-8 space-y-5">
            <div className="relative mx-auto w-14 h-14 flex items-center justify-center">
              <Loader2 className="w-12 h-12 text-[#0B1220] animate-spin stroke-[2.5]" />
            </div>

            <div>
              <h3 className="text-base font-black text-neutral-900">
                {stage === 'verifying' 
                  ? 'Memverifikasi Pembayaran...' 
                  : 'Memproses Pengisian Produk...'}
              </h3>
              <p className="text-xs text-neutral-500 max-w-xs mx-auto mt-1 leading-relaxed">
                {stage === 'verifying'
                  ? 'Sistem sedang memvalidasi status pembayaran dari payment gateway.'
                  : 'Mengirimkan pesanan ke server provider resmi.'}
              </p>
            </div>

            {/* Stepper Status Indicators */}
            <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/80 text-left space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold text-neutral-900">Pembayaran Diterima</span>
              </div>
              <div className="flex items-center gap-2">
                {stage === 'fulfilling' ? (
                  <Loader2 className="w-4 h-4 text-neutral-900 animate-spin shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                )}
                <span className={`font-semibold ${stage === 'fulfilling' ? 'text-neutral-900' : 'text-neutral-600'}`}>
                  Pengisian ke Akun Tujuan
                </span>
              </div>
              <div className="flex items-center gap-2 text-neutral-400">
                <div className="w-4 h-4 rounded-full border border-neutral-300 flex items-center justify-center text-[10px] font-bold">
                  3
                </div>
                <span>Penerbitan Bukti & Serial Number</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
