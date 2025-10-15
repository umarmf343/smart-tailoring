<?php
/**
 * API: Get Statistics
 * Returns counts of tailors, customers, orders
 */

define('DB_ACCESS', true);
require_once '../config/db.php';

header('Content-Type: application/json');

try {
    // Get counts
    $tailorCount = db_fetch_one("SELECT COUNT(*) as count FROM tailors WHERE is_active = 1");
    $customerCount = db_fetch_one("SELECT COUNT(*) as count FROM customers WHERE is_active = 1");
    $orderCount = db_fetch_one("SELECT COUNT(*) as count FROM orders");
    
    echo json_encode([
        'success' => true,
        'tailors' => (int)$tailorCount['count'],
        'customers' => (int)$customerCount['count'],
        'orders' => (int)$orderCount['count']
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'tailors' => 0,
        'customers' => 0,
        'orders' => 0
    ]);
}

db_close();
?>
