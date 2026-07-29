import { Star, Plus, Sparkles, TrendingUp } from 'lucide-react';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  onProductClick: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
}

function formatPrice(price: number): string {
  return price.toFixed(2).replace('.', ',') + ' €';
}

export function ProductCard({ product, onProductClick, onQuickAdd }: ProductCardProps) {
  const discount = product.original_price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : 0;

  return (
    <div
      onClick={() => onProductClick(product)}
      className="group relative bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer hover:shadow-xl hover:shadow-black/40"
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {product.is_new && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/90 text-white text-[10px] font-bold uppercase tracking-wide backdrop-blur-sm">
            <Sparkles className="w-3 h-3" />
            Nouveau
          </span>
        )}
        {discount > 0 && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-500/90 text-white text-[10px] font-bold uppercase tracking-wide backdrop-blur-sm">
            -{discount}%
          </span>
        )}
        {product.is_featured && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-500/90 text-white text-[10px] font-bold uppercase tracking-wide backdrop-blur-sm">
            <TrendingUp className="w-3 h-3" />
            Top vente
          </span>
        )}
      </div>

      {/* Quick add */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onQuickAdd(product);
        }}
        className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-zinc-950/80 border border-zinc-700 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-orange-500 hover:border-orange-500 transition-all backdrop-blur-sm"
        aria-label="Ajouter au panier"
      >
        <Plus className="w-4 h-4" />
      </button>

      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-zinc-800">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-600">
            <Sparkles className="w-12 h-12" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-60" />
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className="text-[10px] font-semibold text-orange-400 uppercase tracking-wide">
            {product.category}
          </span>
          {product.series && (
            <>
              <span className="text-zinc-600 text-[10px]">•</span>
              <span className="text-[10px] text-zinc-500">{product.series}</span>
            </>
          )}
        </div>

        <h3 className="text-white font-semibold text-sm leading-snug mb-2 line-clamp-2 group-hover:text-orange-400 transition-colors">
          {product.name}
        </h3>

        <div className="flex items-center gap-1 mb-3">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <Star
                key={n}
                className={`w-3 h-3 ${
                  n <= Math.round(product.rating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-zinc-700'
                }`}
              />
            ))}
          </div>
          <span className="text-[11px] text-zinc-500">({product.reviews_count})</span>
        </div>

        <div className="flex items-end justify-between">
          <div>
            {product.original_price && (
              <span className="block text-xs text-zinc-500 line-through">
                {formatPrice(product.original_price)}
              </span>
            )}
            <span className="text-lg font-bold text-white">
              {formatPrice(product.price)}
            </span>
          </div>
          {product.stock > 0 ? (
            <span className="text-[10px] font-medium text-emerald-400">
              En stock
            </span>
          ) : (
            <span className="text-[10px] font-medium text-red-400">
              Rupture
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
