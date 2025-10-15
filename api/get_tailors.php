<?php
/**
 * API: Get Tailors
 * Fetches all tailors from database
 * Returns JSON response
 */

// Allow database access
define('DB_ACCESS', true);

// Include database connection
require_once '../config/db.php';

// Set JSON header
header('Content-Type: application/json');

try {
    // Query to fetch all active tailors
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
                created_at 
              FROM tailors 
              WHERE is_active = 1 
              ORDER BY is_verified DESC, rating DESC, total_orders DESC";
    
    $result = db_query($query);
    
    if ($result) {
        $tailors = [];
        
        while ($row = $result->fetch_assoc()) {
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
                'created_at' => $row['created_at']
            ];
        }
        
        echo json_encode([
            'success' => true,
            'count' => count($tailors),
            'tailors' => $tailors
        ]);
    } else {
        throw new Exception('Database query failed');
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Unable to fetch tailors',
        'message' => $e->getMessage()
    ]);
}

// Close database connection
db_close();
?>
