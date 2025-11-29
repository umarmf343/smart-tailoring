<?php

/**
 * Admin - Order Management
 * View and monitor orders
 */

// Security check
require_once 'includes/admin_security.php';

// Database connection
define('DB_ACCESS', true);
require_once '../config/db.php';

// Get filter
$filter = $_GET['filter'] ?? 'all';
$search = $_GET['search'] ?? '';

// Build query
$where_conditions = [];
$params = [];
$types = '';

if ($filter === 'pending') {
    $where_conditions[] = "o.order_status = 'pending'";
} elseif ($filter === 'processing') {
    $where_conditions[] = "o.order_status IN ('confirmed', 'in_progress', 'ready')";
} elseif ($filter === 'completed') {
    $where_conditions[] = "o.order_status IN ('delivered', 'completed')";
} elseif ($filter === 'cancelled') {
    $where_conditions[] = "o.order_status = 'cancelled'";
}

if (!empty($search)) {
    $where_conditions[] = "(c.full_name LIKE ? OR t.shop_name LIKE ? OR o.id = ?)";
    $search_param = "%$search%";
    $search_id = is_numeric($search) ? intval($search) : 0;
    $params = array_merge($params, [$search_param, $search_param, $search_id]);
    $types .= 'ssi';
}

$where_clause = !empty($where_conditions) ? 'WHERE ' . implode(' AND ', $where_conditions) : '';

// Get orders
$query = "SELECT o.*, 
          c.full_name as customer_name, c.email as customer_email,
          t.shop_name as tailor_name, t.owner_name as tailor_owner
          FROM orders o
          LEFT JOIN customers c ON o.customer_id = c.id
          LEFT JOIN tailors t ON o.tailor_id = t.id
          $where_clause
          ORDER BY o.created_at DESC";

$stmt = $conn->prepare($query);

if (!empty($params)) {
    $stmt->bind_param($types, ...$params);
}

$stmt->execute();
$result = $stmt->get_result();
$orders = $result->fetch_all(MYSQLI_ASSOC);

// Get counts for tabs
$total_result = db_fetch_one("SELECT COUNT(*) as count FROM orders");
$total_count = $total_result['count'] ?? 0;

$pending_result = db_fetch_one("SELECT COUNT(*) as count FROM orders WHERE order_status = 'pending'");
$pending_count = $pending_result['count'] ?? 0;

$processing_result = db_fetch_one("SELECT COUNT(*) as count FROM orders WHERE order_status IN ('confirmed', 'in_progress', 'ready')");
$processing_count = $processing_result['count'] ?? 0;

$completed_result = db_fetch_one("SELECT COUNT(*) as count FROM orders WHERE order_status IN ('delivered', 'completed')");
$completed_count = $completed_result['count'] ?? 0;

$cancelled_result = db_fetch_one("SELECT COUNT(*) as count FROM orders WHERE order_status = 'cancelled'");
$cancelled_count = $cancelled_result['count'] ?? 0;

db_close();
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Management - Admin Panel</title>

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
            <h1><i class="fas fa-shopping-cart"></i> Order Management</h1>
            <p>View and monitor all orders</p>
        </div>

        <!-- Filter Tabs -->
        <div class="filter-tabs">
            <a href="?filter=all" class="filter-tab <?php echo $filter === 'all' ? 'active' : ''; ?>">
                <i class="fas fa-list"></i> All
                <span class="tab-count"><?php echo $total_count; ?></span>
            </a>
            <a href="?filter=pending" class="filter-tab <?php echo $filter === 'pending' ? 'active' : ''; ?>">
                <i class="fas fa-clock"></i> Pending
                <span class="tab-count"><?php echo $pending_count; ?></span>
            </a>
            <a href="?filter=processing" class="filter-tab <?php echo $filter === 'processing' ? 'active' : ''; ?>">
                <i class="fas fa-spinner"></i> Processing
                <span class="tab-count"><?php echo $processing_count; ?></span>
            </a>
            <a href="?filter=completed" class="filter-tab <?php echo $filter === 'completed' ? 'active' : ''; ?>">
                <i class="fas fa-check-circle"></i> Completed
                <span class="tab-count"><?php echo $completed_count; ?></span>
            </a>
            <a href="?filter=cancelled" class="filter-tab <?php echo $filter === 'cancelled' ? 'active' : ''; ?>">
                <i class="fas fa-times-circle"></i> Cancelled
                <span class="tab-count"><?php echo $cancelled_count; ?></span>
            </a>
        </div>

        <!-- Search Bar -->
        <div class="search-bar">
            <form method="GET" action="">
                <input type="hidden" name="filter" value="<?php echo htmlspecialchars($filter); ?>">
                <input type="text" name="search" placeholder="Search by order ID, customer, or tailor..." value="<?php echo htmlspecialchars($search); ?>">
                <button type="submit"><i class="fas fa-search"></i> Search</button>
                <?php if (!empty($search)): ?>
                    <a href="?filter=<?php echo $filter; ?>" class="btn-secondary">
                        <i class="fas fa-times"></i> Clear
                    </a>
                <?php endif; ?>
            </form>
        </div>

        <!-- Orders Table -->
        <div class="card">
            <div class="table-responsive">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Tailor</th>
                            <th>Service</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Delivery</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if (empty($orders)): ?>
                            <tr>
                                <td colspan="8" style="text-align: center; padding: 2rem; color: var(--text-light);">
                                    <i class="fas fa-inbox" style="font-size: 3rem; margin-bottom: 1rem; display: block;"></i>
                                    No orders found
                                </td>
                            </tr>
                        <?php else: ?>
                            <?php foreach ($orders as $order): ?>
                                <tr>
                                    <td><strong>#<?php echo $order['id']; ?></strong></td>
                                    <td>
                                        <?php echo htmlspecialchars($order['customer_name'] ?? 'N/A'); ?><br>
                                        <small style="color: var(--text-light);"><?php echo htmlspecialchars($order['customer_email'] ?? ''); ?></small>
                                    </td>
                                    <td>
                                        <?php echo htmlspecialchars($order['tailor_name'] ?? 'N/A'); ?><br>
                                        <small style="color: var(--text-light);"><?php echo htmlspecialchars($order['tailor_owner'] ?? ''); ?></small>
                                    </td>
                                    <td><?php echo htmlspecialchars($order['service_type'] ?? 'N/A'); ?></td>
                                    <td><strong>₹<?php echo number_format($order['final_price'] ?? 0, 2); ?></strong></td>
                                    <td>
                                        <?php
                                        $status = $order['order_status'];
                                        $badge_class = 'badge-secondary';
                                        $icon = 'fa-circle';

                                        if ($status === 'pending') {
                                            $badge_class = 'badge-warning';
                                            $icon = 'fa-clock';
                                        } elseif (in_array($status, ['confirmed', 'in_progress', 'ready'])) {
                                            $badge_class = 'badge-info';
                                            $icon = 'fa-spinner';
                                        } elseif (in_array($status, ['delivered', 'completed'])) {
                                            $badge_class = 'badge-success';
                                            $icon = 'fa-check-circle';
                                        } elseif ($status === 'cancelled') {
                                            $badge_class = 'badge-danger';
                                            $icon = 'fa-times-circle';
                                        }
                                        ?>
                                        <span class="badge <?php echo $badge_class; ?>">
                                            <i class="fas <?php echo $icon; ?>"></i>
                                            <?php echo ucfirst(str_replace('_', ' ', $status)); ?>
                                        </span>
                                    </td>
                                    <td><?php echo date('M d, Y', strtotime($order['created_at'])); ?></td>
                                    <td>
                                        <?php if (!empty($order['estimated_delivery_date'])): ?>
                                            <?php echo date('M d, Y', strtotime($order['estimated_delivery_date'])); ?>
                                        <?php else: ?>
                                            <span style="color: var(--text-light);">Not set</span>
                                        <?php endif; ?>
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