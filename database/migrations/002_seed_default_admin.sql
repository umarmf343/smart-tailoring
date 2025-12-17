-- Migration: 002_seed_default_admin
-- Purpose: Seed an initial super admin account for first-time access
-- Notes:
--   - Uses a pre-generated bcrypt hash for the admin password
--   - Executes only when no admin with the same username or email exists

INSERT INTO `admins` (username, password, full_name, name, email, role, created_at)
SELECT 'admin', '$2y$10$zAM5U232ptyS7eLA7pgS.OtX.0quZAVZdBhATPOzMYXYxN6eGYUe2', 'Administrator', 'Administrator', 'anupamkushwaha639@gmail.com', 'super_admin', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM `admins` WHERE `username` = 'admin' OR `email` = 'anupamkushwaha639@gmail.com'
);
