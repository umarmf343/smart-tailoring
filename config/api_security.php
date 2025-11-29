<?php

/**
 * API Security Middleware
 * Include this in all API endpoints for consistent security
 */

// Prevent direct access
if (!defined('DB_ACCESS')) {
    http_response_code(403);
    die(json_encode(['success' => false, 'message' => 'Direct access forbidden']));
}

// Load security functions
require_once __DIR__ . '/security.php';

/**
 * Initialize secure API environment
 */
function init_api_security()
{
    // Set secure headers
    header('Content-Type: application/json; charset=UTF-8');
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: DENY');
    header('X-XSS-Protection: 1; mode=block');

    // Initialize secure session
    init_secure_session();

    // Validate request method if specified
    return true;
}

/**
 * Validate API request method
 */
function validate_request_method($allowed_methods = ['POST'])
{
    $method = $_SERVER['REQUEST_METHOD'];

    if (!in_array($method, $allowed_methods)) {
        http_response_code(405);
        echo json_encode([
            'success' => false,
            'message' => 'Method not allowed'
        ]);
        exit;
    }
}

/**
 * Require authentication
 */
function require_auth($allowed_types = ['customer', 'tailor'])
{
    if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => 'Authentication required'
        ]);
        exit;
    }

    if (!in_array($_SESSION['user_type'], $allowed_types)) {
        http_response_code(403);
        echo json_encode([
            'success' => false,
            'message' => 'Access forbidden'
        ]);
        exit;
    }

    return [
        'user_id' => (int)$_SESSION['user_id'],
        'user_type' => $_SESSION['user_type']
    ];
}

/**
 * Validate CSRF token for API requests
 */
function validate_api_csrf()
{
    $token = null;

    // Check POST data
    if (isset($_POST['csrf_token'])) {
        $token = $_POST['csrf_token'];
    }
    // Check JSON body
    elseif ($json = json_decode(file_get_contents('php://input'), true)) {
        $token = $json['csrf_token'] ?? null;
    }
    // Check headers
    elseif (isset($_SERVER['HTTP_X_CSRF_TOKEN'])) {
        $token = $_SERVER['HTTP_X_CSRF_TOKEN'];
    }

    if (!$token || !validate_csrf_token($token)) {
        http_response_code(403);
        echo json_encode([
            'success' => false,
            'message' => 'Invalid or missing CSRF token'
        ]);
        exit;
    }

    return true;
}

/**
 * Sanitize API input data
 */
function sanitize_api_input($data)
{
    if (is_array($data)) {
        return array_map('sanitize_api_input', $data);
    }

    return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}

/**
 * API rate limiting
 */
function api_rate_limit($action, $max_requests = 60, $time_window = 60)
{
    $ip = $_SERVER['REMOTE_ADDR'];
    $key = 'api_limit_' . $action . '_' . md5($ip);
    $time_key = $key . '_time';

    if (!isset($_SESSION[$key])) {
        $_SESSION[$key] = 1;
        $_SESSION[$time_key] = time();
        return true;
    }

    // Reset if time window passed
    if (time() - $_SESSION[$time_key] > $time_window) {
        $_SESSION[$key] = 1;
        $_SESSION[$time_key] = time();
        return true;
    }

    // Check limit
    if ($_SESSION[$key] >= $max_requests) {
        http_response_code(429);
        echo json_encode([
            'success' => false,
            'message' => 'Rate limit exceeded. Please try again later.'
        ]);
        exit;
    }

    $_SESSION[$key]++;
    return true;
}

/**
 * Validate and sanitize integer ID
 */
function validate_id($id, $field_name = 'ID')
{
    $id = filter_var($id, FILTER_VALIDATE_INT);

    if ($id === false || $id <= 0) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => "Invalid {$field_name}"
        ]);
        exit;
    }

    return $id;
}

/**
 * Send error response and exit
 */
function api_error($message, $code = 400, $extra = [])
{
    http_response_code($code);
    echo json_encode(array_merge([
        'success' => false,
        'message' => $message
    ], $extra));
    exit;
}

/**
 * Send success response
 */
function api_success($message, $data = [], $code = 200)
{
    http_response_code($code);
    echo json_encode(array_merge([
        'success' => true,
        'message' => $message
    ], $data));
}

/**
 * Validate email input
 */
function validate_api_email($email)
{
    $email = filter_var($email, FILTER_VALIDATE_EMAIL);

    if (!$email) {
        api_error('Invalid email format');
    }

    return $email;
}

/**
 * Get JSON input safely
 */
function get_json_input()
{
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        api_error('Invalid JSON input', 400);
    }

    return $data ?? [];
}

/**
 * Check if user owns resource
 */
function check_ownership($resource_user_id, $current_user_id, $resource_type = 'resource')
{
    if ((int)$resource_user_id !== (int)$current_user_id) {
        http_response_code(403);
        echo json_encode([
            'success' => false,
            'message' => "You don't have permission to access this {$resource_type}"
        ]);
        exit;
    }

    return true;
}
