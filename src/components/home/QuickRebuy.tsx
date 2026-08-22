import React from 'react';
import { RotateCw, ArrowRight, Smartphone, Zap, Gamepad2 } from 'lucide-react';
import { RecentTarget } from '../../services/storage';
import { ProviderIcon } from '../common/ProviderIcon';

interface QuickRebuyProps {
  recentTargets: RecentTarget[];
  onSelectTarget: (target: RecentTarget) => void;
}

export const QuickRebuy: React.FC<QuickRebuyProps> = ({ recentTargets, onSelectTarget }) => {
  if (!recentTargets || recentTargets.length === 0) {
    return null;
  }

  return (
    <section className="mb-6" id="quick-rebuy-section">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold tracking-tight text-neutral-900">
          Beli Ulang Cepat
        </h3>
        <span className="text-xs text-neutral-400 font-medium">Riwayat Tujuan</span>
      </div>

      <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar">
        {recentTargets.map((item, idx) => (
          <button
            key={idx}
            onClick={() => onSelectTarget(item)}
            className="flex items-center gap-3 p-3 rounded-xl bg-white border border-neutral-200/80 hover:border-neutral-900 hover:shadow-xs transition-all text-left shrink-0 min-w-[210px] cursor-pointer focus:outline-hidden group"
          >
            <ProviderIcon provider={item.provider} size="md" />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-neutral-900 truncate">
                {item.name || item.provider.toUpperCase()}
              </div>
              <div className="text-xs font-mono text-neutral-500 truncate">
                {item.targetValue}
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 transition-colors shrink-0" />
          </button>
        ))}
      </div>
    </section>
  );
};
