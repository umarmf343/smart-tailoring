# Database Migrations

# How to Run Migrations

These migrations prepare the database tables used by the application, including the admin accounts that power the admin panel.

## Quick CLI Run (recommended)

```bash
php migrate.php status   # See pending migrations
php migrate.php run      # Execute pending migrations (admins + OTP columns)
```

## Manual Run via phpMyAdmin

1. Open phpMyAdmin and select your database (e.g., `smart_tailoring`).
2. Go to the **SQL** tab.
3. Run the migrations in this order:
   - `001_create_admin_tables.sql` (creates `admins` and `admin_activity_log`)
   - `add_otp_columns.sql` (adds OTP tracking columns on `orders`)

## Verify Migrations

After running the migrations, verify the key tables and columns exist:

```sql
-- Admin tables
SHOW TABLES LIKE 'admins';
SHOW TABLES LIKE 'admin_activity_log';

-- Admin structure (should include username, password, role, is_active, email_verified, last_login)
DESCRIBE admins;

-- OTP columns on orders
DESCRIBE orders;
-- Should include: start_otp, start_otp_verified_at, delivery_otp, delivery_otp_verified_at
```

If any table or column is missing, re-run `php migrate.php run` or execute the specific SQL file above.
