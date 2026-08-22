import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Product } from '../../types';
import { formatRupiah } from '../../utils/formatters';
import { ProviderIcon } from '../common/ProviderIcon';

interface PopularDealsProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onViewAllKuota: () => void;
}

export const PopularDeals: React.FC<PopularDealsProps> = ({
  products,
  onSelectProduct,
  onViewAllKuota
}) => {
  // Take top popular products
  const popular = products.filter(p => p.isPopular).slice(0, 6);

  return (
    <section className="mb-6" id="popular-deals-section">
      <div className="flex items-end justify-between mb-3.5">
        <div>
          <h3 className="text-base sm:text-lg font-bold tracking-tight text-neutral-900">
            Produk Terpopuler
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            Pilihan paket dan nominal yang sering dibeli
          </p>
        </div>
        <button
          onClick={onViewAllKuota}
          className="text-xs font-semibold text-neutral-900 hover:text-blue-600 flex items-center gap-1 focus:outline-hidden cursor-pointer transition-colors"
        >
          <span>Lihat semua</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {popular.map((prod) => (
          <div
            key={prod.id}
            onClick={() => onSelectProduct(prod)}
            className="flex flex-col justify-between p-4 rounded-xl bg-white border border-neutral-200/80 hover:border-neutral-900 hover:shadow-xs transition-all cursor-pointer group"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2.5">
                <ProviderIcon provider={prod.provider} size="sm" />
                <span className="text-[10px] font-mono font-medium text-neutral-400">
                  {prod.category.toUpperCase()}
                </span>
              </div>

              <h4 className="text-sm font-bold text-neutral-900 line-clamp-1 group-hover:text-neutral-950 transition-colors">
                {prod.name}
              </h4>
              <p className="text-xs text-neutral-500 line-clamp-1 mt-0.5">
                {prod.description}
              </p>
            </div>

            <div className="pt-3 mt-3 border-t border-neutral-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-neutral-400 font-medium block uppercase tracking-wider">Harga</span>
                <span className="text-sm sm:text-base font-black text-neutral-900 font-mono">
                  {formatRupiah(prod.price)}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectProduct(prod);
                }}
                className="px-4 py-2 rounded-xl bg-[#0B1220] hover:bg-neutral-900 text-white text-xs font-bold transition-all focus:outline-hidden cursor-pointer"
              >
                Beli
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
