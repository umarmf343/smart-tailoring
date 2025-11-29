<?php

/**
 * API: Save Tailor Location
 * POST /api/tailors/save_location.php
 * Saves latitude and longitude for a tailor's shop
 */

session_start();

// Set JSON response header
header('Content-Type: application/json');

// Check if user is logged in and is a tailor
if (!isset($_SESSION['logged_in']) || $_SESSION['user_type'] !== 'tailor') {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => 'Unauthorized. Only tailors can save locations.'
    ]);
    exit;
}

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed. Use POST.'
    ]);
    exit;
}

// Include database connection
define('DB_ACCESS', true);
require_once '../../config/db.php';

try {
    // Get input data
    $input = json_decode(file_get_contents('php://input'), true);

    $latitude = isset($input['latitude']) ? floatval($input['latitude']) : null;
    $longitude = isset($input['longitude']) ? floatval($input['longitude']) : null;

    // Validate coordinates
    if ($latitude === null || $longitude === null) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Latitude and longitude are required'
        ]);
        exit;
    }

    // Validate coordinate ranges
    if ($latitude < -90 || $latitude > 90) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Invalid latitude. Must be between -90 and 90'
        ]);
        exit;
    }

    if ($longitude < -180 || $longitude > 180) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Invalid longitude. Must be between -180 and 180'
        ]);
        exit;
    }

    $tailor_id = $_SESSION['user_id'];

    // Update tailor location
    $sql = "UPDATE tailors 
            SET latitude = ?, 
                longitude = ?, 
                location_updated_at = NOW() 
            WHERE id = ?";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param('ddi', $latitude, $longitude, $tailor_id);

    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Location saved successfully',
            'data' => [
                'latitude' => $latitude,
                'longitude' => $longitude,
                'updated_at' => date('Y-m-d H:i:s')
            ]
        ]);
    } else {
        throw new Exception('Failed to save location: ' . $stmt->error);
    }

    $stmt->close();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage()
    ]);
}

// Close database connection
db_close();
