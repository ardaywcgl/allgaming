-- ================================================================
-- HepsiGaming — PostgreSQL Başlangıç Şeması
-- ================================================================

-- UUID desteği
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
-- Full-text search Türkçe desteği
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- ----------------------------------------------------------------
-- Markalar
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS brands (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(200) NOT NULL UNIQUE,
    slug        VARCHAR(200) NOT NULL UNIQUE,
    logo_svg    TEXT,                        -- SVG içeriği veya URL
    logo_dark   TEXT,                        -- Koyu tema logo
    logo_light  TEXT,                        -- Açık tema logo
    banner_url  TEXT,
    description TEXT,
    website     TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------
-- Kategoriler
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(200) NOT NULL,
    slug        VARCHAR(200) NOT NULL UNIQUE,
    parent_id   UUID REFERENCES categories(id),
    icon_svg    TEXT,
    sort_order  INT DEFAULT 0,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------
-- Ürünler (JSONB teknik özellikler)
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug            VARCHAR(500) UNIQUE NOT NULL,
    name            VARCHAR(500) NOT NULL,
    brand_id        UUID REFERENCES brands(id) ON DELETE SET NULL,
    category_id     UUID REFERENCES categories(id) ON DELETE SET NULL,
    specs           JSONB DEFAULT '{}',      -- Değişken teknik özellikler
    images          TEXT[] DEFAULT '{}',
    description     TEXT,
    avg_rating      DECIMAL(2,1) DEFAULT 0,
    review_count    INT DEFAULT 0,
    -- SEO (otomatik üretilir)
    seo_title       VARCHAR(200),
    seo_description VARCHAR(320),
    -- Durum
    is_active       BOOLEAN DEFAULT TRUE,
    is_complete     BOOLEAN DEFAULT TRUE,    -- Görseli eksik ürünler için
    -- Zaman damgaları
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- GIN Index: JSONB hızlı arama (specs içinde filtre)
CREATE INDEX IF NOT EXISTS idx_products_specs ON products USING GIN(specs);
-- Full-text search (Türkçe)
CREATE INDEX IF NOT EXISTS idx_products_fts ON products
    USING GIN(to_tsvector('turkish', coalesce(name, '') || ' ' || coalesce(description, '')));
-- B-Tree indexler
CREATE INDEX IF NOT EXISTS idx_products_brand    ON products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug     ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_active   ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_complete ON products(is_complete) WHERE is_complete = FALSE;

-- ----------------------------------------------------------------
-- Kaynaklar (Scraper hedef siteler)
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sources (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(100) NOT NULL UNIQUE,  -- trendyol, amazon, hepsiburada...
    display_name    VARCHAR(200),
    logo_url        TEXT,
    base_url        TEXT,
    affiliate_param TEXT,   -- ?partnerId=XXX formatı
    affiliate_id    TEXT,   -- Affiliate kod değeri
    is_active       BOOLEAN DEFAULT TRUE
);

-- ----------------------------------------------------------------
-- Anlık Fiyatlar (en güncel, her kaynaktan)
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS prices (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    source_id   UUID NOT NULL REFERENCES sources(id),
    price       DECIMAL(12,2) NOT NULL,
    in_stock    BOOLEAN DEFAULT TRUE,
    free_ship   BOOLEAN DEFAULT FALSE,
    url         TEXT,
    affiliate_url TEXT,     -- Affiliate parametreli link
    scraped_at  TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (product_id, source_id)  -- Her üründen her kaynaktan 1 kayıt
);

CREATE INDEX IF NOT EXISTS idx_prices_product    ON prices(product_id);
CREATE INDEX IF NOT EXISTS idx_prices_source     ON prices(source_id);
CREATE INDEX IF NOT EXISTS idx_prices_stock      ON prices(product_id, in_stock);
CREATE INDEX IF NOT EXISTS idx_prices_scraped    ON prices(scraped_at DESC);

-- ----------------------------------------------------------------
-- Fiyat Geçmişi (zaman serisi, aylık partition)
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS price_history (
    id          UUID DEFAULT gen_random_uuid(),
    product_id  UUID NOT NULL,
    source_id   UUID NOT NULL,
    price       DECIMAL(12,2) NOT NULL,
    in_stock    BOOLEAN DEFAULT TRUE,
    recorded_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (id, recorded_at)
) PARTITION BY RANGE (recorded_at);

-- İlk 2 partition (Temmuz - Ağustos 2026)
CREATE TABLE IF NOT EXISTS price_history_2026_07
    PARTITION OF price_history
    FOR VALUES FROM ('2026-07-01') TO ('2026-08-01');

CREATE TABLE IF NOT EXISTS price_history_2026_08
    PARTITION OF price_history
    FOR VALUES FROM ('2026-08-01') TO ('2026-09-01');

CREATE INDEX IF NOT EXISTS idx_ph_product_time ON price_history(product_id, recorded_at DESC);

-- ----------------------------------------------------------------
-- Kullanıcılar + Roller + Rozetler
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name       VARCHAR(300),
    role            VARCHAR(50) DEFAULT 'user'
                    CHECK (role IN ('admin', 'editor', 'category_manager', 'grafiker', 'user')),
    -- Gamification rozetleri
    badge           VARCHAR(100),           -- Gamer, Pro, Donanım Gurusu
    review_count    INT DEFAULT 0,
    -- PWA Push
    push_subscription JSONB,               -- Web Push subscription objesi
    -- Durum
    is_active       BOOLEAN DEFAULT TRUE,
    last_login      TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role  ON users(role);

-- ----------------------------------------------------------------
-- Yorumlar (admin onaylı)
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reviews (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating      SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    title       VARCHAR(300),
    content     TEXT NOT NULL,
    approved    BOOLEAN DEFAULT FALSE,      -- Admin onay bekleniyor
    helpful_count INT DEFAULT 0,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (product_id, user_id)            -- Kullanıcı başına 1 yorum
);

CREATE INDEX IF NOT EXISTS idx_reviews_product  ON reviews(product_id, approved);
CREATE INDEX IF NOT EXISTS idx_reviews_pending  ON reviews(approved) WHERE approved = FALSE;

-- ----------------------------------------------------------------
-- Fiyat Alarmları
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS price_alerts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id      UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
    target_price    DECIMAL(12,2) NOT NULL,
    email           VARCHAR(255),           -- Misafir kullanıcılar için
    is_active       BOOLEAN DEFAULT TRUE,
    triggered_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_alerts_product ON price_alerts(product_id, is_active);

-- ----------------------------------------------------------------
-- Bannerlar + Tık Analitik
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS banners (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title       VARCHAR(300),
    image_url   TEXT NOT NULL,
    link_url    TEXT,
    position    VARCHAR(50) DEFAULT 'hero',  -- hero, sidebar, deals
    is_active   BOOLEAN DEFAULT TRUE,
    sort_order  INT DEFAULT 0,
    click_count INT DEFAULT 0,
    view_count  INT DEFAULT 0,
    created_by  UUID REFERENCES users(id),
    starts_at   TIMESTAMPTZ,
    ends_at     TIMESTAMPTZ,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------
-- Sistem Gereksinimleri (Oyunlar için)
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS game_requirements (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id      UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    min_cpu         VARCHAR(200),
    min_gpu         VARCHAR(200),
    min_ram_gb      INT,
    min_storage_gb  INT,
    rec_cpu         VARCHAR(200),
    rec_gpu         VARCHAR(200),
    rec_ram_gb      INT,
    ultra_cpu       VARCHAR(200),
    ultra_gpu       VARCHAR(200),
    ultra_ram_gb    INT
);

-- ----------------------------------------------------------------
-- Sosyal Medya Ayarları (Admin panelden yönetilir)
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS site_settings (
    key         VARCHAR(200) PRIMARY KEY,
    value       TEXT,
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Varsayılan ayarlar
INSERT INTO site_settings (key, value) VALUES
    ('social_instagram', ''),
    ('social_youtube', ''),
    ('social_discord', ''),
    ('social_twitch', ''),
    ('social_tiktok', ''),
    ('social_x', ''),
    ('site_name', 'HepsiGaming'),
    ('logo_dark', ''),
    ('logo_light', ''),
    ('affiliate_amazon_tag', ''),
    ('affiliate_trendyol_id', '')
ON CONFLICT (key) DO NOTHING;

-- ----------------------------------------------------------------
-- İndirim / Kupon Köşesi
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS deals (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title       VARCHAR(500) NOT NULL,
    description TEXT,
    platform    VARCHAR(100),               -- Steam, Epic, Razer, vb.
    discount_pct INT,                       -- %30 indirim
    original_price DECIMAL(12,2),
    deal_price  DECIMAL(12,2),
    deal_url    TEXT,
    image_url   TEXT,
    is_free     BOOLEAN DEFAULT FALSE,      -- Ücretsiz oyun/içerik
    expires_at  TIMESTAMPTZ,
    is_active   BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------
-- Trigger: Yorum eklenince user badge güncelle
-- ----------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_user_badge()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE users SET
        review_count = review_count + 1,
        badge = CASE
            WHEN review_count + 1 >= 50 THEN 'Donanım Gurusu'
            WHEN review_count + 1 >= 20 THEN 'Pro Gamer'
            WHEN review_count + 1 >= 5  THEN 'Gamer'
            ELSE badge
        END
    WHERE id = NEW.user_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_user_badge
AFTER INSERT ON reviews
FOR EACH ROW EXECUTE FUNCTION update_user_badge();

-- ----------------------------------------------------------------
-- Trigger: Ürün güncellenince updated_at'i set et
-- ----------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_brands_updated_at
BEFORE UPDATE ON brands
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
