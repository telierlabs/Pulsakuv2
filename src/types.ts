export type ProductCategory = 'pulsa' | 'kuota' | 'pln' | 'game' | 'etoll' | 'pdam';

export type ProviderId = 
  | 'telkomsel' 
  | 'indosat' 
  | 'xl' 
  | 'axis' 
  | 'tri' 
  | 'smartfren' 
  | 'pln' 
  | 'mlbb' 
  | 'ff' 
  | 'pubgm' 
  | 'genshin' 
  | 'valorant';

export interface ProviderInfo {
  id: ProviderId;
  name: string;
  category: ProductCategory;
  prefixes?: string[];
  color: string;
  badgeLabel?: string;
}

export type RequiredFieldType = 'phone' | 'meter_no' | 'user_zone_id' | 'player_id' | 'riot_id';

export interface Product {
  id: string;
  category: ProductCategory;
  provider: ProviderId;
  name: string;
  description: string;
  denomination: number; // e.g. 10000 for 10k pulsa
  price: number;
  adminFee: number;
  active: boolean;
  isPopular?: boolean;
  quotaAmount?: string; // e.g. "10 GB"
  validityDays?: number; // e.g. 30
  quotaCategory?: 'harian' | 'mingguan' | 'bulanan' | 'unlimited';
  gameCurrencyName?: string; // e.g. "Diamonds", "UC", "VP"
  requiredFields: RequiredFieldType;
  metadata?: Record<string, string | number | boolean>;
}

export type PaymentMethodId = 'qris' | 'dana' | 'bca_va' | 'mandiri_va' | 'gopay';

export interface PaymentMethod {
  id: PaymentMethodId;
  name: string;
  description: string;
  iconType: string;
  adminFee: number;
  badge?: string;
  isActive: boolean;
}

export type TransactionStatus = 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED' | 'EXPIRED';

export interface Transaction {
  transactionId: string;
  productId: string;
  category: ProductCategory;
  provider: ProviderId;
  providerName: string;
  productName: string;
  productDescription?: string;
  destination: string;
  secondaryDestination?: string; // e.g. Zone ID for MLBB
  customerName?: string; // e.g. for PLN simulation
  amount: number;
  adminFee: number;
  total: number;
  paymentMethod: PaymentMethodId;
  paymentMethodName: string;
  status: TransactionStatus;
  serialNumber?: string;
  tokenPLN?: string;
  kwhPLN?: string;
  failureReason?: string;
  createdAt: string; // ISO string
  updatedAt: string;
}

export interface FavoriteTarget {
  id: string;
  type: 'phone' | 'pln' | 'game';
  label: string;
  targetValue: string;
  secondaryValue?: string;
  provider: ProviderId;
  category: ProductCategory;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  type: 'transaction' | 'promo' | 'system';
  title: string;
  message: string;
  date: string;
  isRead: boolean;
  transactionId?: string;
  categoryTarget?: ProductCategory;
}

export interface PromoBanner {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  ctaText: string;
  targetCategory: ProductCategory;
  targetProvider?: ProviderId;
  accentColor: string;
}

export interface FAQItem {
  id: string;
  category: 'transaksi' | 'pembayaran' | 'produk' | 'umum';
  question: string;
  answer: string;
}

export type AppActiveTab = 'home' | 'products' | 'history' | 'favorites' | 'help' | 'settings';
