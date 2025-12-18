<?php

/**
 * API: Get Tailors
 * Fetches all tailors from database
 * Returns JSON response
 */

// Disable error display for clean JSON response
ini_set('display_errors', 0);
error_reporting(0);

// Allow database access
define('DB_ACCESS', true);

// Include database connection
require_once '../config/db.php';
require_once __DIR__ . '/../services/TailorCacheService.php';

$cacheService = new TailorCacheService();

// Set JSON header
header('Content-Type: application/json');

try {
    if (!isset($conn) || !$conn instanceof mysqli) {
        throw new Exception($GLOBALS['db_connection_error'] ?? 'Database connection unavailable');
    }

    // Query to fetch all active tailors (including location data)
    $query = "SELECT 
                id, 
                shop_name, 
                owner_name, 
                email, 
                phone, 
                shop_address, 
                area, 
                speciality, 
                services_offered, 
                experience_years, 
                price_range, 
                rating, 
                total_reviews, 
                total_orders, 
                shop_image, 
                is_verified,
                latitude,
                longitude,
                location_updated_at,
                created_at 
              FROM tailors 
              WHERE is_active = 1 
              ORDER BY is_verified DESC, rating DESC, total_orders DESC";

    $result = db_query($query);

    if ($result instanceof mysqli_stmt) {
        $dbResult = $result->get_result();
    } else {
        $dbResult = $result;
    }

    if (!$dbResult) {
        throw new Exception('Database query failed');
    }

    $tailors = [];

    while ($row = $dbResult->fetch_assoc()) {
        $tailors[] = [
            'id' => (int)$row['id'],
            'shop_name' => $row['shop_name'],
            'owner_name' => $row['owner_name'],
            'email' => $row['email'],
            'phone' => $row['phone'],
            'shop_address' => $row['shop_address'],
            'area' => $row['area'],
            'speciality' => $row['speciality'],
            'services_offered' => $row['services_offered'],
            'experience_years' => (int)$row['experience_years'],
            'price_range' => $row['price_range'],
            'rating' => (float)$row['rating'],
            'total_reviews' => (int)$row['total_reviews'],
            'total_orders' => (int)$row['total_orders'],
            'shop_image' => $row['shop_image'],
            'is_verified' => (int)$row['is_verified'],
            'latitude' => $row['latitude'] ? (float)$row['latitude'] : null,
            'longitude' => $row['longitude'] ? (float)$row['longitude'] : null,
            'location_updated_at' => $row['location_updated_at'],
            'created_at' => $row['created_at']
        ];
    }

    if ($result instanceof mysqli_stmt) {
        $result->close();
    }

    // Cache the successful payload for resilience
    $cacheService->save($tailors);

    echo json_encode([
        'success' => true,
        'count' => count($tailors),
        'tailors' => $tailors,
        'from_cache' => false
    ]);
} catch (Exception $e) {
    error_log('Get Tailors error: ' . $e->getMessage());

    $cached = $cacheService->load();

    if ($cached) {
        http_response_code(206); // Partial availability but still serving data
        echo json_encode([
            'success' => true,
            'count' => $cached['count'],
            'tailors' => $cached['tailors'],
            'from_cache' => true,
            'cache_last_updated' => $cached['cached_at'],
            'message' => 'Serving cached tailors while we reconnect to the database.'
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Unable to fetch tailors',
            'message' => $e->getMessage()
        ]);
    }
}

// Connection is automatically closed by PHP or handled by pool
