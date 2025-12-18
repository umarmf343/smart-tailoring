<?php

/**
 * Email Configuration
 * Setup for PHPMailer with Gmail SMTP
 * Updated for Cloud Deployment (Environment Variables)
 */

require_once __DIR__ . '/env_loader.php';
$appConfig = load_env_config();

// Email settings
define('SMTP_HOST', env_value('SMTP_HOST', 'smtp.gmail.com'));
define('SMTP_PORT', (int)env_value('SMTP_PORT', 587));
define('SMTP_SECURE', env_value('SMTP_SECURE', 'tls'));
define('SMTP_AUTH', filter_var(env_value('SMTP_AUTH', 'true'), FILTER_VALIDATE_BOOLEAN));

// Gmail credentials
define('SMTP_USERNAME', env_value('SMTP_USERNAME', ''));
define('SMTP_PASSWORD', env_value('SMTP_PASSWORD', ''));

// From email details
define('MAIL_FROM_EMAIL', env_value('MAIL_FROM_EMAIL', env_value('SMTP_USERNAME', '')));
define('MAIL_FROM_NAME', env_value('MAIL_FROM_NAME', 'Smart Tailoring Service'));

// Reply-to email
define('MAIL_REPLY_TO', env_value('MAIL_REPLY_TO', env_value('SMTP_USERNAME', '')));
define('MAIL_REPLY_TO_NAME', env_value('MAIL_REPLY_TO_NAME', 'Smart Tailoring Support'));

// OTP settings
define('OTP_EXPIRY_MINUTES', (int)env_value('OTP_EXPIRY_MINUTES', 10));
define('OTP_LENGTH', (int)env_value('OTP_LENGTH', 6));
define('MAX_OTP_ATTEMPTS', (int)env_value('MAX_OTP_ATTEMPTS', 3));

// Email templates directory
define('EMAIL_TEMPLATES_DIR', __DIR__ . '/email_templates/');

// Debug mode
define('SMTP_DEBUG', (int)env_value('SMTP_DEBUG', 0));
