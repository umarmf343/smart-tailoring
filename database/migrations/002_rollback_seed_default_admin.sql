-- Rollback: 002_seed_default_admin
-- Purpose: Remove the seeded super admin account if rollback is requested

DELETE FROM `admins`
WHERE `username` = 'admin'
  AND `email` = 'anupamkushwaha639@gmail.com';
