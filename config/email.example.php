<?php

/**
 * Email Configuration
 * Setup for PHPMailer with Gmail SMTP
 * 
 * IMPORTANT: This is a template file
 * Copy this to email.php and add your credentials
 */

// Email settings
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);
define('SMTP_SECURE', 'tls'); // or 'ssl' for port 465
define('SMTP_AUTH', true);

// Gmail credentials - REPLACE WITH YOUR DETAILS
define('SMTP_USERNAME', 'your-email@gmail.com');  // Your Gmail address
define('SMTP_PASSWORD', 'your-app-password');     // Gmail App Password (NOT your regular password)

// From email details
define('MAIL_FROM_EMAIL', 'your-email@gmail.com'); // Same as SMTP_USERNAME
define('MAIL_FROM_NAME', 'Smart Tailoring Service');

// Reply-to email (optional)
define('MAIL_REPLY_TO', 'your-email@gmail.com');
define('MAIL_REPLY_TO_NAME', 'Smart Tailoring Support');

// OTP settings
define('OTP_EXPIRY_MINUTES', 10);  // OTP valid for 10 minutes
define('OTP_LENGTH', 6);            // 6-digit OTP
define('MAX_OTP_ATTEMPTS', 3);      // Maximum verification attempts

// Email templates directory
define('EMAIL_TEMPLATES_DIR', __DIR__ . '/email_templates/');

// Debug mode (set to false in production)
define('SMTP_DEBUG', 0); // 0 = off, 1 = client messages, 2 = client and server messages
