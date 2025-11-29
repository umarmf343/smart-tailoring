# Smart Tailoring Service - Migration Guide

## Overview
This migration adds the full tailoring business workflow to your existing database, including:
- Measurement management system
- Multi-stage order status tracking
- Order history/audit trail
- Support for fittings, alterations, and reorders

## Migration Files
- `001_add_tailoring_workflow.sql` - Main migration (adds tables and columns)
- `001_rollback_tailoring_workflow.sql` - Rollback script (removes changes)
- `verify_migration.sql` - Verification queries

## Pre-Migration Checklist
1. ✅ Backup your database:
   ```sql
   mysqldump -u root smart_tailoring > backup_before_migration_$(date +%Y%m%d).sql
   ```

2. ✅ Check current database state:
   ```sql
   USE smart_tailoring;
   SHOW TABLES;
   DESCRIBE orders;
   SELECT COUNT(*) FROM orders;
   ```

3. ✅ Verify you have write permissions and sufficient disk space

## Running the Migration

### Option 1: Via phpMyAdmin
1. Open phpMyAdmin (http://localhost/phpmyadmin)
2. Select `smart_tailoring` database
3. Click "SQL" tab
4. Copy-paste contents of `001_add_tailoring_workflow.sql`
5. Click "Go"
6. Check for success messages

### Option 2: Via Command Line (PowerShell)
```powershell
# Navigate to XAMPP mysql bin
cd C:\xampp\mysql\bin

# Run migration
.\mysql.exe -u root smart_tailoring < "C:\xampp\htdocs\smart\smart-tailoring\database\migrations\001_add_tailoring_workflow.sql"

# Verify
.\mysql.exe -u root smart_tailoring < "C:\xampp\htdocs\smart\smart-tailoring\database\migrations\verify_migration.sql"
```

### Option 3: Via MySQL Workbench
1. Open MySQL Workbench
2. Connect to localhost (root user)
3. Open SQL file: File → Open SQL Script
4. Select `001_add_tailoring_workflow.sql`
5. Execute: Query → Execute (All or Selection)

## Post-Migration Verification

Run these queries to verify success:

```sql
-- Check new tables exist
SHOW TABLES LIKE 'measurements';
SHOW TABLES LIKE 'order_history';
SHOW TABLES LIKE 'order_statuses';

-- Verify order_statuses data
SELECT code, label, sequence FROM order_statuses ORDER BY sequence;

-- Check new columns in orders table
DESCRIBE orders;

-- Test views
SELECT * FROM v_active_orders LIMIT 1;

-- Check triggers
SHOW TRIGGERS WHERE `Trigger` LIKE 'trg_orders%';
```

Expected results:
- 3 new tables created (measurements, order_history, order_statuses, order_status_transitions)
- 13 new columns added to orders table
- 11 rows in order_statuses table
- 17 rows in order_status_transitions table
- 2 triggers created
- 2 views created

## What Changed

### New Tables
1. **measurements** - Stores customer body measurements
2. **order_history** - Audit trail for order status changes
3. **order_statuses** - Reference table for valid statuses
4. **order_status_transitions** - Defines allowed status changes

### Enhanced Orders Table
New columns added:
- `fabric_type`, `fabric_color` - Fabric selection
- `design_specifications` (JSON) - Design choices
- `measurements_snapshot` (JSON) - Measurement snapshot
- `measurement_id` - Link to measurements table
- `deadline` - Expected completion date
- `first_fitting_date`, `final_fitting_date` - Fitting appointments
- `deposit_amount`, `deposit_paid_at`, `balance_due` - Payment tracking
- `alteration_notes`, `alteration_count` - Alteration tracking
- `source_order_id` - For reorders

### New Order Statuses
The order lifecycle now includes:
1. pending → booked → cutting → stitching
2. → first_fitting → alterations (if needed)
3. → final_fitting → ready_for_pickup → delivered

## Testing the Migration

### 1. Create Sample Measurement
```sql
INSERT INTO measurements (customer_id, label, garment_context, measurements_data, is_default)
VALUES (
  1,
  'Test Shirt Measurement',
  'shirt',
  '{"unit":"inches","chest":40,"shoulder":17,"sleeve_length":24,"neck":15.5,"waist":34}',
  1
);

SELECT * FROM measurements WHERE customer_id = 1;
```

### 2. Update Order Status
```sql
-- Update an existing order to new status
UPDATE orders 
SET order_status = 'booked' 
WHERE id = 1;

-- Check history was created automatically
SELECT * FROM order_history WHERE order_id = 1;
```

### 3. Test Status Transitions
```sql
-- Check valid transitions for 'booked' status
SELECT from_status, to_status, allowed_for 
FROM order_status_transitions 
WHERE from_status = 'booked';
```

## Rollback Instructions

If you need to undo this migration:

```powershell
# Via command line
cd C:\xampp\mysql\bin
.\mysql.exe -u root smart_tailoring < "C:\xampp\htdocs\smart\smart-tailoring\database\migrations\001_rollback_tailoring_workflow.sql"
```

**⚠️ WARNING:** Rollback will delete:
- All measurement records
- All order history records
- New columns from orders table (data will be lost)

Always backup before rollback!

## Common Issues & Solutions

### Issue: Duplicate column error
**Solution:** You may have already added some columns manually. Edit migration to skip those columns.

### Issue: Foreign key constraint fails
**Solution:** Ensure referenced customer_id/order_id exist in parent tables.

### Issue: Trigger already exists
**Solution:** Drop existing trigger first:
```sql
DROP TRIGGER IF EXISTS trg_orders_status_change;
```

### Issue: Enum modification fails
**Solution:** Check if any orders have statuses not in new enum. Update them first.

## Next Steps

After successful migration:

1. ✅ Update API endpoints to use new tables
2. ✅ Create OrderRepository and OrderService classes
3. ✅ Update frontend forms to capture measurements
4. ✅ Test order creation with measurements
5. ✅ Test status transitions
6. ✅ Implement order history display in UI

## Sample API Requests

After implementing endpoints, test with:

```bash
# Create order with measurements
curl -X POST http://localhost/smart/smart-tailoring/api/orders/create_order.php \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": 1,
    "tailor_id": 1,
    "garment_type": "shirt",
    "fabric_type": "Cotton",
    "measurements": {"chest": 40, "sleeve": 24},
    "deadline": "2025-12-15"
  }'

# Update status
curl -X POST http://localhost/smart/smart-tailoring/api/orders/update_status.php \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": 1,
    "new_status": "cutting",
    "notes": "Started cutting fabric"
  }'
```

## Support

If you encounter issues:
1. Check Apache error log: `C:\xampp\apache\logs\error.log`
2. Check MySQL error log: `C:\xampp\mysql\data\*.err`
3. Verify database user permissions
4. Ensure InnoDB engine is enabled (for foreign keys)

## Database Schema Diagram

```
customers (existing)
    ↓ 1:N
measurements (new) ← stores reusable measurement sets
    
customers (existing) ← 1:N → orders (enhanced)
tailors (existing)   ← 1:N ↗
    ↓ 1:N
order_history (new) ← audit trail

order_statuses (new) ← reference data
order_status_transitions (new) ← validation rules
```

---
**Migration Version:** 001  
**Date:** 2025-11-11  
**Compatibility:** MySQL 5.7+, MariaDB 10.2+
