<?php

/**
 * Customer Dashboard
 * Main page for logged-in customers
 */

// Suppress ALL errors and start output buffering
@ini_set('display_errors', 0);
@error_reporting(0);
ob_start();

// Start secure session
require_once '../config/session.php';

// Check if user is logged in and is a customer
if (!isset($_SESSION['logged_in']) || $_SESSION['user_type'] !== 'customer') {
    header('Location: ../index.php');
    exit;
}

// Include database connection
define('DB_ACCESS', true);
require_once '../config/db.php';
require_once '../repositories/CustomerRepository.php';

// Get customer details
$customer_id = $_SESSION['user_id'];

$customerRepo = new CustomerRepository($conn);
$customer = $customerRepo->findById($customer_id);
$profile_image = $customer['profile_image'] ?? null;

// Get customer's order count
$result = $conn->query("SELECT COUNT(*) as count FROM orders WHERE customer_id = " . intval($customer_id));
$order_data = $result->fetch_assoc();
$total_orders = $order_data['count'] ?? 0;
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Customer Dashboard - Smart Tailoring Service</title>

    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="../assets/images/STP-favicon.svg">

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
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
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
            overflow: visible;
            position: relative;
            z-index: 1;
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
            flex-shrink: 0;
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

        .stat-content h3 {
            font-size: 2rem;
            color: var(--text-dark);
            margin-bottom: 0.25rem;
            white-space: nowrap;
            position: relative;
            z-index: 2;
            background: var(--white);
        }

        .stat-content p {
            color: var(--text-light);
            font-size: 0.95rem;
            white-space: nowrap;
            position: relative;
            z-index: 2;
            background: var(--white);
        }

        .dashboard-section {
            background: var(--white);
            padding: 2rem;
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-md);
            margin-bottom: 2rem;
            position: relative;
            z-index: 1;
        }

        .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
            position: relative;
            z-index: 2;
        }

        .section-header h2 {
            font-size: 1.75rem;
            color: var(--text-dark);
            background: var(--white);
            position: relative;
            z-index: 3;
        }

        .view-all-btn {
            color: var(--primary-color);
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s ease;
        }

        .view-all-btn:hover {
            text-decoration: underline;
        }

        .profile-card {
            display: grid;
            grid-template-columns: auto 1fr;
            gap: 2rem;
            align-items: start;
        }

        .profile-avatar {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--white);
            font-size: 3rem;
            font-weight: 700;
        }

        .profile-details {
            flex: 1;
        }

        .profile-details h3 {
            font-size: 1.5rem;
            margin-bottom: 1rem;
            color: var(--text-dark);
        }

        .profile-info {
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

        /* Mobile Responsive */
        @media (max-width: 768px) {

            /* Hide welcome text in navbar on mobile */
            .welcome-text {
                display: none !important;
            }

            /* Make logout button icon-only on mobile */
            .btn-logout .btn-text {
                display: none;
            }

            .btn-logout {
                width: 40px;
                height: 40px;
                padding: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
            }

            .btn-logout i {
                margin: 0;
                font-size: 1.1rem;
            }

            .nav-menu {
                display: none;
            }

            .dashboard-container {
                padding: 0 1rem;
                margin-top: 1rem;
            }

            .dashboard-header {
                flex-direction: column;
                text-align: center;
                padding: 1.5rem;
            }

            .welcome-section h1 {
                font-size: 1.5rem;
            }

            .stats-grid {
                grid-template-columns: repeat(3, 1fr);
                gap: 0.5rem;
            }

            .stat-card {
                flex-direction: column;
                padding: 1rem;
                text-align: center;
            }

            .stat-icon {
                width: 40px;
                height: 40px;
                font-size: 1rem;
            }

            .stat-content h3 {
                font-size: 1.5rem;
            }

            .stat-content p {
                font-size: 0.75rem;
            }

            .dashboard-section {
                padding: 1.25rem;
            }

            .section-header h2 {
                font-size: 1.25rem;
            }

            /* Quick Actions Grid on Mobile */
            .quick-actions {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 0.5rem;
                margin-top: 1rem;
            }

            .action-btn {
                padding: 1rem 0.5rem;
                font-size: 0.85rem;
                display: flex !important;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 100px;
                aspect-ratio: 1 / 1;
            }

            .action-btn i {
                font-size: 1.8rem;
                margin-bottom: 0.5rem;
            }

            .action-btn strong {
                font-size: 0.7rem;
                line-height: 1.2;
                word-wrap: break-word;
                white-space: normal;
            }

            /* Reorder sections */
            .dashboard-container {
                display: flex;
                flex-direction: column;
            }

            .stats-grid {
                order: 1;
            }

            .dashboard-section:has(.quick-actions) {
                order: 2;
            }

            .dashboard-section:has(.profile-card) {
                order: 3;
            }

            .profile-card {
                grid-template-columns: 1fr;
                text-align: center;
                justify-items: center;
                gap: 1rem;
            }

            .profile-avatar {
                width: 80px;
                height: 80px;
                font-size: 2rem;
            }

            .info-row {
                justify-content: center;
            }
        }

        @media (max-width: 480px) {
            .dashboard-container {
                padding: 0 0.75rem;
            }

            .dashboard-header {
                padding: 1.25rem 1rem;
            }

            .welcome-section h1 {
                font-size: 1.25rem;
            }

            .welcome-section p {
                font-size: 0.9rem;
            }

            .stats-grid {
                gap: 0.4rem;
            }

            .stat-card {
                padding: 0.75rem 0.5rem;
            }

            .stat-icon {
                width: 35px;
                height: 35px;
                font-size: 0.9rem;
            }

            .stat-content h3 {
                font-size: 1.25rem;
            }

            .stat-content p {
                font-size: 0.7rem;
            }

            .dashboard-section {
                padding: 1rem;
            }

            .section-header h2 {
                font-size: 1.1rem;
            }

            .action-btn {
                padding: 0.75rem 0.4rem;
                min-height: 90px;
            }

            .action-btn i {
                font-size: 1.5rem;
            }

            .action-btn strong {
                font-size: 0.65rem;
            }

            .profile-avatar {
                width: 70px;
                height: 70px;
                font-size: 1.75rem;
            }

            .profile-details h3 {
                font-size: 1.25rem;
            }

            .info-row {
                font-size: 0.9rem;
            }
        }
    </style>
</head>

<body>

    <!-- Navigation Bar -->
    <nav class="navbar">
        <div class="nav-container">
            <!-- Logo -->
            <div class="nav-logo">
                <img src="../assets/images/logo.png" alt="Smart Tailoring Service Logo">
                <span class="logo-text">Smart Tailoring Service</span>
            </div>

            <!-- Navigation Menu -->
            <ul class="nav-menu">
                <li><a href="../index.php" class="nav-link">Home</a></li>
                <li><a href="dashboard.php" class="nav-link active">Dashboard</a></li>
                <li><a href="orders.php" class="nav-link">My Orders</a></li>
                <li><a href="measurements.php" class="nav-link">Measurements</a></li>
                <li><a href="profile.php" class="nav-link">Profile</a></li>
            </ul>

            <!-- User Info -->
            <div class="nav-auth">
                <span class="welcome-text" style="margin-right: 1rem;">Welcome, <?php echo htmlspecialchars($customer['full_name']); ?>!</span>
                <button class="btn-logout" onclick="window.location.href='../auth/logout.php'">
                    <i class="fas fa-sign-out-alt"></i> <span class="btn-text">Logout</span>
                </button>
            </div>
        </div>
    </nav>

    <!-- Dashboard Container -->
    <div class="dashboard-container">

        <!-- Dashboard Header -->
        <div class="dashboard-header">
            <div class="welcome-section">
                <h1>Welcome back, <?php echo htmlspecialchars($customer['full_name']); ?>!</h1>
                <p>Manage your orders and find the best tailors in Satna</p>
            </div>
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
                <div class="stat-icon green">
                    <i class="fas fa-check-circle"></i>
                </div>
                <div class="stat-content">
                    <h3>0</h3>
                    <p>Completed Orders</p>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon orange">
                    <i class="fas fa-clock"></i>
                </div>
                <div class="stat-content">
                    <h3>0</h3>
                    <p>Pending Orders</p>
                </div>
            </div>
        </div>

        <!-- Profile Section -->
        <div class="dashboard-section">
            <div class="section-header">
                <h2><i class="fas fa-user-circle"></i> Your Profile</h2>
            </div>

            <div class="profile-card">
                <div class="profile-avatar">
                    <?php if ($profile_image): ?>
                        <?php
                        $image_src = (strpos($profile_image, 'http') === 0)
                            ? $profile_image
                            : "/smart/smart-tailoring/uploads/profiles/" . $profile_image;
                        ?>
                        <img src="<?php echo htmlspecialchars($image_src); ?>"
                            alt="Profile"
                            style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">
                    <?php else: ?>
                        <?php echo strtoupper(substr($customer['full_name'] ?? '', 0, 1)); ?>
                    <?php endif; ?>
                </div>


                <div class="profile-details">
                    <h3><?php echo htmlspecialchars($customer['full_name']); ?></h3>
                    <div class="profile-info">
                        <div class="info-row">
                            <i class="fas fa-envelope"></i>
                            <span><?php echo htmlspecialchars($customer['email']); ?></span>
                        </div>
                        <div class="info-row">
                            <i class="fas fa-phone"></i>
                            <span><?php echo htmlspecialchars($customer['phone']); ?></span>
                        </div>
                        <?php if (!empty($customer['address'])): ?>
                            <div class="info-row">
                                <i class="fas fa-map-marker-alt"></i>
                                <span><?php echo htmlspecialchars($customer['address']); ?></span>
                            </div>
                        <?php endif; ?>
                        <div class="info-row">
                            <i class="fas fa-calendar"></i>
                            <span>Member since <?php echo date('F Y', strtotime($customer['created_at'])); ?></span>
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
                <a href="../index.php" class="action-btn">
                    <i class="fas fa-home"></i>
                    <strong>Home</strong>
                </a>

                <a href="../index.php#tailors" class="action-btn">
                    <i class="fas fa-search"></i>
                    <strong>Find Tailors</strong>
                </a>

                <a href="orders.php" class="action-btn">
                    <i class="fas fa-shopping-bag"></i>
                    <strong>My Orders</strong>
                </a>

                <a href="measurements.php" class="action-btn">
                    <i class="fas fa-ruler"></i>
                    <strong>Measurements</strong>
                </a>

                <a href="profile.php" class="action-btn">
                    <i class="fas fa-user-edit"></i>
                    <strong>Edit Profile</strong>
                </a>

                <a href="../index.php#services" class="action-btn">
                    <i class="fas fa-tags"></i>
                    <strong>View Services</strong>
                </a>
            </div>
        </div>

    </div>

</body>

</html>