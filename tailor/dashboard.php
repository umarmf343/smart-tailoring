<?php

/**
 * Tailor Dashboard
 * Main page for logged-in tailors
 */

// Start session
session_start();

// Check if user is logged in and is a tailor
if (!isset($_SESSION['logged_in']) || $_SESSION['user_type'] !== 'tailor') {
    header('Location: ../index.php');
    exit;
}


// Include database connection
define('DB_ACCESS', true);
require_once '../config/db.php';

// Get tailor details
$tailor_id = $_SESSION['user_id'];
$tailor_query = "SELECT * FROM tailors WHERE id = " . $tailor_id;
$tailor = db_fetch_one($tailor_query);

// Get tailor shop image

require_once '../config/db.php';
require_once '../repositories/TailorRepository.php';

$tailorRepo = new TailorRepository($conn);
$tailor = $tailorRepo->findById($tailor_id);
$shop_image = $tailor['shop_image'] ?? null;




// Get tailor's order count
$order_count_query = "SELECT COUNT(*) as count FROM orders WHERE tailor_id = " . $tailor_id;
$order_count = db_fetch_one($order_count_query);
$total_orders = $order_count['count'];

// Get pending orders
$pending_query = "SELECT COUNT(*) as count FROM orders WHERE tailor_id = " . $tailor_id . " AND order_status = 'pending'";
$pending_count = db_fetch_one($pending_query);
$pending_orders = $pending_count['count'];

// Get completed orders
$completed_query = "SELECT COUNT(*) as count FROM orders WHERE tailor_id = " . $tailor_id . " AND order_status = 'completed'";
$completed_count = db_fetch_one($completed_query);
$completed_orders = $completed_count['count'];

db_close();
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tailor Dashboard - Smart Tailoring Service</title>

    <!-- Favicon -->
    <link rel="icon" type="image/jpg" href="../assets/images/STP-favicon.jpg">

    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    <!-- Font Awesome Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <!-- Custom CSS -->
    <link rel="stylesheet" href="../assets/css/style.css">

    <style>
        /* Dashboard-specific styles */
        .dashboard-container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 2rem;
        }

        .dashboard-header {
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            color: var(--white);
            padding: 2rem;
            border-radius: var(--radius-lg);
            margin-bottom: 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .welcome-section h1 {
            font-size: 2rem;
            margin-bottom: 0.5rem;
        }

        .welcome-section p {
            opacity: 0.9;
        }

        .verification-badge {
            display: inline-block;
            padding: 0.5rem 1rem;
            border-radius: 50px;
            font-weight: 600;
            margin-top: 0.5rem;
        }

        .verified {
            background: #10b981;
        }

        .not-verified {
            background: #f59e0b;
        }

        .logout-btn {
            background: var(--white);
            color: var(--primary-color);
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 50px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .logout-btn:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow-lg);
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
        }

        .stat-card {
            background: var(--white);
            padding: 1.5rem;
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-md);
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .stat-icon {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            color: var(--white);
        }

        .stat-icon.blue {
            background: linear-gradient(135deg, #667eea, #764ba2);
        }

        .stat-icon.green {
            background: linear-gradient(135deg, #10b981, #059669);
        }

        .stat-icon.orange {
            background: linear-gradient(135deg, #f59e0b, #d97706);
        }

        .stat-icon.purple {
            background: linear-gradient(135deg, #8b5cf6, #6d28d9);
        }

        .stat-content h3 {
            font-size: 2rem;
            color: var(--text-dark);
            margin-bottom: 0.25rem;
        }

        .stat-content p {
            color: var(--text-light);
            font-size: 0.95rem;
        }

        .dashboard-section {
            background: var(--white);
            padding: 2rem;
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-md);
            margin-bottom: 2rem;
        }

        .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
        }

        .section-header h2 {
            font-size: 1.75rem;
            color: var(--text-dark);
        }

        .shop-card {
            display: grid;
            grid-template-columns: auto 1fr;
            gap: 2rem;
            align-items: start;
        }

        .shop-avatar {
            width: 120px;
            height: 120px;
            border-radius: var(--radius-lg);
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--white);
            font-size: 3rem;
            font-weight: 700;
        }

        .shop-details {
            flex: 1;
        }

        .shop-details h3 {
            font-size: 1.5rem;
            margin-bottom: 0.5rem;
            color: var(--text-dark);
        }

        .shop-subtitle {
            color: var(--text-light);
            margin-bottom: 1rem;
        }

        .shop-info {
            display: grid;
            gap: 0.75rem;
        }

        .info-row {
            display: flex;
            gap: 1rem;
            color: var(--text-light);
        }

        .info-row i {
            width: 20px;
            color: var(--primary-color);
        }

        .quick-actions {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-top: 2rem;
        }

        .action-btn {
            padding: 1rem;
            background: var(--light-bg);
            border: 2px solid var(--border-color);
            border-radius: var(--radius-md);
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            color: var(--text-dark);
        }

        .action-btn:hover {
            border-color: var(--primary-color);
            transform: translateY(-3px);
            box-shadow: var(--shadow-md);
        }

        .action-btn i {
            font-size: 2rem;
            color: var(--primary-color);
            margin-bottom: 0.5rem;
            display: block;
        }
    </style>
</head>

<body>

    <!-- Navigation Bar -->
    <nav class="navbar">
        <div class="nav-container">
            <!-- Logo -->
            <div class="nav-logo">
                <img src="../assets/images/logo.jpg" alt="Smart Tailoring Service Logo">
                <span class="logo-text">Smart Tailoring Service</span>
            </div>

            <!-- Navigation Menu -->
            <ul class="nav-menu">
                <li><a href="../index.php" class="nav-link">Home</a></li>
                <li><a href="dashboard.php" class="nav-link active">Dashboard</a></li>
                <li><a href="orders.php" class="nav-link">Orders</a></li>
                <li><a href="profile.php" class="nav-link">Shop Profile</a></li>
            </ul>

            <!-- User Info -->
            <div class="nav-auth">
                <span style="margin-right: 1rem;">Welcome, <?php echo htmlspecialchars($tailor['owner_name']); ?>!</span>
                <button class="btn-login-register" onclick="window.location.href='../auth/logout.php'">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </button>
            </div>
        </div>
    </nav>

    <!-- Dashboard Container -->
    <div class="dashboard-container">

        <!-- Dashboard Header -->
        <div class="dashboard-header">
            <div class="welcome-section">
                <h1>Welcome back, <?php echo htmlspecialchars($tailor['owner_name']); ?>!</h1>
                <p>Manage your shop and orders</p>
                <span class="verification-badge <?php echo $tailor['is_verified'] ? 'verified' : 'not-verified'; ?>">
                    <i class="fas fa-<?php echo $tailor['is_verified'] ? 'check-circle' : 'clock'; ?>"></i>
                    <?php echo $tailor['is_verified'] ? 'Verified Shop' : 'Pending Verification'; ?>
                </span>
            </div>
            <button class="logout-btn" onclick="window.location.href='../auth/logout.php'">
                <i class="fas fa-sign-out-alt"></i> Logout
            </button>
        </div>

        <!-- Stats Grid -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon blue">
                    <i class="fas fa-shopping-bag"></i>
                </div>
                <div class="stat-content">
                    <h3><?php echo $total_orders; ?></h3>
                    <p>Total Orders</p>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon orange">
                    <i class="fas fa-clock"></i>
                </div>
                <div class="stat-content">
                    <h3><?php echo $pending_orders; ?></h3>
                    <p>Pending Orders</p>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon green">
                    <i class="fas fa-check-circle"></i>
                </div>
                <div class="stat-content">
                    <h3><?php echo $completed_orders; ?></h3>
                    <p>Completed Orders</p>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon purple">
                    <i class="fas fa-star"></i>
                </div>
                <div class="stat-content">
                    <h3><?php echo number_format($tailor['rating'], 1); ?></h3>
                    <p>Average Rating</p>
                </div>
            </div>
        </div>

        <!-- Shop Profile Section -->
        <div class="dashboard-section">
            <div class="section-header">
                <h2><i class="fas fa-store"></i> Your Shop Profile</h2>
            </div>

            <div class="shop-card">

                <div class="shop-avatar">
                    <?php if ($shop_image): ?>
                        <img src="/smart/smart-tailoring/uploads/shops/<?php echo htmlspecialchars($shop_image); ?>"
                            alt="Shop Image"
                            style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">
                    <?php else: ?>
                        <?php echo strtoupper(substr($shop_name, 0, 1)); ?>
                    <?php endif; ?>
                </div>


                <div class="shop-details">
                    <h3><?php echo htmlspecialchars($tailor['shop_name']); ?></h3>
                    <p class="shop-subtitle">Owned by <?php echo htmlspecialchars($tailor['owner_name']); ?></p>

                    <div class="shop-info">
                        <div class="info-row">
                            <i class="fas fa-envelope"></i>
                            <span><?php echo htmlspecialchars($tailor['email']); ?></span>
                        </div>
                        <div class="info-row">
                            <i class="fas fa-phone"></i>
                            <span><?php echo htmlspecialchars($tailor['phone']); ?></span>
                        </div>
                        <div class="info-row">
                            <i class="fas fa-map-marker-alt"></i>
                            <span><?php echo htmlspecialchars($tailor['shop_address']); ?></span>
                        </div>
                        <div class="info-row">
                            <i class="fas fa-map"></i>
                            <span><?php echo htmlspecialchars($tailor['area']); ?>, Satna</span>
                        </div>
                        <div class="info-row">
                            <i class="fas fa-star"></i>
                            <span><?php echo htmlspecialchars($tailor['speciality']); ?></span>
                        </div>
                        <div class="info-row">
                            <i class="fas fa-briefcase"></i>
                            <span><?php echo $tailor['experience_years']; ?>+ years of experience</span>
                        </div>
                        <div class="info-row">
                            <i class="fas fa-calendar"></i>
                            <span>Member since <?php echo date('F Y', strtotime($tailor['created_at'])); ?></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Quick Actions -->
        <div class="dashboard-section">
            <div class="section-header">
                <h2><i class="fas fa-bolt"></i> Quick Actions</h2>
            </div>

            <div class="quick-actions">
                <a href="orders.php" class="action-btn">
                    <i class="fas fa-inbox"></i>
                    <strong>View Orders</strong>
                </a>

                <a href="profile.php" class="action-btn">
                    <i class="fas fa-edit"></i>
                    <strong>Edit Shop Profile</strong>
                </a>

                <a href="#settings" class="action-btn">
                    <i class="fas fa-cog"></i>
                    <strong>Settings</strong>
                </a>

                <a href="../index.php#tailors" class="action-btn">
                    <i class="fas fa-eye"></i>
                    <strong>View My Listing</strong>
                </a>
            </div>
        </div>

    </div>

</body>

</html>