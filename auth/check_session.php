<?php
/**
 * Check Session Status
 * Returns whether user is logged in
 */

session_start();

header('Content-Type: application/json');

if (isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true) {
    echo json_encode([
        'loggedIn' => true,
        'userType' => $_SESSION['user_type'],
        'userName' => $_SESSION['user_name'],
        'userId' => $_SESSION['user_id']
    ]);
} else {
    echo json_encode([
        'loggedIn' => false
    ]);
}
?>
