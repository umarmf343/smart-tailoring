<?php
/**
 * Registration Handler
 * Processes customer and tailor registrations
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
    $name = clean_input($_POST['name']);
    $email = clean_input($_POST['email']);
    $phone = clean_input($_POST['phone']);
    $password = $_POST['password']; // Don't clean password, we'll hash it
    
    // Validate required fields
    if (empty($user_type) || empty($name) || empty($email) || empty($phone) || empty($password)) {
        throw new Exception('All required fields must be filled');
    }
    
    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Invalid email format');
    }
    
    // Validate phone number (Indian format)
    if (!preg_match('/^[6-9][0-9]{9}$/', $phone)) {
        throw new Exception('Invalid phone number. Must be 10 digits starting with 6-9');
    }
    
    // Validate password length
    if (strlen($password) < 6) {
        throw new Exception('Password must be at least 6 characters long');
    }
    
    // Hash password
    $password_hash = password_hash($password, PASSWORD_BCRYPT);
    
    // Register based on user type
    if ($user_type === 'customer') {
        // Register Customer
        
        // Check if email already exists
        $check_query = "SELECT id FROM customers WHERE email = '" . $email . "'";
        $existing = db_fetch_one($check_query);
        
        if ($existing) {
            throw new Exception('Email already registered. Please login instead.');
        }
        
        // Check if phone already exists
        $check_phone = "SELECT id FROM customers WHERE phone = '" . $phone . "'";
        $existing_phone = db_fetch_one($check_phone);
        
        if ($existing_phone) {
            throw new Exception('Phone number already registered.');
        }
        
        // Get optional address
        $address = isset($_POST['address']) ? clean_input($_POST['address']) : '';
        
        // Insert customer
        $insert_query = "INSERT INTO customers (full_name, email, phone, password, address) 
                        VALUES ('" . $name . "', '" . $email . "', '" . $phone . "', 
                                '" . $password_hash . "', '" . $address . "')";
        
        if (db_query($insert_query)) {
            echo json_encode([
                'success' => true,
                'message' => 'Registration successful! Please login to continue.',
                'user_type' => 'customer'
            ]);
        } else {
            throw new Exception('Registration failed. Please try again.');
        }
        
    } elseif ($user_type === 'tailor') {
        // Register Tailor
        
        // Check if email already exists
        $check_query = "SELECT id FROM tailors WHERE email = '" . $email . "'";
        $existing = db_fetch_one($check_query);
        
        if ($existing) {
            throw new Exception('Email already registered. Please login instead.');
        }
        
        // Check if phone already exists
        $check_phone = "SELECT id FROM tailors WHERE phone = '" . $phone . "'";
        $existing_phone = db_fetch_one($check_phone);
        
        if ($existing_phone) {
            throw new Exception('Phone number already registered.');
        }
        
        // Get tailor-specific fields
        $shop_address = clean_input($_POST['shop_address']);
        $area = isset($_POST['area']) ? clean_input($_POST['area']) : 'Satna';
        $speciality = isset($_POST['speciality']) ? clean_input($_POST['speciality']) : 'General Tailoring';
        $services = isset($_POST['services']) ? clean_input($_POST['services']) : 'Stitching, Alteration';
        $experience = isset($_POST['experience']) ? (int)$_POST['experience'] : 0;
        
        // Validate tailor required fields
        if (empty($shop_address)) {
            throw new Exception('Shop address is required for tailor registration');
        }
        
        // Insert tailor (shop_name = owner_name for now)
        $insert_query = "INSERT INTO tailors 
                        (shop_name, owner_name, email, phone, password, shop_address, area, 
                         speciality, services_offered, experience_years, price_range) 
                        VALUES ('" . $name . "', '" . $name . "', '" . $email . "', '" . $phone . "', 
                                '" . $password_hash . "', '" . $shop_address . "', '" . $area . "', 
                                '" . $speciality . "', '" . $services . "', " . $experience . ", 'medium')";
        
        if (db_query($insert_query)) {
            echo json_encode([
                'success' => true,
                'message' => 'Tailor registration successful! Your profile will be reviewed and activated soon.',
                'user_type' => 'tailor'
            ]);
        } else {
            throw new Exception('Registration failed. Please try again.');
        }
        
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
