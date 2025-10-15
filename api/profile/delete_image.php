<?php
/**
 * API: Delete Profile/Shop Image
 * POST /api/profile/delete_image.php
 * Deletes profile/shop image
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
require_once '../../utils/ImageUpload.php';
require_once '../../repositories/CustomerRepository.php';
require_once '../../repositories/TailorRepository.php';

try {
    $user_id = $_SESSION['user_id'];
    $user_type = $_SESSION['user_type'];
    
    if ($user_type === 'customer') {
        $customerRepo = new CustomerRepository($conn);
        
        // Get current image
        $customer = $customerRepo->findById($user_id);
        $image_filename = $customer['profile_image'] ?? null;
        
        if ($image_filename) {
            // Delete from database
            if ($customerRepo->deleteProfileImage($user_id)) {
                // Delete physical file
                $upload_path = '../../uploads/profiles/';
                $imageUpload = new ImageUpload($upload_path);
                $imageUpload->delete($image_filename);
                
                echo json_encode([
                    'success' => true,
                    'message' => 'Profile image deleted successfully!'
                ]);
            } else {
                throw new Exception('Failed to delete from database');
            }
        } else {
            throw new Exception('No image to delete');
        }
        
    } else if ($user_type === 'tailor') {
        $tailorRepo = new TailorRepository($conn);
        
        // Get current image
        $tailor = $tailorRepo->findById($user_id);
        $image_filename = $tailor['shop_image'] ?? null;
        
        if ($image_filename) {
            // Delete from database
            if ($tailorRepo->deleteShopImage($user_id)) {
                // Delete physical file
                $upload_path = '../../uploads/shops/';
                $imageUpload = new ImageUpload($upload_path);
                $imageUpload->delete($image_filename);
                
                echo json_encode([
                    'success' => true,
                    'message' => 'Shop image deleted successfully!'
                ]);
            } else {
                throw new Exception('Failed to delete from database');
            }
        } else {
            throw new Exception('No image to delete');
        }
        
    } else {
        throw new Exception('Invalid user type');
    }
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}

// Close database connection
db_close();
?>
