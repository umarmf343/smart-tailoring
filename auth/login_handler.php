<?php
/**
 * Login Handler
 * Authenticates customers and tailors
 */

// Start session
session_start();

// Allow database access
define('DB_ACCESS', true);

// Include database connection
require_once '../config/db.php';

// Set JSON response header
header('Content-Type: application/json');

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid request method'
    ]);
    exit;
}

try {
    // Get form data
    $user_type = clean_input($_POST['user_type']);
    $email = clean_input($_POST['email']);
    $password = $_POST['password']; // Don't clean password
    
    // Validate required fields
    if (empty($user_type) || empty($email) || empty($password)) {
        throw new Exception('Please fill in all fields');
    }
    
    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Invalid email format');
    }
    
    // Login based on user type
    if ($user_type === 'customer') {
        // Customer Login
        
        $query = "SELECT id, full_name, email, phone, password, is_active 
                  FROM customers 
                  WHERE email = '" . $email . "'";
        
        $user = db_fetch_one($query);
        
        if (!$user) {
            throw new Exception('Invalid email or password');
        }
        
        // Check if account is active
        if ($user['is_active'] != 1) {
            throw new Exception('Your account has been deactivated. Please contact support.');
        }
        
        // Verify password
        if (!password_verify($password, $user['password'])) {
            throw new Exception('Invalid email or password');
        }
        
        // Set session variables
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_type'] = 'customer';
        $_SESSION['user_name'] = $user['full_name'];
        $_SESSION['user_email'] = $user['email'];
        $_SESSION['logged_in'] = true;
        
        echo json_encode([
            'success' => true,
            'message' => 'Login successful! Redirecting...',
            'userType' => 'customer',
            'redirect' => 'customer/dashboard.php'
        ]);
        
    } elseif ($user_type === 'tailor') {
        // Tailor Login
        
        $query = "SELECT id, shop_name, owner_name, email, phone, password, is_active, is_verified 
                  FROM tailors 
                  WHERE email = '" . $email . "'";
        
        $user = db_fetch_one($query);
        
        if (!$user) {
            throw new Exception('Invalid email or password');
        }
        
        // Check if account is active
        if ($user['is_active'] != 1) {
            throw new Exception('Your account has been deactivated. Please contact support.');
        }
        
        // Verify password
        if (!password_verify($password, $user['password'])) {
            throw new Exception('Invalid email or password');
        }
        
        // Set session variables
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_type'] = 'tailor';
        $_SESSION['user_name'] = $user['owner_name'];
        $_SESSION['shop_name'] = $user['shop_name'];
        $_SESSION['user_email'] = $user['email'];
        $_SESSION['is_verified'] = $user['is_verified'];
        $_SESSION['logged_in'] = true;
        
        echo json_encode([
            'success' => true,
            'message' => 'Login successful! Redirecting...',
            'userType' => 'tailor',
            'redirect' => 'tailor/dashboard.php'
        ]);
        
    } else {
        throw new Exception('Invalid user type');
    }
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}

// Close database connection
db_close();
?>
