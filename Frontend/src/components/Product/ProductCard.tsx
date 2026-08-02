import { Plus, Check, Star } from 'lucide-react';
import type { Product } from '@/types';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
  onProductClick: (product: Product) => void;
}

function formatPrice(price: number): string {
  return price.toFixed(2).replace('.', ',') + ' €';
}

export function ProductCard({ product, onProductClick }: ProductCardProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [adding, setAdding] = useState(false);

  const handleQuickAdd = async () => {
    if (adding || product.stock === 0) return;
    setAdding(true);
    try {
      await addToCart(product.id, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div
      onClick={() => onProductClick(product)}
      className="group relative bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all cursor-pointer"
    >
      {/* Bouton "Ajouter au panier" - Toujours visible sur mobile, au survol sur PC */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleQuickAdd();
        }}
        disabled={product.stock === 0 || adding}
        className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full
          bg-[#EE9D34] text-white shadow-md
          md:bg-white/80 md:border md:border-gray-300 md:text-gray-700
          md:opacity-0 md:group-hover:opacity-100
          hover:bg-[#EE9D34] hover:text-white hover:border-[#EE9D34]
          flex items-center justify-center
          transition-all backdrop-blur-sm disabled:opacity-50"
        aria-label={added ? "Ajouté au panier" : "Ajouter au panier"}
      >
        {added ? (
          <Check className="w-4 h-4" />
        ) : (
          <Plus className="w-4 h-4" />
        )}
      </button>

      {/* Image du produit */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-12 h-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Informations du produit */}
      <div className="p-4">
        <div className="flex items-center gap-1.5 mb-1.5">
          {product.series && (
            <>
              <span className="text-gray-400 text-[10px]">•</span>
              <span className="text-[10px] text-gray-500">{product.series}</span>
            </>
          )}
        </div>

        <h3 className="text-gray-900 font-semibold text-sm leading-snug mb-2 line-clamp-2 group-hover:text-[#EE9D34] transition-colors">
          {product.name}
        </h3>

        {/* Note et nombre d'avis */}
        <div className="flex items-center gap-1.5 mb-2">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <Star
                key={n}
                className={`w-3.5 h-3.5 ${
                  n <= Math.round(product.rating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">
            ({product.reviews_count ?? 0})
          </span>
        </div>

        <div className="flex items-end justify-between">
          <div>
            {product.original_price && (
              <span className="block text-xs text-gray-500 line-through">
                {formatPrice(product.original_price)}
              </span>
            )}
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
          </div>
          {product.stock > 0 ? (
            <span className="text-[10px] font-medium text-green-600">
              En stock
            </span>
          ) : (
            <span className="text-[10px] font-medium text-red-500">
              Rupture
            </span>
          )}
        </div>
      </div>
    </div>
  );
}