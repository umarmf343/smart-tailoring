-- Migration: 006_create_supporting_tables
-- Purpose: Create supporting tables used by authentication, notifications, reviews, and measurements
-- Notes:
--   - Uses IF NOT EXISTS guards for safe re-runs
--   - Seeds measurement_fields with common defaults to power the dynamic measurements UI

CREATE TABLE IF NOT EXISTS `email_otp` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(255) NOT NULL,
    `otp_code` VARCHAR(10) NOT NULL,
    `purpose` VARCHAR(50) NOT NULL DEFAULT 'registration',
    `user_type` VARCHAR(20) DEFAULT NULL,
    `user_id` INT UNSIGNED DEFAULT NULL,
    `attempts` INT UNSIGNED NOT NULL DEFAULT 0,
    `is_verified` TINYINT(1) NOT NULL DEFAULT 0,
    `expires_at` DATETIME NOT NULL,
    `verified_at` DATETIME DEFAULT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_email_purpose` (`email`, `purpose`),
    KEY `idx_verified` (`is_verified`, `verified_at`),
    KEY `idx_expires` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `password_resets` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_type` ENUM('customer','tailor','admin') NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `token` VARCHAR(255) NOT NULL,
    `expires_at` DATETIME NOT NULL,
    `used` TINYINT(1) NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uniq_reset_token` (`token`),
    KEY `idx_reset_email` (`email`, `user_type`),
    KEY `idx_reset_expires` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `notifications` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` INT UNSIGNED NOT NULL,
    `user_type` ENUM('customer','tailor') NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `message` TEXT NOT NULL,
    `type` VARCHAR(100) DEFAULT NULL,
    `related_id` INT UNSIGNED DEFAULT NULL,
    `is_read` TINYINT(1) NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_notification_user` (`user_id`, `user_type`, `is_read`),
    KEY `idx_notification_related` (`related_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `reviews` (
    `review_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `tailor_id` INT UNSIGNED NOT NULL,
    `customer_id` INT UNSIGNED NOT NULL,
    `order_id` INT UNSIGNED NOT NULL,
    `rating` DECIMAL(3,2) NOT NULL DEFAULT 0.00,
    `review_text` TEXT,
    `is_verified` TINYINT(1) NOT NULL DEFAULT 1,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`review_id`),
    KEY `idx_review_tailor` (`tailor_id`),
    KEY `idx_review_customer` (`customer_id`),
    KEY `idx_review_order` (`order_id`),
    CONSTRAINT `fk_reviews_tailor` FOREIGN KEY (`tailor_id`) REFERENCES `tailors` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_reviews_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `order_history` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `order_id` INT UNSIGNED NOT NULL,
    `old_status` VARCHAR(50) DEFAULT NULL,
    `new_status` VARCHAR(50) NOT NULL,
    `changed_by_id` INT UNSIGNED DEFAULT NULL,
    `changed_by_type` ENUM('customer','tailor','system') DEFAULT 'system',
    `notes` TEXT DEFAULT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_order_history_order` (`order_id`),
    KEY `idx_order_history_user` (`changed_by_id`, `changed_by_type`),
    CONSTRAINT `fk_order_history_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `measurement_fields` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `field_name` VARCHAR(100) NOT NULL,
    `display_name` VARCHAR(150) NOT NULL,
    `field_category` VARCHAR(50) DEFAULT 'body',
    `data_type` ENUM('decimal','integer','text') NOT NULL DEFAULT 'decimal',
    `unit` VARCHAR(20) DEFAULT 'cm',
    `garment_types` JSON DEFAULT NULL,
    `is_required` TINYINT(1) NOT NULL DEFAULT 0,
    `min_value` DECIMAL(10,2) DEFAULT NULL,
    `max_value` DECIMAL(10,2) DEFAULT NULL,
    `sort_order` INT UNSIGNED DEFAULT 0,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uniq_measurement_field` (`field_name`),
    KEY `idx_measurement_category` (`field_category`, `sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `measurements` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `customer_id` INT UNSIGNED NOT NULL,
    `label` VARCHAR(255) DEFAULT NULL,
    `garment_context` VARCHAR(50) DEFAULT 'full',
    `measurements_data` JSON NOT NULL,
    `is_default` TINYINT(1) NOT NULL DEFAULT 0,
    `notes` TEXT DEFAULT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_measurements_customer` (`customer_id`, `garment_context`),
    KEY `idx_measurements_default` (`customer_id`, `is_default`),
    CONSTRAINT `fk_measurements_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `measurement_values` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `measurement_id` INT UNSIGNED NOT NULL,
    `field_id` INT UNSIGNED NOT NULL,
    `value_decimal` DECIMAL(10,2) DEFAULT NULL,
    `value_text` VARCHAR(255) DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_measurement_values_measurement` (`measurement_id`),
    KEY `idx_measurement_values_field` (`field_id`),
    CONSTRAINT `fk_measurement_values_measurement` FOREIGN KEY (`measurement_id`) REFERENCES `measurements` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_measurement_values_field` FOREIGN KEY (`field_id`) REFERENCES `measurement_fields` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Seed common measurement fields (idempotent)
INSERT IGNORE INTO measurement_fields (field_name, display_name, field_category, data_type, unit, garment_types, sort_order) VALUES
('chest', 'Chest', 'body', 'decimal', 'cm', JSON_ARRAY('shirt','blazer','kurta','dress','full'), 10),
('waist', 'Waist', 'body', 'decimal', 'cm', JSON_ARRAY('pants','skirt','dress','full'), 20),
('hip', 'Hip', 'body', 'decimal', 'cm', JSON_ARRAY('pants','skirt','dress','full'), 30),
('shoulder_width', 'Shoulder Width', 'body', 'decimal', 'cm', JSON_ARRAY('shirt','blazer','kurta','full'), 40),
('sleeve_length', 'Sleeve Length', 'body', 'decimal', 'cm', JSON_ARRAY('shirt','blazer','kurta','full'), 50),
('shirt_length', 'Shirt Length', 'garment', 'decimal', 'cm', JSON_ARRAY('shirt','kurta'), 60),
('inseam', 'Inseam', 'garment', 'decimal', 'cm', JSON_ARRAY('pants'), 70),
('outseam', 'Outseam', 'garment', 'decimal', 'cm', JSON_ARRAY('pants'), 80),
('thigh', 'Thigh', 'body', 'decimal', 'cm', JSON_ARRAY('pants'), 90),
('ankle', 'Ankle', 'body', 'decimal', 'cm', JSON_ARRAY('pants'), 100),
('neck', 'Neck', 'body', 'decimal', 'cm', JSON_ARRAY('shirt','blazer','kurta','full'), 110),
('bicep', 'Bicep', 'body', 'decimal', 'cm', JSON_ARRAY('shirt','blazer','kurta'), 120),
('armhole', 'Armhole', 'body', 'decimal', 'cm', JSON_ARRAY('shirt','dress'), 130),
('dress_length', 'Dress Length', 'garment', 'decimal', 'cm', JSON_ARRAY('dress'), 140),
('fit_preference', 'Fit Preference', 'preference', 'text', NULL, JSON_ARRAY('all'), 150),
('style_notes', 'Style Notes', 'preference', 'text', NULL, JSON_ARRAY('all'), 160);
