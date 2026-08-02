import { useEffect, useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import type { Product } from '@/types';
import { Hero } from '@/components/Hero';
import { ProductCard } from '@/components/Product/ProductCard';
import { ProductDetail } from '@/components/Product/ProductDetail';
import api from '@/services/api';

export default function Home() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  // Récupérer tous les produits depuis le backend
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/products/list.php');
      const data = res?.data?.products;
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Impossible de charger les produits. Veuillez réessayer.');
      console.error('Erreur lors de la récupération des produits :', err);
    } finally {
      setLoading(false);
    }
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

  // Filtrer les 6 derniers produits ajoutés (tri par created_at)
  // Nouveautés : produits marqués comme "is_new" côté admin, les plus récents en premier
  const latestProducts = (products ?? [])
    .filter((p) => !!p.is_new)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 6);

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
        <>
          <Hero
            onShopNow={() => (window.location.href = '/boutique')}
            onExplore={() =>
              document.getElementById('nouveautes')?.scrollIntoView({ behavior: 'smooth' })
            }
          />

          {/* Section Nouveautés */}
          <section id="nouveautes" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Nouveautés</h2>
              <a
                href="/boutique"
                className="text-sm font-medium text-[#EE9D34] hover:underline"
              >
                Voir tout le catalogue
              </a>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-[#EE9D34]" />
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
            ) : latestProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500">Aucun produit trouvé.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {latestProducts.map((product) => (
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