import React, { useState, useEffect } from 'react';
import { 
  Gamepad2, 
  ArrowLeft, 
  Bookmark, 
  Info 
} from 'lucide-react';
import { Product, ProviderId, FavoriteTarget } from '../types';
import { GAME_PRODUCTS, PROVIDERS } from '../data/mockData';
import { formatRupiah, cleanNumeric } from '../utils/formatters';
import { ProviderIcon } from '../components/common/ProviderIcon';
import { getStoredFavorites } from '../services/storage';

interface GameViewProps {
  onBack: () => void;
  onSelectProduct: (product: Product, destination: string, secondaryDestination?: string) => void;
  initialGame?: ProviderId;
}

export const GameView: React.FC<GameViewProps> = ({
  onBack,
  onSelectProduct,
  initialGame = 'mlbb'
}) => {
  const [selectedGame, setSelectedGame] = useState<ProviderId>(initialGame);
  const [userId, setUserId] = useState('');
  const [zoneId, setZoneId] = useState('');
  const [server, setServer] = useState('Asia');
  const [showFavoritePicker, setShowFavoritePicker] = useState(false);
  const [favorites, setFavorites] = useState<FavoriteTarget[]>([]);

  const games = PROVIDERS.filter(p => p.category === 'game');

  useEffect(() => {
    setFavorites(getStoredFavorites().filter(f => f.type === 'game'));
  }, []);

  const handleSelectFavorite = (fav: FavoriteTarget) => {
    setUserId(fav.targetValue);
    if (fav.secondaryValue) setZoneId(fav.secondaryValue);
    setSelectedGame(fav.provider);
    setShowFavoritePicker(false);
  };

  const gameProducts = GAME_PRODUCTS.filter(p => p.provider === selectedGame);
  const currentGameInfo = PROVIDERS.find(p => p.id === selectedGame)!;

  const isFormValid = () => {
    if (!userId.trim()) return false;
    if (selectedGame === 'mlbb' && !zoneId.trim()) return false;
    return true;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200" id="game-view">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-100 text-neutral-700 transition-colors cursor-pointer"
          aria-label="Kembali"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2]" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
            Voucher & Top Up Game
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Pilih judul game, masukkan ID akun, dan pilih nominal voucher
          </p>
        </div>
      </div>

      {/* Game Selector Chips (Horizontal Scroll / Grid) */}
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2.5">
          Pilih Game
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {games.map((g) => {
            const isSelected = selectedGame === g.id;
            return (
              <button
                key={g.id}
                onClick={() => {
                  setSelectedGame(g.id);
                  setUserId('');
                  setZoneId('');
                }}
                className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-[#0B1220] text-white border-neutral-900 shadow-2xs'
                    : 'bg-white text-neutral-700 border-neutral-200/80 hover:border-neutral-400'
                }`}
              >
                <ProviderIcon provider={g.id} size="sm" />
                <span>{g.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Account Input Form */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            Data Akun {currentGameInfo.name}
          </label>
          {favorites.length > 0 && (
            <button
              onClick={() => setShowFavoritePicker(!showFavoritePicker)}
              className="text-xs font-bold text-neutral-900 hover:text-blue-600 flex items-center gap-1 focus:outline-hidden cursor-pointer"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Favorit Game ({favorites.length})</span>
            </button>
          )}
        </div>

        {showFavoritePicker && (
          <div className="p-2 rounded-xl bg-neutral-50 border border-neutral-200/80 space-y-1 animate-in fade-in">
            <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider px-2 py-1">
              Daftar Favorit Game
            </div>
            {favorites.map((fav) => (
              <button
                key={fav.id}
                onClick={() => handleSelectFavorite(fav)}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white text-left text-xs cursor-pointer"
              >
                <div>
                  <div className="font-bold text-neutral-900">{fav.label}</div>
                  <div className="font-mono text-neutral-500">
                    {fav.targetValue} {fav.secondaryValue && `(${fav.secondaryValue})`}
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-200 text-neutral-700 uppercase">
                  {fav.provider}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Form Inputs based on Game Type */}
        {selectedGame === 'mlbb' ? (
          <div className="grid grid-cols-3 gap-2.5">
            <div className="col-span-2">
              <label className="text-[11px] text-neutral-400 font-semibold mb-1 block">User ID</label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(cleanNumeric(e.target.value))}
                placeholder="Contoh: 12345678"
                className="w-full px-3.5 py-2.5 text-sm font-bold font-mono text-neutral-900 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-neutral-900 focus:outline-hidden"
                id="input-game-userid"
              />
            </div>
            <div>
              <label className="text-[11px] text-neutral-400 font-semibold mb-1 block">Zone ID</label>
              <input
                type="text"
                value={zoneId}
                onChange={(e) => setZoneId(cleanNumeric(e.target.value))}
                placeholder="(2134)"
                maxLength={6}
                className="w-full px-3.5 py-2.5 text-sm font-bold font-mono text-neutral-900 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-neutral-900 focus:outline-hidden"
                id="input-game-zoneid"
              />
            </div>
          </div>
        ) : selectedGame === 'genshin' ? (
          <div className="grid grid-cols-3 gap-2.5">
            <div className="col-span-2">
              <label className="text-[11px] text-neutral-400 font-semibold mb-1 block">UID In-Game</label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(cleanNumeric(e.target.value))}
                placeholder="Contoh: 812345678"
                className="w-full px-3.5 py-2.5 text-sm font-bold font-mono text-neutral-900 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-neutral-900 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="text-[11px] text-neutral-400 font-semibold mb-1 block">Server</label>
              <select
                value={server}
                onChange={(e) => setServer(e.target.value)}
                className="w-full px-3 py-2.5 text-xs font-bold text-neutral-900 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-neutral-900 focus:outline-hidden"
              >
                <option value="Asia">Asia</option>
                <option value="America">America</option>
                <option value="Europe">Europe</option>
                <option value="TW/HK/MO">TW/HK/MO</option>
              </select>
            </div>
          </div>
        ) : (
          <div>
            <label className="text-[11px] text-neutral-400 font-semibold mb-1 block">Player ID / User ID</label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Masukkan ID akun game Anda"
              className="w-full px-3.5 py-2.5 text-sm font-bold font-mono text-neutral-900 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-neutral-900 focus:outline-hidden"
            />
          </div>
        )}

        <p className="text-[11px] text-neutral-400">
          Item game akan langsung ditambahkan otomatis ke akun Anda setelah pembayaran sukses.
        </p>
      </div>

      {/* Denominations Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold tracking-tight text-neutral-900">
            Pilih Item / Nominal {currentGameInfo.name}
          </h3>
          <span className="text-xs text-neutral-400 font-medium">Top Up Kilat 24 Jam</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {gameProducts.map((prod) => (
            <button
              key={prod.id}
              onClick={() => {
                if (!isFormValid()) {
                  const input = document.getElementById('input-game-userid');
                  input?.focus();
                  return;
                }
                const secondary = selectedGame === 'mlbb' ? zoneId : selectedGame === 'genshin' ? server : undefined;
                onSelectProduct(prod, userId, secondary);
              }}
              className="p-3.5 sm:p-4 rounded-xl bg-white border border-neutral-200/80 hover:border-neutral-900 hover:shadow-xs transition-all text-left flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">
                    {prod.gameCurrencyName || 'Item'}
                  </span>
                  {prod.isPopular && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-neutral-100 text-neutral-800">
                      Populer
                    </span>
                  )}
                </div>
                <div className="text-base sm:text-lg font-black text-neutral-900">
                  {prod.name}
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-neutral-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-neutral-400 block font-medium uppercase tracking-wider">Harga</span>
                  <span className="text-xs sm:text-sm font-bold text-neutral-900 font-mono">
                    {formatRupiah(prod.price)}
                  </span>
                </div>
                <span className="px-3 py-1 rounded-lg bg-[#0B1220] group-hover:bg-neutral-900 text-white text-xs font-bold transition-all">
                  Beli
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
