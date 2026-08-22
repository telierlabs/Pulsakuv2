import React from 'react';
import { Home, ShoppingBag, Receipt, Bookmark, User } from 'lucide-react';
import { AppActiveTab } from '../../types';

interface BottomNavProps {
  activeTab: AppActiveTab;
  onNavigate: (tab: AppActiveTab) => void;
  unreadCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onNavigate
}) => {
  const navItems = [
    { id: 'home' as AppActiveTab, label: 'Beranda', icon: Home },
    { id: 'products' as AppActiveTab, label: 'Produk', icon: ShoppingBag },
    { id: 'history' as AppActiveTab, label: 'Riwayat', icon: Receipt },
    { id: 'favorites' as AppActiveTab, label: 'Favorit', icon: Bookmark },
    { id: 'settings' as AppActiveTab, label: 'Akun', icon: User },
  ];

  return (
    <nav 
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-neutral-200/80 safe-area-pb"
      id="mobile-bottom-navigation"
    >
      <div className="flex items-center justify-around h-15 max-w-lg mx-auto px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex-1 flex flex-col items-center justify-center h-full py-1 min-h-[48px] transition-colors relative focus:outline-hidden cursor-pointer ${
                isActive ? 'text-neutral-950 font-bold' : 'text-neutral-500 hover:text-neutral-800'
              }`}
              id={`btn-nav-${item.id}`}
            >
              <div className="relative flex items-center justify-center">
                <Icon className={`w-5 h-5 transition-all ${isActive ? 'scale-105 stroke-[2.4] text-neutral-950' : 'stroke-[1.7] text-neutral-500'}`} />
                {isActive && (
                  <span className="absolute -bottom-1.5 w-1.5 h-1.5 rounded-full bg-neutral-950" />
                )}
              </div>
              <span className={`text-[10px] mt-1 tracking-tight ${isActive ? 'text-neutral-950 font-bold' : 'text-neutral-500 font-normal'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
