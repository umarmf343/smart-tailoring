<?php
/**
 * API: Create Order
 * POST /api/orders/create_order.php
 * Creates a new order
 */

session_start();

// Set JSON response header
header('Content-Type: application/json');

// Check if user is logged in
if (!isset($_SESSION['logged_in']) || $_SESSION['user_type'] !== 'customer') {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => 'Unauthorized. Please login as customer.'
    ]);
    exit;
}

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
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

try {
    // Get POST data
    $orderData = [
        'customer_id' => $_SESSION['user_id'],
        'tailor_id' => $_POST['tailor_id'] ?? null,
        'service_type' => $_POST['service_type'] ?? null,
        'garment_type' => $_POST['garment_type'] ?? null,
        'quantity' => $_POST['quantity'] ?? 1,
        'measurements' => $_POST['measurements'] ?? '',
        'special_instructions' => $_POST['special_instructions'] ?? '',
        'estimated_price' => $_POST['estimated_price'] ?? 0,
        'delivery_date' => $_POST['delivery_date'] ?? null
    ];
    
    // Create service instance
    $orderService = new OrderService($conn);
    
    // Create order
    $result = $orderService->createOrder($orderData);
    
    // Set HTTP status code
    http_response_code($result['success'] ? 201 : 400);
    
    // Return response
    echo json_encode($result);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage()
    ]);
}

// Close database connection
db_close();
?>
