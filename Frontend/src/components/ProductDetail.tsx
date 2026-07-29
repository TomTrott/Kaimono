import { Star, Plus, Minus, ArrowLeft, Sparkles, Shield, Truck, Check } from 'lucide-react';
import type { Product } from '@/types';
import { useState } from 'react';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

function formatPrice(price: number): string {
  return price.toFixed(2).replace('.', ',') + ' €';
}

export function ProductDetail({ product, onBack, onAddToCart }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const discount = product.original_price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : 0;

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="bg-zinc-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white text-sm font-medium mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour au catalogue
        </button>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image */}
          <div className="relative">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-600">
                  <Sparkles className="w-16 h-16" />
                </div>
              )}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.is_new && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-500/90 text-white text-xs font-bold uppercase tracking-wide backdrop-blur-sm">
                    <Sparkles className="w-3.5 h-3.5" />
                    Nouveau
                  </span>
                )}
                {discount > 0 && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-500/90 text-white text-xs font-bold uppercase tracking-wide backdrop-blur-sm">
                    -{discount}%
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-semibold text-orange-400 uppercase tracking-wider">
                {product.category}
              </span>
              {product.series && (
                <>
                  <span className="text-zinc-600">•</span>
                  <span className="text-xs text-zinc-500">{product.series}</span>
                </>
              )}
            </div>

            <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight mb-4">
              {product.name}
            </h1>

            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    className={`w-4 h-4 ${
                      n <= Math.round(product.rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-zinc-700'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-zinc-400">
                {product.rating.toFixed(1)} ({product.reviews_count} avis)
              </span>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-white">
                {formatPrice(product.price)}
              </span>
              {product.original_price && (
                <span className="text-lg text-zinc-500 line-through">
                  {formatPrice(product.original_price)}
                </span>
              )}
            </div>

            <p className="text-zinc-400 leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Specs */}
            <div className="grid grid-cols-2 gap-4 mb-8 p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
              {product.character && (
                <div>
                  <dt className="text-xs text-zinc-500 uppercase tracking-wide mb-0.5">
                    Personnage
                  </dt>
                  <dd className="text-sm font-semibold text-white">
                    {product.character}
                  </dd>
                </div>
              )}
              {product.scale && (
                <div>
                  <dt className="text-xs text-zinc-500 uppercase tracking-wide mb-0.5">
                    Échelle
                  </dt>
                  <dd className="text-sm font-semibold text-white">
                    {product.scale}
                  </dd>
                </div>
              )}
              {product.height_cm && (
                <div>
                  <dt className="text-xs text-zinc-500 uppercase tracking-wide mb-0.5">
                    Hauteur
                  </dt>
                  <dd className="text-sm font-semibold text-white">
                    {product.height_cm} cm
                  </dd>
                </div>
              )}
              {product.material && (
                <div>
                  <dt className="text-xs text-zinc-500 uppercase tracking-wide mb-0.5">
                    Matériau
                  </dt>
                  <dd className="text-sm font-semibold text-white">
                    {product.material}
                  </dd>
                </div>
              )}
            </div>

            {/* Stock */}
            <div className="mb-6">
              {product.stock > 0 ? (
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-400">
                  <Check className="w-4 h-4" />
                  En stock ({product.stock} disponibles)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-red-400">
                  Rupture de stock
                </span>
              )}
            </div>

            {/* Quantity + Add to cart */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-full p-1">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 rounded-full hover:bg-zinc-800 text-zinc-300 hover:text-white flex items-center justify-center transition-colors"
                  aria-label="Diminuer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center text-white font-semibold">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="w-9 h-9 rounded-full hover:bg-zinc-800 text-zinc-300 hover:text-white flex items-center justify-center transition-colors"
                  aria-label="Augmenter"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleAdd}
                disabled={product.stock === 0}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold hover:shadow-lg hover:shadow-orange-500/30 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5" />
                    Ajouté au panier
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Ajouter au panier
                  </>
                )}
              </button>
            </div>

            {/* Guarantees */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-zinc-800">
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <Shield className="w-5 h-5 text-orange-400" />
                Produit officiel garanti
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <Truck className="w-5 h-5 text-orange-400" />
                Livraison 48h en France
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
