<?php

/**
 * Email OTP Service
 * Handles OTP generation, verification, and email sending using PHPMailer
 */

// Load PHPMailer
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../config/email.php';

class EmailOTPService
{
    private $conn;
    private $mailer;

    public function __construct($db_connection)
    {
        $this->conn = $db_connection;
        $this->initializeMailer();
    }

    /**
     * Initialize PHPMailer with Gmail SMTP settings
     */
    private function initializeMailer()
    {
        $this->mailer = new PHPMailer(true);

        try {
            // Server settings
            $this->mailer->isSMTP();
            $this->mailer->Host = SMTP_HOST;
            $this->mailer->SMTPAuth = SMTP_AUTH;
            $this->mailer->Username = SMTP_USERNAME;
            $this->mailer->Password = SMTP_PASSWORD;
            $this->mailer->SMTPSecure = SMTP_SECURE;
            $this->mailer->Port = SMTP_PORT;
            $this->mailer->SMTPDebug = SMTP_DEBUG;

            // From address
            $this->mailer->setFrom(MAIL_FROM_EMAIL, MAIL_FROM_NAME);
            $this->mailer->addReplyTo(MAIL_REPLY_TO, MAIL_REPLY_TO_NAME);

            // Email format
            $this->mailer->isHTML(true);
            $this->mailer->CharSet = 'UTF-8';
        } catch (Exception $e) {
            error_log("Mailer initialization error: " . $e->getMessage());
        }
    }

    /**
     * Generate a random OTP code
     */
    private function generateOTP()
    {
        return str_pad(random_int(0, 999999), OTP_LENGTH, '0', STR_PAD_LEFT);
    }

    /**
     * Create and send OTP
     * @param string $email
     * @param string $purpose (registration, password_reset, email_change, login_verification)
     * @param string|null $user_type
     * @param int|null $user_id
     * @param string|null $user_name
     * @return array
     */
    public function sendOTP($email, $purpose = 'registration', $user_type = null, $user_id = null, $user_name = null)
    {
        try {
            // Validate email
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                return [
                    'success' => false,
                    'message' => 'Invalid email address'
                ];
            }

            // Check for recent OTP (rate limiting - max 1 OTP per 2 minutes)
            $stmt = $this->conn->prepare("
                SELECT id FROM email_otp 
                WHERE email = ? 
                AND purpose = ?
                AND created_at > DATE_SUB(NOW(), INTERVAL 2 MINUTE)
                LIMIT 1
            ");
            $stmt->bind_param("ss", $email, $purpose);
            $stmt->execute();
            if ($stmt->get_result()->num_rows > 0) {
                $stmt->close();
                return [
                    'success' => false,
                    'message' => 'Please wait 2 minutes before requesting a new OTP'
                ];
            }
            $stmt->close();

            // Generate OTP
            $otp_code = $this->generateOTP();
            $expires_at = date('Y-m-d H:i:s', strtotime('+' . OTP_EXPIRY_MINUTES . ' minutes'));

            // Store OTP in database
            $stmt = $this->conn->prepare("
                INSERT INTO email_otp (email, otp_code, purpose, user_type, user_id, expires_at)
                VALUES (?, ?, ?, ?, ?, ?)
            ");
            $stmt->bind_param("ssssis", $email, $otp_code, $purpose, $user_type, $user_id, $expires_at);

            if (!$stmt->execute()) {
                $stmt->close();
                return [
                    'success' => false,
                    'message' => 'Failed to generate OTP'
                ];
            }
            $stmt->close();

            // Send email
            $email_sent = $this->sendOTPEmail($email, $otp_code, $purpose, $user_name);

            if ($email_sent) {
                return [
                    'success' => true,
                    'message' => 'OTP sent successfully to ' . $email,
                    'expires_in' => OTP_EXPIRY_MINUTES . ' minutes'
                ];
            } else {
                // Delete OTP if email failed
                $this->conn->query("DELETE FROM email_otp WHERE email = '$email' AND otp_code = '$otp_code'");
                return [
                    'success' => false,
                    'message' => 'Failed to send OTP email. Please try again.'
                ];
            }
        } catch (Exception $e) {
            error_log("OTP Send Error: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'An error occurred while sending OTP'
            ];
        }
    }

    /**
     * Send OTP email using PHPMailer
     */
    private function sendOTPEmail($email, $otp_code, $purpose, $user_name = null)
    {
        try {
            // Determine template based on purpose
            $template = $purpose === 'password_reset' ? 'password_reset_otp.html' : 'otp_verification.html';
            $subject = $purpose === 'password_reset' ? 'Password Reset OTP' : 'Email Verification OTP';

            // Load email template
            $template_path = EMAIL_TEMPLATES_DIR . $template;
            if (!file_exists($template_path)) {
                error_log("Email template not found: " . $template_path);
                return false;
            }

            $email_body = file_get_contents($template_path);

            // Replace placeholders
            $email_body = str_replace('{{OTP_CODE}}', $otp_code, $email_body);
            $email_body = str_replace('{{USER_EMAIL}}', $email, $email_body);
            $email_body = str_replace('{{USER_NAME}}', $user_name ?? 'User', $email_body);
            $email_body = str_replace('{{EXPIRY_TIME}}', OTP_EXPIRY_MINUTES, $email_body);

            // Configure email
            $this->mailer->clearAddresses();
            $this->mailer->addAddress($email);
            $this->mailer->Subject = $subject . ' - Smart Tailoring Service';
            $this->mailer->Body = $email_body;
            $this->mailer->AltBody = "Your OTP is: $otp_code. Valid for " . OTP_EXPIRY_MINUTES . " minutes.";

            // Send email
            $result = $this->mailer->send();

            return $result;
        } catch (Exception $e) {
            error_log("Email sending failed: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Verify OTP
     * @param string $email
     * @param string $otp_code
     * @param string $purpose
     * @return array
     */
    public function verifyOTP($email, $otp_code, $purpose = 'registration')
    {
        try {
            // Get OTP record
            $stmt = $this->conn->prepare("
                SELECT id, user_type, user_id, is_verified, attempts, expires_at
                FROM email_otp
                WHERE email = ?
                AND otp_code = ?
                AND purpose = ?
                ORDER BY created_at DESC
                LIMIT 1
            ");
            $stmt->bind_param("sss", $email, $otp_code, $purpose);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result->num_rows === 0) {
                $stmt->close();
                return [
                    'success' => false,
                    'message' => 'Invalid OTP code'
                ];
            }

            $otp_record = $result->fetch_assoc();
            $stmt->close();

            // Check if already verified
            if ($otp_record['is_verified']) {
                return [
                    'success' => false,
                    'message' => 'This OTP has already been used'
                ];
            }

            // Check if expired
            if (strtotime($otp_record['expires_at']) < time()) {
                return [
                    'success' => false,
                    'message' => 'OTP has expired. Please request a new one'
                ];
            }

            // Check max attempts
            if ($otp_record['attempts'] >= MAX_OTP_ATTEMPTS) {
                return [
                    'success' => false,
                    'message' => 'Maximum verification attempts exceeded. Please request a new OTP'
                ];
            }

            // Mark as verified
            $stmt = $this->conn->prepare("
                UPDATE email_otp
                SET is_verified = 1, verified_at = NOW()
                WHERE id = ?
            ");
            $stmt->bind_param("i", $otp_record['id']);
            $stmt->execute();
            $stmt->close();

            // Update user email_verified status
            if ($purpose === 'registration' && $otp_record['user_type'] && $otp_record['user_id']) {
                $this->markEmailAsVerified($otp_record['user_id'], $otp_record['user_type']);
            }

            return [
                'success' => true,
                'message' => 'Email verified successfully!',
                'user_type' => $otp_record['user_type'],
                'user_id' => $otp_record['user_id']
            ];
        } catch (Exception $e) {
            error_log("OTP Verification Error: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Verification failed. Please try again.'
            ];
        }
    }

    /**
     * Increment failed attempts
     */
    public function incrementAttempts($email, $purpose)
    {
        $stmt = $this->conn->prepare("
            UPDATE email_otp
            SET attempts = attempts + 1
            WHERE email = ?
            AND purpose = ?
            AND is_verified = 0
            ORDER BY created_at DESC
            LIMIT 1
        ");
        $stmt->bind_param("ss", $email, $purpose);
        $stmt->execute();
        $stmt->close();
    }

    /**
     * Mark user email as verified in their table
     */
    private function markEmailAsVerified($user_id, $user_type)
    {
        $table = $user_type === 'customer' ? 'customers' : ($user_type === 'tailor' ? 'tailors' : 'admins');

        $stmt = $this->conn->prepare("
            UPDATE $table
            SET email_verified = 1, email_verified_at = NOW()
            WHERE id = ?
        ");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $stmt->close();
    }

    /**
     * Check if email is verified
     */
    public function isEmailVerified($user_id, $user_type)
    {
        $table = $user_type === 'customer' ? 'customers' : ($user_type === 'tailor' ? 'tailors' : 'admins');

        $stmt = $this->conn->prepare("SELECT email_verified FROM $table WHERE id = ?");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $stmt->close();
            return $row['email_verified'] == 1;
        }

        $stmt->close();
        return false;
    }
}
