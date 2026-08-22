import React from 'react';
import { Smartphone, Wifi, Zap, Gamepad2, ArrowUpRight } from 'lucide-react';
import { ProductCategory } from '../../types';

interface CategoryShortcutsProps {
  onSelectCategory: (category: ProductCategory) => void;
}

export const CategoryShortcuts: React.FC<CategoryShortcutsProps> = ({
  onSelectCategory
}) => {
  const actions = [
    {
      id: 'kuota' as ProductCategory,
      label: 'Paket Data',
      sublabel: 'Internet & Roaming',
      icon: Wifi,
      isAnchor: true,
    },
    {
      id: 'pulsa' as ProductCategory,
      label: 'Pulsa Reguler',
      sublabel: 'Semua Operator',
      icon: Smartphone,
      isAnchor: false,
    },
    {
      id: 'pln' as ProductCategory,
      label: 'Token PLN',
      sublabel: 'Listrik Prabayar & Pasca',
      icon: Zap,
      isAnchor: false,
    },
    {
      id: 'game' as ProductCategory,
      label: 'Voucher Game',
      sublabel: 'Top Up Kilat 24 Jam',
      icon: Gamepad2,
      isAnchor: false,
    },
  ];

  return (
    <section className="my-6" id="quick-action-section">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold tracking-tight text-neutral-900">
          Layanan Utama
        </h3>
        <span className="text-xs text-neutral-400 font-medium">Transaksi Instan</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.id}
              onClick={() => onSelectCategory(act.id)}
              className={`relative flex flex-col justify-between p-4 rounded-2xl text-left transition-all duration-150 cursor-pointer focus:outline-hidden group ${
                act.isAnchor
                  ? 'bg-[#0B1220] text-white border border-neutral-800 shadow-xs hover:bg-neutral-900'
                  : 'bg-white text-neutral-900 border border-neutral-200/80 hover:border-neutral-900 hover:shadow-xs'
              }`}
              id={`btn-quick-${act.id}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-transform group-hover:scale-105 ${
                    act.isAnchor
                      ? 'bg-neutral-800/80 text-white border-neutral-700'
                      : 'bg-neutral-100 text-neutral-900 border-neutral-200/80'
                  }`}
                >
                  <Icon className="w-5 h-5 stroke-[2.2]" />
                </div>
                <ArrowUpRight
                  className={`w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                    act.isAnchor ? 'text-neutral-400' : 'text-neutral-300 group-hover:text-neutral-900'
                  }`}
                />
              </div>

              <div>
                <span className={`block text-sm font-bold tracking-tight ${act.isAnchor ? 'text-white' : 'text-neutral-900'}`}>
                  {act.label}
                </span>
                <span className={`block text-[11px] mt-0.5 line-clamp-1 ${act.isAnchor ? 'text-neutral-400 font-normal' : 'text-neutral-500 font-normal'}`}>
                  {act.sublabel}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};

