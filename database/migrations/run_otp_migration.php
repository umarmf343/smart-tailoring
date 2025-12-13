<?php
require_once __DIR__ . '/../../config/db.php';

$sql = file_get_contents(__DIR__ . '/add_otp_columns.sql');

if ($conn->multi_query($sql)) {
    echo "Migration successful: OTP columns added to orders table.\n";
} else {
    echo "Migration failed: " . $conn->error . "\n";
}
