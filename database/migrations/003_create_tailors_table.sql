-- Migration: 003_create_tailors_table
-- Purpose: Create core tailors table used across authentication, profile, and admin flows
-- Notes:
--   - Includes verification and blocking metadata for admin actions
--   - Supports location storage for map features
--   - Adds rating/review counters used by storefront listings

CREATE TABLE IF NOT EXISTS `tailors` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `shop_name` VARCHAR(255) NOT NULL,
    `owner_name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(20) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `shop_address` VARCHAR(255) NOT NULL,
    `area` VARCHAR(100) DEFAULT 'Satna',
    `speciality` VARCHAR(255) DEFAULT 'General Tailoring',
    `services_offered` TEXT,
    `experience_years` INT UNSIGNED DEFAULT 0,
    `price_range` VARCHAR(50) DEFAULT 'medium',
    `rating` DECIMAL(3,2) NOT NULL DEFAULT 0.00,
    `total_reviews` INT UNSIGNED NOT NULL DEFAULT 0,
    `total_orders` INT UNSIGNED NOT NULL DEFAULT 0,
    `profile_image` VARCHAR(500) DEFAULT NULL,
    `shop_image` VARCHAR(500) DEFAULT NULL,
    `email_verified` TINYINT(1) NOT NULL DEFAULT 0,
    `is_active` TINYINT(1) NOT NULL DEFAULT 1,
    `is_verified` TINYINT(1) NOT NULL DEFAULT 0,
    `is_blocked` TINYINT(1) NOT NULL DEFAULT 0,
    `verified_by_admin_id` INT UNSIGNED DEFAULT NULL,
    `verified_at` DATETIME DEFAULT NULL,
    `blocked_by_admin_id` INT UNSIGNED DEFAULT NULL,
    `blocked_at` DATETIME DEFAULT NULL,
    `latitude` DECIMAL(10,7) DEFAULT NULL,
    `longitude` DECIMAL(10,7) DEFAULT NULL,
    `location_updated_at` DATETIME DEFAULT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uniq_tailor_email` (`email`),
    UNIQUE KEY `uniq_tailor_phone` (`phone`),
    KEY `idx_tailor_status` (`is_active`, `is_verified`, `is_blocked`),
    KEY `idx_tailor_rating` (`rating`),
    KEY `idx_tailor_location` (`latitude`, `longitude`),
    CONSTRAINT `fk_tailors_verified_by` FOREIGN KEY (`verified_by_admin_id`) REFERENCES `admins` (`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_tailors_blocked_by` FOREIGN KEY (`blocked_by_admin_id`) REFERENCES `admins` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
