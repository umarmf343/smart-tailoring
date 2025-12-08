<?php

/**
 * Reset Password API (After OTP Verification)
 * Updates user password after successful OTP verification
 */

// Disable error display for clean JSON response
ini_set('display_errors', 0);
error_reporting(0);


header('Content-Type: application/json');

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed'
    ]);
    exit;
}

// Include dependencies
define('DB_ACCESS', true);
require_once '../../config/db.php';

try {
    // Get request data
    $email = trim($_POST['email'] ?? '');
    $password = trim($_POST['password'] ?? '');
    $user_type = trim($_POST['user_type'] ?? 'customer');

    // Validate inputs
    if (empty($email) || empty($password)) {
        echo json_encode([
            'success' => false,
            'message' => 'Email and password are required'
        ]);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode([
            'success' => false,
            'message' => 'Invalid email address'
        ]);
        exit;
    }

    // Initialize OTP service
    require_once '../../services/EmailOTPService.php';
    $otpService = new EmailOTPService($conn);
    
    // Check if a valid OTP was verified in the last 15 minutes
    if (!$otpService->checkVerifiedOTP($email, 'password_reset', 15)) {
        echo json_encode([
            'success' => false,
            'message' => 'Session expired or invalid. Please verify OTP again.'
        ]);
        exit;
    }

    if (strlen($password) < 6) {
        echo json_encode([
            'success' => false,
            'message' => 'Password must be at least 6 characters'
        ]);
        exit;
    }

    // Hash the new password
    $password_hash = password_hash($password, PASSWORD_BCRYPT);

    // Determine table based on user type
    $table = $user_type === 'customer' ? 'customers' : 'tailors';

    // Update password
    $stmt = $conn->prepare("UPDATE $table SET password = ? WHERE email = ?");
    $stmt->bind_param("ss", $password_hash, $email);

    if ($stmt->execute() && $stmt->affected_rows > 0) {
        $stmt->close();

        echo json_encode([
            'success' => true,
            'message' => 'Password reset successfully!'
        ]);
    } else {
        $stmt->close();
        echo json_encode([
            'success' => false,
            'message' => 'Failed to reset password. Please try again.'
        ]);
    }
} catch (Exception $e) {
    error_log("Password reset error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'An error occurred. Please try again.'
    ]);
}

db_close();
