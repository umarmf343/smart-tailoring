<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

echo "<h1>Web DB Connection Test</h1>";

echo "<p>Loading config...</p>";
require_once 'config/db.php';

echo "<p>Config loaded.</p>";

if (isset($conn) && $conn) {
    echo "<p style='color:green'><strong>Connection Successful!</strong></p>";
    echo "<p>Host info: " . mysqli_get_host_info($conn) . "</p>";

    $result = mysqli_query($conn, "SELECT VERSION()");
    if ($result) {
        $row = mysqli_fetch_row($result);
        echo "<p>DB Version: " . $row[0] . "</p>";
    } else {
        echo "<p style='color:red'>Query failed: " . mysqli_error($conn) . "</p>";
    }
} else {
    echo "<p style='color:red'><strong>Connection Failed!</strong></p>";
}
