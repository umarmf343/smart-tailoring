<?php
/**
 * API: Get Profile
 * GET /api/profile/get_profile.php
 * Returns user profile data
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

// Include dependencies
define('DB_ACCESS', true);
require_once '../../config/db.php';
require_once '../../services/ProfileService.php';

try {
    $profileService = new ProfileService($conn);
    $user_id = $_SESSION['user_id'];
    $user_type = $_SESSION['user_type'];
    
    if ($user_type === 'customer') {
        $result = $profileService->getCustomerProfile($user_id);
    } else if ($user_type === 'tailor') {
        $result = $profileService->getTailorProfile($user_id);
    } else {
        throw new Exception('Invalid user type');
    }
    
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
