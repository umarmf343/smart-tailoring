<?php

/**
 * Admin Security Helper
 * Include this file at the top of every admin page to ensure authentication
 */

// Start session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Check if admin is logged in
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    // Redirect to login page
    header('Location: index.php');
    exit;
}

// Get admin info from session
$admin_id = $_SESSION['admin_id'];
$admin_username = $_SESSION['admin_username'];
$admin_name = $_SESSION['admin_name'];
$admin_email = $_SESSION['admin_email'];
$admin_role = $_SESSION['admin_role'];

/**
 * Check if admin has required role
 * @param string|array $required_role - 'super_admin', 'admin', or ['admin', 'super_admin']
 * @return bool
 */
function hasRole($required_role)
{
    global $admin_role;

    if (is_array($required_role)) {
        return in_array($admin_role, $required_role);
    }

    return $admin_role === $required_role;
}

/**
 * Require specific role or redirect
 * @param string|array $required_role
 * @param string $redirect_url
 */
function requireRole($required_role, $redirect_url = 'dashboard.php')
{
    if (!hasRole($required_role)) {
        header('Location: ' . $redirect_url . '?error=insufficient_permissions');
        exit;
    }
}

/**
 * Check if admin is super admin
 * @return bool
 */
function isSuperAdmin()
{
    global $admin_role;
    return $admin_role === 'super_admin';
}

/**
 * Log admin activity
 * @param string $action_type
 * @param string $description
 * @param string|null $target_type
 * @param int|null $target_id
 */
function logActivity($action_type, $description, $target_type = null, $target_id = null)
{
    global $admin_id, $conn;

    if (!isset($conn)) {
        define('DB_ACCESS', true);
        require_once '../config/db.php';
    }

    try {
        $stmt = $conn->prepare("
            INSERT INTO admin_activity_log 
            (admin_id, action_type, action_description, target_type, target_id, ip_address, user_agent) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ");

        $ip = $_SERVER['REMOTE_ADDR'];
        $user_agent = $_SERVER['HTTP_USER_AGENT'] ?? null;

        $stmt->bind_param(
            "isssiis",
            $admin_id,
            $action_type,
            $description,
            $target_type,
            $target_id,
            $ip,
            $user_agent
        );

        $stmt->execute();
        $stmt->close();
    } catch (Exception $e) {
        error_log("Failed to log activity: " . $e->getMessage());
    }
}
