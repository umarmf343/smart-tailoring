<?php

/**
 * API: Get Orders
 * GET /api/orders/get_orders.php
 * Returns orders for logged-in user (customer or tailor)
 */

// Suppress any output and set JSON header FIRST
ob_start();
header('Content-Type: application/json');

session_start();

// Check if user is logged in
if (!isset($_SESSION['logged_in'])) {
    ob_end_clean();
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => 'Unauthorized. Please login.'
    ]);
    exit;
}

// Include dependencies
define('DB_ACCESS', true);
require_once '../../config/db.php';
require_once '../../services/OrderService.php';

try {
    // Create service instance
    $orderService = new OrderService($conn);

    // Get orders based on user type
    if ($_SESSION['user_type'] === 'customer') {
        $result = $orderService->getCustomerOrders($_SESSION['user_id']);
    } else if ($_SESSION['user_type'] === 'tailor') {
        $result = $orderService->getTailorOrders($_SESSION['user_id']);
    } else {
        throw new Exception('Invalid user type');
    }

    // Clear any accidental output
    ob_end_clean();

    // Return response
    echo json_encode($result);
} catch (Exception $e) {
    // Clear any accidental output
    ob_end_clean();

    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage()
    ]);
}

// Close database connection
db_close();
