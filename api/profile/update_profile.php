<?php
/**
 * API: Update Profile
 * POST /api/profile/update_profile.php
 * Updates customer or tailor profile
 */

session_start();

// Set JSON response header
header('Content-Type: application/json');

// Check if user is logged in
if (!isset($_SESSION['logged_in'])) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => 'Unauthorized. Please login.'
    ]);
    exit;
}

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed'
    ]);
    exit;
}

// Include dependencies
define('DB_ACCESS', true);
require_once '../../config/db.php';
require_once '../../services/ProfileService.php';

try {
    $profileService = new ProfileService($conn);
    $user_id = $_SESSION['user_id'];
    $user_type = $_SESSION['user_type'];
    
    if ($user_type === 'customer') {
        // Update customer profile
        $data = [
            'full_name' => $_POST['full_name'] ?? '',
            'email' => $_POST['email'] ?? '',
            'phone' => $_POST['phone'] ?? '',
            'address' => $_POST['address'] ?? ''
        ];
        
        $result = $profileService->updateCustomerProfile($user_id, $data);
        
    } else if ($user_type === 'tailor') {
        // Update tailor profile
        $data = [
            'shop_name' => $_POST['shop_name'] ?? '',
            'owner_name' => $_POST['owner_name'] ?? '',
            'email' => $_POST['email'] ?? '',
            'phone' => $_POST['phone'] ?? '',
            'shop_address' => $_POST['shop_address'] ?? '',
            'area' => $_POST['area'] ?? '',
            'speciality' => $_POST['speciality'] ?? '',
            'services_offered' => $_POST['services_offered'] ?? '',
            'experience_years' => $_POST['experience_years'] ?? 0,
            'price_range' => $_POST['price_range'] ?? ''
        ];
        
        $result = $profileService->updateTailorProfile($user_id, $data);
        
    } else {
        throw new Exception('Invalid user type');
    }
    
    // Set HTTP status code
    http_response_code($result['success'] ? 200 : 400);
    
    // Return response
    echo json_encode($result);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage()
    ]);
}

// Close database connection
db_close();
?>
