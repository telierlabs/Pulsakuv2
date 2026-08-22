import React from 'react';
import { Zap, ShieldCheck, QrCode, Clock } from 'lucide-react';

export const TrustSection: React.FC = () => {
  const points = [
    {
      icon: Zap,
      title: 'Otomatis 24 Jam',
      desc: 'Transaksi diproses langsung oleh sistem serverless tanpa jeda antrean.'
    },
    {
      icon: QrCode,
      title: 'QRIS Bebas Biaya',
      desc: 'Bebas biaya admin QRIS untuk semua pulsa & token listrik.'
    },
    {
      icon: ShieldCheck,
      title: 'Tanpa Login Wajib',
      desc: 'Beli langsung hanya dengan nomor tujuan tanpa repot registrasi.'
    },
    {
      icon: Clock,
      title: 'Garansi Status Transparan',
      desc: 'Pelacakan real-time & struk digital tersimpan otomatis di perangkat.'
    }
  ];

  return (
    <section className="my-8 pt-6 border-t border-neutral-200/80" id="trust-section">
      <div className="mb-4">
        <h3 className="text-sm font-bold tracking-tight text-neutral-900">
          Standar Layanan Pulsaku
        </h3>
        <p className="text-xs text-neutral-500 mt-0.5">
          Komitmen keandalan dan kenyamanan setiap transaksi
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {points.map((pt, idx) => {
          const Icon = pt.icon;
          return (
            <div 
              key={idx}
              className="p-3.5 rounded-xl bg-white border border-neutral-200/80 flex items-start gap-3"
            >
              <div className="p-2 rounded-lg bg-neutral-100 text-neutral-900 shrink-0 border border-neutral-200/60">
                <Icon className="w-4 h-4 stroke-[2]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-neutral-900">{pt.title}</h4>
                <p className="text-[11px] text-neutral-500 mt-0.5 leading-relaxed">
                  {pt.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
