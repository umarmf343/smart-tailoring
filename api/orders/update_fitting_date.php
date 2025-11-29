<?php

/**
 * Update Final Fitting Date API
 * Allows tailor to set/update the final fitting date for an order
 */

session_start();
header('Content-Type: application/json');

// Check if tailor is logged in
if (!isset($_SESSION['user_id']) || $_SESSION['user_type'] !== 'tailor') {
    echo json_encode([
        'success' => false,
        'message' => 'Unauthorized access'
    ]);
    exit;
}

// Include required files
define('DB_ACCESS', true);
require_once '../../config/db.php';
require_once '../../repositories/OrderRepository.php';

// Get POST data
$order_id = isset($_POST['order_id']) ? intval($_POST['order_id']) : 0;
$final_fitting_date = isset($_POST['final_fitting_date']) ? trim($_POST['final_fitting_date']) : '';

// Validate input
if (empty($order_id) || empty($final_fitting_date)) {
    echo json_encode([
        'success' => false,
        'message' => 'Order ID and final fitting date are required'
    ]);
    exit;
}

// Validate date format
$date = DateTime::createFromFormat('Y-m-d\TH:i', $final_fitting_date);
if (!$date) {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid date format'
    ]);
    exit;
}

try {
    // Check database connection
    if (!$conn) {
        echo json_encode([
            'success' => false,
            'message' => 'Database connection failed'
        ]);
        exit;
    }

    // Get order details first with simple query
    $check_query = "SELECT id, tailor_id FROM orders WHERE id = ?";
    $check_stmt = $conn->prepare($check_query);

    if (!$check_stmt) {
        echo json_encode([
            'success' => false,
            'message' => 'Database prepare failed: ' . $conn->error
        ]);
        exit;
    }

    $check_stmt->bind_param("i", $order_id);
    $check_stmt->execute();
    $result = $check_stmt->get_result();
    $order = $result->fetch_assoc();
    $check_stmt->close();

    if (!$order) {
        echo json_encode([
            'success' => false,
            'message' => 'Order not found'
        ]);
        exit;
    }

    // Verify this tailor owns the order
    if ($order['tailor_id'] != $_SESSION['user_id']) {
        echo json_encode([
            'success' => false,
            'message' => 'You do not have permission to update this order'
        ]);
        exit;
    }

    // Convert to MySQL datetime format
    $mysql_datetime = $date->format('Y-m-d H:i:s');

    // Update the final fitting date
    $query = "UPDATE orders 
              SET final_fitting_date = ?, 
                  updated_at = NOW() 
              WHERE id = ?";

    $stmt = $conn->prepare($query);

    if (!$stmt) {
        echo json_encode([
            'success' => false,
            'message' => 'Update prepare failed: ' . $conn->error
        ]);
        exit;
    }

    $stmt->bind_param("si", $mysql_datetime, $order_id);

    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Final fitting date updated successfully',
            'final_fitting_date' => $mysql_datetime
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Failed to update fitting date: ' . $stmt->error
        ]);
    }

    $stmt->close();
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'An error occurred: ' . $e->getMessage()
    ]);
}

$conn->close();
