<?php

/**
 * Resend OTP API
 * Resends OTP to user's email
 */

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
require_once '../../services/EmailOTPService.php';

try {
    // Get request data
    $email = trim($_POST['email'] ?? '');
    $purpose = trim($_POST['purpose'] ?? 'registration');
    $user_type = trim($_POST['user_type'] ?? null);
    $user_id = isset($_POST['user_id']) ? intval($_POST['user_id']) : null;
    $user_name = trim($_POST['user_name'] ?? null);

    // Validate email
    if (empty($email)) {
        echo json_encode([
            'success' => false,
            'message' => 'Email is required'
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
    $otpService = new EmailOTPService($conn);

    // Invalidate previous OTPs for this email and purpose
    $stmt = $conn->prepare("
        UPDATE email_otp 
        SET is_verified = 1, verified_at = NOW()
        WHERE email = ? 
        AND purpose = ? 
        AND is_verified = 0
    ");
    $stmt->bind_param("ss", $email, $purpose);
    $stmt->execute();
    $stmt->close();

    // Send new OTP
    $result = $otpService->sendOTP($email, $purpose, $user_type, $user_id, $user_name);

    // Return response
    http_response_code($result['success'] ? 200 : 400);
    echo json_encode($result);
} catch (Exception $e) {
    error_log("Resend OTP Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to resend OTP. Please try again.'
    ]);
}

db_close();
