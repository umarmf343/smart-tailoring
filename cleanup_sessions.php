<?php

/**
 * Session Cleanup Script
 * Run this periodically (via cron job) to clean up old sessions
 */

define('DB_ACCESS', true);
require_once __DIR__ . '/config/db.php';
require_once __DIR__ . '/config/concurrent_users.php';

$userManager = new ConcurrentUserManager($conn, 100);

// Force cleanup of all expired sessions
$timeout = date('Y-m-d H:i:s', time() - 1800); // 30 minutes
$sql = "DELETE FROM active_sessions WHERE last_activity < '$timeout'";
mysqli_query($conn, $sql);

$deleted = mysqli_affected_rows($conn);

echo "Cleanup completed. Removed $deleted expired sessions.\n";
echo "Active users: " . $userManager->getActiveUserCount() . "\n";

$capacity = $userManager->getCapacityInfo();
echo "Capacity: " . $capacity['capacity_percentage'] . "%\n";
