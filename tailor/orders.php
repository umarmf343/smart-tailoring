<?php
/**
 * Tailor Orders Page
 * Displays all orders received by the logged-in tailor
 */

session_start();

// Check if user is logged in and is a tailor
if (!isset($_SESSION['logged_in']) || $_SESSION['user_type'] !== 'tailor') {
    header('Location: ../index.php');
    exit;
}

$tailor_id = $_SESSION['user_id'];
$tailor_name = $_SESSION['user_name'];
$shop_name = $_SESSION['shop_name'];
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Orders - Smart Tailoring Service</title>
    
    <link rel="icon" type="image/jpg" href="../assets/images/STP-favicon.jpg">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="../assets/css/style.css">
    
    <style>
        .orders-container {
            max-width: 1400px;
            margin: 2rem auto;
            padding: 0 2rem;
        }
        
        .page-header {
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            color: var(--white);
            padding: 2rem;
            border-radius: var(--radius-lg);
            margin-bottom: 2rem;
        }
        
        .page-header h1 {
            margin: 0;
            font-size: 2rem;
        }
        
        .filter-tabs {
            display: flex;
            gap: 1rem;
            margin-bottom: 2rem;
            flex-wrap: wrap;
        }
        
        .filter-btn {
            padding: 0.75rem 1.5rem;
            border: 2px solid var(--border-color);
            background: var(--white);
            border-radius: 50px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .filter-btn:hover {
            border-color: var(--primary-color);
        }
        
        .filter-btn.active {
            background: var(--primary-color);
            color: var(--white);
            border-color: var(--primary-color);
        }
        
        .orders-grid {
            display: grid;
            gap: 1.5rem;
        }
        
        .order-card {
            background: var(--white);
            border-radius: var(--radius-lg);
            padding: 1.5rem;
            box-shadow: var(--shadow-md);
            border: 2px solid var(--border-color);
            transition: all 0.3s ease;
        }
        
        .order-card:hover {
            border-color: var(--primary-color);
            box-shadow: var(--shadow-lg);
        }
        
        .order-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
            padding-bottom: 1rem;
            border-bottom: 2px solid var(--light-bg);
        }
        
        .order-number {
            font-size: 1.25rem;
            font-weight: 700;
            color: var(--text-dark);
        }
        
        .order-status {
            padding: 0.5rem 1rem;
            border-radius: 50px;
            font-weight: 600;
            font-size: 0.9rem;
        }
        
        .status-pending { background: #fef3c7; color: #92400e; }
        .status-accepted { background: #dbeafe; color: #1e40af; }
        .status-in_progress { background: #e0e7ff; color: #4338ca; }
        .status-ready { background: #d1fae5; color: #065f46; }
        .status-completed { background: #d1fae5; color: #065f46; }
        .status-cancelled { background: #fee2e2; color: #991b1b; }
        
        .order-body {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 2rem;
        }
        
        .order-details {
            display: grid;
            gap: 0.75rem;
        }
        
        .detail-row {
            display: flex;
            gap: 0.5rem;
        }
        
        .detail-label {
            font-weight: 600;
            color: var(--text-light);
            min-width: 150px;
        }
        
        .detail-value {
            color: var(--text-dark);
        }
        
        .customer-info {
            background: var(--light-bg);
            padding: 1.5rem;
            border-radius: var(--radius-md);
        }
        
        .customer-info h4 {
            margin: 0 0 1rem 0;
            color: var(--text-dark);
        }
        
        .order-actions {
            display: flex;
            gap: 1rem;
            margin-top: 1.5rem;
            padding-top: 1.5rem;
            border-top: 2px solid var(--light-bg);
            flex-wrap: wrap;
        }
        
        .btn-action {
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: var(--radius-md);
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .btn-accept {
            background: #10b981;
            color: var(--white);
        }
        
        .btn-accept:hover {
            background: #059669;
        }
        
        .btn-progress {
            background: #3b82f6;
            color: var(--white);
        }
        
        .btn-progress:hover {
            background: #2563eb;
        }
        
        .btn-ready {
            background: #8b5cf6;
            color: var(--white);
        }
        
        .btn-ready:hover {
            background: #7c3aed;
        }
        
        .btn-complete {
            background: #10b981;
            color: var(--white);
        }
        
        .btn-complete:hover {
            background: #059669;
        }
        
        .btn-reject {
            background: #ef4444;
            color: var(--white);
        }
        
        .btn-reject:hover {
            background: #dc2626;
        }
        
        .btn-contact {
            background: var(--light-bg);
            color: var(--text-dark);
            border: 2px solid var(--border-color);
        }
        
        .btn-contact:hover {
            border-color: var(--primary-color);
        }
        
        .empty-state {
            text-align: center;
            padding: 4rem 2rem;
            background: var(--white);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-md);
        }
        
        .empty-state i {
            font-size: 4rem;
            color: var(--primary-color);
            margin-bottom: 1rem;
        }
    </style>
</head>
<body>

    <!-- Navigation -->
    <nav class="navbar">
        <div class="nav-container">
            <div class="nav-logo">
                <img src="../assets/images/logo.jpg" alt="Logo">
                <span class="logo-text">Smart Tailoring Service</span>
            </div>
            
            <ul class="nav-menu">
                <li><a href="../index.php" class="nav-link">Home</a></li>
                <li><a href="dashboard.php" class="nav-link">Dashboard</a></li>
                <li><a href="orders.php" class="nav-link active">Orders</a></li>
                <li><a href="profile.php" class="nav-link">Shop Profile</a></li>
            </ul>
            
            <div class="nav-auth">
                <span style="margin-right: 1rem;">Welcome, <?php echo htmlspecialchars($tailor_name); ?>!</span>
                <button class="btn-login-register" onclick="window.location.href='../auth/logout.php'">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </button>
            </div>
        </div>
    </nav>

    <!-- Orders Container -->
    <div class="orders-container">
        
        <!-- Page Header -->
        <div class="page-header">
            <h1><i class="fas fa-inbox"></i> Order Management</h1>
            <p>Manage and track all incoming orders for <?php echo htmlspecialchars($shop_name); ?></p>
        </div>

        <!-- Filter Tabs -->
        <div class="filter-tabs">
            <button class="filter-btn active" data-status="all" onclick="filterOrders('all')">
                <i class="fas fa-list"></i> All Orders
            </button>
            <button class="filter-btn" data-status="pending" onclick="filterOrders('pending')">
                <i class="fas fa-clock"></i> Pending
            </button>
            <button class="filter-btn" data-status="accepted" onclick="filterOrders('accepted')">
                <i class="fas fa-check"></i> Accepted
            </button>
            <button class="filter-btn" data-status="in_progress" onclick="filterOrders('in_progress')">
                <i class="fas fa-tasks"></i> In Progress
            </button>
            <button class="filter-btn" data-status="ready" onclick="filterOrders('ready')">
                <i class="fas fa-box"></i> Ready
            </button>
            <button class="filter-btn" data-status="completed" onclick="filterOrders('completed')">
                <i class="fas fa-check-circle"></i> Completed
            </button>
        </div>

        <!-- Orders Grid -->
        <div class="orders-grid" id="ordersGrid">
            <div class="loading" style="text-align: center; padding: 3rem;">
                <i class="fas fa-spinner fa-spin" style="font-size: 2rem; color: var(--primary-color);"></i>
                <p>Loading orders...</p>
            </div>
        </div>

    </div>

    <script>
        let allOrders = [];
        let currentFilter = 'all';

        // Load orders on page load
        document.addEventListener('DOMContentLoaded', function() {
            loadOrders();
        });

        // Load tailor orders
        function loadOrders() {
            fetch('../api/orders/get_orders.php')
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        allOrders = data.orders;
                        displayOrders(allOrders);
                    } else {
                        document.getElementById('ordersGrid').innerHTML = `
                            <div class="empty-state">
                                <i class="fas fa-inbox"></i>
                                <h2>No orders yet</h2>
                                <p>Orders from customers will appear here</p>
                            </div>
                        `;
                    }
                })
                .catch(error => {
                    console.error('Error loading orders:', error);
                    document.getElementById('ordersGrid').innerHTML = `
                        <div class="empty-state">
                            <i class="fas fa-exclamation-triangle"></i>
                            <h2>Error loading orders</h2>
                            <p>Please try again later</p>
                        </div>
                    `;
                });
        }

        // Filter orders by status
        function filterOrders(status) {
            currentFilter = status;
            
            // Update active button
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            document.querySelector(`[data-status="${status}"]`).classList.add('active');
            
            // Filter and display
            if (status === 'all') {
                displayOrders(allOrders);
            } else {
                const filtered = allOrders.filter(order => order.order_status === status);
                displayOrders(filtered);
            }
        }

        // Display orders
        function displayOrders(orders) {
            const grid = document.getElementById('ordersGrid');
            
            if (orders.length === 0) {
                grid.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-inbox"></i>
                        <h2>No ${currentFilter === 'all' ? '' : currentFilter} orders</h2>
                        <p>${currentFilter === 'all' ? 'Orders from customers will appear here' : 'No orders with this status'}</p>
                    </div>
                `;
                return;
            }
            
            grid.innerHTML = orders.map(order => createOrderCard(order)).join('');
        }

        // Create order card HTML
        function createOrderCard(order) {
            const statusClass = `status-${order.order_status}`;
            const statusText = order.order_status.replace('_', ' ').toUpperCase();
            
            // Determine which action buttons to show
            let actionButtons = '';
            
            if (order.order_status === 'pending') {
                actionButtons = `
                    <button class="btn-action btn-accept" onclick="updateOrderStatus(${order.id}, 'accepted')">
                        <i class="fas fa-check"></i> Accept Order
                    </button>
                    <button class="btn-action btn-reject" onclick="updateOrderStatus(${order.id}, 'cancelled')">
                        <i class="fas fa-times"></i> Reject
                    </button>
                `;
            } else if (order.order_status === 'accepted') {
                actionButtons = `
                    <button class="btn-action btn-progress" onclick="updateOrderStatus(${order.id}, 'in_progress')">
                        <i class="fas fa-play"></i> Start Work
                    </button>
                `;
            } else if (order.order_status === 'in_progress') {
                actionButtons = `
                    <button class="btn-action btn-ready" onclick="updateOrderStatus(${order.id}, 'ready')">
                        <i class="fas fa-box"></i> Mark as Ready
                    </button>
                `;
            } else if (order.order_status === 'ready') {
                actionButtons = `
                    <button class="btn-action btn-complete" onclick="updateOrderStatus(${order.id}, 'completed')">
                        <i class="fas fa-check-circle"></i> Complete Order
                    </button>
                `;
            }
            
            return `
                <div class="order-card" data-status="${order.order_status}">
                    <div class="order-header">
                        <div class="order-number">
                            <i class="fas fa-receipt"></i> ${order.order_number}
                        </div>
                        <div class="order-status ${statusClass}">
                            ${statusText}
                        </div>
                    </div>
                    
                    <div class="order-body">
                        <div class="order-details">
                            <div class="detail-row">
                                <span class="detail-label">Service Type:</span>
                                <span class="detail-value">${order.service_type}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Garment Type:</span>
                                <span class="detail-value">${order.garment_type}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Quantity:</span>
                                <span class="detail-value">${order.quantity}</span>
                            </div>
                            ${order.measurements ? `
                            <div class="detail-row">
                                <span class="detail-label">Measurements:</span>
                                <span class="detail-value">${order.measurements}</span>
                            </div>
                            ` : ''}
                            ${order.special_instructions ? `
                            <div class="detail-row">
                                <span class="detail-label">Instructions:</span>
                                <span class="detail-value">${order.special_instructions}</span>
                            </div>
                            ` : ''}
                            <div class="detail-row">
                                <span class="detail-label">Customer Budget:</span>
                                <span class="detail-value">₹${order.estimated_price || 'Not specified'}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Order Date:</span>
                                <span class="detail-value">${formatDate(order.created_at)}</span>
                            </div>
                            ${order.delivery_date ? `
                            <div class="detail-row">
                                <span class="detail-label">Expected Delivery:</span>
                                <span class="detail-value">${formatDate(order.delivery_date)}</span>
                            </div>
                            ` : ''}
                        </div>
                        
                        <div class="customer-info">
                            <h4><i class="fas fa-user"></i> Customer Details</h4>
                            <div class="detail-row">
                                <i class="fas fa-user"></i>
                                <span>${order.customer_info.name}</span>
                            </div>
                            <div class="detail-row">
                                <i class="fas fa-phone"></i>
                                <span>${order.customer_info.phone}</span>
                            </div>
                            ${order.customer_info.address ? `
                            <div class="detail-row">
                                <i class="fas fa-map-marker-alt"></i>
                                <span>${order.customer_info.address}</span>
                            </div>
                            ` : ''}
                        </div>
                    </div>
                    
                    <div class="order-actions">
                        ${actionButtons}
                        <button class="btn-action btn-contact" onclick="contactCustomer('${order.customer_info.phone}')">
                            <i class="fas fa-phone"></i> Contact Customer
                        </button>
                    </div>
                </div>
            `;
        }

        // Update order status
        function updateOrderStatus(orderId, newStatus) {
            const statusNames = {
                'accepted': 'Accept',
                'in_progress': 'Start Work on',
                'ready': 'Mark as Ready',
                'completed': 'Complete',
                'cancelled': 'Reject'
            };
            
            if (!confirm(`Are you sure you want to ${statusNames[newStatus]} this order?`)) {
                return;
            }
            
            const formData = new FormData();
            formData.append('order_id', orderId);
            formData.append('status', newStatus);
            
            fetch('../api/orders/update_status.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Order status updated successfully!');
                    loadOrders(); // Reload orders
                } else {
                    alert(data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Failed to update order status');
            });
        }

        // Contact customer
        function contactCustomer(phone) {
            window.location.href = `tel:+91${phone}`;
        }

        // Format date
        function formatDate(dateString) {
            if (!dateString) return 'N/A';
            const date = new Date(dateString);
            return date.toLocaleDateString('en-IN', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            });
        }
    </script>

</body>
</html>
