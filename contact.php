<?php

/**
 * Contact Page
 * Contact form for users to send messages
 */

session_start();

// Check if user is logged in
$is_logged_in = isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true;
$user_name = $is_logged_in ? ($_SESSION['user_name'] ?? '') : '';
$user_email = $is_logged_in ? ($_SESSION['user_email'] ?? '') : '';
$user_type = $is_logged_in ? ($_SESSION['user_type'] ?? 'guest') : 'guest';
$user_id = $is_logged_in ? ($_SESSION['user_id'] ?? null) : null;

// Include database connection
define('DB_ACCESS', true);
require_once 'config/db.php';
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact Us - Smart Tailoring Service</title>

    <link rel="icon" type="image/jpg" href="assets/images/STP-favicon.jpg">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="assets/css/style.css">

    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Poppins', sans-serif;
        }

        .contact-header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: white;
            padding: 1.5rem 2rem;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            display: flex;
            align-items: center;
            justify-content: space-between;
            z-index: 1000;
        }

        .back-button {
            background: var(--primary-color);
            color: white;
            padding: 0.8rem 1.5rem;
            border-radius: 50px;
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-weight: 500;
            transition: all 0.3s ease;
        }

        .back-button:hover {
            background: #5a6fd8;
            transform: translateX(-5px);
        }

        .back-button i {
            font-size: 1rem;
        }

        .contact-header h1 {
            font-size: 1.8rem;
            color: var(--text-dark);
            font-weight: 600;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
        }

        .contact-page {
            min-height: 100vh;
            padding: 8rem 2rem 4rem;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }

        .contact-container {
            max-width: 1200px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 3rem;
            align-items: start;
        }

        .contact-info {
            background: white;
            padding: 3rem;
            border-radius: 20px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        }

        .contact-info h2 {
            font-size: 2rem;
            color: var(--text-dark);
            margin-bottom: 1rem;
        }

        .contact-info p {
            color: var(--text-light);
            margin-bottom: 2rem;
            line-height: 1.8;
        }

        .contact-details {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }

        .contact-item {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem;
            background: #f8f9fa;
            border-radius: 12px;
            transition: all 0.3s ease;
        }

        .contact-item:hover {
            background: linear-gradient(135deg, #667eea20, #764ba220);
            transform: translateX(5px);
        }

        .contact-item i {
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border-radius: 12px;
            font-size: 1.25rem;
        }

        .contact-item-content h4 {
            color: var(--text-dark);
            margin-bottom: 0.25rem;
            font-size: 1rem;
        }

        .contact-item-content p {
            color: var(--text-light);
            margin: 0;
            font-size: 0.95rem;
        }

        .contact-form-wrapper {
            background: white;
            padding: 3rem;
            border-radius: 20px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        }

        .contact-form-wrapper h2 {
            font-size: 2rem;
            color: var(--text-dark);
            margin-bottom: 0.5rem;
        }

        .contact-form-wrapper .subtitle {
            color: var(--text-light);
            margin-bottom: 2rem;
        }

        .form-group {
            margin-bottom: 1.5rem;
        }

        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            color: var(--text-dark);
            font-weight: 500;
        }

        .form-group label .required {
            color: #ef4444;
        }

        .form-group input,
        .form-group textarea {
            width: 100%;
            padding: 1rem;
            border: 2px solid #e5e7eb;
            border-radius: 10px;
            font-family: 'Poppins', sans-serif;
            font-size: 0.95rem;
            transition: all 0.3s ease;
        }

        .form-group input:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .form-group textarea {
            resize: vertical;
            min-height: 150px;
        }

        .form-message {
            padding: 1rem;
            border-radius: 10px;
            margin-bottom: 1.5rem;
            display: none;
        }

        .form-message.success {
            background: #d1fae5;
            color: #065f46;
            display: block;
        }

        .form-message.error {
            background: #fee2e2;
            color: #991b1b;
            display: block;
        }

        .submit-btn {
            width: 100%;
            padding: 1.25rem;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            border-radius: 10px;
            font-family: 'Poppins', sans-serif;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .submit-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
        }

        .submit-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }

        @media (max-width: 968px) {
            .contact-header h1 {
                position: static;
                transform: none;
                font-size: 1.3rem;
            }

            .contact-header {
                padding: 1rem 1.5rem;
            }

            .contact-container {
                grid-template-columns: 1fr;
            }

            .contact-page {
                padding: 6rem 1rem 2rem;
            }

            .back-button {
                padding: 0.6rem 1rem;
                font-size: 0.9rem;
            }

            .contact-info,
            .contact-form-wrapper {
                padding: 2rem;
            }
        }
    </style>
</head>

<body>
    <!-- Contact Header -->
    <div class="contact-header">
        <a href="index.php" class="back-button">
            <i class="fas fa-arrow-left"></i>
            <span>Back</span>
        </a>
        <h1>Contact Us</h1>
    </div>

    <!-- Contact Page -->
    <div class="contact-page">
        <div class="contact-container">
            <!-- Contact Information -->
            <div class="contact-info">
                <h2>Get In Touch</h2>
                <p>Have questions or concerns? We're here to help! Send us a message and we'll respond as soon as possible.</p>

                <div class="contact-details">
                    <div class="contact-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <div class="contact-item-content">
                            <h4>Address</h4>
                            <p>Satna, Madhya Pradesh, India</p>
                        </div>
                    </div>

                    <div class="contact-item">
                        <i class="fas fa-envelope"></i>
                        <div class="contact-item-content">
                            <h4>Email</h4>
                            <p>support@smarttailoring.com</p>
                        </div>
                    </div>

                    <div class="contact-item">
                        <i class="fas fa-phone"></i>
                        <div class="contact-item-content">
                            <h4>Phone</h4>
                            <p>+91 1234567890</p>
                        </div>
                    </div>

                    <div class="contact-item">
                        <i class="fas fa-clock"></i>
                        <div class="contact-item-content">
                            <h4>Working Hours</h4>
                            <p>Mon - Sat: 9:00 AM - 8:00 PM</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Contact Form -->
            <div class="contact-form-wrapper">
                <h2>Send Us a Message</h2>
                <p class="subtitle">Fill out the form below and we'll get back to you shortly.</p>

                <div class="form-message" id="formMessage"></div>

                <form id="contactForm" method="POST">
                    <input type="hidden" name="user_id" value="<?php echo $user_id; ?>">
                    <input type="hidden" name="user_type" value="<?php echo $user_type; ?>">

                    <div class="form-group">
                        <label>Your Name <span class="required">*</span></label>
                        <input type="text" name="name" value="<?php echo htmlspecialchars($user_name); ?>"
                            required placeholder="Enter your full name"
                            pattern="[A-Za-z\s]{2,50}"
                            title="Name should only contain letters and spaces (2-50 characters)"
                            minlength="2" maxlength="50">
                    </div>

                    <div class="form-group">
                        <label>Email Address <span class="required">*</span></label>
                        <input type="email" name="email" value="<?php echo htmlspecialchars($user_email); ?>"
                            required placeholder="Enter your email"
                            pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                            title="Please enter a valid email address"
                            maxlength="100">
                    </div>

                    <div class="form-group">
                        <label>Phone Number</label>
                        <input type="tel" name="phone" placeholder="Enter your phone number"
                            pattern="[6-9][0-9]{9}"
                            title="Phone number must be 10 digits starting with 6-9"
                            minlength="10" maxlength="10">
                    </div>

                    <div class="form-group">
                        <label>Subject <span class="required">*</span></label>
                        <input type="text" name="subject" required placeholder="What is this about?"
                            minlength="5" maxlength="200"
                            title="Subject should be between 5 and 200 characters">
                    </div>

                    <div class="form-group">
                        <label>Message <span class="required">*</span></label>
                        <textarea name="message" required placeholder="Write your message here..."
                            minlength="10" maxlength="1000"
                            title="Message should be between 10 and 1000 characters"></textarea>
                    </div>

                    <button type="submit" class="submit-btn">
                        <i class="fas fa-paper-plane"></i> Send Message
                    </button>
                </form>
            </div>
        </div>
    </div>

    <script>
        // Handle contact form submission
        document.getElementById('contactForm').addEventListener('submit', function(e) {
            e.preventDefault();

            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

            const formData = new FormData(this);

            fetch('api/submit_contact.php', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    const messageDiv = document.getElementById('formMessage');

                    if (data.success) {
                        messageDiv.className = 'form-message success';
                        messageDiv.innerHTML = '<i class="fas fa-check-circle"></i> ' + data.message;
                        this.reset();
                    } else {
                        messageDiv.className = 'form-message error';
                        messageDiv.innerHTML = '<i class="fas fa-exclamation-circle"></i> ' + data.message;
                    }

                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;

                    // Scroll to message
                    messageDiv.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest'
                    });
                })
                .catch(error => {
                    console.error('Error:', error);
                    const messageDiv = document.getElementById('formMessage');
                    messageDiv.className = 'form-message error';
                    messageDiv.innerHTML = '<i class="fas fa-exclamation-circle"></i> An error occurred. Please try again.';
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                });
        });
    </script>
</body>

</html>