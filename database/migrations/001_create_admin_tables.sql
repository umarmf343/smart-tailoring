-- Migration: 001_create_admin_tables
-- Purpose: Ensure core admin tables exist for authentication and audit logging
-- Applies to: admins, admin_activity_log
-- Notes:
--   - Creates admins table with role management and email verification support
--   - Creates admin_activity_log table used across the admin panel for auditing

CREATE TABLE IF NOT EXISTS `admins` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(100) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `full_name` VARCHAR(255) DEFAULT NULL,
    `name` VARCHAR(255) DEFAULT NULL,
    `email` VARCHAR(255) NOT NULL,
    `role` ENUM('super_admin', 'admin', 'moderator') NOT NULL DEFAULT 'admin',
    `is_active` TINYINT(1) NOT NULL DEFAULT 1,
    `email_verified` TINYINT(1) NOT NULL DEFAULT 0,
    `email_verified_at` DATETIME DEFAULT NULL,
    `last_login` DATETIME DEFAULT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uniq_admin_username` (`username`),
    UNIQUE KEY `uniq_admin_email` (`email`),
    KEY `idx_admin_role_active` (`role`, `is_active`),
    KEY `idx_admin_email_verified` (`email_verified`),
    KEY `idx_admin_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `admin_activity_log` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `admin_id` INT UNSIGNED NOT NULL DEFAULT 0,
    `action_type` VARCHAR(100) NOT NULL,
    `action_description` TEXT NOT NULL,
    `target_type` VARCHAR(100) DEFAULT NULL,
    `target_id` INT UNSIGNED DEFAULT NULL,
    `ip_address` VARCHAR(45) DEFAULT NULL,
    `user_agent` VARCHAR(512) DEFAULT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_admin_action` (`admin_id`, `action_type`),
    KEY `idx_admin_log_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
