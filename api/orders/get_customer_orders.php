<?php
/**
 * API: Get Customer Orders with specific Tailor
 * GET /api/orders/get_customer_orders.php?tailor_id=X
 * Returns orders for the logged-in customer with a specific tailor
 */

session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Check if user is logged in as customer
if (!isset($_SESSION['user_type']) || $_SESSION['user_type'] !== 'customer') {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => 'Unauthorized'
    ]);
    exit;
}

// Get tailor_id from query string
if (!isset($_GET['tailor_id'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Tailor ID is required'
    ]);
    exit;
}

$tailor_id = (int)$_GET['tailor_id'];
$customer_id = $_SESSION['user_id'];

define('DB_ACCESS', true);
require_once '../../config/db.php';

try {
    // Get orders between this customer and tailor that haven't been reviewed yet
    $stmt = $conn->prepare("
        SELECT o.id, o.order_number, o.service_type, o.created_at 
        FROM orders o
        LEFT JOIN reviews r ON r.order_id = o.id AND r.customer_id = ?
        WHERE o.customer_id = ? 
        AND o.tailor_id = ?
        AND r.review_id IS NULL
        ORDER BY o.created_at DESC
    ");
    
    $stmt->bind_param("iii", $customer_id, $customer_id, $tailor_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $orders = [];
    while ($row = $result->fetch_assoc()) {
        $orders[] = $row;
    }
    
    $stmt->close();
    
    echo json_encode([
        'success' => true,
        'orders' => $orders
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to fetch orders',
        'error' => $e->getMessage()
    ]);
}

db_close();
?>
