import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

function formatPrice(price: number): string {
  return price.toFixed(2).replace('.', ',') + ' €';
}

export function CartDrawer({ open, onClose, onCheckout }: CartDrawerProps) {
  const { items, updateQuantity, removeFromCart, subtotal, totalItems } = useCart();

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-full sm:max-w-md bg-zinc-950 border-l border-zinc-800 z-50 flex flex-col transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-orange-400" />
            <h2 className="text-white font-bold text-lg">
              Panier {totalItems > 0 && `(${totalItems})`}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4">
                <ShoppingBag className="w-7 h-7 text-zinc-600" />
              </div>
              <p className="text-white font-semibold mb-1">Votre panier est vide</p>
              <p className="text-sm text-zinc-500 mb-6">
                Ajoutez des figurines pour commencer
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-full bg-zinc-900 border border-zinc-700 text-white text-sm font-medium hover:bg-zinc-800 transition-colors"
              >
                Continuer mes achats
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-3 p-3 rounded-xl bg-zinc-900 border border-zinc-800"
                >
                  <div className="w-16 h-20 rounded-lg overflow-hidden bg-zinc-800 shrink-0">
                    {item.product.image_url && (
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-orange-400 font-medium uppercase tracking-wide">
                      {item.product.category}
                    </p>
                    <h4 className="text-sm font-semibold text-white line-clamp-2 mb-1">
                      {item.product.name}
                    </h4>
                    <p className="text-sm font-bold text-white">
                      {formatPrice(item.product.price)}
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2 bg-zinc-800 rounded-full p-0.5">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          className="w-7 h-7 rounded-full hover:bg-zinc-700 text-zinc-300 flex items-center justify-center transition-colors"
                          aria-label="Diminuer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          className="w-7 h-7 rounded-full hover:bg-zinc-700 text-zinc-300 flex items-center justify-center transition-colors"
                          aria-label="Augmenter"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-zinc-800 transition-colors"
                        aria-label="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400 text-sm">Sous-total</span>
              <span className="text-white text-xl font-bold">
                {formatPrice(subtotal)}
              </span>
            </div>
            <p className="text-xs text-zinc-500">
              Frais de livraison calculés à l'étape suivante
            </p>
            <button
              onClick={onCheckout}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-all"
            >
              Passer commande
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
