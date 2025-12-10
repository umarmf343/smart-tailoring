<?php

/**
 * Send OTP API
 * Generates and sends OTP to user's email
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
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    $purpose = isset($_POST['purpose']) ? trim($_POST['purpose']) : 'registration';
    $user_type = isset($_POST['user_type']) ? trim($_POST['user_type']) : null;
    $user_id = isset($_POST['user_id']) ? intval($_POST['user_id']) : null;
    $user_name = isset($_POST['user_name']) ? trim($_POST['user_name']) : null;

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

    // Validate purpose
    $valid_purposes = ['registration', 'password_reset', 'email_change', 'login_verification'];
    if (!in_array($purpose, $valid_purposes)) {
        echo json_encode([
            'success' => false,
            'message' => 'Invalid purpose'
        ]);
        exit;
    }

    // For password reset, check if email exists
    if ($purpose === 'password_reset') {
        $user_type = trim($_POST['user_type'] ?? 'customer');
        $table = $user_type === 'customer' ? 'customers' : 'tailors';

        $stmt = $conn->prepare("SELECT id, full_name FROM $table WHERE email = ?");
        if ($user_type === 'tailor') {
            $stmt = $conn->prepare("SELECT id, owner_name as full_name FROM tailors WHERE email = ?");
        }

        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 0) {
            $stmt->close();
            echo json_encode([
                'success' => false,
                'message' => 'No account found with this email address'
            ]);
            exit;
        }

        $user = $result->fetch_assoc();
        $user_id = $user['id'];
        $user_name = $user['full_name'];
        $stmt->close();
    }

    // Initialize OTP service
    $otpService = new EmailOTPService($conn);

    // Send OTP
    $result = $otpService->sendOTP($email, $purpose, $user_type, $user_id, $user_name);

    // Return response
    http_response_code($result['success'] ? 200 : 400);
    echo json_encode($result);
} catch (Exception $e) {
    error_log("Send OTP Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'An error occurred. Please try again later.'
    ]);
}

db_close();
