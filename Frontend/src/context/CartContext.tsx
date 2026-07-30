import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { useAuth } from './AuthContext';

const LOCAL_KEY = 'cart_guest';
const API_BASE = import.meta.env.VITE_API_URL;

interface LocalItem {
  product_id: string;
  quantity: number;
}

interface CartItem {
  product_id: string;
  name: string;
  price: number;
  image_url: string | null;
  stock: number;
  quantity: number;
  subtotal: number;
}

interface CartContextValue {
  items: CartItem[];
  total: number;
  subtotal: number;
  totalItems: number;
  loading: boolean;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

const readLocal = (): LocalItem[] => {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) ?? '[]');
  } catch {
    return [];
  }
};

const writeLocal = (items: LocalItem[]) =>
  localStorage.setItem(LOCAL_KEY, JSON.stringify(items));

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, token } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const authHeaders = useCallback(
    () => (token ? { Authorization: `Bearer ${token}` } : {}),
    [token]
  );

  const fetchDbCart = useCallback(async () => {
    setLoading(true);
    try {
      console.log("Chargement du panier depuis la DB...");
      const res = await fetch(`${API_BASE}/cart/get.php`, {
        headers: authHeaders(),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Erreur lors de la récupération du panier:", errorData);
        throw new Error("Erreur lors de la récupération du panier");
      }

      const data = await res.json();
      console.log("Panier récupéré depuis la DB:", data);

      const itemsWithCorrectTypes = (data.items ?? []).map((item: any) => ({
        ...item,
        price: typeof item.price === 'string' ? parseFloat(item.price) : item.price,
        subtotal: typeof item.subtotal === 'string' ? parseFloat(item.subtotal) : item.subtotal,
      }));

      setItems(itemsWithCorrectTypes);
      setTotal(typeof data.total === 'string' ? parseFloat(data.total) : data.total);
    } catch (error) {
      console.error("Erreur dans fetchDbCart:", error);
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [authHeaders]);

  const hydrateLocalCart = useCallback(async () => {
    const local = readLocal();
    if (local.length === 0) {
      setItems([]);
      setTotal(0);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/products/by-ids.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: local.map((i) => i.product_id) }),
      });

      if (!res.ok) throw new Error("Erreur lors de la récupération des produits");

      const data = await res.json();
      const byId: Record<string, any> = {};
      (data.products ?? []).forEach((p: any) => (byId[p.id] = p));

      let t = 0;
      const built = local
        .filter((li) => byId[li.product_id])
        .map((li) => {
          const p = byId[li.product_id];
          const price = typeof p.price === 'string' ? parseFloat(p.price) : p.price;
          const subtotal = price * li.quantity;
          t += subtotal;
          return {
            product_id: li.product_id,
            name: p.name,
            price: price,
            image_url: p.image_url,
            stock: p.stock,
            quantity: li.quantity,
            subtotal,
          };
        });

      setItems(built);
      setTotal(t);
    } catch (error) {
      console.error("Erreur dans hydrateLocalCart:", error);
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  const mergeLocalIntoDb = useCallback(async () => {
    const local = readLocal();
    if (local.length === 0) {
      console.log("Aucun article dans le localStorage à fusionner.");
      return;
    }

    console.log("Fusion du panier local avec la DB:", local);

    try {
      const res = await fetch(`${API_BASE}/cart/merge.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders(),
        },
        body: JSON.stringify({ items: local }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Erreur lors de la fusion:", errorData);
        throw new Error("Erreur lors de la fusion du panier");
      }

      const data = await res.json();
      console.log("Fusion réussie:", data);

      localStorage.removeItem(LOCAL_KEY);
      console.log("localStorage vidé après fusion.");
    } catch (error) {
      console.error("Erreur dans mergeLocalIntoDb:", error);
      throw error;
    }
  }, [authHeaders]);

  useEffect(() => {
    if (user && token) {
      (async () => {
        try {
          await mergeLocalIntoDb();
          await fetchDbCart();
        } catch (error) {
          console.error("Erreur lors de la synchronisation du panier:", error);
        }
      })();
    } else if (!user) {
      hydrateLocalCart();
    }
  }, [user, token, mergeLocalIntoDb, fetchDbCart, hydrateLocalCart]);

  const addToCart = useCallback(
    async (productId: string, quantity: number) => {
      if (user) {
        try {
          const res = await fetch(`${API_BASE}/cart/add.php`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...authHeaders(),
            },
            body: JSON.stringify({ product_id: productId, quantity }),
          });

          if (!res.ok) {
            throw new Error("Erreur lors de l'ajout au panier");
          }

          await fetchDbCart();
        } catch (error) {
          console.error("Erreur lors de l'ajout au panier (DB):", error);
        }
      } else {
        try {
          const local = readLocal();
          const existing = local.find((i) => i.product_id === productId);
          existing ? (existing.quantity += quantity) : local.push({ product_id: productId, quantity });
          writeLocal(local);
          await hydrateLocalCart();
        } catch (error) {
          console.error("Erreur lors de l'ajout au panier (localStorage):", error);
        }
      }
    },
    [user, token, authHeaders, fetchDbCart, hydrateLocalCart]
  );

  const updateQuantity = useCallback(
    async (productId: string, quantity: number) => {
      if (user) {
        try {
          await fetch(`${API_BASE}/cart/update.php`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...authHeaders(),
            },
            body: JSON.stringify({ product_id: productId, quantity }),
          });
          await fetchDbCart();
        } catch (error) {
          console.error("Erreur lors de la mise à jour du panier (DB):", error);
        }
      } else {
        try {
          let local = readLocal();
          if (quantity <= 0) {
            local = local.filter((i) => i.product_id !== productId);
          } else {
            const existing = local.find((i) => i.product_id === productId);
            if (existing) existing.quantity = quantity;
          }
          writeLocal(local);
          await hydrateLocalCart();
        } catch (error) {
          console.error("Erreur lors de la mise à jour du panier (localStorage):", error);
        }
      }
    },
    [user, token, authHeaders, fetchDbCart, hydrateLocalCart]
  );

  const removeFromCart = useCallback(
    async (productId: string) => {
      if (user) {
        try {
          await fetch(`${API_BASE}/cart/remove.php`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...authHeaders(),
            },
            body: JSON.stringify({ product_id: productId }),
          });
          await fetchDbCart();
        } catch (error) {
          console.error("Erreur lors de la suppression du panier (DB):", error);
        }
      } else {
        try {
          writeLocal(readLocal().filter((i) => i.product_id !== productId));
          await hydrateLocalCart();
        } catch (error) {
          console.error("Erreur lors de la suppression du panier (localStorage):", error);
        }
      }
    },
    [user, token, authHeaders, fetchDbCart, hydrateLocalCart]
  );

  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, total, subtotal, totalItems, loading, addToCart, updateQuantity, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart doit être utilisé dans un CartProvider');
  return ctx;
}