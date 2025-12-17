<?php

/**
 * Environment Configuration Template
 * Copy this file to config.php and fill in your values
 * NEVER commit config.php to version control!
 */

return [
    // Database Configuration
    'db' => [
        'host' => 'quranseed.com.ng',
        'username' => 'baladre1_tailor',
        'password' => 'Himmacolage343#',
        'database' => 'baladre1_tailor',
        'charset' => 'utf8mb4'
    ],

    // Application Settings
    'app' => [
        'name' => 'Smart Tailoring Service',
        'url' => 'http://quranseed.com.ng',
        'environment' => 'production', // development, staging, production
        'debug' => false, // Set to false in production
        'timezone' => 'Asia/Kolkata'
    ],

    // Security Settings
    'security' => [
        'session_timeout' => 1800, // 30 minutes
        'password_min_length' => 6,
        'max_login_attempts' => 5,
        'lockout_duration' => 900, // 15 minutes
        'csrf_token_expiry' => 3600, // 1 hour
    ],

    // File Upload Settings
    'upload' => [
        'max_size' => 5242880, // 5MB
        'allowed_image_types' => ['image/jpeg', 'image/png', 'image/jpg'],
        'upload_path' => __DIR__ . '/../uploads/'
    ],

    // Email Configuration (for future use)
    'email' => [
        'smtp_host' => 'smtp.gmail.com',
        'smtp_port' => 587,
        'smtp_username' => '',
        'smtp_password' => '',
        'from_email' => 'noreply@smarttailoring.com',
        'from_name' => 'Smart Tailoring Service'
    ],

    // API Keys (for future use)
    'api' => [
        'google_maps_key' => '',
        'payment_gateway_key' => '',
        'sms_api_key' => ''
    ],

    // Concurrent Users
    'capacity' => [
        'max_concurrent_users' => 100,
        'session_cleanup_interval' => 300 // 5 minutes
    ]
];
