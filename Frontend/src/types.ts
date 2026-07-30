export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  original_price: number | null;
  image_url: string | null;
  images: string[];
  category: string;
  series: string | null;
  character: string | null;
  scale: string | null;
  material: string | null;
  height_cm: number | null;
  stock: number;
  rating: number;
  reviews_count: number;
  is_featured: boolean;
  is_new: boolean;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderInput {
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  shipping_address: string;
  city: string;
  postal_code: string;
  country: string;
  total: number;
}

export interface OrderItemInput {
  order_id: string;
  product_id: string | null;
  product_name: string;
  product_image_url: string | null;
  unit_price: number;
  quantity: number;
}

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';

// Renvoyé par GET /orders/mine.php (liste, sans les articles)
export interface OrderSummary {
  id: string;
  customer_name: string;
  total: number;
  status: OrderStatus;
  created_at: string;
}

// Renvoyé par GET /orders/detail.php?id=... (objet "order" de la réponse)
export interface OrderDetail {
  id: string;
  user_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  shipping_address: string;
  city: string;
  postal_code: string;
  country: string;
  total: number;
  status: OrderStatus;
  created_at: string;
}

// Renvoyé par GET /orders/detail.php?id=... (tableau "items" de la réponse)
export interface OrderDetailItem {
  product_id: string | null;
  product_name: string;
  product_image_url: string | null;
  unit_price: number;
  quantity: number;
}

// Utilisateur connecté, renvoyé par GET /auth/me.php, /auth/login.php, PUT /users/me.php
export interface AuthUser {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: 'customer' | 'admin';
}