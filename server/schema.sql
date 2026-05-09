-- ============================================
-- VIRASAT-CONNECT DATABASE SCHEMA
-- Run this file first: mysql -u root -p < schema.sql
-- ============================================

CREATE DATABASE IF NOT EXISTS virasat_connect CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE virasat_connect;

-- ============================================
-- TABLE: artisans
-- Stores registered artisan accounts
-- ============================================
CREATE TABLE IF NOT EXISTS artisans (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(150)  NOT NULL,
  email         VARCHAR(255)  NOT NULL UNIQUE,
  password_hash VARCHAR(255)  NOT NULL,
  craft         VARCHAR(100)  NOT NULL COMMENT 'e.g. Weaver, Woodworker, Potter',
  village       VARCHAR(150)  NOT NULL,
  state         VARCHAR(100)  NOT NULL,
  bio           TEXT,
  avatar_url    VARCHAR(500)  DEFAULT NULL,
  created_at    DATETIME      DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================
-- TABLE: products
-- Each product belongs to one artisan (FK)
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  artisan_id      INT           NOT NULL,
  name            VARCHAR(200)  NOT NULL,
  material        VARCHAR(300)  NOT NULL COMMENT 'Comma-separated materials used',
  hours_worked    DECIMAL(6,2)  NOT NULL COMMENT 'Time taken in hours',
  material_cost   DECIMAL(10,2) NOT NULL COMMENT 'Raw material cost in INR',
  suggested_price DECIMAL(10,2) NOT NULL COMMENT 'Fair-trade calculated price in INR',
  final_price     DECIMAL(10,2) NOT NULL COMMENT 'Artisan\'s chosen selling price in INR',
  story           TEXT          NOT NULL COMMENT 'The human story behind this product',
  image_url       VARCHAR(500)  DEFAULT NULL COMMENT 'Path to uploaded product image',
  certificate_id  VARCHAR(64)   NOT NULL UNIQUE COMMENT 'UUID for QR code & certificate',
  is_sold         TINYINT(1)    DEFAULT 0,
  created_at      DATETIME      DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_products_artisan
    FOREIGN KEY (artisan_id) REFERENCES artisans(id)
    ON DELETE CASCADE ON UPDATE CASCADE,

  INDEX idx_certificate_id (certificate_id),
  INDEX idx_artisan_id (artisan_id)
) ENGINE=InnoDB;

-- ============================================
-- SAMPLE SEED DATA (optional, for testing)
-- Password: 'password123' (bcrypt hashed)
-- ============================================
INSERT INTO artisans (name, email, password_hash, craft, village, state, bio) VALUES
(
  'Razia Begum',
  'razia@example.com',
  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.',
  'Pashmina Weaver',
  'Kanihama',
  'Jammu & Kashmir',
  'Third-generation Pashmina weaver from the valley of Kashmir. Each shawl carries the whispers of 400 years of craft tradition.'
);
