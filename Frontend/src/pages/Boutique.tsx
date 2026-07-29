import { useEffect, useState, useCallback } from 'react';
import { Loader2, SlidersHorizontal, Sparkles, ChevronDown, Search } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import type { Product } from '@/types';
import { ProductCard } from '@/components/Cart/ProductCard';
import { ProductDetail } from '@/components/Product/ProductDetail';

// Catégories de produits
const CATEGORIES = ['Tous', 'Dragon Ball Z', 'Naruto', 'One Piece'];

// Fabricants
const MANUFACTURERS = ['Tous', 'Banpresto', 'Bandai', 'Funko', 'MegaHouse', 'ThreeZero', 'Flare'];

// Options de tri
const SORT_OPTIONS = [
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
  const [activeManufacturer, setActiveManufacturer] = useState('Tous');
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

    // Filtre par catégorie
    if (activeCategory !== 'Tous') {
      result = result.filter((p) => p.category === activeCategory);
    }

    // Filtre par fabricant
    if (activeManufacturer !== 'Tous') {
      result = result.filter((p) => p.manufacturer === activeManufacturer);
    }

    // Filtre par recherche
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.character?.toLowerCase().includes(q) ||
          p.series?.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.manufacturer?.toLowerCase().includes(q),
      );
    }

    // Tri des produits
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
  }, [products, activeCategory, activeManufacturer, searchQuery, sortBy]);

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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Catalogue complet</h2>
              <p className="text-sm text-gray-500 mt-1">
                {displayedProducts.length} produit{displayedProducts.length > 1 ? 's' : ''}
                {activeCategory !== 'Tous' && ` — ${activeCategory}`}
                {activeManufacturer !== 'Tous' && ` — Fabricant : ${activeManufacturer}`}
              </p>
            </div>
          </div>

          {/* Filtres + recherche : tout sur une seule ligne en desktop, empilé en mobile */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-8">
            {/* Recherche */}
            <div className="relative w-full lg:max-w-xs lg:order-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher une figurine..."
                className="w-full bg-gray-100 border border-gray-200 rounded-full pl-9 pr-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#EE9D34]/50 focus:ring-1 focus:ring-[#EE9D34]/30 transition-colors"
              />
            </div>

            {/* Catégorie */}
            <div className="relative w-full sm:w-auto lg:order-2">
              <select
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
                className="w-full sm:w-auto bg-white border border-gray-300 rounded-full pl-4 pr-8 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#EE9D34]/50 focus:ring-1 focus:ring-[#EE9D34]/30 cursor-pointer appearance-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Fabricant */}
            <div className="relative w-full sm:w-auto lg:order-3">
              <select
                value={activeManufacturer}
                onChange={(e) => setActiveManufacturer(e.target.value)}
                className="w-full sm:w-auto bg-white border border-gray-300 rounded-full pl-4 pr-8 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#EE9D34]/50 focus:ring-1 focus:ring-[#EE9D34]/30 cursor-pointer appearance-none"
              >
                {MANUFACTURERS.map((manufacturer) => (
                  <option key={manufacturer} value={manufacturer}>
                    {manufacturer}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Tri */}
            <div className="relative w-full sm:w-auto lg:order-4 lg:ml-auto">
              <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#EE9D34] pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortValue)}
                className="w-full sm:w-auto bg-white border border-gray-300 rounded-full pl-10 pr-8 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#EE9D34]/50 focus:ring-1 focus:ring-[#EE9D34]/30 cursor-pointer appearance-none"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Products grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#EE9D34]" />
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={fetchProducts}
                className="px-6 py-2.5 rounded-full bg-gray-100 border border-gray-200 text-gray-900 text-sm font-medium hover:bg-[#EE9D34]/10 hover:text-[#EE9D34] transition-colors"
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
          <Sparkles className="w-4 h-4 text-[#EE9D34]" />
          {toast}
        </div>
      )}
    </>
  );
}