<?php

/**
 * Delete Measurement API
 * Endpoint to delete a customer measurement
 */

session_start();
header('Content-Type: application/json');

// Check if user is logged in as customer
if (!isset($_SESSION['user_id']) || $_SESSION['user_type'] !== 'customer') {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => 'Unauthorized: Please login as customer'
    ]);
    exit;
}

// Allow DELETE or POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'DELETE' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed. Use DELETE or POST'
    ]);
    exit;
}

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../repositories/MeasurementRepository.php';

try {
    $customer_id = $_SESSION['user_id'];

    // Get measurement ID from various sources
    $measurement_id = null;
    if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        parse_str(file_get_contents('php://input'), $_DELETE);
        $measurement_id = $_DELETE['measurement_id'] ?? $_GET['measurement_id'] ?? null;
    } else {
        $measurement_id = $_POST['measurement_id'] ?? $_GET['measurement_id'] ?? null;
    }

    if (!$measurement_id) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Measurement ID is required'
        ]);
        exit;
    }

    $measurementRepo = new MeasurementRepository($conn);

    // Verify ownership
    $measurement = $measurementRepo->findById((int)$measurement_id);

    if (!$measurement) {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'Measurement not found'
        ]);
        exit;
    }

    if ($measurement->getCustomerId() != $customer_id) {
        http_response_code(403);
        echo json_encode([
            'success' => false,
            'message' => 'Forbidden: This is not your measurement'
        ]);
        exit;
    }

    // Delete measurement
    $result = $measurementRepo->delete((int)$measurement_id);

    if ($result) {
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Measurement deleted successfully'
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Failed to delete measurement'
        ]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'An error occurred: ' . $e->getMessage()
    ]);
}
