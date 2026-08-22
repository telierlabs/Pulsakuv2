import { Transaction, FavoriteTarget, NotificationItem } from '../types';

const STORAGE_KEYS = {
  TRANSACTIONS: 'pulsaku_transactions_v1',
  FAVORITES: 'pulsaku_favorites_v1',
  NOTIFICATIONS: 'pulsaku_notifications_v1',
  RECENT_TARGETS: 'pulsaku_recent_targets_v1',
  APP_PREFERENCES: 'pulsaku_preferences_v1',
  USER_PROFILE: 'pulsaku_user_profile_v1'
};

export interface UserProfile {
  name: string;
  phone: string;
  email: string;
  memberTier: 'Silver Member' | 'Gold Member' | 'Platinum VIP';
  balance: number;
  points: number;
  isVerified: boolean;
  avatarUrl?: string;
  joinDate: string;
  pin?: string;
}

const DEFAULT_PROFILE: UserProfile = {
  name: 'Muhamad Rivaldy',
  phone: '081234567890',
  email: 'muhamadrivaldy@sman5cirebon.sch.id',
  memberTier: 'Gold Member',
  balance: 350000,
  points: 1250,
  isVerified: true,
  joinDate: 'Januari 2024'
};

// Initial sample data if storage is empty
const INITIAL_FAVORITES: FavoriteTarget[] = [
  {
    id: 'fav-1',
    type: 'phone',
    label: 'Nomor Utama',
    targetValue: '081234567890',
    provider: 'telkomsel',
    category: 'pulsa',
    createdAt: new Date().toISOString()
  },
  {
    id: 'fav-2',
    type: 'pln',
    label: 'Listrik Rumah',
    targetValue: '32145678901',
    provider: 'pln',
    category: 'pln',
    createdAt: new Date().toISOString()
  }
];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'promo',
    title: 'Selamat Datang di Pulsaku',
    message: 'Nikmati kemudahan transaksi pulsa, paket data, PLN, dan voucher game tanpa login.',
    date: new Date(Date.now() - 3600000).toISOString(),
    isRead: false
  },
  {
    id: 'notif-2',
    type: 'promo',
    title: 'Diskon Flash Kuota Bulanan',
    message: 'Dapatkan potongan harga untuk paket data Telkomsel & Indosat pilihan hari ini.',
    date: new Date(Date.now() - 86400000).toISOString(),
    isRead: true,
    categoryTarget: 'kuota'
  }
];

function notifyStorageChange(key: string) {
  window.dispatchEvent(new CustomEvent('pulsaku_storage_update', { detail: { key } }));
}

// ----------------- TRANSACTIONS -----------------

export function getStoredTransactions(): Transaction[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read transactions:', e);
    return [];
  }
}

export function saveTransaction(transaction: Transaction): void {
  try {
    const current = getStoredTransactions();
    const existingIndex = current.findIndex(t => t.transactionId === transaction.transactionId);
    let updated: Transaction[];
    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = transaction;
    } else {
      updated = [transaction, ...current];
    }
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(updated));
    notifyStorageChange(STORAGE_KEYS.TRANSACTIONS);
    
    // Save to recent targets
    saveRecentTarget({
      targetValue: transaction.destination,
      secondaryValue: transaction.secondaryDestination,
      provider: transaction.provider,
      category: transaction.category,
      name: transaction.productName
    });
  } catch (e) {
    console.error('Failed to save transaction:', e);
  }
}

export function getTransactionById(id: string): Transaction | null {
  const all = getStoredTransactions();
  return all.find(t => t.transactionId === id) || null;
}

// ----------------- FAVORITES -----------------

export function getStoredFavorites(): FavoriteTarget[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(INITIAL_FAVORITES));
      return INITIAL_FAVORITES;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_FAVORITES;
  }
}

export function saveFavorite(fav: Omit<FavoriteTarget, 'id' | 'createdAt'>): FavoriteTarget {
  const current = getStoredFavorites();
  const newFav: FavoriteTarget = {
    ...fav,
    id: 'fav_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    createdAt: new Date().toISOString()
  };
  const updated = [newFav, ...current];
  localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updated));
  notifyStorageChange(STORAGE_KEYS.FAVORITES);
  return newFav;
}

export function removeFavorite(id: string): void {
  const current = getStoredFavorites();
  const updated = current.filter(f => f.id !== id);
  localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updated));
  notifyStorageChange(STORAGE_KEYS.FAVORITES);
}

// ----------------- RECENT TARGETS -----------------

export interface RecentTarget {
  targetValue: string;
  secondaryValue?: string;
  provider: string;
  category: string;
  name: string;
  lastUsed?: string;
}

export function getRecentTargets(): RecentTarget[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RECENT_TARGETS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

export function saveRecentTarget(target: Omit<RecentTarget, 'lastUsed'>): void {
  try {
    const current = getRecentTargets();
    const filtered = current.filter(r => r.targetValue !== target.targetValue);
    const updated = [
      { ...target, lastUsed: new Date().toISOString() },
      ...filtered
    ].slice(0, 5); // Keep last 5
    localStorage.setItem(STORAGE_KEYS.RECENT_TARGETS, JSON.stringify(updated));
    notifyStorageChange(STORAGE_KEYS.RECENT_TARGETS);
  } catch (e) {
    console.error('Failed to save recent target:', e);
  }
}

// ----------------- NOTIFICATIONS -----------------

export function getStoredNotifications(): NotificationItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
      return INITIAL_NOTIFICATIONS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_NOTIFICATIONS;
  }
}

export function markNotificationAsRead(id: string): void {
  const current = getStoredNotifications();
  const updated = current.map(n => n.id === id ? { ...n, isRead: true } : n);
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
  notifyStorageChange(STORAGE_KEYS.NOTIFICATIONS);
}

export function markAllNotificationsAsRead(): void {
  const current = getStoredNotifications();
  const updated = current.map(n => ({ ...n, isRead: true }));
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
  notifyStorageChange(STORAGE_KEYS.NOTIFICATIONS);
}

export function addNotification(notif: Omit<NotificationItem, 'id' | 'date'>): void {
  const current = getStoredNotifications();
  const newNotif: NotificationItem = {
    ...notif,
    id: 'notif_' + Date.now(),
    date: new Date().toISOString()
  };
  const updated = [newNotif, ...current];
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
  notifyStorageChange(STORAGE_KEYS.NOTIFICATIONS);
}

// ----------------- APP PREFERENCES -----------------

export interface AppPreferences {
  hapticFeedback: boolean;
  autoCopyToken: boolean;
  saveRecentNumbers: boolean;
  deviceId: string;
}

export function getAppPreferences(): AppPreferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.APP_PREFERENCES);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  
  const defaultPrefs: AppPreferences = {
    hapticFeedback: true,
    autoCopyToken: true,
    saveRecentNumbers: true,
    deviceId: 'PLK-' + Math.random().toString(36).substring(2, 8).toUpperCase()
  };
  localStorage.setItem(STORAGE_KEYS.APP_PREFERENCES, JSON.stringify(defaultPrefs));
  return defaultPrefs;
}

export function updateAppPreferences(prefs: Partial<AppPreferences>): AppPreferences {
  const current = getAppPreferences();
  const updated = { ...current, ...prefs };
  localStorage.setItem(STORAGE_KEYS.APP_PREFERENCES, JSON.stringify(updated));
  return updated;
}

// ----------------- USER PROFILE -----------------

export function getUserProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse user profile:', e);
  }
  localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(DEFAULT_PROFILE));
  return DEFAULT_PROFILE;
}

export function updateUserProfile(profile: Partial<UserProfile>): UserProfile {
  const current = getUserProfile();
  const updated = { ...current, ...profile };
  localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(updated));
  notifyStorageChange(STORAGE_KEYS.USER_PROFILE);
  return updated;
}

