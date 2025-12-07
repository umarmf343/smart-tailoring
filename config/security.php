<?php

/**
 * Security Configuration and Functions
 * CSRF Protection, Session Security, Input Validation
 */

// Prevent direct access
if (!defined('DB_ACCESS')) {
    die('Direct access not permitted');
}

/**
 * Generate CSRF Token
 * @return string
 */
function generate_csrf_token()
{
    if (!isset($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        $_SESSION['csrf_token_time'] = time();
    }
    return $_SESSION['csrf_token'];
}

/**
 * Validate CSRF Token
 * @param string $token
 * @return bool
 */
function validate_csrf_token($token)
{
    if (!isset($_SESSION['csrf_token'])) {
        return false;
    }

    // Check if token has expired (1 hour)
    if (isset($_SESSION['csrf_token_time'])) {
        if (time() - $_SESSION['csrf_token_time'] > 3600) {
            unset($_SESSION['csrf_token']);
            unset($_SESSION['csrf_token_time']);
            return false;
        }
    }

    // Compare tokens
    return hash_equals($_SESSION['csrf_token'], $token);
}

/**
 * Get CSRF Token HTML Input
 * @return string
 */
function csrf_token_field()
{
    $token = generate_csrf_token();
    return '<input type="hidden" name="csrf_token" value="' . htmlspecialchars($token, ENT_QUOTES, 'UTF-8') . '">';
}

/**
 * Get CSRF Token for AJAX
 * @return string
 */
function get_csrf_token()
{
    return generate_csrf_token();
}

/**
 * Check Session Timeout (30 minutes)
 * @return bool
 */
function check_session_timeout()
{
    $timeout = 1800; // 30 minutes

    if (isset($_SESSION['last_activity'])) {
        if (time() - $_SESSION['last_activity'] > $timeout) {
            // Session expired
            session_unset();
            session_destroy();
            return false;
        }
    }

    // Update last activity time
    $_SESSION['last_activity'] = time();
    return true;
}

/**
 * Secure session initialization
 */
function init_secure_session()
{
    // Use centralized session configuration
    require_once __DIR__ . '/session.php';

    // Check for session hijacking
    if (isset($_SESSION['user_agent'])) {
        if ($_SESSION['user_agent'] !== $_SERVER['HTTP_USER_AGENT']) {
            session_unset();
            session_destroy();
            return false;
        }
    } else {
        $_SESSION['user_agent'] = $_SERVER['HTTP_USER_AGENT'];
    }

    // Check session timeout
    return check_session_timeout();
}

/**
 * Sanitize input data (enhanced)
 * @param mixed $data
 * @return mixed
 */
function sanitize_input($data)
{
    if (is_array($data)) {
        return array_map('sanitize_input', $data);
    }

    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

/**
 * Validate email
 * @param string $email
 * @return bool
 */
function validate_email($email)
{
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

/**
 * Validate phone (Indian format)
 * @param string $phone
 * @return bool
 */
function validate_phone($phone)
{
    return preg_match('/^[6-9][0-9]{9}$/', $phone);
}

/**
 * Rate limiting check
 * @param string $action - action identifier (e.g., 'login', 'register')
 * @param int $max_attempts - maximum attempts allowed
 * @param int $time_window - time window in seconds
 * @return bool
 */
function check_rate_limit($action, $max_attempts = 5, $time_window = 900)
{
    $ip = $_SERVER['REMOTE_ADDR'];
    $key = 'rate_limit_' . $action . '_' . md5($ip);
    $time_key = $key . '_time';

    if (!isset($_SESSION[$key])) {
        $_SESSION[$key] = 1;
        $_SESSION[$time_key] = time();
        return true;
    }

    // Check if time window has passed
    if (time() - $_SESSION[$time_key] > $time_window) {
        $_SESSION[$key] = 1;
        $_SESSION[$time_key] = time();
        return true;
    }

    // Check if max attempts exceeded
    if ($_SESSION[$key] >= $max_attempts) {
        return false;
    }

    $_SESSION[$key]++;
    return true;
}

/**
 * Reset rate limit counter
 * @param string $action
 */
function reset_rate_limit($action)
{
    $ip = $_SERVER['REMOTE_ADDR'];
    $key = 'rate_limit_' . $action . '_' . md5($ip);
    unset($_SESSION[$key]);
    unset($_SESSION[$key . '_time']);
}

/**
 * Secure file upload validation
 * @param array $file - $_FILES array
 * @param array $allowed_types - allowed MIME types
 * @param int $max_size - max file size in bytes
 * @return array
 */
function validate_file_upload($file, $allowed_types = ['image/jpeg', 'image/png', 'image/jpg'], $max_size = 5242880)
{
    if (!isset($file['tmp_name']) || empty($file['tmp_name'])) {
        return ['valid' => false, 'error' => 'No file uploaded'];
    }

    // Check file size
    if ($file['size'] > $max_size) {
        return ['valid' => false, 'error' => 'File size exceeds limit'];
    }

    // Check MIME type
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);

    if (!in_array($mime, $allowed_types)) {
        return ['valid' => false, 'error' => 'Invalid file type'];
    }

    // Check if it's actually an image
    if (strpos($mime, 'image/') === 0) {
        $image_info = getimagesize($file['tmp_name']);
        if ($image_info === false) {
            return ['valid' => false, 'error' => 'Invalid image file'];
        }
    }

    return ['valid' => true, 'mime' => $mime];
}

/**
 * Generate secure random token
 * @param int $length
 * @return string
 */
function generate_secure_token($length = 32)
{
    return bin2hex(random_bytes($length));
}

/**
 * Hash password securely
 * @param string $password
 * @return string
 */
function hash_password($password)
{
    return password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
}

/**
 * Verify password
 * @param string $password
 * @param string $hash
 * @return bool
 */
function verify_password($password, $hash)
{
    return password_verify($password, $hash);
}

/**
 * Log security event
 * @param string $event
 * @param string $details
 */
function log_security_event($event, $details = '')
{
    $log_file = __DIR__ . '/../logs/security.log';
    $log_dir = dirname($log_file);

    // Create logs directory if it doesn't exist
    if (!is_dir($log_dir)) {
        mkdir($log_dir, 0755, true);
    }

    $timestamp = date('Y-m-d H:i:s');
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $user_agent = $_SERVER['HTTP_USER_AGENT'] ?? 'unknown';
    $user_id = $_SESSION['user_id'] ?? 'guest';

    $log_entry = sprintf(
        "[%s] IP: %s | User: %s | Event: %s | Details: %s | UA: %s\n",
        $timestamp,
        $ip,
        $user_id,
        $event,
        $details,
        $user_agent
    );

    error_log($log_entry, 3, $log_file);
}
