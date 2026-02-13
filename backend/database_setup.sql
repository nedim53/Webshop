-- ============================================
-- Neptis Webshop Database Setup Script
-- ============================================
-- Kopirajte i izvršite ovu skriptu u DBeaver-u
-- SVE TABELE ZAVRŠAVAJU SA "_webshop" SUFIKSOM
-- ============================================

-- Kreiranje ENUM tipova (samo ako ne postoje)
DO $$ BEGIN
    CREATE TYPE product_status_webshop AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE order_status_webshop AS ENUM ('pending', 'accepted', 'rejected', 'completed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================
-- 1. KREIRANJE TABELE USERS_WEBSHOP (Korisnici)
-- ============================================
CREATE TABLE IF NOT EXISTS users_webshop (
    id SERIAL PRIMARY KEY,
    username VARCHAR NOT NULL UNIQUE,
    password_hash VARCHAR NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    first_name VARCHAR NOT NULL,
    last_name VARCHAR NOT NULL,
    email VARCHAR NOT NULL UNIQUE,
    city VARCHAR NOT NULL,
    country VARCHAR NOT NULL,
    phone VARCHAR NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_users_webshop_username ON users_webshop(username);
CREATE INDEX IF NOT EXISTS idx_users_webshop_email ON users_webshop(email);

-- ============================================
-- 2. KREIRANJE TABELE PRODUCTS_WEBSHOP (Proizvodi)
-- ============================================
CREATE TABLE IF NOT EXISTS products_webshop (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    description TEXT,
    price DOUBLE PRECISION NOT NULL,
    image_url VARCHAR,
    quantity INTEGER NOT NULL,
    date_posted TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status product_status_webshop DEFAULT 'pending',
    seller_id INTEGER NOT NULL,
    CONSTRAINT fk_products_webshop_seller FOREIGN KEY (seller_id) REFERENCES users_webshop(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_products_webshop_seller_id ON products_webshop(seller_id);
CREATE INDEX IF NOT EXISTS idx_products_webshop_status ON products_webshop(status);

-- ============================================
-- 3. KREIRANJE TABELE CARTS_WEBSHOP (Korpe)
-- ============================================
CREATE TABLE IF NOT EXISTS carts_webshop (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_carts_webshop_user FOREIGN KEY (user_id) REFERENCES users_webshop(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_carts_webshop_user_id ON carts_webshop(user_id);

-- ============================================
-- 4. KREIRANJE TABELE CART_ITEMS_WEBSHOP (Stavke korpe)
-- ============================================
CREATE TABLE IF NOT EXISTS cart_items_webshop (
    id SERIAL PRIMARY KEY,
    cart_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT fk_cart_items_webshop_cart FOREIGN KEY (cart_id) REFERENCES carts_webshop(id) ON DELETE CASCADE,
    CONSTRAINT fk_cart_items_webshop_product FOREIGN KEY (product_id) REFERENCES products_webshop(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_cart_items_webshop_cart_id ON cart_items_webshop(cart_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_webshop_product_id ON cart_items_webshop(product_id);

-- ============================================
-- 5. KREIRANJE TABELE ORDERS_WEBSHOP (Narudžbe)
-- ============================================
CREATE TABLE IF NOT EXISTS orders_webshop (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR NOT NULL,
    address VARCHAR NOT NULL,
    phone VARCHAR NOT NULL,
    email VARCHAR,
    status order_status_webshop DEFAULT 'pending',
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_decided TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_orders_webshop_status ON orders_webshop(status);
CREATE INDEX IF NOT EXISTS idx_orders_webshop_date_created ON orders_webshop(date_created);

-- ============================================
-- 6. KREIRANJE TABELE ORDER_ITEMS_WEBSHOP (Stavke narudžbe)
-- ============================================
CREATE TABLE IF NOT EXISTS order_items_webshop (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    price_at_order_time DOUBLE PRECISION NOT NULL,
    CONSTRAINT fk_order_items_webshop_order FOREIGN KEY (order_id) REFERENCES orders_webshop(id) ON DELETE CASCADE,
    CONSTRAINT fk_order_items_webshop_product FOREIGN KEY (product_id) REFERENCES products_webshop(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_order_items_webshop_order_id ON order_items_webshop(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_webshop_product_id ON order_items_webshop(product_id);

-- ============================================
-- KRAJ SKRIPTE
-- ============================================
-- Sada možete provjeriti da li su sve tabele kreirane:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE '%webshop%';
-- ============================================

