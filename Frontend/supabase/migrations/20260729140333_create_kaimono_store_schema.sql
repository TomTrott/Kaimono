/*
# KAIMONO Store — Product Catalog & Orders Schema

1. Overview
Creates the database schema for KAIMONO store, an online shop selling Dragon Ball Z
and other manga figurines. This is a single-tenant storefront (no customer sign-in):
visitors browse products, add to cart, and place orders with their contact/shipping
details. All data is intentionally public for products and writeable by anon for orders.

2. New Tables
- `products` — catalog of figurines available for sale.
  - `id` (uuid, PK)
  - `name` (text, not null)
  - `description` (text)
  - `price` (numeric(10,2), not null) — in EUR
  - `original_price` (numeric(10,2), nullable) — for showing discounts
  - `image_url` (text) — main product image
  - `category` (text, not null) — e.g. "Dragon Ball Z", "Naruto", "One Piece"
  - `series` (text) — sub-series, e.g. "Saiyan Saga", "Marineford"
  - `character` (text) — e.g. "Goku", "Naruto"
  - `scale` (text) — e.g. "1/6", "1/4"
  - `material` (text) — e.g. "PVC, ABS"
  - `height_cm` (numeric(5,2)) — figurine height
  - `stock` (integer, default 0)
  - `rating` (numeric(3,2), default 0) — average rating 0-5
  - `reviews_count` (integer, default 0)
  - `is_featured` (boolean, default false) — shown on homepage hero/featured row
  - `is_new` (boolean, default false) — "new arrival" badge
  - `created_at` (timestamptz, default now())
- `orders` — customer orders.
  - `id` (uuid, PK)
  - `customer_name` (text, not null)
  - `customer_email` (text, not null)
  - `customer_phone` (text)
  - `shipping_address` (text, not null)
  - `city` (text, not null)
  - `postal_code` (text, not null)
  - `country` (text, default 'France')
  - `total` (numeric(10,2), not null)
  - `status` (text, default 'pending') — pending, paid, shipped, delivered, cancelled
  - `created_at` (timestamptz, default now())
- `order_items` — line items belonging to an order.
  - `id` (uuid, PK)
  - `order_id` (uuid, FK -> orders.id ON DELETE CASCADE)
  - `product_id` (uuid, FK -> products.id ON DELETE SET NULL)
  - `product_name` (text, not null) — snapshot at purchase time
  - `product_image_url` (text) — snapshot
  - `unit_price` (numeric(10,2), not null) — snapshot
  - `quantity` (integer, not null, check >= 1)

3. Indexes
- `products_category_idx` on products(category)
- `products_is_featured_idx` on products(is_featured)
- `order_items_order_id_idx` on order_items(order_id)

4. Security
- RLS enabled on all three tables.
- products: anon + authenticated can SELECT (public catalog). No public insert/update/delete.
- orders: anon + authenticated can INSERT (customers place orders) and SELECT.
- order_items: anon + authenticated can INSERT and SELECT.

5. Notes
- Prices stored as numeric(10,2) for exact currency math.
- Order item fields snapshot product data at purchase time so historical orders remain
  correct even if a product is later edited or removed.
- This is a no-auth storefront, so policies use `TO anon, authenticated`.
*/

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL,
  original_price numeric(10,2),
  image_url text,
  category text NOT NULL,
  series text,
  character text,
  scale text,
  material text,
  height_cm numeric(5,2),
  stock integer NOT NULL DEFAULT 0,
  rating numeric(3,2) NOT NULL DEFAULT 0,
  reviews_count integer NOT NULL DEFAULT 0,
  is_featured boolean NOT NULL DEFAULT false,
  is_new boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_products" ON products;
CREATE POLICY "anon_select_products" ON products FOR SELECT
  TO anon, authenticated USING (true);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text,
  shipping_address text NOT NULL,
  city text NOT NULL,
  postal_code text NOT NULL,
  country text NOT NULL DEFAULT 'France',
  total numeric(10,2) NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_orders" ON orders;
CREATE POLICY "anon_select_orders" ON orders FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_orders" ON orders;
CREATE POLICY "anon_insert_orders" ON orders FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  product_image_url text,
  unit_price numeric(10,2) NOT NULL,
  quantity integer NOT NULL CHECK (quantity >= 1),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_order_items" ON order_items;
CREATE POLICY "anon_select_order_items" ON order_items FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_order_items" ON order_items;
CREATE POLICY "anon_insert_order_items" ON order_items FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- Indexes
CREATE INDEX IF NOT EXISTS products_category_idx ON products(category);
CREATE INDEX IF NOT EXISTS products_is_featured_idx ON products(is_featured);
CREATE INDEX IF NOT EXISTS order_items_order_id_idx ON order_items(order_id);
