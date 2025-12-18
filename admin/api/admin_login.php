<?php

/**
 * Admin Login API
 * POST /admin/api/admin_login.php
 * Authenticates admin users
 * SECURITY: Rate limiting, session regeneration, activity logging
 */

// Secure session configuration
ini_set('session.cookie_httponly', 1);
ini_set('session.cookie_secure', 0); // Set to 1 when using HTTPS
ini_set('session.use_strict_mode', 1);

session_start();
header('Content-Type: application/json');

// Check if already logged in
if (isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true) {
    echo json_encode([
        'success' => true,
        'message' => 'Already logged in',
        'redirect' => 'dashboard.php'
    ]);
    exit;
}

// Validate POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed'
    ]);
    exit;
}

// Get form data
$username = trim($_POST['username'] ?? '');
$password = trim($_POST['password'] ?? '');

// Validate inputs
if (empty($username) || empty($password)) {
    echo json_encode([
        'success' => false,
        'message' => 'Please provide username and password'
    ]);
    exit;
}

// Rate limiting check
$ip_address = $_SERVER['REMOTE_ADDR'];
$attempt_key = 'admin_login_attempts_' . md5($ip_address);
$attempt_time_key = 'admin_login_time_' . md5($ip_address);

if (isset($_SESSION[$attempt_key]) && $_SESSION[$attempt_key] >= 5) {
    $last_attempt = $_SESSION[$attempt_time_key] ?? 0;
    if (time() - $last_attempt < 900) { // 15 minutes lockout
        echo json_encode([
            'success' => false,
            'message' => 'Too many failed attempts. Try again in 15 minutes.'
        ]);
        exit;
    } else {
        // Reset after lockout period
        $_SESSION[$attempt_key] = 0;
    }
}

// Database connection
define('DB_ACCESS', true);
require_once '../../config/db.php';

if (!isset($conn) || !($conn instanceof mysqli)) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $GLOBALS['db_connection_error'] ?? 'Database connection failed. Please try again later.'
    ]);
    exit;
}

try {
    // Prepare statement to prevent SQL injection
    $stmt = $conn->prepare("SELECT * FROM admins WHERE username = ? AND is_active = 1 LIMIT 1");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        // Increment failed attempts
        $_SESSION[$attempt_key] = ($_SESSION[$attempt_key] ?? 0) + 1;
        $_SESSION[$attempt_time_key] = time();

        // Log failed attempt
        logFailedLogin($username, $_SERVER['REMOTE_ADDR']);

        echo json_encode([
            'success' => false,
            'message' => 'Invalid username or password'
        ]);
        exit;
    }

    $admin = $result->fetch_assoc();

    // Verify password
    if (!password_verify($password, $admin['password'])) {
        // Increment failed attempts
        $_SESSION[$attempt_key] = ($_SESSION[$attempt_key] ?? 0) + 1;
        $_SESSION[$attempt_time_key] = time();

        // Log failed attempt
        logFailedLogin($username, $_SERVER['REMOTE_ADDR']);

        echo json_encode([
            'success' => false,
            'message' => 'Invalid username or password'
        ]);
        exit;
    }

    // Check if account is blocked
    if ($admin['is_active'] == 0) {
        echo json_encode([
            'success' => false,
            'message' => 'Your account has been deactivated. Contact system administrator.'
        ]);
        exit;
    }

    // Reset failed attempts on successful login
    unset($_SESSION[$attempt_key]);
    unset($_SESSION[$attempt_time_key]);

    // Regenerate session ID to prevent session fixation
    session_regenerate_id(true);

    // Login successful - create session
    $admin_display_name = $admin['full_name'] ?? $admin['name'] ?? $admin['username'];

    $_SESSION['admin_logged_in'] = true;
    $_SESSION['admin_id'] = (int)$admin['id'];
    $_SESSION['admin_username'] = htmlspecialchars($admin['username'], ENT_QUOTES, 'UTF-8');
    $_SESSION['admin_name'] = htmlspecialchars($admin_display_name, ENT_QUOTES, 'UTF-8');
    $_SESSION['admin_email'] = htmlspecialchars($admin['email'], ENT_QUOTES, 'UTF-8');
    $_SESSION['admin_role'] = $admin['role'];
    $_SESSION['admin_login_time'] = time();
    $_SESSION['admin_last_activity'] = time();

    // Update last login time
    $update_stmt = $conn->prepare("UPDATE admins SET last_login = NOW() WHERE id = ?");
    $update_stmt->bind_param("i", $admin['id']);
    $update_stmt->execute();

    // Log successful login
    logAdminActivity(
        $admin['id'],
        'login',
        'Admin logged in successfully',
        null,
        null,
        $_SERVER['REMOTE_ADDR'],
        $_SERVER['HTTP_USER_AGENT'] ?? null
    );

    echo json_encode([
        'success' => true,
        'message' => 'Login successful',
        'admin' => [
            'name' => $admin_display_name,
            'role' => $admin['role']
        ]
    ]);
} catch (Exception $e) {
    error_log("Admin login error: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'An error occurred. Please try again.'
    ]);
}

// Close connection
if (isset($stmt)) $stmt->close();
if (isset($update_stmt)) $update_stmt->close();
db_close();

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Log admin activity
 */
function logAdminActivity($admin_id, $action_type, $description, $target_type = null, $target_id = null, $ip = null, $user_agent = null)
{
    global $conn;

    try {
        $stmt = $conn->prepare("
            INSERT INTO admin_activity_log 
            (admin_id, action_type, action_description, target_type, target_id, ip_address, user_agent) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ");

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
        error_log("Failed to log admin activity: " . $e->getMessage());
    }
}

/**
 * Log failed login attempt
 */
function logFailedLogin($username, $ip)
{
    global $conn;

    try {
        $stmt = $conn->prepare("
            INSERT INTO admin_activity_log 
            (admin_id, action_type, action_description, ip_address) 
            VALUES (0, 'failed_login', ?, ?)
        ");

        $description = "Failed login attempt for username: " . $username;
        $stmt->bind_param("ss", $description, $ip);
        $stmt->execute();
        $stmt->close();
    } catch (Exception $e) {
        error_log("Failed to log failed login: " . $e->getMessage());
    }
}
