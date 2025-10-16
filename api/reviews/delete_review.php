<?php
/**
 * API: Delete Review
 * POST /api/reviews/delete_review.php
 * Allows customers to delete their own reviews
 */

session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

// Check if user is logged in as customer
if (!isset($_SESSION['user_type']) || $_SESSION['user_type'] !== 'customer') {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => 'Unauthorized. Please login as a customer.'
    ]);
    exit;
}

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);

// Validate input
if (!isset($data['review_id'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Review ID is required'
    ]);
    exit;
}

$review_id = (int)$data['review_id'];
$customer_id = $_SESSION['user_id'];

define('DB_ACCESS', true);
require_once '../../config/db.php';
require_once '../../repositories/ReviewRepository.php';

try {
    $reviewRepo = new ReviewRepository($conn);
    
    // Delete the review (only if it belongs to this customer)
    $success = $reviewRepo->delete($review_id, $customer_id);
    
    if ($success) {
        echo json_encode([
            'success' => true,
            'message' => 'Review deleted successfully'
        ]);
    } else {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'Review not found or you do not have permission to delete it'
        ]);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to delete review',
        'error' => $e->getMessage()
    ]);
}

db_close();
?>
