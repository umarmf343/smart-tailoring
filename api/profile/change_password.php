<?php
/**
 * API: Change Password
 * POST /api/profile/change_password.php
 * Changes user password
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
    
    // Get password data
    $current_password = $_POST['current_password'] ?? '';
    $new_password = $_POST['new_password'] ?? '';
    $confirm_password = $_POST['confirm_password'] ?? '';
    
    if ($user_type === 'customer') {
        $result = $profileService->changeCustomerPassword(
            $user_id, 
            $current_password, 
            $new_password, 
            $confirm_password
        );
    } else if ($user_type === 'tailor') {
        $result = $profileService->changeTailorPassword(
            $user_id, 
            $current_password, 
            $new_password, 
            $confirm_password
        );
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
