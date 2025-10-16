<?php
/**
 * API: Get Reviews
 * GET /api/reviews/get_reviews.php?tailor_id=X
 * Fetch all reviews for a specific tailor
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Get tailor_id from query string
if (!isset($_GET['tailor_id'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Tailor ID is required'
    ]);
    exit;
}

$tailor_id = (int)$_GET['tailor_id'];

define('DB_ACCESS', true);
require_once '../../config/db.php';
require_once '../../repositories/ReviewRepository.php';

try {
    $reviewRepo = new ReviewRepository($conn);
    
    // Get all reviews
    $reviews = $reviewRepo->getByTailorId($tailor_id);
    
    // Get statistics
    $stats = $reviewRepo->getStatistics($tailor_id);
    
    echo json_encode([
        'success' => true,
        'reviews' => $reviews,
        'statistics' => $stats
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to fetch reviews',
        'error' => $e->getMessage()
    ]);
}

db_close();
?>
