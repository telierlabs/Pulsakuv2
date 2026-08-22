import React from 'react';
import { Home, ShoppingBag, Receipt, Bookmark, HelpCircle, User, Zap } from 'lucide-react';
import { AppActiveTab } from '../../types';
import { BrandLogo } from '../common/BrandLogo';

interface DesktopNavProps {
  activeTab: AppActiveTab;
  onNavigate: (tab: AppActiveTab) => void;
  unreadNotifsCount: number;
}

export const DesktopNav: React.FC<DesktopNavProps> = ({
  activeTab,
  onNavigate,
  unreadNotifsCount
}) => {
  const navItems = [
    { id: 'home' as AppActiveTab, label: 'Beranda', icon: Home },
    { id: 'products' as AppActiveTab, label: 'Semua Produk', icon: ShoppingBag },
    { id: 'history' as AppActiveTab, label: 'Riwayat Transaksi', icon: Receipt },
    { id: 'favorites' as AppActiveTab, label: 'Nomor Favorit', icon: Bookmark },
    { id: 'help' as AppActiveTab, label: 'Pusat Bantuan', icon: HelpCircle },
    { id: 'settings' as AppActiveTab, label: 'Akun Saya', icon: User, count: unreadNotifsCount },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-neutral-200 bg-white min-h-screen p-5 shrink-0 sticky top-0 h-screen overflow-y-auto">
      <div className="mb-8">
        <button onClick={() => onNavigate('home')} className="cursor-pointer focus:outline-hidden">
          <BrandLogo size="lg" showTagline={true} />
        </button>
      </div>

      <div className="space-y-1.5 flex-1">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 px-3 mb-2">
          Menu Utama
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-neutral-900 text-white font-semibold shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/80'
              }`}
              id={`desktop-nav-${item.id}`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-white stroke-[2.2]' : 'text-neutral-500 stroke-[1.8]'}`} />
                <span>{item.label}</span>
              </div>
              {item.count && item.count > 0 ? (
                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${isActive ? 'bg-neutral-800 text-white' : 'bg-neutral-900 text-white'}`}>
                  {item.count}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Trust & Guarantee badge in Desktop sidebar */}
      <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/80 text-xs text-neutral-600 space-y-2 mt-4">
        <div className="flex items-center gap-2 font-semibold text-neutral-800">
          <Zap className="w-4 h-4 text-blue-600 shrink-0" />
          <span>Proses Instan 24 Jam</span>
        </div>
        <p className="text-[11px] text-neutral-500 leading-relaxed">
          Semua transaksi diproses otomatis dalam 5-60 detik tanpa login wajib.
        </p>
      </div>
    </aside>
  );
};
