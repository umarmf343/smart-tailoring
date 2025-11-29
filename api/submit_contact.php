<?php

/**
 * Submit Contact Form API
 * Handles contact form submissions
 */

session_start();
header('Content-Type: application/json');

// Include database connection
define('DB_ACCESS', true);
require_once '../config/db.php';

// Check if request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

// Get form data
$user_id = !empty($_POST['user_id']) ? intval($_POST['user_id']) : null;
$user_type = !empty($_POST['user_type']) ? $_POST['user_type'] : 'guest';
$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$phone = trim($_POST['phone'] ?? '');
$subject = trim($_POST['subject'] ?? '');
$message = trim($_POST['message'] ?? '');

// Validate required fields
if (empty($name) || empty($email) || empty($subject) || empty($message)) {
    echo json_encode(['success' => false, 'message' => 'Please fill in all required fields']);
    exit;
}

// Validate name (only letters and spaces, 2-50 chars)
if (!preg_match('/^[A-Za-z\s]{2,50}$/', $name)) {
    echo json_encode(['success' => false, 'message' => 'Name should only contain letters and spaces (2-50 characters)']);
    exit;
}

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Please enter a valid email address']);
    exit;
}

// Validate email length
if (strlen($email) > 100) {
    echo json_encode(['success' => false, 'message' => 'Email address is too long']);
    exit;
}

// Validate phone if provided (Indian format: 10 digits starting with 6-9)
if (!empty($phone) && !preg_match('/^[6-9][0-9]{9}$/', $phone)) {
    echo json_encode(['success' => false, 'message' => 'Phone number must be 10 digits starting with 6-9']);
    exit;
}

// Validate subject length
if (strlen($subject) < 5 || strlen($subject) > 200) {
    echo json_encode(['success' => false, 'message' => 'Subject should be between 5 and 200 characters']);
    exit;
}

// Validate message length
if (strlen($message) < 10 || strlen($message) > 1000) {
    echo json_encode(['success' => false, 'message' => 'Message should be between 10 and 1000 characters']);
    exit;
}

try {
    // Insert contact message into database
    $stmt = $conn->prepare("
        INSERT INTO contact_messages 
        (user_id, user_type, name, email, phone, subject, message, status) 
        VALUES (?, ?, ?, ?, ?, ?, ?, 'new')
    ");

    $stmt->bind_param(
        "issssss",
        $user_id,
        $user_type,
        $name,
        $email,
        $phone,
        $subject,
        $message
    );

    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Thank you! Your message has been sent successfully. We will get back to you soon.'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Failed to send message. Please try again later.'
        ]);
    }

    $stmt->close();
} catch (Exception $e) {
    error_log("Contact form error: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'An error occurred. Please try again later.'
    ]);
}

db_close();
