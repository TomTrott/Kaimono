import { Star, Plus, Minus, ArrowLeft, Check, X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Product } from '@/types';
import { useState, useEffect, useRef } from 'react';
import { useCart } from '@/context/CartContext';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
}

function formatPrice(price: number): string {
  return price.toFixed(2).replace('.', ',') + ' €';
}

export function ProductDetail({ product, onBack }: ProductDetailProps) {
  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [adding, setAdding] = useState(false);

  const images = product.images?.length ? product.images : product.image_url ? [product.image_url] : [];
  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const handleAdd = async () => {
    if (adding || product.stock === 0) return;
    setAdding(true);
    try {
      await addToCart(product.id, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } finally {
      setAdding(false);
    }
  };

  const goToPrev = () => {
    setActiveImage((i) => (i === 0 ? images.length - 1 : i - 1));
  };

  const goToNext = () => {
    setActiveImage((i) => (i === images.length - 1 ? 0 : i + 1));
  };

  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'ArrowRight') goToNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [lightboxOpen, images.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const delta = touchStartX.current - touchEndX.current;
    const threshold = 50;

    if (delta > threshold) {
      goToNext();
    } else if (delta < -threshold) {
      goToPrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div className="bg-gray-50 min-h-[calc(80vh-4rem)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-[#EE9D34] text-sm font-medium mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour au catalogue
        </button>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Galerie d'images */}
          <div className="relative">
            <div
              className="relative aspect-square rounded-3xl overflow-hidden bg-gray-50 border border-gray-200 cursor-zoom-in group"
              onClick={() => images.length > 0 && setLightboxOpen(true)}
            >
              {images.length > 0 ? (
                <>
                  <img
                    src={images[activeImage]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          goToPrev();
                        }}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white shadow-md flex items-center justify-center text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Image précédente"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          goToNext();
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white shadow-md flex items-center justify-center text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Image suivante"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                      <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/60 text-white text-xs font-medium">
                        {activeImage + 1} / {images.length}
                      </span>
                    </>
                  )}
                </>
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

            {images.length > 1 && (
              <div
                className="grid gap-3 mt-3"
                style={{ gridTemplateColumns: `repeat(${Math.min(images.length, 4)}, minmax(0, 1fr))` }}
              >
                {images.map((url, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      activeImage === index
                        ? 'border-[#EE9D34] ring-2 ring-[#EE9D34]/30'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    aria-label={`Voir l'image ${index + 1}`}
                  >
                    <img
                      src={url}
                      alt={`${product.name} - vue ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Détails du produit */}
          <div className="flex flex-col">
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

            <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight mb-4">
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
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {product.rating.toFixed(1)} ({product.reviews_count} avis)
              </span>
            </div>

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

            <p className="text-gray-600 leading-relaxed mb-8">
              {product.description}
            </p>

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
                disabled={product.stock === 0 || adding}
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
                    {adding ? 'Ajout...' : 'Ajouter au panier'}
                  </>
                )}
              </button>
            </div>

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

      {/* Lightbox */}
      {lightboxOpen && images.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            aria-label="Fermer"
          >
            <X className="w-6 h-6" />
          </button>

          {images.length > 1 && (
            <span className="absolute top-5 left-5 px-3 py-1.5 rounded-full bg-white/10 text-white text-sm font-medium">
              {activeImage + 1} / {images.length}
            </span>
          )}

          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrev();
              }}
              className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              aria-label="Image précédente"
            >
              <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
            </button>
          )}

          <img
            src={images[activeImage]}
            alt={`${product.name} - vue ${activeImage + 1}`}
            className="max-w-[90vw] max-h-[85vh] object-contain select-none"
            onClick={(e) => e.stopPropagation()}
            draggable={false}
          />

          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              aria-label="Image suivante"
            >
              <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
            </button>
          )}

          {images.length > 1 && (
            <div
              className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    activeImage === index ? 'bg-white' : 'bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Aller à l'image ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}