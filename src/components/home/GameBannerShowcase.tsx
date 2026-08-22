import React, { useState, useEffect, useMemo } from 'react';
import { 
  Gamepad2, 
  Flame
} from 'lucide-react';
import { Product, ProductCategory } from '../../types';
import { GAME_PRODUCTS } from '../../data/mockData';
import { formatRupiah } from '../../utils/formatters';
import { ProviderIcon } from '../common/ProviderIcon';

interface GameBannerShowcaseProps {
  onSelectCategory: (category: ProductCategory) => void;
  onSelectProduct: (product: Product) => void;
}

const GAME_NAMES_TYPING = [
  'Mobile Legends',
  'Free Fire',
  'PUBG Mobile',
  'Valorant',
  'Genshin Impact',
  'Honor of Kings'
];

export const GameBannerShowcase: React.FC<GameBannerShowcaseProps> = ({
  onSelectCategory,
  onSelectProduct
}) => {
  const [selectedGameFilter, setSelectedGameFilter] = useState<'all' | 'mlbb' | 'ff' | 'pubgm' | 'genshin' | 'val'>('all');

  // Typewriter effect states
  const [typewriterText, setTypewriterText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopIndex, setLoopIndex] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(120);

  useEffect(() => {
    const currentWord = GAME_NAMES_TYPING[loopIndex % GAME_NAMES_TYPING.length];

    const timer = setTimeout(() => {
      if (!isDeleting) {
        // Typing forward
        setTypewriterText(currentWord.substring(0, typewriterText.length + 1));
        setTypingSpeed(110);

        if (typewriterText === currentWord) {
          // Pause at full word before deleting
          setIsDeleting(true);
          setTypingSpeed(1800);
        }
      } else {
        // Deleting backward
        setTypewriterText(currentWord.substring(0, typewriterText.length - 1));
        setTypingSpeed(60);

        if (typewriterText === '') {
          setIsDeleting(false);
          setLoopIndex((prev) => prev + 1);
          setTypingSpeed(350);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [typewriterText, isDeleting, loopIndex, typingSpeed]);

  const gameFilters = [
    { id: 'all', label: 'Semua Game' },
    { id: 'mlbb', label: 'Mobile Legends' },
    { id: 'ff', label: 'Free Fire' },
    { id: 'pubgm', label: 'PUBG Mobile' },
    { id: 'genshin', label: 'Genshin Impact' },
    { id: 'val', label: 'Valorant' },
  ];

  const filteredProducts = useMemo(() => {
    if (selectedGameFilter === 'all') {
      const list: Product[] = [];
      const m1 = GAME_PRODUCTS.find(p => p.id === 'game-mlbb-weekly-pass');
      const m2 = GAME_PRODUCTS.find(p => p.id === 'game-mlbb-86');
      const f1 = GAME_PRODUCTS.find(p => p.id === 'game-ff-140');
      const f2 = GAME_PRODUCTS.find(p => p.id === 'game-ff-355');
      const p1 = GAME_PRODUCTS.find(p => p.id === 'game-pubgm-60');
      const v1 = GAME_PRODUCTS.find(p => p.id === 'game-val-1000');
      
      if (m1) list.push(m1);
      if (m2) list.push(m2);
      if (f1) list.push(f1);
      if (f2) list.push(f2);
      if (p1) list.push(p1);
      if (v1) list.push(v1);

      if (list.length === 0) return GAME_PRODUCTS.slice(0, 6);
      return list;
    }
    return GAME_PRODUCTS.filter(p => p.provider === selectedGameFilter).slice(0, 6);
  }, [selectedGameFilter]);

  return (
    <section className="my-8" id="game-banner-showcase-section">
      {/* Big Grand Gamer Banner Container - matched with top banner #0B1220 theme */}
      <div className="relative w-full rounded-3xl bg-[#0B1220] text-white overflow-hidden border border-neutral-800 shadow-xl p-6 sm:p-8 md:p-10 pt-6 sm:pt-8 md:pt-10 pb-10 sm:pb-12 md:pb-14 min-h-[580px] sm:min-h-[640px] md:min-h-[680px] flex flex-col justify-between">
        
        {/* Ambient Glows in Navy, Cyan, and Indigo matching top banner palette */}
        <div className="absolute -top-32 -left-32 w-[480px] h-[480px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/4 right-0 w-[450px] h-[450px] bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-[600px] h-[300px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* TOP HERO SHOWCASE: Title & Visual Gaming Elements */}
        <div className="relative z-10 w-full flex flex-col md:flex-row md:items-center justify-between gap-6 pt-2 pb-6">
          {/* Left / Main: Title & Typewriter Animation */}
          <div className="flex-1 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-[11px] font-bold uppercase tracking-wider mb-3">
              <Gamepad2 className="w-3.5 h-3.5 text-blue-400" />
              <span>Official Game Top Up</span>
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white flex items-center gap-2.5">
                <span>Voucher & Diamond Game</span>
                <Flame className="w-6 h-6 sm:w-7 sm:h-7 text-amber-400 fill-amber-400 shrink-0" />
              </h2>
              <div className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-cyan-400 flex items-center min-h-[1.4em]">
                <span className="truncate">{typewriterText}</span>
                <span className="inline-block w-0.5 sm:w-1 h-6 sm:h-7 bg-cyan-400 ml-1 rounded-full animate-pulse shrink-0" />
              </div>
            </div>
          </div>

          {/* Right: Rich Gaming Visual Suite (Smartphone + Controller + MLBB Diamond + FF Diamond + Valorant Radianite) */}
          <div className="relative shrink-0 flex items-center justify-center self-center md:self-auto py-2">
            <svg
              width="360"
              height="160"
              viewBox="0 0 360 160"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-72 sm:w-80 md:w-96 h-auto select-none"
            >
              <defs>
                {/* Gradients */}
                <linearGradient id="phoneBody" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#1E293B" />
                  <stop offset="100%" stopColor="#0B132B" />
                </linearGradient>
                <linearGradient id="phoneScreen" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#1E3A8A" />
                  <stop offset="50%" stopColor="#0284C7" />
                  <stop offset="100%" stopColor="#0F172A" />
                </linearGradient>
                <linearGradient id="mlbbDiamondGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#38BDF8" />
                  <stop offset="40%" stopColor="#2563EB" />
                  <stop offset="100%" stopColor="#1D4ED8" />
                </linearGradient>
                <linearGradient id="ffDiamondGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#FBBF24" />
                  <stop offset="45%" stopColor="#F97316" />
                  <stop offset="100%" stopColor="#EF4444" />
                </linearGradient>
                <linearGradient id="controllerGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1E293B" />
                  <stop offset="100%" stopColor="#0F172A" />
                </linearGradient>
                <filter id="glowBlue" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <filter id="glowOrange" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* 1. GAMING SMARTPHONE (Tilted Landscape/Isometric in Center-Left) */}
              <g transform="translate(45, 20)">
                {/* Phone Glow */}
                <rect x="0" y="0" width="150" height="95" rx="14" fill="#2563EB" opacity="0.15" filter="url(#glowBlue)" />
                {/* Phone Body */}
                <rect x="0" y="0" width="150" height="95" rx="14" fill="url(#phoneBody)" stroke="#38BDF8" strokeWidth="2" />
                {/* Screen */}
                <rect x="8" y="7" width="134" height="81" rx="8" fill="url(#phoneScreen)" />
                
                {/* Screen Game Graphic (HUD / Map / Healthbar) */}
                <path d="M12 75 L45 50 L80 65 L115 40 L138 55 L138 84 L12 84 Z" fill="#0284C7" fillOpacity="0.4" />
                {/* Floating HP Bar */}
                <rect x="16" y="14" width="45" height="4" rx="2" fill="#10B981" />
                <rect x="16" y="21" width="30" height="3" rx="1.5" fill="#38BDF8" />
                {/* Joystick on Screen */}
                <circle cx="28" cy="58" r="10" fill="#0F172A" fillOpacity="0.7" stroke="#38BDF8" strokeWidth="1" />
                <circle cx="28" cy="58" r="4" fill="#60A5FA" />
                {/* Action Buttons on Screen */}
                <circle cx="122" cy="62" r="7" fill="#EF4444" fillOpacity="0.8" stroke="#FCA5A5" strokeWidth="1" />
                <circle cx="112" cy="48" r="5" fill="#F59E0B" fillOpacity="0.8" />
                <circle cx="128" cy="45" r="5" fill="#3B82F6" fillOpacity="0.8" />
                {/* Center Game Logo / Emblem */}
                <polygon points="75,32 85,48 65,48" fill="#FBBF24" stroke="#FEF08A" strokeWidth="1" />
                <polygon points="75,54 85,38 65,38" fill="#F59E0B" fillOpacity="0.7" />
              </g>

              {/* 2. PRO CONTROLLER (Gamepad in Center-Right) */}
              <g transform="translate(180, 25)">
                {/* Controller Glow */}
                <ellipse cx="75" cy="50" rx="75" ry="45" fill="#38BDF8" opacity="0.12" filter="url(#glowBlue)" />
                {/* Gamepad Shell */}
                <path
                  d="M35 22C20 22 8 35 6 60C4 82 12 102 32 105C45 107 55 92 64 80H86C95 92 105 107 118 105C138 102 146 82 144 60C142 35 130 22 115 22C98 22 88 30 75 30C62 30 52 22 35 22Z"
                  fill="url(#controllerGrad)"
                  stroke="#60A5FA"
                  strokeWidth="2"
                />
                {/* D-Pad */}
                <rect x="30" y="46" width="8" height="22" rx="2" fill="#0B132B" stroke="#93C5FD" strokeWidth="1" />
                <rect x="23" y="53" width="22" height="8" rx="2" fill="#0B132B" stroke="#93C5FD" strokeWidth="1" />
                
                {/* ABXY Diamond Buttons */}
                <circle cx="118" cy="48" r="4" fill="#EF4444" />
                <circle cx="110" cy="56" r="4" fill="#3B82F6" />
                <circle cx="126" cy="56" r="4" fill="#10B981" />
                <circle cx="118" cy="64" r="4" fill="#F59E0B" />

                {/* Left & Right Thumbsticks */}
                <circle cx="54" cy="68" r="9" fill="#0B132B" stroke="#38BDF8" strokeWidth="1.5" />
                <circle cx="54" cy="68" r="4" fill="#60A5FA" />
                <circle cx="96" cy="68" r="9" fill="#0B132B" stroke="#38BDF8" strokeWidth="1.5" />
                <circle cx="96" cy="68" r="4" fill="#60A5FA" />

                {/* Touchpad / Lightbar */}
                <rect x="63" y="38" width="24" height="14" rx="3" fill="#0B132B" stroke="#38BDF8" strokeWidth="1" />
                <line x1="68" y1="42" x2="82" y2="42" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" />
              </g>

              {/* 3. MLBB BLUE BRILLIANT DIAMOND (Top Left Floating) */}
              <g transform="translate(15, 12)">
                <ellipse cx="20" cy="24" rx="20" ry="20" fill="#38BDF8" opacity="0.25" filter="url(#glowBlue)" />
                {/* Faceted Diamond */}
                {/* Top Crown */}
                <polygon points="10,16 30,16 38,24 2,24" fill="#93C5FD" stroke="#E0F2FE" strokeWidth="1" />
                {/* Bottom Pavilion */}
                <polygon points="2,24 38,24 20,44" fill="url(#mlbbDiamondGrad)" stroke="#E0F2FE" strokeWidth="1" />
                {/* Facet Lines */}
                <polygon points="10,16 30,16 20,44" fill="#38BDF8" fillOpacity="0.6" />
                <polygon points="16,16 24,16 20,24" fill="#FFFFFF" fillOpacity="0.8" />
              </g>

              {/* 4. FREE FIRE FIERY RUBY DIAMOND (Top Right Floating) */}
              <g transform="translate(305, 14)">
                <ellipse cx="20" cy="24" rx="20" ry="20" fill="#F97316" opacity="0.3" filter="url(#glowOrange)" />
                {/* Polygon Fire Diamond */}
                <polygon points="8,16 32,16 40,24 0,24" fill="#FDE047" stroke="#FEF08A" strokeWidth="1" />
                <polygon points="0,24 40,24 20,44" fill="url(#ffDiamondGrad)" stroke="#FEF08A" strokeWidth="1" />
                <polygon points="8,16 32,16 20,44" fill="#F97316" fillOpacity="0.7" />
                <polygon points="15,16 25,16 20,24" fill="#FFFFFF" fillOpacity="0.9" />
              </g>

              {/* 5. VALORANT / PUBG GLOWING CRYSTAL SHARD (Bottom Floating) */}
              <g transform="translate(165, 108)">
                <polygon points="15,0 26,16 15,32 4,16" fill="#10B981" stroke="#A7F3D0" strokeWidth="1" />
                <polygon points="15,0 26,16 15,32" fill="#059669" />
                <line x1="15" y1="0" x2="15" y2="32" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.8" />
              </g>
            </svg>
          </div>
        </div>

        {/* BOTTOM SECTION: Filter Chips & Game Cards */}
        <div className="relative z-10 pt-4 border-t border-white/10">
          {/* Quick Filter Game Chips */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {gameFilters.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedGameFilter(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  selectedGameFilter === tab.id
                    ? 'bg-blue-600 text-white shadow-sm border border-blue-400/40'
                    : 'bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Embedded Compact Game Cards Track (Kept at standard compact size) */}
          <div
            className="pt-4 flex items-stretch gap-3.5 overflow-x-auto no-scrollbar scroll-smooth -mx-1 px-1"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {filteredProducts.map((prod) => {
              return (
                <div
                  key={prod.id}
                  onClick={() => onSelectProduct(prod)}
                  className="flex flex-col justify-between p-4 rounded-xl bg-[#111A2E]/95 hover:bg-[#16223D] border border-blue-500/20 hover:border-blue-400/60 hover:shadow-md transition-all cursor-pointer group min-w-[210px] sm:min-w-[225px] max-w-[235px] shrink-0 backdrop-blur-xs"
                  style={{ scrollSnapAlign: 'start' }}
                >
                  <div>
                    {/* Top Row: Provider Icon + Tag */}
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <div className="flex items-center gap-2">
                        <ProviderIcon provider={prod.provider} size="sm" />
                        <span className="text-[10px] font-bold tracking-wider uppercase text-blue-300/80">
                          {prod.provider.toUpperCase()}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-blue-500/20 text-blue-300 border border-blue-400/20">
                        {prod.gameCurrencyName || 'Diamond'}
                      </span>
                    </div>

                    {/* Product Name */}
                    <h4 className="text-sm font-bold text-white group-hover:text-blue-200 transition-colors line-clamp-1">
                      {prod.name}
                    </h4>

                    {/* Description */}
                    <p className="text-[11px] text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                      {prod.description}
                    </p>
                  </div>

                  {/* Price & Direct Top Up Action */}
                  <div className="pt-3 mt-3 border-t border-white/10 flex items-end justify-between gap-2">
                    <div>
                      <span className="text-[9px] text-neutral-400 uppercase tracking-wider block font-medium">
                        Harga Resmi
                      </span>
                      <span className="text-sm font-bold text-white font-mono tracking-tight">
                        {formatRupiah(prod.price)}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProduct(prod);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
                    >
                      Top Up
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Final Card: Explore All Games */}
            <div
              onClick={() => onSelectCategory('game')}
              className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/5 hover:bg-white/10 border-2 border-dashed border-white/20 hover:border-white/40 transition-all cursor-pointer group min-w-[170px] sm:min-w-[185px] shrink-0 text-center"
              style={{ scrollSnapAlign: 'start' }}
            >
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform shadow-sm">
                <Gamepad2 className="w-6 h-6 stroke-[2]" />
              </div>
              <span className="text-xs font-bold text-white block">
                Lihat Semua Game
              </span>
              <span className="text-[10px] text-neutral-400 mt-0.5 block">
                MLBB, FF, PUBG, Valo & Genshin
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

