export interface Admin {
  id: string;
  email: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  original_price: number | null;
  image_url: string | null;
  image_url_2: string | null;
  image_url_3: string | null;
  image_url_4: string | null;
  category: string;
  manufacturer: string | null;
  material: string | null;
  height_cm: number | null;
  weight_kg: number | null;
  stock: number;
  rating: number;
  is_featured: 0 | 1;
  is_new: 0 | 1;
  created_at: string;
  reviews_count: number;
}

export type ContactStatus = 'nouveau' | 'traite';

export interface ContactMessage {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  reason: string;
  order_number: string | null;
  return_reason: string | null;
  message: string;
  status: ContactStatus;
  admin_reply: string | null;
  replied_at: string | null;
  created_at: string;
}

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  id: string;
  product_id: string | null;
  product_name: string;
  product_image_url: string | null;
  unit_price: number;
  quantity: number;
}

export interface Order {
  id: string;
  user_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  shipping_address: string;
  city: string;
  postal_code: string;
  country: string;
  status: OrderStatus;
  total: number;
  created_at: string;
  items?: OrderItem[];
}

export interface StatsSummary {
  total_revenue: number;
  orders_count: number;
  pending_count: number;
  avg_order_value: number;
  by_status: { status: OrderStatus; count: number }[];
  by_month: { month: string; revenue: number; orders_count: number }[];
  top_products: { product_name: string; total_qty: number; total_revenue: number }[];
}

export interface ReviewedProduct {
  id: string;
  product_id: string;
  order_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  updated_at: string;
  product_name: string;
  image_url: string | null;
}

export interface ReviewableProduct {
  product_id: string;
  product_name: string;
  product_image_url: string | null;
  order_id: string;
  ordered_at: string;
}