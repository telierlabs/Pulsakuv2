import React from 'react';
import { ProviderId } from '../../types';
import { Smartphone, Zap, Gamepad2, Radio } from 'lucide-react';

interface ProviderIconProps {
  provider: ProviderId | string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ProviderIcon: React.FC<ProviderIconProps> = ({ 
  provider, 
  size = 'md',
  className = '' 
}) => {
  const dim = size === 'sm' ? 'w-7 h-7 text-[10px]' : size === 'lg' ? 'w-11 h-11 text-xs' : 'w-9 h-9 text-xs';
  const p = provider.toLowerCase();

  const renderContent = () => {
    switch (p) {
      case 'telkomsel':
        return <span className="font-bold tracking-tight text-neutral-900 font-mono">TSEL</span>;
      case 'indosat':
        return <span className="font-bold tracking-tight text-neutral-900 font-mono">IM3</span>;
      case 'xl':
        return <span className="font-bold tracking-tight text-neutral-900 font-mono">XL</span>;
      case 'axis':
        return <span className="font-bold tracking-tight text-neutral-900 font-mono">AXIS</span>;
      case 'tri':
        return <span className="font-bold tracking-tight text-neutral-900 font-mono">TRI</span>;
      case 'smartfren':
        return <span className="font-bold tracking-tight text-neutral-900 font-mono">SF</span>;
      case 'pln':
        return (
          <Zap className={`${size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} text-neutral-900 stroke-[2.5]`} />
        );
      case 'mlbb':
        return <span className="font-bold tracking-tight text-neutral-900 font-mono">MLBB</span>;
      case 'ff':
        return <span className="font-bold tracking-tight text-neutral-900 font-mono">FF</span>;
      case 'pubgm':
        return <span className="font-bold tracking-tight text-neutral-900 font-mono">PUBG</span>;
      case 'genshin':
        return <span className="font-bold tracking-tight text-neutral-900 font-mono">GEN</span>;
      case 'valorant':
        return <span className="font-bold tracking-tight text-neutral-900 font-mono">VAL</span>;
      default:
        return <Radio className={`${size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} text-neutral-900`} />;
    }
  };

  return (
    <div 
      className={`rounded-xl bg-neutral-100/90 text-neutral-900 flex items-center justify-center border border-neutral-200/80 shrink-0 select-none shadow-2xs ${dim} ${className}`}
    >
      {renderContent()}
    </div>
  );
};

