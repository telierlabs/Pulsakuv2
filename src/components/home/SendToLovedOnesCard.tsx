import React from 'react';
import { Heart, Wifi, Smartphone, ArrowRight, Gift, Users } from 'lucide-react';

interface SendToLovedOnesCardProps {
  onSendGift: (type: 'data' | 'pulsa') => void;
}

export const SendToLovedOnesCard: React.FC<SendToLovedOnesCardProps> = ({
  onSendGift
}) => {
  return (
    <section className="my-6" id="send-to-loved-ones-section">
      <div className="relative overflow-hidden rounded-2xl bg-white border border-neutral-200/90 shadow-2xs hover:border-neutral-300 transition-all p-5 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          {/* Left info */}
          <div className="max-w-md">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200/70 text-rose-700 text-[10px] font-black uppercase tracking-wider mb-2.5">
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              <span>Kirim Orang Terdekat</span>
            </div>

            <h3 className="text-base sm:text-lg font-black text-neutral-900 tracking-tight">
              Beri Perhatian & Kejutan Digital
            </h3>
            <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
              Isikan paket data atau pulsa langsung ke nomor keluarga, sahabat, atau pasangan dengan pesan ucapan spesial.
            </p>
          </div>

          {/* Right: 2 Pill Buttons */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
            {/* Pill 1: Kirim Data */}
            <button
              onClick={() => onSendGift('data')}
              className="flex-1 sm:flex-initial flex items-center justify-between sm:justify-center gap-3 px-4 sm:px-5 py-3 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs sm:text-sm font-bold shadow-2xs transition-all cursor-pointer group"
              id="btn-pill-kirim-data"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center">
                  <Wifi className="w-3.5 h-3.5 text-white stroke-[2.5]" />
                </div>
                <span>Kirim Data</span>
              </div>
              <ArrowRight className="w-4 h-4 text-white/70 group-hover:text-white group-hover:translate-x-0.5 transition-all stroke-[2.5]" />
            </button>

            {/* Pill 2: Kirim Pulsa */}
            <button
              onClick={() => onSendGift('pulsa')}
              className="flex-1 sm:flex-initial flex items-center justify-between sm:justify-center gap-3 px-4 sm:px-5 py-3 rounded-full bg-neutral-100 hover:bg-neutral-200/80 border border-neutral-200/80 text-neutral-900 text-xs sm:text-sm font-bold transition-all cursor-pointer group"
              id="btn-pill-kirim-pulsa"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-neutral-200 flex items-center justify-center">
                  <Smartphone className="w-3.5 h-3.5 text-neutral-800 stroke-[2.5]" />
                </div>
                <span>Kirim Pulsa</span>
              </div>
              <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 group-hover:translate-x-0.5 transition-all stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Subtle Background Accent Decoration */}
        <div className="absolute top-0 right-0 bottom-0 w-1/3 pointer-events-none opacity-5 flex items-center justify-end pr-6">
          <Heart className="w-44 h-44 text-neutral-900 fill-neutral-900" />
        </div>
      </div>
    </section>
  );
};
