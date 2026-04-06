-- ============================================================
-- Sample Schema: E-Commerce System
-- File ini untuk testing PolyCode AI parser
-- Tables: users, categories, products, orders, order_items,
--         reviews, addresses, coupons, cart_items
-- ============================================================

-- 1. Users
CREATE TABLE users (
    id          INT             NOT NULL AUTO_INCREMENT,
    name        VARCHAR(150)    NOT NULL,
    email       VARCHAR(255)    NOT NULL,
    password    VARCHAR(255)    NOT NULL,
    phone       VARCHAR(20),
    avatar_url  TEXT,
    is_active   BOOLEAN         NOT NULL DEFAULT true,
    created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_users_email (email)
);

-- 2. Addresses (relasi ke users)
CREATE TABLE addresses (
    id          INT             NOT NULL AUTO_INCREMENT,
    user_id     INT             NOT NULL,
    label       VARCHAR(50)     NOT NULL DEFAULT 'Home',
    street      TEXT            NOT NULL,
    city        VARCHAR(100)    NOT NULL,
    province    VARCHAR(100)    NOT NULL,
    postal_code VARCHAR(10)     NOT NULL,
    is_default  BOOLEAN         NOT NULL DEFAULT false,
    created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Categories
CREATE TABLE categories (
    id          INT             NOT NULL AUTO_INCREMENT,
    name        VARCHAR(100)    NOT NULL,
    slug        VARCHAR(120)    NOT NULL,
    description TEXT,
    image_url   TEXT,
    parent_id   INT,
    created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_categories_slug (slug),
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- 4. Products (relasi ke categories)
CREATE TABLE products (
    id              INT             NOT NULL AUTO_INCREMENT,
    category_id     INT             NOT NULL,
    name            VARCHAR(255)    NOT NULL,
    slug            VARCHAR(280)    NOT NULL,
    description     TEXT,
    price           DECIMAL(12, 2)  NOT NULL,
    stock           INT             NOT NULL DEFAULT 0,
    weight_gram     INT,
    sku             VARCHAR(100),
    is_published    BOOLEAN         NOT NULL DEFAULT false,
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_products_slug (slug),
    UNIQUE KEY uq_products_sku (sku),
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- 5. Coupons
CREATE TABLE coupons (
    id              INT             NOT NULL AUTO_INCREMENT,
    code            VARCHAR(50)     NOT NULL,
    discount_type   VARCHAR(20)     NOT NULL DEFAULT 'percentage',
    discount_value  DECIMAL(10, 2)  NOT NULL,
    min_order       DECIMAL(12, 2),
    max_uses        INT,
    used_count      INT             NOT NULL DEFAULT 0,
    expires_at      DATETIME,
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_coupons_code (code)
);

-- 6. Orders (relasi ke users, addresses, coupons)
CREATE TABLE orders (
    id              INT             NOT NULL AUTO_INCREMENT,
    user_id         INT             NOT NULL,
    address_id      INT             NOT NULL,
    coupon_id       INT,
    status          VARCHAR(30)     NOT NULL DEFAULT 'pending',
    total_price     DECIMAL(12, 2)  NOT NULL,
    discount        DECIMAL(12, 2)  NOT NULL DEFAULT 0,
    grand_total     DECIMAL(12, 2)  NOT NULL,
    notes           TEXT,
    paid_at         DATETIME,
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id)    REFERENCES users(id),
    FOREIGN KEY (address_id) REFERENCES addresses(id),
    FOREIGN KEY (coupon_id)  REFERENCES coupons(id) ON DELETE SET NULL
);

-- 7. Order Items (relasi ke orders & products)
CREATE TABLE order_items (
    id          INT             NOT NULL AUTO_INCREMENT,
    order_id    INT             NOT NULL,
    product_id  INT             NOT NULL,
    quantity    INT             NOT NULL DEFAULT 1,
    unit_price  DECIMAL(12, 2)  NOT NULL,
    subtotal    DECIMAL(12, 2)  NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (order_id)   REFERENCES orders(id)   ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- 8. Reviews (relasi ke users & products)
CREATE TABLE reviews (
    id          INT             NOT NULL AUTO_INCREMENT,
    user_id     INT             NOT NULL,
    product_id  INT             NOT NULL,
    rating      INT             NOT NULL,
    comment     TEXT,
    is_verified BOOLEAN         NOT NULL DEFAULT false,
    created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- 9. Cart Items (relasi ke users & products)
CREATE TABLE cart_items (
    id          INT             NOT NULL AUTO_INCREMENT,
    user_id     INT             NOT NULL,
    product_id  INT             NOT NULL,
    quantity    INT             NOT NULL DEFAULT 1,
    created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_cart_user_product (user_id, product_id),
    FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
