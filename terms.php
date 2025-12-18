<?php

/**
 * Terms of Use Page
 */

session_start();
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Terms Of Use - Smart Tailoring Service</title>

    <link rel="icon" type="image/svg+xml" href="assets/images/STP-favicon.svg">
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

        .page-header {
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

        .page-header h1 {
            font-size: 1.8rem;
            color: var(--text-dark);
            font-weight: 600;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
        }

        .page-content {
            min-height: 100vh;
            padding: 8rem 2rem 4rem;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }

        .container {
            max-width: 900px;
            margin: 0 auto;
        }

        .content-section {
            background: white;
            padding: 3rem;
            border-radius: 20px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        }

        .content-intro {
            margin-bottom: 3rem;
        }

        .content-intro h2 {
            font-size: 2rem;
            color: var(--text-dark);
            margin-bottom: 1rem;
        }

        .content-intro p {
            color: var(--text-light);
            font-size: 1.1rem;
            line-height: 1.8;
        }

        .content-block {
            margin-bottom: 2.5rem;
        }

        .content-block h3 {
            font-size: 1.5rem;
            color: var(--text-dark);
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .content-block h3 i {
            color: var(--primary-color);
            font-size: 1.2rem;
        }

        .content-block p,
        .content-block ul {
            color: var(--text-light);
            line-height: 1.8;
            margin-bottom: 1rem;
        }

        .content-block ul {
            padding-left: 2rem;
        }

        .content-block ul li {
            margin-bottom: 0.5rem;
        }

        .highlight {
            color: var(--primary-color);
            font-weight: 600;
        }

        .last-updated {
            text-align: center;
            color: var(--text-light);
            font-style: italic;
            margin-top: 3rem;
            padding-top: 2rem;
            border-top: 1px solid #e0e0e0;
        }

        @media (max-width: 968px) {
            .page-header h1 {
                position: static;
                transform: none;
                font-size: 1.3rem;
            }

            .page-header {
                padding: 1rem 1.5rem;
            }

            .page-content {
                padding: 6rem 1rem 2rem;
            }

            .back-button {
                padding: 0.6rem 1rem;
                font-size: 0.9rem;
            }

            .content-section {
                padding: 2rem;
            }
        }
    </style>
</head>

<body>
    <!-- Page Header -->
    <div class="page-header">
        <a href="index.php" class="back-button">
            <i class="fas fa-arrow-left"></i>
            <span>Back</span>
        </a>
        <h1>Terms Of Use</h1>
    </div>

    <!-- Page Content -->
    <div class="page-content">
        <div class="container">
            <div class="content-section">
                <div class="content-intro">
                    <h2>Terms and Conditions</h2>
                    <p>Welcome to Smart Tailoring Service. By accessing and using our platform, you agree to comply with and be bound by the following terms and conditions.</p>
                </div>

                <div class="content-block">
                    <h3><i class="fas fa-check-circle"></i> Acceptance of Terms</h3>
                    <p>By accessing or using the Smart Tailoring Service platform, you acknowledge that you have read, understood, and agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use our services.</p>
                </div>

                <div class="content-block">
                    <h3><i class="fas fa-user-circle"></i> User Accounts</h3>
                    <p>To access certain features of our platform, you may be required to create an account. You agree to:</p>
                    <ul>
                        <li>Provide accurate, current, and complete information during registration</li>
                        <li>Maintain and promptly update your account information</li>
                        <li>Maintain the security of your password and account</li>
                        <li>Accept responsibility for all activities that occur under your account</li>
                        <li>Notify us immediately of any unauthorized use of your account</li>
                    </ul>
                </div>

                <div class="content-block">
                    <h3><i class="fas fa-shopping-bag"></i> Services Provided</h3>
                    <p>Smart Tailoring Service is a platform that connects customers with professional tailors. We provide:</p>
                    <ul>
                        <li>A searchable directory of tailors in various locations</li>
                        <li>Profile pages for tailors showcasing their services and specializations</li>
                        <li>Rating and review system for customer feedback</li>
                        <li>Verification and premium badges for qualified tailors</li>
                        <li>Contact information to facilitate direct communication</li>
                    </ul>
                </div>

                <div class="content-block">
                    <h3><i class="fas fa-handshake"></i> User Responsibilities</h3>
                    <p>As a user of our platform, you agree to:</p>
                    <ul>
                        <li>Use the platform only for lawful purposes</li>
                        <li>Not misrepresent your identity or affiliation</li>
                        <li>Respect the intellectual property rights of others</li>
                        <li>Not post false, misleading, or defamatory content</li>
                        <li>Not engage in any activity that could harm or interfere with the platform</li>
                        <li>Comply with all applicable local, state, and federal laws</li>
                    </ul>
                </div>

                <div class="content-block">
                    <h3><i class="fas fa-store"></i> Tailor Responsibilities</h3>
                    <p>Tailors registered on our platform agree to:</p>
                    <ul>
                        <li>Provide accurate information about their services, pricing, and availability</li>
                        <li>Maintain professional standards in all customer interactions</li>
                        <li>Honor commitments made to customers</li>
                        <li>Respond promptly to customer inquiries</li>
                        <li>Maintain valid business licenses and permits as required by law</li>
                    </ul>
                </div>

                <div class="content-block">
                    <h3><i class="fas fa-shield-alt"></i> Liability Disclaimer</h3>
                    <p>Smart Tailoring Service acts as an intermediary platform connecting customers with tailors. We:</p>
                    <ul>
                        <li>Do not guarantee the quality of services provided by tailors</li>
                        <li>Are not responsible for disputes between customers and tailors</li>
                        <li>Do not participate in the actual tailoring transactions</li>
                        <li>Cannot be held liable for any damages arising from use of our platform</li>
                        <li>Recommend users exercise their own judgment when selecting tailors</li>
                    </ul>
                </div>

                <div class="content-block">
                    <h3><i class="fas fa-gavel"></i> Intellectual Property</h3>
                    <p>All content on the Smart Tailoring Service platform, including text, graphics, logos, images, and software, is the property of Smart Tailoring Service or its content suppliers and is protected by copyright and intellectual property laws.</p>
                </div>

                <div class="content-block">
                    <h3><i class="fas fa-ban"></i> Termination</h3>
                    <p>We reserve the right to suspend or terminate your account and access to our platform at any time, without notice, for conduct that we believe violates these Terms of Use or is harmful to other users, our business, or third parties.</p>
                </div>

                <div class="content-block">
                    <h3><i class="fas fa-edit"></i> Changes to Terms</h3>
                    <p>We reserve the right to modify these Terms of Use at any time. We will notify users of any material changes by posting the new terms on this page. Your continued use of the platform after such modifications constitutes your acceptance of the updated terms.</p>
                </div>

                <div class="content-block">
                    <h3><i class="fas fa-envelope"></i> Contact Information</h3>
                    <p>If you have any questions about these Terms of Use, please contact us at:</p>
                    <p><span class="highlight">Email:</span> support@smarttailoring.com</p>
                    <p><span class="highlight">Phone:</span> +91 1234567890</p>
                </div>

                <div class="last-updated">
                    Last Updated: November 15, 2025
                </div>
            </div>
        </div>
    </div>
</body>

</html>