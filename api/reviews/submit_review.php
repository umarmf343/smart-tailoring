<?php
/**
 * API: Submit Review
 * POST /api/reviews/submit_review.php
 * Allows customers to submit reviews for tailors
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
if (!isset($data['tailor_id']) || !isset($data['order_id']) || !isset($data['rating'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Missing required fields'
    ]);
    exit;
}

$tailor_id = (int)$data['tailor_id'];
$order_id = (int)$data['order_id'];
$rating = (int)$data['rating'];
$review_text = isset($data['review_text']) ? trim($data['review_text']) : '';
$customer_id = $_SESSION['user_id'];

// Validate rating
if ($rating < 1 || $rating > 5) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Rating must be between 1 and 5'
    ]);
    exit;
}

define('DB_ACCESS', true);
require_once '../../config/db.php';
require_once '../../repositories/ReviewRepository.php';

try {
    $reviewRepo = new ReviewRepository($conn);
    
    // Check if customer already reviewed this order
    if ($reviewRepo->hasReviewed($customer_id, $order_id)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'You have already reviewed this order'
        ]);
        exit;
    }
    
    // Check if customer has an order with this tailor
    if (!$reviewRepo->canReview($customer_id, $tailor_id)) {
        http_response_code(403);
        echo json_encode([
            'success' => false,
            'message' => 'You can only review tailors you have ordered from'
        ]);
        exit;
    }
    
    // Create the review
    $review_id = $reviewRepo->create($tailor_id, $customer_id, $order_id, $rating, $review_text);
    
    if ($review_id) {
        echo json_encode([
            'success' => true,
            'message' => 'Review submitted successfully!',
            'review_id' => $review_id
        ]);
    } else {
        throw new Exception('Failed to create review');
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'An error occurred while submitting your review',
        'error' => $e->getMessage()
    ]);
}

db_close();
?>
