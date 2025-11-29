<?php

/**
 * API: Change Password
 * POST /api/profile/change_password.php
 * Changes user password
 * SECURITY: CSRF protected, rate limited, input validated
 */

// Include dependencies
define('DB_ACCESS', true);
require_once '../../config/api_security.php';
require_once '../../config/db.php';
require_once '../../services/ProfileService.php';

// Initialize API security
init_api_security();

// Validate request method
validate_request_method(['POST']);

// Require authentication
$auth = require_auth(['customer', 'tailor']);

// Rate limiting - max 5 password changes per hour
api_rate_limit('change_password', 5, 3600);

// Validate CSRF token
validate_api_csrf();

try {
    $profileService = new ProfileService($conn);
    $user_id = $auth['user_id'];
    $user_type = $auth['user_type'];

    // Get and validate password data
    $current_password = $_POST['current_password'] ?? '';
    $new_password = $_POST['new_password'] ?? '';
    $confirm_password = $_POST['confirm_password'] ?? '';

    // Additional password validation
    if (strlen($new_password) < 8) {
        api_error('New password must be at least 8 characters long', 400);
    }

    // Check password complexity
    if (!preg_match('/[A-Z]/', $new_password) || !preg_match('/[a-z]/', $new_password) || !preg_match('/[0-9]/', $new_password)) {
        api_error('Password must contain uppercase, lowercase, and numbers', 400);
    }

    if ($user_type === 'customer') {
        $result = $profileService->changeCustomerPassword(
            $user_id,
            $current_password,
            $new_password,
            $confirm_password
        );
    } else if ($user_type === 'tailor') {
        $result = $profileService->changeTailorPassword(
            $user_id,
            $current_password,
            $new_password,
            $confirm_password
        );
    } else {
        throw new Exception('Invalid user type');
    }

    // Set HTTP status code
    http_response_code($result['success'] ? 200 : 400);

    // Log security event
    if ($result['success']) {
        log_security_event('password_changed', "User {$user_id} ({$user_type}) changed password");
    }

    // Return response
    echo json_encode($result);
} catch (Exception $e) {
    error_log("Password change error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'An error occurred while changing password'
    ]);
}

// Close database connection
if (isset($conn)) {
    $conn->close();
}
