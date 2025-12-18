-- Migration: 002_seed_default_admin
-- Purpose: Seed an initial super admin account for first-time access
-- Notes:
--   - Uses a pre-generated bcrypt hash for the admin password
--   - Executes only when no admin with the same username or email exists
--   - Creates the admins table if it is missing (for safety when migrations are run out of order)

-- Ensure admins table exists (fails gracefully if already present)
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

INSERT INTO `admins` (username, password, full_name, name, email, role, created_at)
SELECT 'admin', '$2y$10$MODBHPvBOti2/05IkJPgDOpJLRdrBf3bOcwhz4NQOSANVR8wUkZuu', 'Administrator', 'Administrator', 'anupamkushwaha639@gmail.com', 'super_admin', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM `admins` WHERE `username` = 'admin' OR `email` = 'anupamkushwaha639@gmail.com'
);
