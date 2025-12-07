<?php

/**
 * Save Measurement API
 * Endpoint to create or update customer measurements
 */

session_start();
header('Content-Type: application/json');

// Check if user is logged in
if (!isset($_SESSION['user_id']) || $_SESSION['user_type'] !== 'customer') {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => 'Unauthorized: Please login as customer'
    ]);
    exit;
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed. Use POST'
    ]);
    exit;
}

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../repositories/MeasurementRepository.php';
require_once __DIR__ . '/../../models/Measurement.php';

try {
    $customer_id = $_SESSION['user_id'];

    // Get POST data
    $measurement_id = $_POST['measurement_id'] ?? null;
    $label = $_POST['label'] ?? '';
    $garment_context = $_POST['garment_context'] ?? 'full';
    $is_default = isset($_POST['is_default']) ? (bool)$_POST['is_default'] : false;
    $notes = $_POST['notes'] ?? '';

    // Get measurements data (could be individual fields or JSON)
    $measurements_data = [];

    if (isset($_POST['measurements_data'])) {
        // If sent as JSON string
        if (is_string($_POST['measurements_data'])) {
            $measurements_data = json_decode($_POST['measurements_data'], true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new Exception('Invalid measurements data JSON');
            }
        } else if (is_array($_POST['measurements_data'])) {
            $measurements_data = $_POST['measurements_data'];
        }
    } else {
        // Dynamically collect all measurement fields from database
        $fieldsQuery = $conn->query("SELECT field_name FROM measurement_fields");
        $possible_fields = [];
        while ($row = $fieldsQuery->fetch_assoc()) {
            $possible_fields[] = $row['field_name'];
        }

        // Also include legacy field names that might be in POST
        $legacy_fields = [
            'shoulder_width',
            'collar',
            'cuff',
            'back_width',
            'front_length',
            'back_length',
            'blazer_length',
            'sherwani_length',
            'waistcoat_length',
            'blouse_length',
            'instructions'
        ];

        $all_fields = array_unique(array_merge($possible_fields, $legacy_fields));

        foreach ($all_fields as $field) {
            if (isset($_POST[$field]) && $_POST[$field] !== '') {
                $measurements_data[$field] = $_POST[$field];
            }
        }
    }

    // Validate measurements data
    if (empty($measurements_data)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Measurements data is required'
        ]);
        exit;
    }

    // Create Measurement object
    $measurement = new Measurement();
    $measurement->setCustomerId($customer_id);
    $measurement->setLabel($label);
    $measurement->setGarmentContext($garment_context);
    $measurement->setMeasurementsFromArray($measurements_data);
    $measurement->setIsDefault($is_default ? 1 : 0);
    $measurement->setNotes($notes);

    if ($measurement_id) {
        $measurement->setId($measurement_id);
    }

    // Validate
    if (!$measurement->isValid()) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Invalid measurement data'
        ]);
        exit;
    }

    // Save to database
    $measurementRepo = new MeasurementRepository($conn);
    $savedId = $measurementRepo->save($measurement);

    if ($savedId) {
        http_response_code($measurement_id ? 200 : 201);
        echo json_encode([
            'success' => true,
            'message' => $measurement_id ? 'Measurement updated successfully' : 'Measurement saved successfully',
            'measurement_id' => $savedId
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Failed to save measurement'
        ]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'An error occurred: ' . $e->getMessage()
    ]);
}
