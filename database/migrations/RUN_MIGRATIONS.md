# Database Migrations

## How to Run Migrations

You need to run these SQL files in your MySQL database (phpMyAdmin or MySQL command line).

### Step 1: Run Migration 002 (Tailor Location Feature)
```sql
-- Open phpMyAdmin
-- Select your database (smart_tailoring)
-- Go to SQL tab
-- Copy and paste the contents of: 002_add_tailor_location.sql
-- Click "Go" to execute
```

### Step 2: Run Migration 003 (Password Reset Feature)
```sql
-- Open phpMyAdmin
-- Select your database (smart_tailoring)
-- Go to SQL tab
-- Copy and paste the contents of: 003_create_password_resets.sql
-- Click "Go" to execute
```

## Verify Migrations

After running the migrations, you can verify by running these queries:

```sql
-- Check if tailor location columns exist
DESCRIBE tailors;
-- Should see: latitude, longitude, location_updated_at columns

-- Check if password_resets table exists
SHOW TABLES LIKE 'password_resets';
-- Should return: password_resets

-- Check password_resets table structure
DESCRIBE password_resets;
```

## Migration Files

1. **002_add_tailor_location.sql** - Adds location tracking to tailors
   - Adds: latitude, longitude, location_updated_at
   - Needed for: Map integration feature

2. **003_create_password_resets.sql** - Creates password reset system
   - Creates: password_resets table
   - Needed for: Forgot password feature
   - Stores: tokens, expiry times, user types
