import { useEffect, useState, useCallback } from 'react';
import { Loader2, SlidersHorizontal } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import type { Product } from '@/types';
import { ProductCard } from '@/components/Cart/ProductCard';
import { ProductDetail } from '@/components/Product/ProductDetail';

const CATEGORIES = ['Tous', 'Dragon Ball Z', 'Naruto', 'One Piece', 'Demon Slayer', 'My Hero Academia', 'Attack on Titan'];

const SORT_OPTIONS = [
  { value: 'featured', label: 'En vedette' },
  { value: 'price-asc', label: 'Prix croissant' },
  { value: 'price-desc', label: 'Prix décroissant' },
  { value: 'rating', label: 'Mieux notés' },
  { value: 'new', label: 'Nouveautés' },
] as const;

type SortValue = (typeof SORT_OPTIONS)[number]['value'];

export default function Boutique() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [sortBy, setSortBy] = useState<SortValue>('featured');
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    // TODO: Remplacer par ta propre logique de récupération des produits
    const mockProducts: Product[] = [];
    setProducts(mockProducts);
    setLoading(false);
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleQuickAdd = (product: Product) => {
    addToCart(product, 1);
    showToast(`${product.name} ajouté au panier`);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredProducts = useCallback(() => {
    let result = products;

    if (activeCategory !== 'Tous') {
      result = result.filter((p) => p.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.character?.toLowerCase().includes(q) ||
          p.series?.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      );
    }

    const sorted = [...result];
    switch (sortBy) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'new':
        sorted.sort((a, b) => Number(b.is_new) - Number(a.is_new));
        break;
      case 'featured':
      default:
        sorted.sort(
          (a, b) =>
            Number(b.is_featured) - Number(a.is_featured) ||
            b.rating - a.rating,
        );
    }

    return sorted;
  }, [products, activeCategory, searchQuery, sortBy]);

  const displayedProducts = filteredProducts();

  return (
    <>
      {selectedProduct ? (
        <ProductDetail
          product={selectedProduct}
          onBack={() => setSelectedProduct(null)}
          onAddToCart={(product, qty) => {
            addToCart(product, qty);
            showToast(`${product.name} ajouté au panier`);
          }}
        />
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Catalogue complet</h2>
              <p className="text-sm text-gray-500 mt-1">
                {displayedProducts.length} produit{displayedProducts.length > 1 ? 's' : ''}
                {activeCategory !== 'Tous' && ` — ${activeCategory}`}
              </p>
            </div>

            {/* Sort dropdown */}
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortValue)}
                className="bg-white border border-gray-300 rounded-full px-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category pills (mobile-friendly) */}
          <div className="flex flex-wrap gap-2 mb-8">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all $
                  activeCategory === cat
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 border border-gray-200 text-gray-700 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full max-w-md mb-8">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher une figurine, un personnage..."
              className="w-full bg-gray-100 border border-gray-200 rounded-full pl-4 pr-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 transition-colors"
            />
          </div>

          {/* Products grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={fetchProducts}
                className="px-6 py-2.5 rounded-full bg-gray-100 border border-gray-200 text-gray-900 text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Réessayer
              </button>
            </div>
          ) : displayedProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500">Aucun produit trouvé.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {displayedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onProductClick={handleProductClick}
                  onQuickAdd={handleQuickAdd}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] px-6 py-3 rounded-full bg-gray-900 border border-gray-700 text-white text-sm font-medium shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4">
          <Sparkles className="w-4 h-4 text-orange-500" />
          {toast}
        </div>
      )}
    </>
  );
}