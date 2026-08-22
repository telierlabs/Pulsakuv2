import React, { useMemo } from 'react';
import { BannerCarousel } from '../components/home/BannerCarousel';
import { CategoryShortcuts } from '../components/home/CategoryShortcuts';
import { SendToLovedOnesCard } from '../components/home/SendToLovedOnesCard';
import { WidePromoCarousel } from '../components/home/WidePromoCarousel';
import { ProductScrollRow } from '../components/home/ProductScrollRow';
import { GameBannerShowcase } from '../components/home/GameBannerShowcase';
import { QuickRebuy } from '../components/home/QuickRebuy';
import { TrustSection } from '../components/home/TrustSection';
import { ProductCategory, Product, AppActiveTab } from '../types';
import { ALL_PRODUCTS, KUOTA_PRODUCTS } from '../data/mockData';
import { RecentTarget } from '../services/storage';

interface HomeViewProps {
  onSelectCategory: (category: ProductCategory) => void;
  onNavigateTab?: (tab: AppActiveTab) => void;
  onSelectProduct: (product: Product, destination?: string) => void;
  onSendGift: (type: 'data' | 'pulsa') => void;
  recentTargets: RecentTarget[];
  onSelectRecentTarget: (target: RecentTarget) => void;
  onOpenSearch?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onSelectCategory,
  onSelectProduct,
  onSendGift,
  recentTargets,
  onSelectRecentTarget
}) => {
  // 1. "Pasti Murah" products (Selected best value flash & low-cost items)
  const pastiMurahProducts = useMemo(() => {
    const list: Product[] = [];
    const p1 = ALL_PRODUCTS.find(p => p.id === 'kuota-isat-5gb-3d');
    const p2 = ALL_PRODUCTS.find(p => p.id === 'pulsa-telkomsel-10000');
    const p3 = ALL_PRODUCTS.find(p => p.id === 'kuota-tsel-3gb-3d');
    const p4 = ALL_PRODUCTS.find(p => p.id === 'pln-token-20k');
    const p5 = ALL_PRODUCTS.find(p => p.id === 'kuota-tri-10gb-7d');

    if (p1) list.push(p1);
    if (p2) list.push(p2);
    if (p3) list.push(p3);
    if (p4) list.push(p4);
    if (p5) list.push(p5);

    // Fallback if specific IDs differ
    if (list.length < 5) {
      const others = ALL_PRODUCTS.filter(p => p.price <= 25000 && !list.includes(p)).slice(0, 5 - list.length);
      list.push(...others);
    }
    return list;
  }, []);

  // 2. "Unlimited & Bulanan" products
  const unlimitedProducts = useMemo(() => {
    const list: Product[] = [];
    const u1 = KUOTA_PRODUCTS.find(p => p.id === 'kuota-tsel-unlimited-30d');
    const u2 = KUOTA_PRODUCTS.find(p => p.id === 'kuota-isat-unlimited-30d');
    const u3 = KUOTA_PRODUCTS.find(p => p.id === 'kuota-xl-unlimited-30d');
    const u4 = KUOTA_PRODUCTS.find(p => p.id === 'kuota-smart-unlimited-30d');
    const u5 = KUOTA_PRODUCTS.find(p => p.id === 'kuota-tri-50gb-30d');

    if (u1) list.push(u1);
    if (u2) list.push(u2);
    if (u3) list.push(u3);
    if (u4) list.push(u4);
    if (u5) list.push(u5);

    if (list.length < 5) {
      const fallback = KUOTA_PRODUCTS.filter(p => p.quotaCategory === 'unlimited' || p.quotaCategory === 'bulanan').slice(0, 5);
      return fallback;
    }
    return list;
  }, []);

  return (
    <div className="space-y-7 animate-in fade-in duration-200" id="home-view">
      {/* 1. Large Hero Banner at the very top */}
      <BannerCarousel onSelectCategory={onSelectCategory} />

      {/* 2. Layanan Utama (Quick Action Shortcuts) */}
      <CategoryShortcuts onSelectCategory={onSelectCategory} />

      {/* 3. Fitur Kirim Orang Terdekat (2 Pill Buttons: Kirim Data & Kirim Pulsa) */}
      <SendToLovedOnesCard onSendGift={onSendGift} />

      {/* 4. Section "Pasti Murah" (Horizontal swipeable cards 1-5 + 6th "Lihat Semua") */}
      <ProductScrollRow
        sectionId="pasti-murah-section"
        badge="Flash Promo"
        title="Pasti Murah Hari Ini"
        subtitle="Paket data hemat & pulsa harga terbaik tanpa biaya admin"
        products={pastiMurahProducts}
        onSelectProduct={(prod) => onSelectProduct(prod)}
        onViewAll={() => onSelectCategory('kuota')}
        viewAllLabel="Lihat Semua Murah"
        viewAllCategory="Paket Data"
      />

      {/* 5. Banner Gede 16:9 (6 Iklan Promosi Pulsaku yang bisa digeser kanan-kiri) */}
      <WidePromoCarousel onSelectCategory={onSelectCategory} />

      {/* 6. Section "Paket Unlimited & Bulanan" (Horizontal swipeable cards 1-5 + 6th "Lihat Semua") */}
      <ProductScrollRow
        sectionId="unlimited-section"
        badge="Akses 30 Hari"
        title="Paket Unlimited & Bulanan"
        subtitle="Internet tanpa batasan kuota untuk sosmed, streaming & kerja"
        products={unlimitedProducts}
        onSelectProduct={(prod) => onSelectProduct(prod)}
        onViewAll={() => onSelectCategory('kuota')}
        viewAllLabel="Lihat Semua Unlimited"
        viewAllCategory="Paket Bulanan"
      />

      {/* 7. Gamer Showcase Banner Gede (Warna Blue Navy + SVG Stik Game + Kartu Game Interaktif) */}
      <GameBannerShowcase
        onSelectCategory={onSelectCategory}
        onSelectProduct={(prod) => onSelectProduct(prod)}
      />

      {/* 8. Re-buy / Last Numbers (Personalization without login) */}
      <QuickRebuy
        recentTargets={recentTargets}
        onSelectTarget={onSelectRecentTarget}
      />

      {/* 9. Trust & Service Info */}
      <TrustSection />

      {/* 10. Desktop Footer note */}
      <footer className="pt-8 pb-12 text-center text-xs text-neutral-400 border-t border-neutral-200/80 hidden md:block">
        <p className="font-bold text-neutral-700">Pulsaku &copy; {new Date().getFullYear()} • Platform Pembayaran Digital Terpercaya</p>
        <p className="text-[11px] text-neutral-400 mt-1">
          Bebas Biaya Admin QRIS • Otomatis 24 Jam • Terhubung Jalur Resmi Operator
        </p>
      </footer>
    </div>
  );
};
