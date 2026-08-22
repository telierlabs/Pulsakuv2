import { 
  Product, 
  ProviderInfo, 
  ProviderId, 
  PaymentMethod, 
  PromoBanner, 
  FAQItem 
} from '../types';

export const PROVIDERS: ProviderInfo[] = [
  {
    id: 'telkomsel',
    name: 'Telkomsel',
    category: 'pulsa',
    prefixes: ['0811', '0812', '0813', '0821', '0822', '0823', '0851', '0852', '0853'],
    color: '#E11D48',
    badgeLabel: 'Telkomsel'
  },
  {
    id: 'indosat',
    name: 'Indosat Ooredoo',
    category: 'pulsa',
    prefixes: ['0814', '0815', '0816', '0855', '0856', '0857', '0858'],
    color: '#EAB308',
    badgeLabel: 'IM3'
  },
  {
    id: 'xl',
    name: 'XL Axiata',
    category: 'pulsa',
    prefixes: ['0817', '0818', '0819', '0859', '0877', '0878'],
    color: '#2563EB',
    badgeLabel: 'XL'
  },
  {
    id: 'axis',
    name: 'AXIS',
    category: 'pulsa',
    prefixes: ['0831', '0832', '0833', '0838'],
    color: '#9333EA',
    badgeLabel: 'AXIS'
  },
  {
    id: 'tri',
    name: 'Tri (3)',
    category: 'pulsa',
    prefixes: ['0895', '0896', '0897', '0898', '0899'],
    color: '#EA580C',
    badgeLabel: 'Three'
  },
  {
    id: 'smartfren',
    name: 'Smartfren',
    category: 'pulsa',
    prefixes: ['0881', '0882', '0883', '0884', '0885', '0886', '0887', '0888', '0889'],
    color: '#DB2777',
    badgeLabel: 'Smartfren'
  },
  {
    id: 'pln',
    name: 'PLN Nusantara',
    category: 'pln',
    color: '#0284C7',
    badgeLabel: 'PLN'
  },
  {
    id: 'mlbb',
    name: 'Mobile Legends',
    category: 'game',
    color: '#4F46E5',
    badgeLabel: 'Moonton'
  },
  {
    id: 'ff',
    name: 'Free Fire',
    category: 'game',
    color: '#D97706',
    badgeLabel: 'Garena'
  },
  {
    id: 'pubgm',
    name: 'PUBG Mobile',
    category: 'game',
    color: '#059669',
    badgeLabel: 'Level Infinite'
  },
  {
    id: 'genshin',
    name: 'Genshin Impact',
    category: 'game',
    color: '#7C3AED',
    badgeLabel: 'HoYoverse'
  },
  {
    id: 'valorant',
    name: 'Valorant',
    category: 'game',
    color: '#DC2626',
    badgeLabel: 'Riot Games'
  }
];

export function detectProviderFromPhone(phone: string): ProviderInfo | null {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  if (cleanPhone.length < 4) return null;

  let prefix = cleanPhone.substring(0, 4);
  if (cleanPhone.startsWith('62')) {
    prefix = '0' + cleanPhone.substring(2, 5);
  }

  for (const prov of PROVIDERS) {
    if (prov.prefixes && prov.prefixes.some(p => prefix.startsWith(p) || cleanPhone.startsWith(p))) {
      return prov;
    }
  }

  return null;
}

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'qris',
    name: 'QRIS',
    description: 'Semua E-Wallet & Mobile Banking',
    iconType: 'qris',
    adminFee: 0,
    badge: 'Bebas Biaya Admin',
    isActive: true
  },
  {
    id: 'dana',
    name: 'DANA',
    description: 'Bayar instan via akun DANA',
    iconType: 'dana',
    adminFee: 0,
    badge: 'Instan',
    isActive: true
  },
  {
    id: 'gopay',
    name: 'GoPay',
    description: 'Bayar via aplikasi GoPay/Gojek',
    iconType: 'gopay',
    adminFee: 0,
    isActive: true
  },
  {
    id: 'bca_va',
    name: 'BCA Virtual Account',
    description: 'Otomatis terverifikasi 24 jam',
    iconType: 'bca',
    adminFee: 1000,
    isActive: true
  },
  {
    id: 'mandiri_va',
    name: 'Mandiri Virtual Account',
    description: 'Otomatis terverifikasi 24 jam',
    iconType: 'mandiri',
    adminFee: 1000,
    isActive: true
  }
];

export const PROMO_BANNERS: PromoBanner[] = [
  {
    id: 'banner-1',
    title: 'Flash Sale Kuota Bulanan',
    subtitle: 'Diskon hingga 20% untuk paket Telkomsel & Indosat pilihan',
    tag: 'PROMO SPESIAL',
    ctaText: 'Lihat Paket',
    targetCategory: 'kuota',
    accentColor: 'from-blue-900 to-indigo-950'
  },
  {
    id: 'banner-2',
    title: 'Bebas Biaya Admin QRIS',
    subtitle: 'Semua transaksi pulsa dan token PLN 0 Rupiah biaya admin',
    tag: 'HEMAT',
    ctaText: 'Isi Pulsa',
    targetCategory: 'pulsa',
    accentColor: 'from-slate-900 to-zinc-900'
  },
  {
    id: 'banner-3',
    title: 'Top Up Game Kilat 24 Jam',
    subtitle: 'Diamond MLBB & Free Fire masuk dalam hitungan detik',
    tag: 'INSTAN',
    ctaText: 'Beli Voucher',
    targetCategory: 'game',
    accentColor: 'from-neutral-900 to-stone-900'
  }
];

export const PROMO_BANNERS_16_9: PromoBanner[] = [
  {
    id: 'ad-qris',
    title: 'QRIS Bebas Biaya Admin Rp 0',
    subtitle: 'Bayar via BCA Mobile, BRImo, DANA, GoPay, OVO, ShopeePay tanpa biaya admin sepeser pun.',
    tag: 'HEMAT 100%',
    ctaText: 'Isi Pulsa Sekarang',
    targetCategory: 'pulsa',
    accentColor: '#0B1220'
  },
  {
    id: 'ad-instant',
    title: 'Garansi Kilat 5 Detik Masuk',
    subtitle: 'Sistem multi-server otomasi terhubung langsung ke operator seluler 24 jam nonstop tanpa antrean.',
    tag: 'REAL-TIME 24/7',
    ctaText: 'Beli Paket Data',
    targetCategory: 'kuota',
    accentColor: '#0B1220'
  },
  {
    id: 'ad-flash-kuota',
    title: 'Flash Sale Kuota Bulanan',
    subtitle: 'Paket internet Telkomsel 15GB, Indosat 25GB, XL 20GB harga spesial termurah se-Indonesia.',
    tag: 'PROMO SPESIAL',
    ctaText: 'Lihat Promo Kuota',
    targetCategory: 'kuota',
    accentColor: '#0B1220'
  },
  {
    id: 'ad-pln',
    title: 'Token Listrik PLN 24 Jam Anti Delay',
    subtitle: '20 Digit nomor token langsung terbit instan di layar dan tersimpan otomatis di struk transaksi.',
    tag: 'LISTRIK PRABAYAR',
    ctaText: 'Beli Token PLN',
    targetCategory: 'pln',
    accentColor: '#0B1220'
  },
  {
    id: 'ad-game',
    title: 'Top Up Game MLBB & Free Fire Termurah',
    subtitle: 'Diamond Mobile Legends & Free Fire 100% legal, langsung masuk ke akun User ID dalam hitungan detik.',
    tag: 'VOUCHER GAME',
    ctaText: 'Top Up Game',
    targetCategory: 'game',
    accentColor: '#0B1220'
  },
  {
    id: 'ad-favorit',
    title: 'Simpan Kontak Favorit 1-Klik Beli',
    subtitle: 'Tandai nomor HP keluarga, meteran PLN rumah, dan akun game agar transaksi berikutnya instan.',
    tag: 'FITUR PRAKTIS',
    ctaText: 'Mulai Transaksi',
    targetCategory: 'pulsa',
    accentColor: '#0B1220'
  }
];

// Base Denominations for Pulsa
const PULSA_DENOMINATIONS = [
  { denom: 5000, price: 6000 },
  { denom: 10000, price: 11000, popular: true },
  { denom: 15000, price: 16000 },
  { denom: 20000, price: 20800 },
  { denom: 25000, price: 25750, popular: true },
  { denom: 30000, price: 30800 },
  { denom: 50000, price: 50500, popular: true },
  { denom: 100000, price: 99500, popular: true },
  { denom: 150000, price: 149000 },
  { denom: 200000, price: 198000 },
  { denom: 300000, price: 297000 },
  { denom: 500000, price: 495000 }
];

const TELCO_PROVIDERS: ProviderId[] = ['telkomsel', 'indosat', 'xl', 'axis', 'tri', 'smartfren'];

// Generate Pulsa Products
const generatePulsaProducts = (): Product[] => {
  const products: Product[] = [];
  for (const prov of TELCO_PROVIDERS) {
    const provInfo = PROVIDERS.find(p => p.id === prov)!;
    for (const d of PULSA_DENOMINATIONS) {
      const denomK = d.denom >= 1000 ? `${d.denom / 1000}K` : `${d.denom}`;
      products.push({
        id: `pulsa-${prov}-${d.denom}`,
        category: 'pulsa',
        provider: prov,
        name: `Pulsa ${provInfo.name} ${denomK}`,
        description: `Masa aktif pulsa bertambah sesuai ketentuan ${provInfo.name}`,
        denomination: d.denom,
        price: d.price,
        adminFee: 0,
        active: true,
        isPopular: d.popular || false,
        requiredFields: 'phone'
      });
    }
  }
  return products;
};

// Data Kuota Products
export const KUOTA_PRODUCTS: Product[] = [
  // Telkomsel
  {
    id: 'kuota-tsel-3gb-3d',
    category: 'kuota',
    provider: 'telkomsel',
    name: 'Internet Harian 3GB',
    description: '3GB Kuota Utama (24 Jam) • Semua Jaringan',
    denomination: 3,
    price: 15000,
    adminFee: 0,
    active: true,
    quotaAmount: '3 GB',
    validityDays: 3,
    quotaCategory: 'harian',
    requiredFields: 'phone'
  },
  {
    id: 'kuota-tsel-10gb-7d',
    category: 'kuota',
    provider: 'telkomsel',
    name: 'Internet Mingguan 10GB',
    description: '10GB Kuota Utama • Masa aktif 7 hari • Akses 24 Jam',
    denomination: 10,
    price: 28000,
    adminFee: 0,
    active: true,
    isPopular: true,
    quotaAmount: '10 GB',
    validityDays: 7,
    quotaCategory: 'mingguan',
    requiredFields: 'phone'
  },
  {
    id: 'kuota-tsel-15gb-30d',
    category: 'kuota',
    provider: 'telkomsel',
    name: 'Internet Bulanan 15GB',
    description: '15GB Kuota Utama (Semua Jaringan 4G/5G) + Bebas Nelpon',
    denomination: 15,
    price: 49000,
    adminFee: 0,
    active: true,
    isPopular: true,
    quotaAmount: '15 GB',
    validityDays: 30,
    quotaCategory: 'bulanan',
    requiredFields: 'phone'
  },
  {
    id: 'kuota-tsel-35gb-30d',
    category: 'kuota',
    provider: 'telkomsel',
    name: 'Internet Max 35GB',
    description: '25GB Kuota Nasional + 10GB Kuota Nonton & Chat',
    denomination: 35,
    price: 85000,
    adminFee: 0,
    active: true,
    quotaAmount: '35 GB',
    validityDays: 30,
    quotaCategory: 'bulanan',
    requiredFields: 'phone'
  },
  {
    id: 'kuota-tsel-unlimited-30d',
    category: 'kuota',
    provider: 'telkomsel',
    name: 'Unlimited Nonstop 50GB',
    description: '50GB FUP Utama + Kecepatan stabil untuk apps sosmed',
    denomination: 50,
    price: 115000,
    adminFee: 0,
    active: true,
    quotaAmount: '50 GB',
    validityDays: 30,
    quotaCategory: 'unlimited',
    requiredFields: 'phone'
  },

  // Indosat
  {
    id: 'kuota-isat-5gb-3d',
    category: 'kuota',
    provider: 'indosat',
    name: 'Freedom Harian 5GB',
    description: '5GB Kuota Utama 24 Jam • 3 Hari',
    denomination: 5,
    price: 14000,
    adminFee: 0,
    active: true,
    quotaAmount: '5 GB',
    validityDays: 3,
    quotaCategory: 'harian',
    requiredFields: 'phone'
  },
  {
    id: 'kuota-isat-12gb-7d',
    category: 'kuota',
    provider: 'indosat',
    name: 'Freedom Mingguan 12GB',
    description: '12GB Kuota Utama • 7 Hari • Pulsa Safe',
    denomination: 12,
    price: 25000,
    adminFee: 0,
    active: true,
    quotaAmount: '12 GB',
    validityDays: 7,
    quotaCategory: 'mingguan',
    requiredFields: 'phone'
  },
  {
    id: 'kuota-isat-25gb-30d',
    category: 'kuota',
    provider: 'indosat',
    name: 'Freedom Internet 25GB',
    description: '25GB Kuota Utama • 30 Hari • 100% Kuota Utama tanpa bagi-bagi',
    denomination: 25,
    price: 52000,
    adminFee: 0,
    active: true,
    isPopular: true,
    quotaAmount: '25 GB',
    validityDays: 30,
    quotaCategory: 'bulanan',
    requiredFields: 'phone'
  },
  {
    id: 'kuota-isat-50gb-30d',
    category: 'kuota',
    provider: 'indosat',
    name: 'Freedom Internet 50GB',
    description: '50GB Kuota Utama • 30 Hari • Bonus Nelpon Sesama',
    denomination: 50,
    price: 89000,
    adminFee: 0,
    active: true,
    quotaAmount: '50 GB',
    validityDays: 30,
    quotaCategory: 'bulanan',
    requiredFields: 'phone'
  },
  {
    id: 'kuota-isat-unlimited-30d',
    category: 'kuota',
    provider: 'indosat',
    name: 'Freedom U Jumbo',
    description: '45GB Kuota Utama + Unlimited Aplikasi Harian',
    denomination: 45,
    price: 125000,
    adminFee: 0,
    active: true,
    quotaAmount: '45 GB',
    validityDays: 30,
    quotaCategory: 'unlimited',
    requiredFields: 'phone'
  },

  // XL
  {
    id: 'kuota-xl-8gb-7d',
    category: 'kuota',
    provider: 'xl',
    name: 'Xtra Combo Flex 8GB',
    description: '8GB Kuota Utama + Bonus Flex Mingguan',
    denomination: 8,
    price: 24000,
    adminFee: 0,
    active: true,
    quotaAmount: '8 GB',
    validityDays: 7,
    quotaCategory: 'mingguan',
    requiredFields: 'phone'
  },
  {
    id: 'kuota-xl-20gb-30d',
    category: 'kuota',
    provider: 'xl',
    name: 'Xtra Combo Flex 20GB',
    description: '20GB Kuota Utama • 30 Hari • Bonus Vidio/YouTube',
    denomination: 20,
    price: 55000,
    adminFee: 0,
    active: true,
    isPopular: true,
    quotaAmount: '20 GB',
    validityDays: 30,
    quotaCategory: 'bulanan',
    requiredFields: 'phone'
  },
  {
    id: 'kuota-xl-40gb-30d',
    category: 'kuota',
    provider: 'xl',
    name: 'Xtra Combo Flex 40GB',
    description: '40GB Kuota Utama • 30 Hari • Nelpon Bebas',
    denomination: 40,
    price: 88000,
    adminFee: 0,
    active: true,
    quotaAmount: '40 GB',
    validityDays: 30,
    quotaCategory: 'bulanan',
    requiredFields: 'phone'
  },
  {
    id: 'kuota-xl-unlimited-30d',
    category: 'kuota',
    provider: 'xl',
    name: 'Xtra Unlimited Turbo',
    description: '30GB Kuota Utama + Unlimited Sosmed & Chat',
    denomination: 30,
    price: 99000,
    adminFee: 0,
    active: true,
    quotaAmount: '30 GB',
    validityDays: 30,
    quotaCategory: 'unlimited',
    requiredFields: 'phone'
  },

  // AXIS
  {
    id: 'kuota-axis-5gb-5d',
    category: 'kuota',
    provider: 'axis',
    name: 'Bronet 24 Jam 5GB',
    description: '5GB Kuota Utama • 5 Hari • Bebas Akses',
    denomination: 5,
    price: 13500,
    adminFee: 0,
    active: true,
    quotaAmount: '5 GB',
    validityDays: 5,
    quotaCategory: 'harian',
    requiredFields: 'phone'
  },
  {
    id: 'kuota-axis-15gb-30d',
    category: 'kuota',
    provider: 'axis',
    name: 'Bronet Kuota 15GB',
    description: '15GB Kuota Utama 24 Jam • 30 Hari',
    denomination: 15,
    price: 39500,
    adminFee: 0,
    active: true,
    isPopular: true,
    quotaAmount: '15 GB',
    validityDays: 30,
    quotaCategory: 'bulanan',
    requiredFields: 'phone'
  },
  {
    id: 'kuota-axis-30gb-30d',
    category: 'kuota',
    provider: 'axis',
    name: 'Bronet Kuota 30GB',
    description: '30GB Kuota Utama • 30 Hari • Bonus Suka-Suka',
    denomination: 30,
    price: 69000,
    adminFee: 0,
    active: true,
    quotaAmount: '30 GB',
    validityDays: 30,
    quotaCategory: 'bulanan',
    requiredFields: 'phone'
  },

  // Tri
  {
    id: 'kuota-tri-10gb-7d',
    category: 'kuota',
    provider: 'tri',
    name: 'Tri Happy 10GB',
    description: '10GB Kuota Utama • 7 Hari • 100% Kuota Regular',
    denomination: 10,
    price: 22000,
    adminFee: 0,
    active: true,
    quotaAmount: '10 GB',
    validityDays: 7,
    quotaCategory: 'mingguan',
    requiredFields: 'phone'
  },
  {
    id: 'kuota-tri-25gb-30d',
    category: 'kuota',
    provider: 'tri',
    name: 'Tri Happy 25GB',
    description: '25GB Kuota Utama • 30 Hari • 24 Jam',
    denomination: 25,
    price: 48000,
    adminFee: 0,
    active: true,
    isPopular: true,
    quotaAmount: '25 GB',
    validityDays: 30,
    quotaCategory: 'bulanan',
    requiredFields: 'phone'
  },
  {
    id: 'kuota-tri-50gb-30d',
    category: 'kuota',
    provider: 'tri',
    name: 'Tri AON 50GB',
    description: '50GB Kuota Utama • Masa aktif mengikuti kartu',
    denomination: 50,
    price: 85000,
    adminFee: 0,
    active: true,
    quotaAmount: '50 GB',
    validityDays: 30,
    quotaCategory: 'bulanan',
    requiredFields: 'phone'
  },

  // Smartfren
  {
    id: 'kuota-smart-15gb-14d',
    category: 'kuota',
    provider: 'smartfren',
    name: 'Kuota Nonstop 15GB',
    description: '15GB Kuota Utama • 14 Hari • Akses Apps Berlanjut',
    denomination: 15,
    price: 32000,
    adminFee: 0,
    active: true,
    quotaAmount: '15 GB',
    validityDays: 14,
    quotaCategory: 'mingguan',
    requiredFields: 'phone'
  },
  {
    id: 'kuota-smart-30gb-30d',
    category: 'kuota',
    provider: 'smartfren',
    name: 'Kuota Nonstop 30GB',
    description: '30GB Kuota Utama • 30 Hari • Nelpon HD Sesama',
    denomination: 30,
    price: 59000,
    adminFee: 0,
    active: true,
    isPopular: true,
    quotaAmount: '30 GB',
    validityDays: 30,
    quotaCategory: 'bulanan',
    requiredFields: 'phone'
  },
  {
    id: 'kuota-smart-unlimited-30d',
    category: 'kuota',
    provider: 'smartfren',
    name: 'Unlimited Harian 2GB/Hari',
    description: 'FUP 2GB/Hari • 30 Hari • Bebas Internetan 24 Jam',
    denomination: 60,
    price: 79000,
    adminFee: 0,
    active: true,
    quotaAmount: '60 GB',
    validityDays: 30,
    quotaCategory: 'unlimited',
    requiredFields: 'phone'
  }
];

// PLN Products
export const PLN_PRODUCTS: Product[] = [
  {
    id: 'pln-token-20k',
    category: 'pln',
    provider: 'pln',
    name: 'Token PLN 20.000',
    description: 'Token listrik prabayar 20 Ribu',
    denomination: 20000,
    price: 20500,
    adminFee: 0,
    active: true,
    isPopular: true,
    requiredFields: 'meter_no'
  },
  {
    id: 'pln-token-50k',
    category: 'pln',
    provider: 'pln',
    name: 'Token PLN 50.000',
    description: 'Token listrik prabayar 50 Ribu',
    denomination: 50000,
    price: 50500,
    adminFee: 0,
    active: true,
    isPopular: true,
    requiredFields: 'meter_no'
  },
  {
    id: 'pln-token-100k',
    category: 'pln',
    provider: 'pln',
    name: 'Token PLN 100.000',
    description: 'Token listrik prabayar 100 Ribu',
    denomination: 10000,
    price: 100500,
    adminFee: 0,
    active: true,
    isPopular: true,
    requiredFields: 'meter_no'
  },
  {
    id: 'pln-token-200k',
    category: 'pln',
    provider: 'pln',
    name: 'Token PLN 200.000',
    description: 'Token listrik prabayar 200 Ribu',
    denomination: 200000,
    price: 200500,
    adminFee: 0,
    active: true,
    requiredFields: 'meter_no'
  },
  {
    id: 'pln-token-500k',
    category: 'pln',
    provider: 'pln',
    name: 'Token PLN 500.000',
    description: 'Token listrik prabayar 500 Ribu',
    denomination: 500000,
    price: 500500,
    adminFee: 0,
    active: true,
    requiredFields: 'meter_no'
  },
  {
    id: 'pln-token-1000k',
    category: 'pln',
    provider: 'pln',
    name: 'Token PLN 1.000.000',
    description: 'Token listrik prabayar 1 Juta',
    denomination: 1000000,
    price: 1000500,
    adminFee: 0,
    active: true,
    requiredFields: 'meter_no'
  }
];

// Game Voucher Products
export const GAME_PRODUCTS: Product[] = [
  // Mobile Legends
  {
    id: 'game-mlbb-86',
    category: 'game',
    provider: 'mlbb',
    name: '86 Diamonds',
    description: 'Mobile Legends: Bang Bang',
    denomination: 86,
    price: 21500,
    adminFee: 0,
    active: true,
    isPopular: true,
    gameCurrencyName: 'Diamonds',
    requiredFields: 'user_zone_id'
  },
  {
    id: 'game-mlbb-172',
    category: 'game',
    provider: 'mlbb',
    name: '172 Diamonds',
    description: 'Mobile Legends: Bang Bang',
    denomination: 172,
    price: 42500,
    adminFee: 0,
    active: true,
    gameCurrencyName: 'Diamonds',
    requiredFields: 'user_zone_id'
  },
  {
    id: 'game-mlbb-257',
    category: 'game',
    provider: 'mlbb',
    name: '257 Diamonds',
    description: 'Mobile Legends: Bang Bang',
    denomination: 257,
    price: 63500,
    adminFee: 0,
    active: true,
    isPopular: true,
    gameCurrencyName: 'Diamonds',
    requiredFields: 'user_zone_id'
  },
  {
    id: 'game-mlbb-weekly-pass',
    category: 'game',
    provider: 'mlbb',
    name: 'Weekly Diamond Pass',
    description: 'Total 220 Diamonds + 70 Starlight Points',
    denomination: 1,
    price: 27500,
    adminFee: 0,
    active: true,
    isPopular: true,
    gameCurrencyName: 'Pass',
    requiredFields: 'user_zone_id'
  },
  {
    id: 'game-mlbb-706',
    category: 'game',
    provider: 'mlbb',
    name: '706 Diamonds',
    description: 'Mobile Legends: Bang Bang',
    denomination: 706,
    price: 170000,
    adminFee: 0,
    active: true,
    gameCurrencyName: 'Diamonds',
    requiredFields: 'user_zone_id'
  },

  // Free Fire
  {
    id: 'game-ff-70',
    category: 'game',
    provider: 'ff',
    name: '70 Diamonds',
    description: 'Garena Free Fire',
    denomination: 70,
    price: 9500,
    adminFee: 0,
    active: true,
    isPopular: true,
    gameCurrencyName: 'Diamonds',
    requiredFields: 'player_id'
  },
  {
    id: 'game-ff-140',
    category: 'game',
    provider: 'ff',
    name: '140 Diamonds',
    description: 'Garena Free Fire',
    denomination: 140,
    price: 19000,
    adminFee: 0,
    active: true,
    gameCurrencyName: 'Diamonds',
    requiredFields: 'player_id'
  },
  {
    id: 'game-ff-355',
    category: 'game',
    provider: 'ff',
    name: '355 Diamonds',
    description: 'Garena Free Fire',
    denomination: 355,
    price: 47500,
    adminFee: 0,
    active: true,
    isPopular: true,
    gameCurrencyName: 'Diamonds',
    requiredFields: 'player_id'
  },
  {
    id: 'game-ff-720',
    category: 'game',
    provider: 'ff',
    name: '720 Diamonds',
    description: 'Garena Free Fire',
    denomination: 720,
    price: 95000,
    adminFee: 0,
    active: true,
    gameCurrencyName: 'Diamonds',
    requiredFields: 'player_id'
  },

  // PUBG Mobile
  {
    id: 'game-pubgm-60',
    category: 'game',
    provider: 'pubgm',
    name: '60 Unknown Cash (UC)',
    description: 'PUBG Mobile Global',
    denomination: 60,
    price: 14000,
    adminFee: 0,
    active: true,
    gameCurrencyName: 'UC',
    requiredFields: 'player_id'
  },
  {
    id: 'game-pubgm-325',
    category: 'game',
    provider: 'pubgm',
    name: '325 Unknown Cash (UC)',
    description: 'PUBG Mobile Global',
    denomination: 325,
    price: 72000,
    adminFee: 0,
    active: true,
    isPopular: true,
    gameCurrencyName: 'UC',
    requiredFields: 'player_id'
  },
  {
    id: 'game-pubgm-660',
    category: 'game',
    provider: 'pubgm',
    name: '660 Unknown Cash (UC)',
    description: 'PUBG Mobile Global',
    denomination: 660,
    price: 145000,
    adminFee: 0,
    active: true,
    gameCurrencyName: 'UC',
    requiredFields: 'player_id'
  },

  // Genshin Impact
  {
    id: 'game-genshin-welkin',
    category: 'game',
    provider: 'genshin',
    name: 'Blessing of the Welkin Moon',
    description: '300 Genesis Crystals + 90 Primogems/hari (30 Hari)',
    denomination: 1,
    price: 78000,
    adminFee: 0,
    active: true,
    isPopular: true,
    gameCurrencyName: 'Welkin',
    requiredFields: 'user_zone_id'
  },
  {
    id: 'game-genshin-300',
    category: 'game',
    provider: 'genshin',
    name: '300 + 30 Genesis Crystals',
    description: 'Genshin Impact Server Asia/America/Europe',
    denomination: 330,
    price: 78000,
    adminFee: 0,
    active: true,
    gameCurrencyName: 'Genesis Crystals',
    requiredFields: 'user_zone_id'
  },

  // Valorant
  {
    id: 'game-val-475',
    category: 'game',
    provider: 'valorant',
    name: '475 Valorant Points (VP)',
    description: 'Riot Games Valorant Indonesia/SEA',
    denomination: 475,
    price: 52000,
    adminFee: 0,
    active: true,
    gameCurrencyName: 'VP',
    requiredFields: 'riot_id'
  },
  {
    id: 'game-val-1000',
    category: 'game',
    provider: 'valorant',
    name: '1000 Valorant Points (VP)',
    description: 'Riot Games Valorant Indonesia/SEA',
    denomination: 1000,
    price: 105000,
    adminFee: 0,
    active: true,
    isPopular: true,
    gameCurrencyName: 'VP',
    requiredFields: 'riot_id'
  }
];

export const ALL_PRODUCTS: Product[] = [
  ...generatePulsaProducts(),
  ...KUOTA_PRODUCTS,
  ...PLN_PRODUCTS,
  ...GAME_PRODUCTS
];

export const INITIAL_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'transaksi',
    question: 'Berapa lama proses pengisian pulsa atau kuota?',
    answer: 'Transaksi diproses secara otomatis oleh sistem dalam waktu 5-60 detik setelah pembayaran terverifikasi.'
  },
  {
    id: 'faq-2',
    category: 'transaksi',
    question: 'Bagaimana jika saldo belum masuk setelah pembayaran?',
    answer: 'Jika dalam 5 menit transaksi belum berhasil, silakan periksa status di menu Riwayat atau hubungi Layanan Bantuan dengan menyertakan ID Transaksi.'
  },
  {
    id: 'faq-3',
    category: 'pembayaran',
    question: 'Apakah pembayaran dengan QRIS dikenakan biaya admin?',
    answer: 'Pembayaran melalui QRIS di Pulsaku 100% bebas biaya admin tambahan (Rp 0).'
  },
  {
    id: 'faq-4',
    category: 'pembayaran',
    question: 'Metode pembayaran apa saja yang tersedia?',
    answer: 'Pulsaku mendukung QRIS (DANA, GoPay, OVO, ShopeePay, LinkAja, BCA Mobile, Livin by Mandiri, BRImo, dll) dan DANA Direct.'
  },
  {
    id: 'faq-5',
    category: 'produk',
    question: 'Di mana saya bisa melihat kode 20 digit Token PLN?',
    answer: 'Kode 20 digit token PLN akan langsung tampil di layar sukses transaksi dan tersimpan permanen di struk menu Riwayat.'
  },
  {
    id: 'faq-6',
    category: 'umum',
    question: 'Apakah saya wajib mendaftar akun untuk bertransaksi?',
    answer: 'Tidak. Pulsaku dirancang tanpa login wajib agar Anda bisa bertransaksi dengan instan kapan saja tanpa hambatan pendaftaran.'
  }
];
