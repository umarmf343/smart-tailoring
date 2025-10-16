<?php
/**
 * Review Repository
 * Handles all review-related database operations
 */

class ReviewRepository {
    private $conn;
    
    public function __construct($connection) {
        $this->conn = $connection;
    }
    
    /**
     * Create a new review
     */
    public function create($tailor_id, $customer_id, $order_id, $rating, $review_text) {
        $stmt = $this->conn->prepare("
            INSERT INTO reviews (tailor_id, customer_id, order_id, rating, review_text, is_verified) 
            VALUES (?, ?, ?, ?, ?, 1)
        ");
        
        $stmt->bind_param("iiiis", $tailor_id, $customer_id, $order_id, $rating, $review_text);
        
        if ($stmt->execute()) {
            $review_id = $this->conn->insert_id;
            $stmt->close();
            
            // Update tailor's average rating
            $this->updateTailorRating($tailor_id);
            
            return $review_id;
        }
        
        $stmt->close();
        return false;
    }
    
    /**
     * Get all reviews for a tailor
     */
    public function getByTailorId($tailor_id) {
        $stmt = $this->conn->prepare("
            SELECT 
                r.review_id,
                r.rating,
                r.review_text,
                r.is_verified,
                r.created_at,
                c.full_name as customer_name,
                c.profile_image as customer_image
            FROM reviews r
            JOIN customers c ON r.customer_id = c.id
            WHERE r.tailor_id = ?
            ORDER BY r.created_at DESC
        ");
        
        $stmt->bind_param("i", $tailor_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $reviews = [];
        while ($row = $result->fetch_assoc()) {
            $reviews[] = $row;
        }
        
        $stmt->close();
        return $reviews;
    }
    
    /**
     * Check if customer already reviewed this order
     */
    public function hasReviewed($customer_id, $order_id) {
        $stmt = $this->conn->prepare("
            SELECT review_id FROM reviews 
            WHERE customer_id = ? AND order_id = ?
        ");
        
        $stmt->bind_param("ii", $customer_id, $order_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $exists = $result->num_rows > 0;
        
        $stmt->close();
        return $exists;
    }
    
    /**
     * Check if customer has placed an order with this tailor
     */
    public function canReview($customer_id, $tailor_id) {
        $stmt = $this->conn->prepare("
            SELECT id FROM orders 
            WHERE customer_id = ? AND tailor_id = ?
            LIMIT 1
        ");
        
        $stmt->bind_param("ii", $customer_id, $tailor_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $canReview = $result->num_rows > 0;
        
        $stmt->close();
        return $canReview;
    }
    
    /**
     * Delete a review (only by the customer who created it)
     */
    public function delete($review_id, $customer_id) {
        // First get the tailor_id for rating update
        $stmt = $this->conn->prepare("SELECT tailor_id FROM reviews WHERE review_id = ? AND customer_id = ?");
        $stmt->bind_param("ii", $review_id, $customer_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            $stmt->close();
            return false;
        }
        
        $row = $result->fetch_assoc();
        $tailor_id = $row['tailor_id'];
        $stmt->close();
        
        // Delete the review
        $stmt = $this->conn->prepare("DELETE FROM reviews WHERE review_id = ? AND customer_id = ?");
        $stmt->bind_param("ii", $review_id, $customer_id);
        $success = $stmt->execute();
        $stmt->close();
        
        if ($success) {
            // Update tailor's rating after deletion
            $this->updateTailorRating($tailor_id);
        }
        
        return $success;
    }
    
    /**
     * Update tailor's average rating and total reviews
     */
    private function updateTailorRating($tailor_id) {
        $stmt = $this->conn->prepare("
            UPDATE tailors 
            SET rating = (
                SELECT COALESCE(AVG(rating), 0) 
                FROM reviews 
                WHERE tailor_id = ?
            ),
            total_reviews = (
                SELECT COUNT(*) 
                FROM reviews 
                WHERE tailor_id = ?
            )
            WHERE id = ?
        ");
        
        $stmt->bind_param("iii", $tailor_id, $tailor_id, $tailor_id);
        $stmt->execute();
        $stmt->close();
    }
    
    /**
     * Get review statistics for a tailor
     */
    public function getStatistics($tailor_id) {
        $stmt = $this->conn->prepare("
            SELECT 
                COUNT(*) as total_reviews,
                AVG(rating) as average_rating,
                SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as five_star,
                SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as four_star,
                SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as three_star,
                SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as two_star,
                SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as one_star
            FROM reviews 
            WHERE tailor_id = ?
        ");
        
        $stmt->bind_param("i", $tailor_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $stats = $result->fetch_assoc();
        
        $stmt->close();
        return $stats;
    }
}
?>
