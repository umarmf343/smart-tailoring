<?php

/**
 * Get Measurements API
 * Endpoint to retrieve customer measurements
 */

session_start();
header('Content-Type: application/json');

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => 'Unauthorized: Please login'
    ]);
    exit;
}

// Only allow GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed. Use GET'
    ]);
    exit;
}

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../repositories/MeasurementRepository.php';

try {
    $measurementRepo = new MeasurementRepository($conn);

    // Get customer_id from query string or session
    if ($_SESSION['user_type'] === 'customer') {
        $customer_id = $_SESSION['user_id'];
    } else if ($_SESSION['user_type'] === 'tailor' && isset($_GET['customer_id'])) {
        // Tailors can view customer measurements
        $customer_id = (int)$_GET['customer_id'];
    } else {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Customer ID is required'
        ]);
        exit;
    }

    // Get optional garment context filter
    $garment_context = $_GET['garment_context'] ?? null;

    // Fetch measurements
    $measurements = $measurementRepo->findByCustomerId($customer_id, $garment_context);

    // Convert to arrays
    $result = [];
    foreach ($measurements as $measurement) {
        $data = $measurement->toArray();
        // Parse JSON measurements_data to array for easier frontend use
        $data['measurements'] = $measurement->getMeasurementsArray();
        $result[] = $data;
    }

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'measurements' => $result,
        'count' => count($result)
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'An error occurred: ' . $e->getMessage()
    ]);
}
