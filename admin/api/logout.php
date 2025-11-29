<?php

/**
 * Admin Logout
 * Destroys admin session and redirects to login
 */

session_start();

// Log logout activity before destroying session
if (isset($_SESSION['admin_id'])) {
    define('DB_ACCESS', true);
    require_once '../../config/db.php';

    $admin_id = $_SESSION['admin_id'];
    $ip = $_SERVER['REMOTE_ADDR'];
    $user_agent = $_SERVER['HTTP_USER_AGENT'] ?? null;

    // Log logout
    try {
        $stmt = $conn->prepare("
            INSERT INTO admin_activity_log 
            (admin_id, action_type, action_description, ip_address, user_agent) 
            VALUES (?, 'logout', 'Admin logged out', ?, ?)
        ");
        $stmt->bind_param("iss", $admin_id, $ip, $user_agent);
        $stmt->execute();
        $stmt->close();
    } catch (Exception $e) {
        error_log("Failed to log logout: " . $e->getMessage());
    }

    db_close();
}

// Destroy all admin session data
unset($_SESSION['admin_logged_in']);
unset($_SESSION['admin_id']);
unset($_SESSION['admin_username']);
unset($_SESSION['admin_name']);
unset($_SESSION['admin_email']);
unset($_SESSION['admin_role']);

// Destroy session
session_destroy();

// Redirect to login
header('Location: ../index.php?logged_out=1');
exit;
