import { useState } from 'react';
import { ArrowLeft, Check, Loader2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import type { OrderInput, OrderItemInput } from '@/types';

interface CheckoutProps {
  onBack: () => void;
  onOrderComplete: () => void;
}

function formatPrice(price: number): string {
  return price.toFixed(2).replace('.', ',') + ' €';
}

export function Checkout({ onBack, onOrderComplete }: CheckoutProps) {
  const { items, subtotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    shipping_address: '',
    city: '',
    postal_code: '',
    country: 'France',
  });

  const shipping = subtotal >= 80 ? 0 : 6.9;
  const total = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setLoading(true);
    setError(null);

    try {
      // TODO: Remplacer par ta propre logique de création de commande
      // Exemple : appel à une API personnalisée, localStorage, etc.
      console.log('Commande à créer :', {
        ...form,
        total,
        items: items.map((item) => ({
          product_id: item.product.id,
          product_name: item.product.name,
          product_image_url: item.product.image_url,
          unit_price: item.product.price,
          quantity: item.quantity,
        })),
      });

      // Simulation de succès
      clearCart();
      setSuccess(true);
      setTimeout(() => {
        onOrderComplete();
      }, 2500);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Une erreur est survenue. Veuillez réessayer.',
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">
            Commande confirmée !
          </h1>
          <p className="text-zinc-400">
            Merci pour votre achat. Un email de confirmation vous sera envoyé
            prochainement. Votre commande sera expédiée sous 48h.
          </p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-7 h-7 text-zinc-600" />
          </div>
          <p className="text-white font-semibold mb-1">Votre panier est vide</p>
          <button
            onClick={onBack}
            className="mt-4 px-6 py-2.5 rounded-full bg-zinc-900 border border-zinc-700 text-white text-sm font-medium hover:bg-zinc-800 transition-colors"
          >
            Retour à la boutique
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white text-sm font-medium mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </button>

        <h1 className="text-2xl font-bold text-white mb-8">Finaliser la commande</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
              <h2 className="text-white font-semibold mb-4">Coordonnées</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field
                  label="Nom complet *"
                  value={form.customer_name}
                  onChange={(v) => setForm({ ...form, customer_name: v })}
                  required
                />
                <Field
                  label="Email *"
                  type="email"
                  value={form.customer_email}
                  onChange={(v) => setForm({ ...form, customer_email: v })}
                  required
                />
                <Field
                  label="Téléphone"
                  value={form.customer_phone}
                  onChange={(v) => setForm({ ...form, customer_phone: v })}
                />
                <Field
                  label="Pays"
                  value={form.country}
                  onChange={(v) => setForm({ ...form, country: v })}
                  required
                />
              </div>
            </div>

            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
              <h2 className="text-white font-semibold mb-4">Adresse de livraison</h2>
              <div className="space-y-4">
                <Field
                  label="Adresse *"
                  value={form.shipping_address}
                  onChange={(v) => setForm({ ...form, shipping_address: v })}
                  required
                />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field
                    label="Ville *"
                    value={form.city}
                    onChange={(v) => setForm({ ...form, city: v })}
                    required
                  />
                  <Field
                    label="Code postal *"
                    value={form.postal_code}
                    onChange={(v) => setForm({ ...form, postal_code: v })}
                    required
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-sm text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Traitement...
                </>
              ) : (
                `Confirmer la commande — ${formatPrice(total)}`
              )}
            </button>
          </form>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 sticky top-24">
              <h2 className="text-white font-semibold mb-4">Récapitulatif</h2>
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-3">
                    <div className="w-12 h-14 rounded-lg overflow-hidden bg-zinc-800 shrink-0">
                      {item.product.image_url && (
                        <img
                          src={item.product.image_url}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white font-medium line-clamp-2">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-zinc-500">
                        x{item.quantity}
                      </p>
                    </div>
                    <span className="text-sm text-white font-semibold shrink-0">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-4 border-t border-zinc-800">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Sous-total</span>
                  <span className="text-white font-medium">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Livraison</span>
                  <span className="text-white font-medium">
                    {shipping === 0 ? 'Gratuite' : formatPrice(shipping)}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-orange-400">
                    Livraison gratuite dès 80 € d'achat
                  </p>
                )}
                <div className="flex justify-between pt-3 border-t border-zinc-800">
                  <span className="text-white font-semibold">Total</span>
                  <span className="text-white text-xl font-bold">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs text-zinc-400 font-medium mb-1.5">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 transition-colors"
      />
    </div>
  );
}