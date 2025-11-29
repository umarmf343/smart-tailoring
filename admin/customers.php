<?php

/**
 * Admin - Customer Management
 * View and manage customers
 */

// Security check
require_once 'includes/admin_security.php';

// Database connection
define('DB_ACCESS', true);
require_once '../config/db.php';

// Handle actions
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    $customer_id = intval($_POST['customer_id']);
    $action = $_POST['action'];

    try {
        if ($action === 'block') {
            // Block customer
            $stmt = $conn->prepare("UPDATE customers SET is_blocked = 1, blocked_at = NOW(), blocked_by_admin_id = ? WHERE id = ?");
            $stmt->bind_param("ii", $admin_id, $customer_id);
            $stmt->execute();

            logActivity('block_customer', "Blocked customer ID: $customer_id", 'customer', $customer_id);
            $success_message = "Customer blocked successfully!";
        } elseif ($action === 'unblock') {
            // Unblock customer
            $stmt = $conn->prepare("UPDATE customers SET is_blocked = 0, blocked_at = NULL, blocked_by_admin_id = NULL WHERE id = ?");
            $stmt->bind_param("i", $customer_id);
            $stmt->execute();

            logActivity('unblock_customer', "Unblocked customer ID: $customer_id", 'customer', $customer_id);
            $success_message = "Customer unblocked successfully!";
        }
    } catch (Exception $e) {
        $error_message = "Error: " . $e->getMessage();
    }
}

// Get filter
$filter = $_GET['filter'] ?? 'all';
$search = $_GET['search'] ?? '';

// Build query
$where_conditions = [];
$params = [];
$types = '';

if ($filter === 'active') {
    $where_conditions[] = "is_blocked = 0";
} elseif ($filter === 'blocked') {
    $where_conditions[] = "is_blocked = 1";
}

if (!empty($search)) {
    $where_conditions[] = "(full_name LIKE ? OR email LIKE ? OR phone LIKE ?)";
    $search_param = "%$search%";
    $params = array_merge($params, [$search_param, $search_param, $search_param]);
    $types .= 'sss';
}

$where_clause = !empty($where_conditions) ? 'WHERE ' . implode(' AND ', $where_conditions) : '';

// Get customers
$query = "SELECT * FROM customers $where_clause ORDER BY created_at DESC";
$stmt = $conn->prepare($query);

if (!empty($params)) {
    $stmt->bind_param($types, ...$params);
}

$stmt->execute();
$result = $stmt->get_result();
$customers = $result->fetch_all(MYSQLI_ASSOC);

// Get counts for tabs
$total_result = db_fetch_one("SELECT COUNT(*) as count FROM customers");
$total_count = $total_result['count'] ?? 0;

$active_result = db_fetch_one("SELECT COUNT(*) as count FROM customers WHERE is_blocked = 0");
$active_count = $active_result['count'] ?? 0;

$blocked_result = db_fetch_one("SELECT COUNT(*) as count FROM customers WHERE is_blocked = 1");
$blocked_count = $blocked_result['count'] ?? 0;

db_close();
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Customer Management - Admin Panel</title>

    <link rel="icon" type="image/jpg" href="../assets/images/STP-favicon.jpg">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="assets/admin.css">

    <style>
        .filter-tabs {
            display: flex;
            gap: 1rem;
            margin-bottom: 2rem;
            border-bottom: 2px solid var(--border-color);
        }

        .filter-tab {
            padding: 1rem 1.5rem;
            background: none;
            border: none;
            font-family: 'Poppins', sans-serif;
            font-weight: 600;
            color: var(--text-light);
            cursor: pointer;
            position: relative;
            transition: all 0.3s ease;
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .filter-tab:hover {
            color: var(--primary-color);
        }

        .filter-tab.active {
            color: var(--primary-color);
        }

        .filter-tab.active::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        }

        .tab-count {
            background: var(--light-color);
            padding: 0.15rem 0.6rem;
            border-radius: 12px;
            font-size: 0.85rem;
        }

        .filter-tab.active .tab-count {
            background: var(--primary-color);
            color: white;
        }

        .search-bar {
            margin-bottom: 2rem;
        }

        .search-bar form {
            display: flex;
            gap: 1rem;
            align-items: center;
        }

        .search-bar input[type="text"] {
            flex: 1;
            max-width: 500px;
            padding: 0.9rem 1rem 0.9rem 3rem;
            border: 2px solid var(--border-color);
            border-radius: 10px;
            font-family: 'Poppins', sans-serif;
            font-size: 0.95rem;
            background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23888' viewBox='0 0 512 512'%3E%3Cpath d='M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z'/%3E%3C/svg%3E") no-repeat 1rem center;
            background-size: 1rem;
        }

        .search-bar button {
            padding: 0.9rem 2rem;
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            color: white;
            border: none;
            border-radius: 10px;
            font-family: 'Poppins', sans-serif;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .search-bar button:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow-lg);
        }

        .btn-secondary {
            padding: 0.9rem 2rem;
            background: var(--light-color);
            color: var(--text-dark);
            border: none;
            border-radius: 10px;
            font-family: 'Poppins', sans-serif;
            font-weight: 600;
            cursor: pointer;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            transition: all 0.3s ease;
        }

        .btn-secondary:hover {
            background: var(--border-color);
        }
    </style>
</head>

<body>
    <?php include 'includes/admin_nav.php'; ?>

    <div class="admin-container">
        <div class="page-header">
            <h1><i class="fas fa-users"></i> Customer Management</h1>
            <p>View and manage customer accounts</p>
        </div>

        <?php if (isset($success_message)): ?>
            <div class="alert alert-success">
                <i class="fas fa-check-circle"></i>
                <?php echo $success_message; ?>
            </div>
        <?php endif; ?>

        <?php if (isset($error_message)): ?>
            <div class="alert alert-danger">
                <i class="fas fa-exclamation-circle"></i>
                <?php echo $error_message; ?>
            </div>
        <?php endif; ?>

        <!-- Filter Tabs -->
        <div class="filter-tabs">
            <a href="?filter=all" class="filter-tab <?php echo $filter === 'all' ? 'active' : ''; ?>">
                <i class="fas fa-list"></i> All
                <span class="tab-count"><?php echo $total_count; ?></span>
            </a>
            <a href="?filter=active" class="filter-tab <?php echo $filter === 'active' ? 'active' : ''; ?>">
                <i class="fas fa-check-circle"></i> Active
                <span class="tab-count"><?php echo $active_count; ?></span>
            </a>
            <a href="?filter=blocked" class="filter-tab <?php echo $filter === 'blocked' ? 'active' : ''; ?>">
                <i class="fas fa-ban"></i> Blocked
                <span class="tab-count"><?php echo $blocked_count; ?></span>
            </a>
        </div>

        <!-- Search Bar -->
        <div class="search-bar">
            <form method="GET" action="">
                <input type="hidden" name="filter" value="<?php echo htmlspecialchars($filter); ?>">
                <input type="text" name="search" placeholder="Search by name, email, or phone..." value="<?php echo htmlspecialchars($search); ?>">
                <button type="submit"><i class="fas fa-search"></i> Search</button>
                <?php if (!empty($search)): ?>
                    <a href="?filter=<?php echo $filter; ?>" class="btn-secondary">
                        <i class="fas fa-times"></i> Clear
                    </a>
                <?php endif; ?>
            </form>
        </div>

        <!-- Customers Table -->
        <div class="card">
            <div class="table-responsive">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Address</th>
                            <th>Joined</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if (empty($customers)): ?>
                            <tr>
                                <td colspan="8" style="text-align: center; padding: 2rem; color: var(--text-light);">
                                    <i class="fas fa-inbox" style="font-size: 3rem; margin-bottom: 1rem; display: block;"></i>
                                    No customers found
                                </td>
                            </tr>
                        <?php else: ?>
                            <?php foreach ($customers as $customer): ?>
                                <tr>
                                    <td>#<?php echo $customer['id']; ?></td>
                                    <td>
                                        <strong><?php echo htmlspecialchars($customer['full_name']); ?></strong>
                                    </td>
                                    <td><?php echo htmlspecialchars($customer['email']); ?></td>
                                    <td><?php echo htmlspecialchars($customer['phone']); ?></td>
                                    <td><?php echo htmlspecialchars($customer['address'] ?? 'N/A'); ?></td>
                                    <td><?php echo date('M d, Y', strtotime($customer['created_at'])); ?></td>
                                    <td>
                                        <?php if ($customer['is_blocked']): ?>
                                            <span class="badge badge-danger">
                                                <i class="fas fa-ban"></i> Blocked
                                            </span>
                                        <?php else: ?>
                                            <span class="badge badge-success">
                                                <i class="fas fa-check-circle"></i> Active
                                            </span>
                                        <?php endif; ?>
                                    </td>
                                    <td>
                                        <div class="action-buttons">
                                            <?php if ($customer['is_blocked']): ?>
                                                <form method="POST" style="display: inline;" onsubmit="return confirm('Unblock this customer?');">
                                                    <input type="hidden" name="action" value="unblock">
                                                    <input type="hidden" name="customer_id" value="<?php echo $customer['id']; ?>">
                                                    <button type="submit" class="btn-action btn-success" title="Unblock">
                                                        <i class="fas fa-check-circle"></i>
                                                    </button>
                                                </form>
                                            <?php else: ?>
                                                <form method="POST" style="display: inline;" onsubmit="return confirm('Block this customer?');">
                                                    <input type="hidden" name="action" value="block">
                                                    <input type="hidden" name="customer_id" value="<?php echo $customer['id']; ?>">
                                                    <button type="submit" class="btn-action btn-danger" title="Block">
                                                        <i class="fas fa-ban"></i>
                                                    </button>
                                                </form>
                                            <?php endif; ?>
                                        </div>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <script src="assets/admin.js"></script>
</body>

</html>