import React, { useState, useEffect } from 'react';
import { 
  User, 
  ShieldCheck, 
  CreditCard, 
  Bell, 
  Sliders, 
  HelpCircle, 
  ChevronRight, 
  CheckCircle2, 
  Key, 
  Smartphone, 
  Trash2, 
  FileText, 
  Lock, 
  Info, 
  X, 
  Wallet, 
  Award, 
  QrCode, 
  Check, 
  Plus, 
  Edit3, 
  MessageCircle,
  Clock,
  ArrowUpRight,
  Fingerprint
} from 'lucide-react';
import { 
  getUserProfile, 
  updateUserProfile, 
  UserProfile, 
  getStoredNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead, 
  getAppPreferences, 
  updateAppPreferences, 
  AppPreferences 
} from '../services/storage';
import { NotificationItem, ProductCategory } from '../types';
import { formatRupiah, formatDateIndo } from '../utils/formatters';
import { Badge } from '../components/common/Badge';
import { useToast } from '../components/common/Toast';

interface SettingsViewProps {
  onSelectCategory?: (cat: ProductCategory) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onSelectCategory }) => {
  const [profile, setProfile] = useState<UserProfile>(getUserProfile());
  const [preferences, setPreferences] = useState<AppPreferences>(getAppPreferences());
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  
  // Modals
  const [isEditProfileOpen, setIsEditProfileOpen] = useState<boolean>(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState<boolean>(false);
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState<boolean>(false);
  const [isNotifModalOpen, setIsNotifModalOpen] = useState<boolean>(false);
  const [isPaymentMethodsOpen, setIsPaymentMethodsOpen] = useState<boolean>(false);
  const [legalModalContent, setLegalModalContent] = useState<{ title: string; body: string } | null>(null);

  // Form states
  const [editName, setEditName] = useState(profile.name);
  const [editPhone, setEditPhone] = useState(profile.phone);
  const [editEmail, setEditEmail] = useState(profile.email);
  const [pinInput, setPinInput] = useState('');
  const [topUpAmount, setTopUpAmount] = useState<number>(50000);

  const { showToast } = useToast();

  const loadData = () => {
    setProfile(getUserProfile());
    setPreferences(getAppPreferences());
    setNotifications(getStoredNotifications());
  };

  useEffect(() => {
    loadData();
    const handleStorage = () => loadData();
    window.addEventListener('pulsaku_storage_update', handleStorage);
    return () => window.removeEventListener('pulsaku_storage_update', handleStorage);
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      showToast('Nama tidak boleh kosong', 'error');
      return;
    }
    const updated = updateUserProfile({
      name: editName.trim(),
      phone: editPhone.trim(),
      email: editEmail.trim()
    });
    setProfile(updated);
    setIsEditProfileOpen(false);
    showToast('Profil akun berhasil diperbarui', 'success');
  };

  const handleSavePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.length !== 6 || isNaN(Number(pinInput))) {
      showToast('PIN harus berupa 6 digit angka', 'error');
      return;
    }
    updateUserProfile({ pin: pinInput });
    setPinInput('');
    setIsPinModalOpen(false);
    showToast('PIN transaksi berhasil disimpan', 'success');
  };

  const handleTopUpBalance = () => {
    const newBal = profile.balance + topUpAmount;
    updateUserProfile({ balance: newBal });
    setProfile(prev => ({ ...prev, balance: newBal }));
    setIsTopUpModalOpen(false);
    showToast(`Top up ${formatRupiah(topUpAmount)} berhasil ditambahkan`, 'success');
  };

  const handleTogglePref = (key: keyof AppPreferences) => {
    const updated = updateAppPreferences({ [key]: !preferences[key] });
    setPreferences(updated);
    showToast('Preferensi diperbarui', 'info');
  };

  const handleClearCache = () => {
    if (window.confirm('Hapus seluruh data cache lokal aplikasi (riwayat & favorit)?')) {
      localStorage.clear();
      showToast('Cache aplikasi berhasil dibersihkan', 'info');
      setTimeout(() => window.location.reload(), 300);
    }
  };

  const unreadNotifsCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="max-w-4xl mx-auto space-y-5 animate-in fade-in duration-200 pb-16" id="account-view">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
          Akun Saya
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
          Informasi profil, saldo dompet, keamanan akun & pengaturan aplikasi
        </p>
      </div>

      {/* 1. USER PROFILE CARD */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-neutral-200/90 shadow-2xs relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className="relative shrink-0">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-black text-xl flex items-center justify-center shadow-xs">
              {profile.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
            </div>
            {profile.isVerified && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center ring-2 ring-white" title="Akun Terverifikasi">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
            )}
          </div>

          <div className="min-w-0 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-black text-neutral-900 truncate">
                {profile.name}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-black uppercase tracking-wider">
                {profile.memberTier}
              </span>
            </div>
            <p className="text-xs font-semibold text-neutral-600 truncate">
              {profile.phone} • {profile.email}
            </p>
            <p className="text-[11px] text-neutral-400">
              Bergabung sejak {profile.joinDate}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setEditName(profile.name);
            setEditPhone(profile.phone);
            setEditEmail(profile.email);
            setIsEditProfileOpen(true);
          }}
          className="px-4 py-2 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer self-start sm:self-center shrink-0"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit Profil</span>
        </button>
      </div>

      {/* 2. WALLET & REWARD POINTS CARD */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Saldo Dompet */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-neutral-200/90 shadow-2xs flex flex-col justify-between gap-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block">
                  Saldo Akun Pulsaku
                </span>
                <div className="text-lg sm:text-xl font-black text-neutral-900">
                  {formatRupiah(profile.balance)}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-neutral-100">
            <button
              onClick={() => setIsTopUpModalOpen(true)}
              className="flex-1 py-1.5 px-3 rounded-xl bg-[#0B1220] hover:bg-blue-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Isi Saldo</span>
            </button>
            <button
              onClick={() => showToast('Fitur penarikan saldo tersedia untuk akun terverifikasi', 'info')}
              className="flex-1 py-1.5 px-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Tarik Saldo</span>
            </button>
          </div>
        </div>

        {/* Poin Reward */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-neutral-200/90 shadow-2xs flex flex-col justify-between gap-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block">
                  Poin Reward Pulsaku
                </span>
                <div className="text-lg sm:text-xl font-black text-neutral-900">
                  {profile.points.toLocaleString('id-ID')} <span className="text-xs font-bold text-neutral-500">Poin</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-xs">
            <span className="text-neutral-500 font-medium">Tukar voucher diskon 5k</span>
            <button
              onClick={() => showToast('Voucher diskon 5K berhasil ditukar!', 'success')}
              className="font-bold text-blue-600 hover:underline cursor-pointer"
            >
              Tukar Poin
            </button>
          </div>
        </div>
      </div>

      {/* 3. GROUPED ACCOUNT MENUS */}
      <div className="space-y-4">
        {/* Keamanan Akun */}
        <div className="space-y-2">
          <h3 className="text-xs font-black uppercase tracking-wider text-neutral-400 px-1">
            Keamanan & Akses Akun
          </h3>
          <div className="rounded-3xl bg-white border border-neutral-200/80 overflow-hidden divide-y divide-neutral-100 shadow-2xs">
            <button
              onClick={() => setIsPinModalOpen(true)}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-neutral-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-700">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs sm:text-sm font-bold text-neutral-900 block">
                    PIN Transaksi 6-Digit
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    {profile.pin ? 'PIN telah aktif' : 'Atur PIN untuk proteksi pembayaran'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={profile.pin ? 'success' : 'neutral'} size="sm">
                  {profile.pin ? 'Aktif' : 'Belum Diatur'}
                </Badge>
                <ChevronRight className="w-4 h-4 text-neutral-400" />
              </div>
            </button>

            <label className="w-full p-4 flex items-center justify-between text-left hover:bg-neutral-50 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-700">
                  <Fingerprint className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs sm:text-sm font-bold text-neutral-900 block">
                    Autentikasi Biometrik / Face ID
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    Konfirmasi pembayaran cepat dengan sensor sidik jari
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={preferences.hapticFeedback}
                onChange={() => handleTogglePref('hapticFeedback')}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-neutral-300 cursor-pointer"
              />
            </label>

            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-700">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs sm:text-sm font-bold text-neutral-900 block">
                    ID Sesi Perangkat
                  </span>
                  <span className="font-mono text-[11px] text-neutral-500">
                    {preferences.deviceId}
                  </span>
                </div>
              </div>
              <Badge variant="primary" size="sm">
                Perangkat Utama
              </Badge>
            </div>
          </div>
        </div>

        {/* Notifikasi & Pemberitahuan */}
        <div className="space-y-2">
          <h3 className="text-xs font-black uppercase tracking-wider text-neutral-400 px-1">
            Pemberitahuan & Pesan
          </h3>
          <div className="rounded-3xl bg-white border border-neutral-200/80 overflow-hidden divide-y divide-neutral-100 shadow-2xs">
            <button
              onClick={() => setIsNotifModalOpen(true)}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-neutral-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs sm:text-sm font-bold text-neutral-900 block">
                    Kotak Masuk Notifikasi
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    Lihat promo khusus & status riwayat transaksi
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {unreadNotifsCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-black">
                    {unreadNotifsCount} Baru
                  </span>
                )}
                <ChevronRight className="w-4 h-4 text-neutral-400" />
              </div>
            </button>

            <button
              onClick={() => setIsPaymentMethodsOpen(true)}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-neutral-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs sm:text-sm font-bold text-neutral-900 block">
                    Metode Pembayaran Tersimpan
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    QRIS Bebas Admin, DANA, GoPay & Bank Virtual Account
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-400" />
            </button>
          </div>
        </div>

        {/* Pengaturan Aplikasi */}
        <div className="space-y-2">
          <h3 className="text-xs font-black uppercase tracking-wider text-neutral-400 px-1">
            Preferensi Aplikasi
          </h3>
          <div className="rounded-3xl bg-white border border-neutral-200/80 p-4 space-y-3.5 shadow-2xs">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="text-xs sm:text-sm font-bold text-neutral-900 block">
                  Salin Otomatis Token PLN
                </span>
                <span className="text-xs text-neutral-500">
                  Otomatis salin 20 digit token sesaat setelah transaksi sukses
                </span>
              </div>
              <input
                type="checkbox"
                checked={preferences.autoCopyToken}
                onChange={() => handleTogglePref('autoCopyToken')}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-neutral-300 cursor-pointer"
              />
            </label>

            <div className="border-t border-neutral-100" />

            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="text-xs sm:text-sm font-bold text-neutral-900 block">
                  Simpan Riwayat Nomor Terakhir
                </span>
                <span className="text-xs text-neutral-500">
                  Tampilkan pintasan "Beli Lagi" di halaman utama
                </span>
              </div>
              <input
                type="checkbox"
                checked={preferences.saveRecentNumbers}
                onChange={() => handleTogglePref('saveRecentNumbers')}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-neutral-300 cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Legal & Bantuan */}
        <div className="space-y-2">
          <h3 className="text-xs font-black uppercase tracking-wider text-neutral-400 px-1">
            Pusat Bantuan & Legal
          </h3>
          <div className="rounded-3xl bg-white border border-neutral-200/80 overflow-hidden divide-y divide-neutral-100 shadow-2xs">
            <a
              href="https://wa.me/6281234567890?text=Halo%20Admin%20Pulsaku,%20saya%20butuh%20bantuan%20transaksi"
              target="_blank"
              rel="noreferrer"
              className="w-full p-4 flex items-center justify-between text-left hover:bg-neutral-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs sm:text-sm font-bold text-neutral-900 block">
                    Customer Support 24/7 (WhatsApp)
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    Bantuan kendala pengisian & transaksi kilat
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-400" />
            </a>

            <button
              onClick={() => setLegalModalContent({
                title: 'Syarat & Ketentuan Layanan',
                body: '1. Pulsaku adalah platform aggregator pembelian produk digital prabayar resmi.\n2. Pembeli bertanggung jawab penuh atas kebenaran nomor/ID tujuan yang dimasukkan.\n3. Transaksi yang telah dinyatakan berhasil oleh server operator tidak dapat dibatalkan.\n4. Seluruh keluhan jaringan diproses dalam SLA maksimal 1x24 jam.'
              })}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-neutral-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-neutral-100 text-neutral-700 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-neutral-800">Syarat & Ketentuan</span>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-400" />
            </button>

            <button
              onClick={() => setLegalModalContent({
                title: 'Kebijakan Privasi',
                body: '1. Kami menghormati privasi Anda. Data profil dan riwayat disimpan secara terenkripsi pada browser lokal Anda.\n2. Nomor handphone yang Anda masukkan hanya digunakan untuk keperluan pengisian paket produk operator seluler.\n3. Kami tidak memperjualbelikan data kontak kepada pihak ketiga mana pun.'
              })}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-neutral-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-neutral-100 text-neutral-700 flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-neutral-800">Kebijakan Privasi</span>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-400" />
            </button>

            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-neutral-100 text-neutral-700 flex items-center justify-center">
                  <Info className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-neutral-800">Versi Aplikasi</span>
              </div>
              <span className="text-xs font-mono font-bold text-neutral-400">v2.4.0 (Production)</span>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="p-4 sm:p-5 rounded-3xl bg-rose-50/60 border border-rose-200/80 flex items-center justify-between">
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-rose-950">Bersihkan Data & Cache</h4>
            <p className="text-[11px] text-rose-700">Hapus seluruh riwayat nomor dan reset pengaturan lokal</p>
          </div>
          <button
            onClick={handleClearCache}
            className="px-3.5 py-1.5 rounded-2xl bg-white border border-rose-300 text-rose-700 text-xs font-bold hover:bg-rose-100 transition-colors cursor-pointer"
          >
            Reset Data
          </button>
        </div>
      </div>

      {/* MODAL 1: EDIT PROFILE */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="p-4 sm:p-5 border-b border-neutral-100 flex items-center justify-between">
              <h3 className="text-sm sm:text-base font-black text-neutral-900">Edit Profil Akun</h3>
              <button onClick={() => setIsEditProfileOpen(false)} className="p-1 rounded-full text-neutral-400 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveProfile} className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-700">Nama Lengkap</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-2xl border border-neutral-200 text-sm font-semibold focus:outline-hidden focus:border-neutral-900"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-700">Nomor Handphone</label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-2xl border border-neutral-200 text-sm font-semibold focus:outline-hidden focus:border-neutral-900"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-700">Alamat Email</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-2xl border border-neutral-200 text-sm font-semibold focus:outline-hidden focus:border-neutral-900"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  className="px-4 py-2 rounded-2xl text-neutral-600 text-xs font-bold hover:bg-neutral-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-2xl bg-[#0B1220] text-white text-xs font-bold hover:bg-neutral-800"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CHANGE PIN */}
      {isPinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="p-4 sm:p-5 border-b border-neutral-100 flex items-center justify-between">
              <h3 className="text-sm sm:text-base font-black text-neutral-900">Atur PIN Transaksi</h3>
              <button onClick={() => setIsPinModalOpen(false)} className="p-1 rounded-full text-neutral-400 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSavePin} className="p-5 space-y-4">
              <p className="text-xs text-neutral-500 leading-relaxed">
                PIN 6-digit digunakan untuk mengamankan transaksi pembayaran bernilai besar.
              </p>
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-700">Masukkan 6 Digit PIN</label>
                <input
                  type="password"
                  maxLength={6}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="******"
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-neutral-200 text-center font-mono text-xl tracking-widest font-black focus:outline-hidden focus:border-neutral-900"
                  required
                />
              </div>
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPinModalOpen(false)}
                  className="px-4 py-2 rounded-2xl text-neutral-600 text-xs font-bold hover:bg-neutral-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-2xl bg-[#0B1220] text-white text-xs font-bold hover:bg-neutral-800"
                >
                  Simpan PIN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: TOP UP SALDO */}
      {isTopUpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="p-4 sm:p-5 border-b border-neutral-100 flex items-center justify-between">
              <h3 className="text-sm sm:text-base font-black text-neutral-900">Isi Saldo Akun</h3>
              <button onClick={() => setIsTopUpModalOpen(false)} className="p-1 rounded-full text-neutral-400 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-3 gap-2">
                {[20000, 50000, 100000, 200000, 500000, 1000000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setTopUpAmount(amt)}
                    className={`p-3 rounded-2xl text-xs font-bold border transition-all cursor-pointer ${
                      topUpAmount === amt
                        ? 'bg-[#0B1220] text-white border-[#0B1220]'
                        : 'bg-neutral-50 text-neutral-800 border-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    {formatRupiah(amt)}
                  </button>
                ))}
              </div>
              <div className="p-3 bg-blue-50/70 rounded-2xl border border-blue-100 text-xs text-blue-900">
                💡 Saldo dapat digunakan untuk transaksi otomatis tanpa biaya admin.
              </div>
              <button
                onClick={handleTopUpBalance}
                className="w-full py-2.5 rounded-2xl bg-[#0B1220] text-white text-xs font-bold hover:bg-neutral-800"
              >
                Konfirmasi Top Up {formatRupiah(topUpAmount)}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: NOTIFICATIONS SHEET */}
      {isNotifModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-200">
            <div className="p-4 sm:p-5 border-b border-neutral-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-neutral-900">Kotak Masuk Notifikasi</h3>
                {unreadNotifsCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-black">
                    {unreadNotifsCount} Baru
                  </span>
                )}
              </div>
              <button onClick={() => setIsNotifModalOpen(false)} className="p-1 rounded-full text-neutral-400 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-2.5 flex-1 min-h-[260px]">
              {notifications.length === 0 ? (
                <div className="py-12 text-center text-neutral-400">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs font-bold">Tidak ada notifikasi</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      markNotificationAsRead(n.id);
                      if (n.categoryTarget && onSelectCategory) {
                        onSelectCategory(n.categoryTarget);
                        setIsNotifModalOpen(false);
                      }
                    }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      n.isRead ? 'bg-white border-neutral-200 text-neutral-700' : 'bg-blue-50/50 border-blue-200 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-neutral-900">{n.title}</h4>
                      <Badge size="sm" variant={n.type === 'transaction' ? 'success' : 'primary'}>
                        {n.type.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-xs text-neutral-600 mt-1 leading-relaxed">{n.message}</p>
                    <span className="text-[10px] text-neutral-400 block pt-1.5">{formatDateIndo(n.date)}</span>
                  </div>
                ))
              )}
            </div>

            <div className="p-3 border-t border-neutral-100 bg-neutral-50 flex items-center justify-between">
              <button
                onClick={() => {
                  markAllNotificationsAsRead();
                  setNotifications(getStoredNotifications());
                  showToast('Semua notifikasi ditandai telah dibaca', 'info');
                }}
                className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
              >
                Tandai Semua Dibaca
              </button>
              <button
                onClick={() => setIsNotifModalOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-neutral-900 text-white text-xs font-bold cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: PAYMENT METHODS */}
      {isPaymentMethodsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="p-4 sm:p-5 border-b border-neutral-100 flex items-center justify-between">
              <h3 className="text-sm sm:text-base font-black text-neutral-900">Metode Pembayaran</h3>
              <button onClick={() => setIsPaymentMethodsOpen(false)} className="p-1 rounded-full text-neutral-400 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-3">
              {[
                { name: 'QRIS Nasional', desc: 'BCA, Mandiri, BRI, DANA, GoPay, OVO', badge: 'Bebas Admin' },
                { name: 'DANA Direct Link', desc: 'Terhubung ke akun 0812****7890', badge: 'Aktif' },
                { name: 'GoPay & ShopeePay', desc: 'Instan scan & 1-klik bayar', badge: 'Aktif' }
              ].map((m, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-neutral-900">{m.name}</h4>
                    <p className="text-[11px] text-neutral-500 mt-0.5">{m.desc}</p>
                  </div>
                  <Badge variant="success" size="sm">{m.badge}</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: LEGAL CONTENT */}
      {legalModalContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-200">
            <div className="p-4 sm:p-5 border-b border-neutral-100 flex items-center justify-between">
              <h3 className="text-sm sm:text-base font-black text-neutral-900">{legalModalContent.title}</h3>
              <button onClick={() => setLegalModalContent(null)} className="p-1 rounded-full text-neutral-400 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 overflow-y-auto text-xs text-neutral-600 leading-relaxed whitespace-pre-line">
              {legalModalContent.body}
            </div>
            <div className="p-3 border-t border-neutral-100 bg-neutral-50 flex justify-end">
              <button
                onClick={() => setLegalModalContent(null)}
                className="px-4 py-2 bg-neutral-900 text-white text-xs font-bold rounded-2xl cursor-pointer"
              >
                Mengerti
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
