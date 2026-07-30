import { Star, Plus, Minus, ArrowLeft, Check } from 'lucide-react';
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

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="bg-gray-50 min-h-[calc(80vh-4rem)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Bouton de retour */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-[#EE9D34] text-sm font-medium mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour au catalogue
        </button>

        {/* Contenu principal */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image du produit */}
          <div className="relative">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-gray-50 border border-gray-200">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-16 h-16"
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
          </div>

          {/* Détails du produit */}
          <div className="flex flex-col">
            {/* Catégorie et série */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-semibold text-[#EE9D34] uppercase tracking-wider">
                {product.category}
              </span>
              {product.series && (
                <>
                  <span className="text-gray-400 text-[10px]">•</span>
                  <span className="text-xs text-gray-500">{product.series}</span>
                </>
              )}
            </div>

            {/* Titre du produit */}
            <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight mb-4">
              {product.name}
            </h1>

            {/* Note et avis */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    className={`w-4 h-4 ${
                      n <= Math.round(product.rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {product.rating.toFixed(1)} ({product.reviews_count} avis)
              </span>
            </div>

            {/* Prix */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
              {product.original_price && (
                <span className="text-lg text-gray-500 line-through">
                  {formatPrice(product.original_price)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Caractéristiques techniques */}
            <div className="grid grid-cols-2 gap-4 mb-8 p-4 rounded-2xl bg-gray-50 border border-gray-200">
              {product.character && (
                <div>
                  <dt className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">
                    Personnage
                  </dt>
                  <dd className="text-sm font-semibold text-gray-900">
                    {product.character}
                  </dd>
                </div>
              )}
              {product.scale && (
                <div>
                  <dt className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">
                    Échelle
                  </dt>
                  <dd className="text-sm font-semibold text-gray-900">
                    {product.scale}
                  </dd>
                </div>
              )}
              {product.height_cm && (
                <div>
                  <dt className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">
                    Hauteur
                  </dt>
                  <dd className="text-sm font-semibold text-gray-900">
                    {product.height_cm} cm
                  </dd>
                </div>
              )}
              {product.material && (
                <div>
                  <dt className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">
                    Matériau
                  </dt>
                  <dd className="text-sm font-semibold text-gray-900">
                    {product.material}
                  </dd>
                </div>
              )}
            </div>

            {/* Stock */}
            <div className="mb-6">
              {product.stock > 0 ? (
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600">
                  <Check className="w-4 h-4" />
                  En stock ({product.stock} disponibles)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-red-500">
                  Rupture de stock
                </span>
              )}
            </div>

            {/* Quantité + Ajouter au panier */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-full p-1">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 rounded-full hover:bg-gray-200 text-gray-600 hover:text-[#EE9D34] flex items-center justify-center transition-colors"
                  aria-label="Diminuer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center text-gray-900 font-semibold">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="w-9 h-9 rounded-full hover:bg-gray-200 text-gray-600 hover:text-[#EE9D34] flex items-center justify-center transition-colors"
                  aria-label="Augmenter"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleAdd}
                disabled={product.stock === 0}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#EE9D34] to-orange-600 text-white font-semibold hover:shadow-lg hover:shadow-orange-500/30 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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

            {/* Garanties */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-[#EE9D34]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                Produit officiel garanti
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-[#EE9D34]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125V14.25m-17.25 4.5v-1.875a3.375 3.375 0 013.375-3.375h9.75a3.375 3.375 0 013.375 3.375v1.875m-17.25 4.5h16.5M5.625 9a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z"
                  />
                </svg>
                Livraison 48h en France
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}