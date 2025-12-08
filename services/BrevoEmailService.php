<?php

/**
 * Brevo (Sendinblue) Email Service
 * Sends emails via HTTP API to bypass SMTP port blocking
 */

class BrevoEmailService
{
    private $apiKey;
    private $senderName;
    private $senderEmail;

    public function __construct()
    {
        // Load from environment variables
        $this->apiKey = getenv('BREVO_API_KEY') ?: ($_ENV['BREVO_API_KEY'] ?? '');
        $this->senderName = getenv('MAIL_FROM_NAME') ?: ($_ENV['MAIL_FROM_NAME'] ?? 'Smart Tailoring');
        $this->senderEmail = getenv('MAIL_FROM_EMAIL') ?: ($_ENV['MAIL_FROM_EMAIL'] ?? '');
    }

    /**
     * Send an email using Brevo API
     */
    public function sendEmail($toEmail, $toName, $subject, $htmlContent)
    {
        if (empty($this->apiKey)) {
            error_log("Brevo Error: API Key is missing");
            return false;
        }

        $url = 'https://api.brevo.com/v3/smtp/email';

        $data = [
            'sender' => [
                'name' => $this->senderName,
                'email' => $this->senderEmail
            ],
            'to' => [
                [
                    'email' => $toEmail,
                    'name' => $toName
                ]
            ],
            'subject' => $subject,
            'htmlContent' => $htmlContent
        ];

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'accept: application/json',
            'api-key: ' . $this->apiKey,
            'content-type: application/json'
        ]);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlError = curl_error($ch);
        curl_close($ch);

        if ($httpCode >= 200 && $httpCode < 300) {
            return true;
        }

        error_log("Brevo Email Error ($httpCode): " . $response . " | Curl Error: " . $curlError);
        return false;
    }
}
