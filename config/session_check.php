<?php

/**
 * Session Security Middleware
 * Include this at the top of protected pages
 */

// Prevent direct access
if (!defined('DB_ACCESS')) {
    define('DB_ACCESS', true);
}

// Include security functions
require_once __DIR__ . '/security.php';

// Initialize secure session
if (!init_secure_session()) {
    // Session expired or hijacked
    if (isset($_SESSION['user_type'])) {
        $redirect = ($_SESSION['user_type'] === 'customer') ? 'customer' : 'tailor';
        header('Location: /smart/smart-tailoring/index.php?session_expired=1');
    } else {
        header('Location: /smart/smart-tailoring/index.php');
    }
    exit;
}

// Check if user is logged in
if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    header('Location: /smart/smart-tailoring/index.php');
    exit;
}

// Regenerate session ID periodically (every 30 minutes)
if (!isset($_SESSION['last_regeneration'])) {
    $_SESSION['last_regeneration'] = time();
} elseif (time() - $_SESSION['last_regeneration'] > 1800) {
    session_regenerate_id(true);
    $_SESSION['last_regeneration'] = time();
}
