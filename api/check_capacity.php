<?php

/**
 * Server Capacity Monitor
 * Check current server load and capacity
 */

define('DB_ACCESS', true);
require_once __DIR__ . '/config/db.php';
require_once __DIR__ . '/config/concurrent_users.php';

header('Content-Type: application/json');

$userManager = new ConcurrentUserManager($conn, 100);
$capacity = $userManager->getCapacityInfo();

echo json_encode([
    'success' => true,
    'timestamp' => date('Y-m-d H:i:s'),
    'capacity' => $capacity,
    'status' => $capacity['is_full'] ? 'FULL' : 'AVAILABLE',
    'health' => [
        'load_level' => $capacity['capacity_percentage'] < 50 ? 'LOW' : ($capacity['capacity_percentage'] < 80 ? 'MEDIUM' : 'HIGH')
    ]
], JSON_PRETTY_PRINT);
