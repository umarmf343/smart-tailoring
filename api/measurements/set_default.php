<?php

/**
 * Set Default Measurement API
 * Endpoint to set a measurement as default
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

// Allow POST or PUT requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'PUT') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed. Use POST or PUT'
    ]);
    exit;
}

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../repositories/MeasurementRepository.php';

try {
    $customer_id = $_SESSION['user_id'];

    // Get measurement ID
    $measurement_id = $_POST['measurement_id'] ?? $_GET['measurement_id'] ?? null;

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

    // Set as default
    $result = $measurementRepo->setAsDefault((int)$measurement_id);

    if ($result) {
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Measurement set as default successfully'
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Failed to set measurement as default'
        ]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'An error occurred: ' . $e->getMessage()
    ]);
}
