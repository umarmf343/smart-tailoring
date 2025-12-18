-- Migration: 004_create_customers_table
-- Purpose: Provide customers table required by authentication, profile, and admin flows
-- Notes:
--   - Includes email verification, blocking, and activity metadata
--   - Adds indexes for login lookups and admin filters

CREATE TABLE IF NOT EXISTS `customers` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `full_name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(20) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `address` TEXT DEFAULT NULL,
    `profile_image` VARCHAR(500) DEFAULT NULL,
    `email_verified` TINYINT(1) NOT NULL DEFAULT 0,
    `email_verified_at` DATETIME DEFAULT NULL,
    `is_active` TINYINT(1) NOT NULL DEFAULT 1,
    `is_blocked` TINYINT(1) NOT NULL DEFAULT 0,
    `blocked_at` DATETIME DEFAULT NULL,
    `blocked_by_admin_id` INT UNSIGNED DEFAULT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uniq_customer_email` (`email`),
    UNIQUE KEY `uniq_customer_phone` (`phone`),
    KEY `idx_customer_status` (`is_active`, `is_blocked`),
    KEY `idx_customer_created` (`created_at`),
    CONSTRAINT `fk_customers_blocked_by` FOREIGN KEY (`blocked_by_admin_id`) REFERENCES `admins` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

