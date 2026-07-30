import { useState, useEffect } from 'react';
import { ArrowLeft, Check, Loader2, ShoppingBag, MapPin, Package, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import type { OrderInput, OrderItemInput } from '@/types';

interface CheckoutProps {
  onBack: () => void;
  onOrderComplete: () => void;
}

interface RelayPoint {
  id: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

function formatPrice(price: number): string {
  return price.toFixed(2).replace('.', ',') + ' €';
}

export function Checkout({ onBack, onOrderComplete }: CheckoutProps) {
  const { items, subtotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRelayModal, setShowRelayModal] = useState(false);
  const [selectedRelay, setSelectedRelay] = useState<RelayPoint | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [relayPoints, setRelayPoints] = useState<RelayPoint[]>([]);
  const [isLoadingRelays, setIsLoadingRelays] = useState(false);

  const [form, setForm] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    shipping_address: '',
    city: '',
    postal_code: '',
    country: 'France',
    delivery_method: 'home',
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      setForm((prev) => ({
        ...prev,
        customer_name: `${user.firstname} ${user.lastname}`.trim(),
        customer_email: user.email,
      }));
    }
  }, [isAuthenticated, user]);

  const shipping = subtotal >= 80 ? 0 : 6.9;
  const total = subtotal + shipping;

  const mockRelayPoints: RelayPoint[] = [
    { id: '1', name: 'Mondial Relay - Bureau de Tabac', address: '12 Rue de Paris', city: 'Lyon', postalCode: '69001', country: 'France' },
    { id: '2', name: 'Mondial Relay - Supermarché', address: '45 Av des Champs', city: 'Lyon', postalCode: '69002', country: 'France' },
    { id: '3', name: 'Mondial Relay - Librairie', address: '78 Rue de la République', city: 'Lyon', postalCode: '69003', country: 'France' },
  ];

  const handleSearchRelay = () => {
    setIsLoadingRelays(true);
    setTimeout(() => {
      setRelayPoints(
        mockRelayPoints.filter(
          (point) =>
            point.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
            point.postalCode.includes(searchQuery)
        )
      );
      setIsLoadingRelays(false);
    }, 500);
  };

  const handleSelectRelay = (relay: RelayPoint) => {
    setSelectedRelay(relay);
    setForm((prev) => ({
      ...prev,
      shipping_address: `${relay.name}, ${relay.address}`,
      city: relay.city,
      postal_code: relay.postalCode,
      delivery_method: 'relay',
    }));
    setShowRelayModal(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    if (!form.customer_name || !form.customer_email || !form.shipping_address || !form.city || !form.postal_code) {
      setError('Veuillez remplir tous les champs obligatoires (*).');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const orderData: OrderInput = {
        customer: {
          name: form.customer_name,
          email: form.customer_email,
          phone: form.customer_phone,
        },
        shipping: {
          address: form.shipping_address,
          city: form.city,
          postal_code: form.postal_code,
          country: form.country,
          method: form.delivery_method,
          relay_point: form.delivery_method === 'relay' ? selectedRelay : null,
        },
        items: items.map((item) => ({
          product_id: item.product_id,
          product_name: item.name,
          product_image_url: item.image_url,
          unit_price: item.price,
          quantity: item.quantity,
        })),
        total,
        subtotal,
        shipping_cost: shipping,
      };

      console.log('Commande à créer :', orderData);
      clearCart();
      setSuccess(true);
      setTimeout(() => {
        onOrderComplete();
      }, 2500);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Une erreur est survenue. Veuillez réessayer.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Commande confirmée !
          </h1>
          <p className="text-gray-600">
            {form.delivery_method === 'relay'
              ? `Votre commande sera disponible au point relais : ${selectedRelay?.name}, ${selectedRelay?.address}`
              : 'Votre commande sera expédiée à l\'adresse indiquée sous 48h.'}
          </p>
          <p className="text-gray-500 mt-2">
            Un email de confirmation vous sera envoyé prochainement.
          </p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-white border border-gray-200 flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-7 h-7 text-gray-400" />
          </div>
          <p className="text-gray-900 font-semibold mb-1">Votre panier est vide</p>
          <button
            onClick={onBack}
            className="mt-4 px-6 py-2.5 rounded-full bg-white border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Retour à la boutique
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-[#EE9D34] text-sm font-medium mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </button>

        <h1 className="text-2xl font-bold text-gray-900 mb-8">Finaliser la commande</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
            {/* Coordonnées */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm shadow-gray-100">
              <h2 className="text-gray-900 font-semibold mb-4">Coordonnées</h2>
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

            {/* Méthode de livraison */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm shadow-gray-100">
              <h2 className="text-gray-900 font-semibold mb-4">Méthode de livraison</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-200 cursor-pointer hover:border-[#EE9D34] transition-colors">
                  <input
                    type="radio"
                    name="delivery_method"
                    checked={form.delivery_method === 'home'}
                    onChange={() => setForm({ ...form, delivery_method: 'home' })}
                    className="w-4 h-4 accent-[#EE9D34]"
                  />
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">Livraison à domicile</p>
                    <p className="text-sm text-gray-500">
                      {shipping === 0 ? 'Gratuite' : `Frais de port : ${formatPrice(shipping)}`}
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-200 cursor-pointer hover:border-[#EE9D34] transition-colors">
                  <input
                    type="radio"
                    name="delivery_method"
                    checked={form.delivery_method === 'relay'}
                    onChange={() => {
                      setForm({ ...form, delivery_method: 'relay' });
                      setShowRelayModal(true);
                    }}
                    className="w-4 h-4 accent-[#EE9D34]"
                  />
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">Mondial Relay</p>
                    <p className="text-sm text-gray-500">Livraison en point relais (gratuit)</p>
                  </div>
                  <MapPin className="w-5 h-5 text-[#EE9D34]" />
                </label>
              </div>
            </div>

            {/* Adresse de livraison */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm shadow-gray-100">
              <h2 className="text-gray-900 font-semibold mb-4">
                {form.delivery_method === 'relay' ? 'Point de retrait' : 'Adresse de livraison'}
              </h2>
              <div className="space-y-4">
                {form.delivery_method === 'relay' ? (
                  <>
                    {selectedRelay ? (
                      <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                        <div className="flex items-start gap-3">
                          <MapPin className="w-6 h-6 text-[#EE9D34] mt-0.5" />
                          <div>
                            <p className="text-gray-900 font-medium">{selectedRelay.name}</p>
                            <p className="text-sm text-gray-600">{selectedRelay.address}</p>
                            <p className="text-sm text-gray-500">
                              {selectedRelay.postalCode} {selectedRelay.city}, {selectedRelay.country}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowRelayModal(true)}
                          className="mt-3 text-sm text-[#EE9D34] hover:underline transition-colors"
                        >
                          Changer de point relais
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowRelayModal(true)}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                      >
                        <MapPin className="w-5 h-5" />
                        Sélectionner un point relais
                      </button>
                    )}
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-[#EE9D34] text-white font-semibold hover:bg-[#D68A2B] transition-all disabled:opacity-50"
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
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm shadow-gray-100 sticky top-24">
              <h2 className="text-gray-900 font-semibold mb-4">Récapitulatif</h2>
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.product_id} className="flex gap-3">
                    <div className="w-12 h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                      {item.image_url && (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-900 font-medium line-clamp-2">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        x{item.quantity}
                      </p>
                    </div>
                    <span className="text-sm text-gray-900 font-semibold shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Sous-total</span>
                  <span className="text-gray-900 font-medium">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Livraison</span>
                  <span className="text-gray-900 font-medium">
                    {shipping === 0 ? 'Gratuite' : formatPrice(shipping)}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-[#EE9D34]">
                    Livraison gratuite dès 80 € d'achat
                  </p>
                )}
                <div className="flex justify-between pt-3 border-t border-gray-200">
                  <span className="text-gray-900 font-semibold">Total</span>
                  <span className="text-gray-900 text-xl font-bold">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Mondial Relay */}
      {showRelayModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-gray-200 w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-lg">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-gray-900 font-semibold">Sélectionner un point Mondial Relay</h2>
                <button
                  onClick={() => setShowRelayModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-4">
                <Field
                  label="Rechercher par ville ou code postal"
                  value={searchQuery}
                  onChange={(v) => {
                    setSearchQuery(v);
                    if (v.length >= 2) handleSearchRelay();
                  }}
                  placeholder="Ex: Lyon ou 69001"
                />
              </div>
            </div>

            <div className="p-6 max-h-[50vh] overflow-y-auto">
              {isLoadingRelays ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-[#EE9D34]" />
                </div>
              ) : relayPoints.length > 0 ? (
                <div className="space-y-3">
                  {relayPoints.map((relay) => (
                    <button
                      key={relay.id}
                      onClick={() => handleSelectRelay(relay)}
                      className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 text-left hover:border-[#EE9D34] transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-[#EE9D34] mt-0.5" />
                        <div>
                          <p className="text-gray-900 font-medium">{relay.name}</p>
                          <p className="text-sm text-gray-600">{relay.address}</p>
                          <p className="text-sm text-gray-500">
                            {relay.postalCode} {relay.city}, {relay.country}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Aucun point relais trouvé.</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Essayez une autre recherche.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  required = false,
  placeholder = '',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs text-gray-500 font-medium mb-1.5">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:border-[#EE9D34]/50 focus:ring-[#EE9D34]/30 transition-colors"
      />
    </div>
  );
}