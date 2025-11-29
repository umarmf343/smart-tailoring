<?php

/**
 * Get Single Measurement API
 * Endpoint to retrieve a specific measurement by ID
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
    // Get measurement ID
    $measurement_id = $_GET['id'] ?? null;

    if (!$measurement_id) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Measurement ID is required'
        ]);
        exit;
    }

    $measurementRepo = new MeasurementRepository($conn);
    $measurement = $measurementRepo->findById((int)$measurement_id);

    if (!$measurement) {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'Measurement not found'
        ]);
        exit;
    }

    // Authorization check
    if ($_SESSION['user_type'] === 'customer' && $measurement->getCustomerId() != $_SESSION['user_id']) {
        http_response_code(403);
        echo json_encode([
            'success' => false,
            'message' => 'Forbidden: This is not your measurement'
        ]);
        exit;
    }

    // Convert to array with parsed measurements
    $data = $measurement->toArray();
    $data['measurements'] = $measurement->getMeasurementsArray();

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'measurement' => $data
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'An error occurred: ' . $e->getMessage()
    ]);
}
