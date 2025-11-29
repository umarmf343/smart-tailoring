<?php

/**
 * Verify OTP API
 * Verifies the OTP code entered by user
 */

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
require_once '../../services/EmailOTPService.php';

try {
    // Get request data
    $email = trim($_POST['email'] ?? '');
    $otp_code = trim($_POST['otp_code'] ?? '');
    $purpose = trim($_POST['purpose'] ?? 'registration');

    // Validate inputs
    if (empty($email) || empty($otp_code)) {
        echo json_encode([
            'success' => false,
            'message' => 'Email and OTP code are required'
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

    // Validate OTP format (6 digits)
    if (!preg_match('/^[0-9]{6}$/', $otp_code)) {
        echo json_encode([
            'success' => false,
            'message' => 'Invalid OTP format'
        ]);
        exit;
    }

    // Initialize OTP service
    $otpService = new EmailOTPService($conn);

    // Verify OTP
    $result = $otpService->verifyOTP($email, $otp_code, $purpose);

    // If verification failed, increment attempts
    if (!$result['success']) {
        $otpService->incrementAttempts($email, $purpose);
    }

    // Return response
    http_response_code($result['success'] ? 200 : 400);
    echo json_encode($result);
} catch (Exception $e) {
    error_log("Verify OTP Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Verification failed. Please try again.'
    ]);
}

db_close();
