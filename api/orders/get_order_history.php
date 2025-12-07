<?php

/**
 * API: Get Order History
 * GET /api/orders/get_order_history.php
 * Retrieves the audit trail of an order
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

// Only accept GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    ob_end_clean();
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed'
    ]);
    exit;
}

// Include dependencies
define('DB_ACCESS', true);
require_once '../../config/db.php';
require_once '../../services/OrderService.php';
require_once '../../repositories/OrderRepository.php';

try {
    // Get order ID from query string
    $order_id = $_GET['order_id'] ?? null;

    if (!$order_id) {
        ob_end_clean();
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Order ID is required'
        ]);
        exit;
    }

    // Create repository to verify order exists and user has access
    $orderRepo = new OrderRepository($conn);
    $order = $orderRepo->findById($order_id);

    if (!$order) {
        ob_end_clean();
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'Order not found'
        ]);
        exit;
    }

    $orderData = $order->toArray();

    // Authorization check - only customer or tailor involved in the order can view history
    $user_id = $_SESSION['user_id'];
    $user_type = $_SESSION['user_type'];

    if ($user_type === 'customer' && $orderData['customer_id'] != $user_id) {
        ob_end_clean();
        http_response_code(403);
        echo json_encode([
            'success' => false,
            'message' => 'Forbidden: This is not your order'
        ]);
        exit;
    }

    // Tailors can view: (1) orders assigned to them OR (2) unassigned orders (tailor_id is NULL)
    if ($user_type === 'tailor' && !empty($orderData['tailor_id']) && $orderData['tailor_id'] != $user_id) {
        ob_end_clean();
        http_response_code(403);
        echo json_encode([
            'success' => false,
            'message' => 'Forbidden: This order is assigned to another tailor'
        ]);
        exit;
    }

    // Get order history
    $orderService = new OrderService($conn);
    $result = $orderService->getOrderHistory($order_id);

    // Clear buffer and return clean JSON
    ob_end_clean();

    // Set HTTP status code
    http_response_code($result['success'] ? 200 : 400);

    // Return response
    echo json_encode($result);
} catch (Exception $e) {
    ob_end_clean();
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage()
    ]);
}

// Close database connection
db_close();
