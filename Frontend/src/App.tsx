import { useEffect, useState, useCallback } from 'react';
import { Loader2, Sparkles, SlidersHorizontal } from 'lucide-react';
import { CartProvider, useCart } from '@/context/CartContext';
import type { Product } from '@/types';
import { Header } from '@/components/Layout/Header';
import { Hero } from '@/components/Hero';
import { ProductCard } from '@/components/Cart/ProductCard';
import { ProductDetail } from '@/components/Product/ProductDetail';
import { CartDrawer } from '@/components/Cart/CartDrawer';
import { Checkout } from '@/components/Checkout/Checkout';
import { Footer } from '@/components/Layout/Footer';

type View = 'home' | 'product' | 'checkout';

const CATEGORIES = ['Tous', 'Dragon Ball Z', 'Naruto', 'One Piece', 'Demon Slayer', 'My Hero Academia', 'Attack on Titan'];

const SORT_OPTIONS = [
  { value: 'featured', label: 'En vedette' },
  { value: 'price-asc', label: 'Prix croissant' },
  { value: 'price-desc', label: 'Prix décroissant' },
  { value: 'rating', label: 'Mieux notés' },
  { value: 'new', label: 'Nouveautés' },
] as const;

type SortValue = (typeof SORT_OPTIONS)[number]['value'];

// Fonction pour parser le hash de l'URL
const parseHashParams = (): { category?: string; sort?: SortValue; search?: string } => {
  const hash = window.location.hash.substring(1); // Enlève le #
  const params = new URLSearchParams(hash);
  return {
    category: params.get('category') || undefined,
    sort: params.get('sort') as SortValue | undefined,
    search: params.get('search') || undefined,
  };
};

// Fonction pour mettre à jour le hash de l'URL
const updateHashParams = (category: string, sort: SortValue, search: string) => {
  const params = new URLSearchParams();
  if (category !== 'Tous') params.set('category', category);
  if (sort !== 'featured') params.set('sort', sort);
  if (search.trim()) params.set('search', search);
  const newHash = params.toString();
  window.location.hash = newHash;
};

function StoreApp() {
  const { addToCart } = useCart();
  const [view, setView] = useState<View>('home');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [sortBy, setSortBy] = useState<SortValue>('featured');
  const [toast, setToast] = useState<string | null>(null);

  // Charger les filtres depuis l'URL au montage
  useEffect(() => {
    const { category, sort, search } = parseHashParams();
    if (category) setActiveCategory(category);
    if (sort) setSortBy(sort);
    if (search) setSearchQuery(search);
    fetchProducts();
  }, []);

  // Mettre à jour l'URL quand un filtre change
  useEffect(() => {
    updateHashParams(activeCategory, sortBy, searchQuery);
  }, [activeCategory, sortBy, searchQuery]);

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
    setView('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogoClick = () => {
    setView('home');
    setSelectedProduct(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategorySelect = (cat: string) => {
    setActiveCategory(cat);
    if (view !== 'home') {
      setView('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      document.getElementById('catalogue')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCheckout = () => {
    setCartOpen(false);
    setView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderComplete = () => {
    setView('home');
    setSelectedProduct(null);
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
  const featuredProducts = products.filter((p) => p.is_featured).slice(0, 4);
  const newProducts = products.filter((p) => p.is_new).slice(0, 8);

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <Header
        onCartClick={() => setCartOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onCategorySelect={handleCategorySelect}
        activeCategory={activeCategory}
        categories={CATEGORIES}
        onLogoClick={handleLogoClick}
      />

      <main className="flex-1">
        {view === 'product' && selectedProduct ? (
          <ProductDetail
            product={selectedProduct}
            onBack={() => {
              setView('home');
              setSelectedProduct(null);
            }}
            onAddToCart={(product, qty) => {
              addToCart(product, qty);
              showToast(`${product.name} ajouté au panier`);
            }}
          />
        ) : view === 'checkout' ? (
          <Checkout onBack={() => setView('home')} onOrderComplete={handleOrderComplete} />
        ) : (
          <>
            <Hero
              onShopNow={() =>
                document.getElementById('catalogue')?.scrollIntoView({ behavior: 'smooth' })
              }
              onExplore={() =>
                document.getElementById('nouveautes')?.scrollIntoView({ behavior: 'smooth' })
              }
            />

            {/* Featured products */}
            {featuredProducts.length > 0 && !searchQuery && activeCategory === 'Tous' && (
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="flex items-center gap-2 mb-8">
                  <Sparkles className="w-5 h-5 text-orange-400" />
                  <h2 className="text-2xl font-bold text-white">En vedette</h2>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                  {featuredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onProductClick={handleProductClick}
                      onQuickAdd={handleQuickAdd}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* New arrivals */}
            {newProducts.length > 0 && !searchQuery && activeCategory === 'Tous' && (
              <section id="nouveautes" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center gap-2 mb-8">
                  <h2 className="text-2xl font-bold text-white">Nouveautés</h2>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                  {newProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onProductClick={handleProductClick}
                      onQuickAdd={handleQuickAdd}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Full catalog */}
            <section id="catalogue" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-white">Catalogue complet</h2>
                  <p className="text-sm text-zinc-500 mt-1">
                    {displayedProducts.length} produit{displayedProducts.length > 1 ? 's' : ''}
                    {activeCategory !== 'Tous' && ` — ${activeCategory}`}
                  </p>
                </div>

                {/* Sort dropdown */}
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-zinc-500" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortValue)}
                    className="bg-zinc-900 border border-zinc-800 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-orange-500/50 cursor-pointer"
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
                        : 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Products grid */}
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-orange-400" />
                </div>
              ) : error ? (
                <div className="text-center py-20">
                  <p className="text-red-400 mb-4">{error}</p>
                  <button
                    onClick={fetchProducts}
                    className="px-6 py-2.5 rounded-full bg-zinc-900 border border-zinc-700 text-white text-sm font-medium hover:bg-zinc-800 transition-colors"
                  >
                    Réessayer
                  </button>
                </div>
              ) : displayedProducts.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-zinc-400">Aucun produit trouvé.</p>
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
            </section>
          </>
        )}
      </main>

      <Footer />

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={handleCheckout}
      />

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] px-6 py-3 rounded-full bg-zinc-900 border border-zinc-700 text-white text-sm font-medium shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4">
          <Sparkles className="w-4 h-4 text-orange-400" />
          {toast}
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <StoreApp />
    </CartProvider>
  );
}