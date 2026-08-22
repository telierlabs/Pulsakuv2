import React, { useState, useEffect } from 'react';
import { 
  Bookmark, 
  Plus, 
  Trash2, 
  Smartphone, 
  Zap, 
  Gamepad2, 
  ArrowRight, 
  X, 
  Check 
} from 'lucide-react';
import { FavoriteTarget, ProviderId, ProductCategory } from '../types';
import { getStoredFavorites, saveFavorite, removeFavorite } from '../services/storage';
import { PROVIDERS } from '../data/mockData';
import { ProviderIcon } from '../components/common/ProviderIcon';
import { Badge } from '../components/common/Badge';
import { useToast } from '../components/common/Toast';

interface FavoritesViewProps {
  onDirectBuy: (category: ProductCategory, provider: ProviderId, targetValue: string, secondaryValue?: string) => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({ onDirectBuy }) => {
  const [favorites, setFavorites] = useState<FavoriteTarget[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [type, setType] = useState<'phone' | 'pln' | 'game'>('phone');
  const [label, setLabel] = useState('');
  const [targetValue, setTargetValue] = useState('');
  const [secondaryValue, setSecondaryValue] = useState('');
  const [provider, setProvider] = useState<ProviderId>('telkomsel');
  const { showToast } = useToast();

  const loadFavorites = () => {
    setFavorites(getStoredFavorites());
  };

  useEffect(() => {
    loadFavorites();
    const handleStorage = () => loadFavorites();
    window.addEventListener('pulsaku_storage_update', handleStorage);
    return () => window.removeEventListener('pulsaku_storage_update', handleStorage);
  }, []);

  const handleAddFavorite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetValue.trim() || !label.trim()) {
      showToast('Mohon lengkapi label dan nomor tujuan', 'error');
      return;
    }

    const category: ProductCategory = type === 'pln' ? 'pln' : type === 'game' ? 'game' : 'pulsa';

    saveFavorite({
      type,
      label: label.trim(),
      targetValue: targetValue.trim(),
      secondaryValue: secondaryValue.trim() || undefined,
      provider,
      category
    });

    showToast('Nomor favorit berhasil disimpan', 'success');
    setIsAdding(false);
    setLabel('');
    setTargetValue('');
    setSecondaryValue('');
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeFavorite(id);
    showToast('Favorit dihapus', 'info');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5 animate-in fade-in duration-200" id="favorites-view">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-neutral-900">
            Daftar Favorit
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Simpan nomor HP, ID PLN, atau ID game yang sering kamu gunakan
          </p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0B1220] hover:bg-neutral-900 text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah</span>
        </button>
      </div>

      {/* Add Modal */}
      {isAdding && (
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-neutral-200 shadow-2xs space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
            <h3 className="text-sm font-black text-neutral-900">Tambah Favorit Baru</h3>
            <button
              onClick={() => setIsAdding(false)}
              className="p-1 text-neutral-400 hover:text-neutral-900 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Type Switcher */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'phone', label: 'Nomor HP', icon: Smartphone, prov: 'telkomsel' },
              { id: 'pln', label: 'Token PLN', icon: Zap, prov: 'pln' },
              { id: 'game', label: 'Akun Game', icon: Gamepad2, prov: 'mlbb' },
            ].map((t) => {
              const Icon = t.icon;
              const isSelected = type === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setType(t.id as any);
                    setProvider(t.prov as any);
                  }}
                  className={`flex items-center justify-center gap-1.5 p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'border-neutral-900 bg-neutral-900 text-white shadow-2xs'
                      : 'border-neutral-200 bg-neutral-50 text-neutral-600 hover:border-neutral-400'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          <form onSubmit={handleAddFavorite} className="space-y-3">
            <div>
              <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">
                Label / Nama Kontak
              </label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Contoh: Nomor Utama, WiFi Rumah, Akun ML Adik"
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-xs sm:text-sm font-semibold focus:outline-hidden focus:bg-white focus:border-neutral-900"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">
                  {type === 'pln' ? 'No. Meter / ID Pelanggan' : type === 'game' ? 'User ID / Player ID' : 'Nomor Handphone'}
                </label>
                <input
                  type="text"
                  value={targetValue}
                  onChange={(e) => setTargetValue(e.target.value)}
                  placeholder={type === 'pln' ? '32145678901' : '081234567890'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-xs sm:text-sm font-mono font-bold focus:outline-hidden focus:bg-white focus:border-neutral-900"
                  required
                />
              </div>

              {type === 'game' && (
                <div>
                  <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">
                    Zone ID / Server (Opsional)
                  </label>
                  <input
                    type="text"
                    value={secondaryValue}
                    onChange={(e) => setSecondaryValue(e.target.value)}
                    placeholder="2134"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-xs sm:text-sm font-mono font-bold focus:outline-hidden focus:bg-white focus:border-neutral-900"
                  />
                </div>
              )}

              {type === 'phone' && (
                <div>
                  <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">
                    Operator
                  </label>
                  <select
                    value={provider}
                    onChange={(e) => setProvider(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-xs font-bold focus:outline-hidden focus:bg-white focus:border-neutral-900"
                  >
                    {PROVIDERS.filter(p => p.category === 'pulsa').map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {type === 'game' && (
                <div>
                  <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">
                    Game
                  </label>
                  <select
                    value={provider}
                    onChange={(e) => setProvider(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-xs font-bold focus:outline-hidden focus:bg-white focus:border-neutral-900"
                  >
                    {PROVIDERS.filter(p => p.category === 'game').map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3.5 py-2 rounded-xl border border-neutral-200 text-neutral-600 text-xs font-bold hover:bg-neutral-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#0B1220] hover:bg-neutral-900 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Simpan Favorit
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Favorites List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {favorites.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-white rounded-2xl border border-neutral-200/80">
            <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-3 text-neutral-400">
              <Bookmark className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-black text-neutral-800">Belum Ada Favorit</h3>
            <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
              Nomor HP, ID PLN, atau ID game yang sering kamu gunakan akan tersimpan di sini untuk pembelian instan 1-klik.
            </p>
          </div>
        ) : (
          favorites.map((fav) => (
            <div
              key={fav.id}
              onClick={() => onDirectBuy(fav.category, fav.provider, fav.targetValue, fav.secondaryValue)}
              className="p-4 rounded-xl bg-white border border-neutral-200/80 hover:border-neutral-900 hover:shadow-2xs transition-all flex items-center justify-between gap-3 cursor-pointer group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <ProviderIcon provider={fav.provider} size="md" />
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-black text-neutral-900 truncate group-hover:text-neutral-900 transition-colors">
                    {fav.label}
                  </h4>
                  <div className="text-xs font-mono font-medium text-neutral-500 truncate mt-0.5">
                    {fav.targetValue} {fav.secondaryValue && `(${fav.secondaryValue})`}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">{fav.provider.toUpperCase()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={(e) => handleDelete(fav.id, e)}
                  className="p-2 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Hapus"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="p-2 text-neutral-400 group-hover:text-neutral-900 transition-colors">
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
