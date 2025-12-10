<?php

/**
 * Fix Admin Login Script
 * This script resets or creates the admin account 'adminanupam'
 * Run this once and then delete it.
 */

// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

define('DB_ACCESS', true);
require_once 'config/db.php';

$username = 'adminanupam';
$password = 'anupam6262161170';
$email = 'admin@example.com'; // Default email if creating new
$full_name = 'Admin Anupam'; // Default name if creating new

echo "<!DOCTYPE html>
<html>
<head>
    <title>Fix Admin Login</title>
    <style>
        body { font-family: sans-serif; padding: 20px; line-height: 1.6; }
        .success { color: green; background: #e6fffa; padding: 10px; border: 1px solid green; border-radius: 5px; }
        .error { color: red; background: #fff5f5; padding: 10px; border: 1px solid red; border-radius: 5px; }
        .info { color: blue; background: #ebf8ff; padding: 10px; border: 1px solid blue; border-radius: 5px; }
    </style>
</head>
<body>
    <h1>Fix Admin Login</h1>
";

try {
    // Check connection
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }
    echo "<div class='info'>Database connected successfully.</div><br>";

    // Check if admins table exists
    $tableCheck = $conn->query("SHOW TABLES LIKE 'admins'");
    if ($tableCheck->num_rows == 0) {
        // Create table if it doesn't exist
        $sql = "CREATE TABLE `admins` (
            `id` int(11) NOT NULL AUTO_INCREMENT,
            `username` varchar(50) NOT NULL,
            `password` varchar(255) NOT NULL,
            `full_name` varchar(100) NOT NULL,
            `email` varchar(100) NOT NULL,
            `role` enum('super_admin','admin','editor') DEFAULT 'admin',
            `is_active` tinyint(1) DEFAULT 1,
            `last_login` datetime DEFAULT NULL,
            `created_at` timestamp DEFAULT current_timestamp(),
            `updated_at` timestamp DEFAULT current_timestamp() ON UPDATE current_timestamp(),
            PRIMARY KEY (`id`),
            UNIQUE KEY `username` (`username`),
            UNIQUE KEY `email` (`email`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";

        if ($conn->query($sql) === TRUE) {
            echo "<div class='success'>Admins table created successfully.</div><br>";
        } else {
            throw new Exception("Error creating table: " . $conn->error);
        }
    }

    // Check if user exists
    $stmt = $conn->prepare("SELECT id FROM admins WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    if ($result->num_rows > 0) {
        // Update existing user
        $row = $result->fetch_assoc();
        $id = $row['id'];

        $update_stmt = $conn->prepare("UPDATE admins SET password = ?, is_active = 1 WHERE id = ?");
        $update_stmt->bind_param("si", $hashed_password, $id);

        if ($update_stmt->execute()) {
            echo "<div class='success'>Password updated for user '<strong>$username</strong>'. Account activated.</div>";
        } else {
            throw new Exception("Error updating record: " . $update_stmt->error);
        }
    } else {
        // Create new user
        $insert_stmt = $conn->prepare("INSERT INTO admins (username, password, full_name, email, role, is_active) VALUES (?, ?, ?, ?, 'super_admin', 1)");
        $insert_stmt->bind_param("ssss", $username, $hashed_password, $full_name, $email);

        if ($insert_stmt->execute()) {
            echo "<div class='success'>New admin user '<strong>$username</strong>' created successfully.</div>";
        } else {
            throw new Exception("Error creating record: " . $insert_stmt->error);
        }
    }

    echo "<br><div class='info'>
        <strong>Credentials:</strong><br>
        Username: $username<br>
        Password: $password
    </div>";

    echo "<br><a href='admin/index.php' target='_blank'>Go to Admin Login</a>";
} catch (Exception $e) {
    echo "<div class='error'>Error: " . $e->getMessage() . "</div>";
}

echo "</body></html>";
