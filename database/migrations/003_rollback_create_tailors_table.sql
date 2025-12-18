-- Rollback: 003_create_tailors_table
-- Purpose: Drop tailors table if migration needs to be reverted

DROP TABLE IF EXISTS `tailors`;
