export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  original_price: number | null;
  image_url: string | null;
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
