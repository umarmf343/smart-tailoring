<?php

/**
 * Forgot Password API
 * Handles password reset requests
 */

header('Content-Type: application/json');

// Start session
session_start();

// Include database connection
define('DB_ACCESS', true);
require_once '../../config/db.php';

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);

// Validate input
if (!isset($data['email']) || !isset($data['user_type'])) {
    echo json_encode([
        'success' => false,
        'message' => 'Email and user type are required'
    ]);
    exit;
}

$email = filter_var(trim($data['email']), FILTER_SANITIZE_EMAIL);
$user_type = $data['user_type'];

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid email format'
    ]);
    exit;
}

// Validate user type
if (!in_array($user_type, ['customer', 'tailor'])) {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid user type'
    ]);
    exit;
}

try {
    // Check if user exists
    $table = ($user_type === 'tailor') ? 'tailors' : 'customers';
    $stmt = $pdo->prepare("SELECT id, name, email FROM $table WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        // Don't reveal if email exists or not (security)
        echo json_encode([
            'success' => true,
            'message' => 'If the email exists, a password reset link has been sent.'
        ]);
        exit;
    }

    // Generate secure token
    $token = bin2hex(random_bytes(32));
    $expires_at = date('Y-m-d H:i:s', strtotime('+1 hour'));

    // Delete any existing tokens for this email
    $stmt = $pdo->prepare("DELETE FROM password_resets WHERE email = ? AND user_type = ?");
    $stmt->execute([$email, $user_type]);

    // Insert new reset token
    $stmt = $pdo->prepare("
        INSERT INTO password_resets (user_type, email, token, expires_at)
        VALUES (?, ?, ?, ?)
    ");
    $stmt->execute([$user_type, $email, $token, $expires_at]);

    // Create reset link
    $reset_link = "http://" . $_SERVER['HTTP_HOST'] . dirname(dirname($_SERVER['PHP_SELF'])) . "/reset_password.php?token=" . $token;

    // In a real application, you would send an email here
    // For now, we'll just return the link (for testing purposes)

    // TODO: Send email using PHPMailer or similar
    // Example email content:
    $email_subject = "Password Reset Request - Smart Tailoring";
    $email_body = "
        Hello {$user['name']},
        
        You requested to reset your password. Click the link below to reset it:
        
        {$reset_link}
        
        This link will expire in 1 hour.
        
        If you didn't request this, please ignore this email.
        
        Best regards,
        Smart Tailoring Team
    ";

    // For development: Return the link in the response
    echo json_encode([
        'success' => true,
        'message' => 'Password reset link generated successfully!',
        'reset_link' => $reset_link, // Remove this in production
        'note' => 'In production, this link would be sent via email'
    ]);
} catch (PDOException $e) {
    error_log("Forgot password error: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'An error occurred. Please try again later.'
    ]);
}
