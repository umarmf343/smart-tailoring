<?php

/**
 * Session Security Configuration
 * 
 * Configures secure session settings based on environment.
 * Include this file at the very beginning of your application bootstrap.
 */

// Suppress all errors
@ini_set('display_errors', 0);
@error_reporting(0);

// Start session if not already started
if (session_status() === PHP_SESSION_NONE) {
    // Configure session security based on environment
    $isProduction = isset($_ENV['APP_ENV']) && $_ENV['APP_ENV'] === 'production';
    $isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || (!empty($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https')
        || (!empty($_SERVER['SERVER_PORT']) && $_SERVER['SERVER_PORT'] == 443);

    // Session cookie parameters
    session_set_cookie_params([
        'lifetime' => 0, // Session cookie (expires when browser closes)
        'path' => '/',
        'domain' => '', // Current domain
        'secure' => $isProduction || $isHttps, // Only send over HTTPS in production
        'httponly' => true, // Prevent JavaScript access to session cookie
        'samesite' => 'Strict' // Prevent CSRF attacks
    ]);

    // Additional session security settings
    ini_set('session.use_strict_mode', '1'); // Reject uninitialized session IDs
    ini_set('session.use_only_cookies', '1'); // Don't accept session IDs via URL
    ini_set('session.cookie_httponly', '1'); // HTTP only cookies

    // In production, enforce secure cookies
    if ($isProduction || $isHttps) {
        ini_set('session.cookie_secure', '1');
    }

    // Start the session
    session_start();

    // Regenerate session ID periodically to prevent session fixation
    if (!isset($_SESSION['last_regeneration'])) {
        $_SESSION['last_regeneration'] = time();
    } elseif (time() - $_SESSION['last_regeneration'] > 1800) { // Every 30 minutes
        session_regenerate_id(true);
        $_SESSION['last_regeneration'] = time();
    }
}
