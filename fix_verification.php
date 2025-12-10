<?php
/**
 * Fix Verification Status
 * This script marks all existing customers and tailors as verified.
 * Run this once to fix login for existing users.
 */

// Enable error reporting
ini_set('display_errors', 1);
error_reporting(E_ALL);

define('DB_ACCESS', true);
require_once 'config/db.php';

echo "<!DOCTYPE html>
<html>
<head>
    <title>Fix Verification Status</title>
    <style>
        body { font-family: sans-serif; padding: 20px; line-height: 1.6; }
        .success { color: green; background: #e6fffa; padding: 10px; border: 1px solid green; border-radius: 5px; margin-bottom: 10px; }
        .error { color: red; background: #fff5f5; padding: 10px; border: 1px solid red; border-radius: 5px; margin-bottom: 10px; }
        .info { color: blue; background: #ebf8ff; padding: 10px; border: 1px solid blue; border-radius: 5px; margin-bottom: 10px; }
    </style>
</head>
<body>
    <h1>Fix Verification Status</h1>
    <p>This script will mark all existing users as 'verified' so they can login without OTP.</p>
";

try {
    // Check connection
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }
    echo "<div class='info'>Database connected successfully.</div>";

    // 1. Fix Customers
    $sql = "UPDATE customers SET email_verified = 1 WHERE email_verified = 0";
    if ($conn->query($sql) === TRUE) {
        $affected = $conn->affected_rows;
        echo "<div class='success'>Updated <strong>$affected</strong> customers to 'verified'.</div>";
    } else {
        echo "<div class='error'>Error updating customers: " . $conn->error . "</div>";
    }

    // 2. Fix Tailors
    $sql = "UPDATE tailors SET email_verified = 1, is_verified = 1 WHERE email_verified = 0 OR is_verified = 0";
    if ($conn->query($sql) === TRUE) {
        $affected = $conn->affected_rows;
        echo "<div class='success'>Updated <strong>$affected</strong> tailors to 'verified'.</div>";
    } else {
        echo "<div class='error'>Error updating tailors: " . $conn->error . "</div>";
    }

    echo "<br><div class='info'>
        <strong>Done!</strong><br>
        Existing users should now be able to login without OTP.<br>
        New registrations will still require OTP verification.
    </div>";
    
    echo "<br><a href='index.php' target='_blank'>Go to Homepage</a>";

} catch (Exception $e) {
    echo "<div class='error'>Error: " . $e->getMessage() . "</div>";
}

echo "</body></html>";
?>
