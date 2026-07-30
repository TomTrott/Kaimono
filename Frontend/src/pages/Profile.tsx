import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  User,
  Mail,
  Loader2,
  Pencil,
  Check,
  X,
  Package,
  ChevronDown,
  ChevronUp,
  MapPin,
  LogOut,
  Calendar,
  Euro,
  Truck,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  Download,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import type { OrderSummary, OrderDetail, OrderDetailItem, OrderStatus } from '@/types';

// Définition des statuts avec des icônes et des styles
const statusIcons: Record<OrderStatus, { icon: React.ReactNode; label: string; className: string }> = {
  pending: { icon: <Clock className="w-4 h-4" />, label: 'En attente', className: 'bg-gray-100 text-gray-600' },
  paid: { icon: <CreditCard className="w-4 h-4" />, label: 'Payée', className: 'bg-blue-50 text-blue-600' },
  shipped: { icon: <Truck className="w-4 h-4" />, label: 'Expédiée', className: 'bg-amber-50 text-[#EE9D34]' },
  delivered: { icon: <CheckCircle className="w-4 h-4" />, label: 'Livrée', className: 'bg-green-50 text-green-600' },
  cancelled: { icon: <XCircle className="w-4 h-4" />, label: 'Annulée', className: 'bg-red-50 text-red-500' },
};

export default function Profile() {
  const { isAuthenticated, loading } = useAuth();
  const [tab, setTab] = useState<'infos' | 'orders'>('infos');

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: '/profile' }} replace />;
  }

  return (
    <div className="min-h-[calc(80vh-4rem)] bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Mon compte</h1>

        <div className="flex gap-2 mb-8 border-b border-gray-200">
          <TabButton active={tab === 'infos'} onClick={() => setTab('infos')} icon={<User className="w-4 h-4" />}>
            Mes informations
          </TabButton>
          <TabButton active={tab === 'orders'} onClick={() => setTab('orders')} icon={<Package className="w-4 h-4" />}>
            Mes commandes
          </TabButton>
        </div>

        {tab === 'infos' ? <InfoTab /> : <OrdersTab />}
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
        active ? 'border-[#EE9D34] text-[#EE9D34]' : 'border-transparent text-gray-500 hover:text-gray-700'
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

// ---------- Onglet Informations ----------
function InfoTab() {
  const { user, updateUser, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    firstname: user?.firstname ?? '',
    lastname: user?.lastname ?? '',
    email: user?.email ?? '',
  });

  if (!user) return null;

  const startEdit = () => {
    setForm({ firstname: user.firstname, lastname: user.lastname, email: user.email });
    setError('');
    setEditing(true);
  };

  const handleSave = async () => {
    setError('');
    if (!form.firstname.trim() || !form.lastname.trim() || !form.email.trim()) {
      setError('Tous les champs sont requis.');
      return;
    }
    setSaving(true);
    try {
      await updateUser(form);
      setEditing(false);
    } catch (err) {
      const apiMessage = axios.isAxiosError(err) ? err.response?.data?.error : undefined;
      setError(apiMessage || 'Impossible de mettre à jour le profil.');
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    'w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:border-[#EE9D34]/50 focus:ring-[#EE9D34]/30 transition-colors';

  return (
    <div className="rounded-3xl border border-gray-200 bg-white shadow-sm shadow-gray-100 p-6 sm:p-8 max-w-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Informations personnelles</h2>
        {!editing && (
          <button
            onClick={startEdit}
            className="flex items-center gap-1.5 text-sm font-medium text-[#EE9D34] hover:underline"
          >
            <Pencil className="w-3.5 h-3.5" />
            Modifier
          </button>
        )}
      </div>

      {error && (
        <div className="rounded-2xl bg-red-50 border border-red-200 px-4 py-2.5 text-xs text-red-600 mb-4">
          {error}
        </div>
      )}

      {editing ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-1.5">Prénom</label>
              <input
                value={form.firstname}
                onChange={(e) => setForm((f) => ({ ...f, firstname: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-1.5">Nom</label>
              <input
                value={form.lastname}
                onChange={(e) => setForm((f) => ({ ...f, lastname: e.target.value }))}
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className={inputClass}
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 disabled:opacity-60 transition-colors"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              Enregistrer
            </button>
            <button
              onClick={() => setEditing(false)}
              disabled={saving}
              className="flex items-center gap-1.5 px-5 py-2 rounded-full border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              <X className="w-4 h-4" />
              Annuler
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <InfoRow icon={<User className="w-5 h-5" />} label="Nom complet" value={`${user.firstname} ${user.lastname}`} />
          <InfoRow icon={<Mail className="w-5 h-5" />} label="Email" value={user.email} />
        </div>
      )}

      <div className="mt-8 pt-6 border-t border-gray-100">
        <button
          onClick={logout}
          className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-red-500 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          Se déconnecter
        </button>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm text-gray-900 font-medium">{value}</p>
      </div>
    </div>
  );
}

// ---------- Onglet Commandes ----------
function OrdersTab() {
  const [orders, setOrders] = useState<OrderSummary[] | null>(null);
  const [error, setError] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);
  const [details, setDetails] = useState<Record<string, { order: OrderDetail; items: OrderDetailItem[] }>>({});
  const [loadingDetail, setLoadingDetail] = useState<string | null>(null);

  useEffect(() => {
    api
      .get('/orders/list.php')
      .then((res) => setOrders(res.data.orders))
      .catch(() => setError('Impossible de charger vos commandes.'));
  }, []);

  const toggleOrder = async (id: string) => {
    if (openId === id) {
      setOpenId(null);
      return;
    }
    setOpenId(id);

    if (!details[id]) {
      setLoadingDetail(id);
      try {
        const res = await api.get('/orders/show.php', { params: { id } });
        setDetails((prev) => ({ ...prev, [id]: { order: res.data.order, items: res.data.items } }));
      } catch {
        setError('Impossible de charger le détail de cette commande.');
      } finally {
        setLoadingDetail(null);
      }
    }
  };

  const handleDownloadInvoice = (orderId: string) => {
    // Fonction à implémenter plus tard pour télécharger la facture
    console.log(`Téléchargement de la facture pour la commande : ${orderId}`);
    alert(`Téléchargement de la facture pour la commande ${orderId} (à implémenter).`);
  };

  if (error) {
    return <p className="text-sm text-red-500">{error}</p>;
  }

  if (orders === null) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-400 py-12 justify-center">
        <Loader2 className="w-4 h-4 animate-spin" />
        Chargement de vos commandes...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-16 rounded-3xl border border-dashed border-gray-200">
        <Package className="w-8 h-8 text-gray-300 mx-auto mb-3" />
        <p className="text-sm text-gray-500">Vous n'avez pas encore passé de commande.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const isOpen = openId === order.id;
        const status = statusIcons[order.status];
        const detail = details[order.id];

        // Formatage de la date
        const formattedDate = new Date(order.created_at).toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });

        return (
          <div
            key={order.id}
            className="rounded-3xl border border-gray-200 bg-white shadow-sm shadow-gray-100 overflow-hidden"
          >
            {/* En-tête de la commande */}
            <button
              onClick={() => toggleOrder(order.id)}
              className="w-full flex items-center justify-between p-5 sm:p-6 text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#EE9D34]/10 flex items-center justify-center text-[#EE9D34]">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Commande du {formattedDate}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{order.total.toFixed(2)} €</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${status.className}`}>
                  {status.label}
                </span>
                {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </div>
            </button>

            {/* Détails de la commande */}
            {isOpen && (
              <div className="border-t border-gray-100 p-5 sm:p-6 space-y-6">
                {loadingDetail === order.id || !detail ? (
                  <div className="flex items-center gap-2 text-xs text-gray-400 py-4 justify-center">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Chargement du détail...
                  </div>
                ) : (
                  <>
                    {/* Section : Informations de livraison */}
                    <div className="rounded-2xl bg-gray-50 p-4">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        Adresse de livraison
                      </h3>
                      <p className="text-sm text-gray-700">
                        {detail.order.shipping_address}, {detail.order.postal_code} {detail.order.city}, {detail.order.country}
                      </p>
                    </div>

                    {/* Section : Articles de la commande */}
                    <div className="rounded-2xl bg-gray-50 p-4">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Package className="w-4 h-4 text-gray-500" />
                        Articles commandés
                      </h3>
                      <div className="space-y-4">
                        {detail.items.map((item, i) => (
                          <div key={item.product_id ?? i} className="flex items-center gap-4">
                            <img
                              src={item.product_image_url ?? '/placeholder.png'}
                              alt={item.product_name}
                              className="w-16 h-16 rounded-xl object-cover bg-gray-100 flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{item.product_name}</p>
                              <p className="text-xs text-gray-500">
                                {item.quantity} × {item.unit_price.toFixed(2)} €
                              </p>
                            </div>
                            <p className="text-sm font-semibold text-gray-900">
                              {(item.unit_price * item.quantity).toFixed(2)} €
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Section : Récapitulatif */}
                    <div className="rounded-2xl bg-gray-50 p-4">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Euro className="w-4 h-4 text-gray-500" />
                        Récapitulatif
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Sous-total</span>
                          <span className="text-gray-900">
                            {detail.items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0).toFixed(2)} €
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Livraison</span>
                          <span className="text-gray-900">Gratuite</span>
                        </div>
                        <div className="flex justify-between text-lg font-semibold pt-2 border-t border-gray-200">
                          <span className="text-gray-900">Total</span>
                          <span className="text-gray-900">{order.total.toFixed(2)} €</span>
                        </div>
                      </div>
                    </div>

                    {/* Bouton pour télécharger la facture */}
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleDownloadInvoice(order.id)}
                        className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#EE9D34] text-[#EE9D34] text-sm font-medium hover:bg-[#EE9D34]/10 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Télécharger la facture
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}