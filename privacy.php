<?php

/**
 * Privacy Policy Page
 */

session_start();
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Privacy Policy - Smart Tailoring Service</title>

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
        <h1>Privacy Policy</h1>
    </div>

    <!-- Page Content -->
    <div class="page-content">
        <div class="container">
            <div class="content-section">
                <div class="content-intro">
                    <h2>Our Privacy Commitment</h2>
                    <p>At Smart Tailoring Service, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and safeguard your data.</p>
                </div>

                <div class="content-block">
                    <h3><i class="fas fa-database"></i> Information We Collect</h3>
                    <p>We collect several types of information to provide and improve our services:</p>
                    <ul>
                        <li><strong>Personal Information:</strong> Name, email address, phone number, and location</li>
                        <li><strong>Account Information:</strong> Username, password, and user type (customer/tailor)</li>
                        <li><strong>Profile Information:</strong> For tailors - shop name, services offered, business address, pricing</li>
                        <li><strong>Usage Data:</strong> Information about how you interact with our platform</li>
                        <li><strong>Device Information:</strong> IP address, browser type, and operating system</li>
                        <li><strong>Communication Data:</strong> Messages sent through our contact forms</li>
                    </ul>
                </div>

                <div class="content-block">
                    <h3><i class="fas fa-tasks"></i> How We Use Your Information</h3>
                    <p>We use the collected information for various purposes:</p>
                    <ul>
                        <li>To create and manage your account</li>
                        <li>To connect customers with tailors</li>
                        <li>To display tailor profiles and services</li>
                        <li>To process and respond to your inquiries</li>
                        <li>To improve our platform and user experience</li>
                        <li>To send service-related notifications</li>
                        <li>To prevent fraud and ensure platform security</li>
                        <li>To comply with legal obligations</li>
                    </ul>
                </div>

                <div class="content-block">
                    <h3><i class="fas fa-share-alt"></i> Information Sharing</h3>
                    <p>We respect your privacy and limit information sharing to:</p>
                    <ul>
                        <li><strong>With Tailors:</strong> When you contact a tailor, they receive your name and contact information</li>
                        <li><strong>With Customers:</strong> Tailor profiles including business information are publicly visible</li>
                        <li><strong>Service Providers:</strong> Third-party services that help us operate our platform</li>
                        <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                        <li><strong>Business Transfers:</strong> In case of merger, acquisition, or sale of assets</li>
                    </ul>
                    <p>We do not sell your personal information to third parties for marketing purposes.</p>
                </div>

                <div class="content-block">
                    <h3><i class="fas fa-lock"></i> Data Security</h3>
                    <p>We implement appropriate security measures to protect your personal information:</p>
                    <ul>
                        <li>Secure password encryption</li>
                        <li>SSL/TLS encryption for data transmission</li>
                        <li>Regular security audits and updates</li>
                        <li>Access controls and authentication systems</li>
                        <li>Secure data storage and backup procedures</li>
                    </ul>
                    <p>However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.</p>
                </div>

                <div class="content-block">
                    <h3><i class="fas fa-cookie-bite"></i> Cookies and Tracking</h3>
                    <p>We use cookies and similar tracking technologies to:</p>
                    <ul>
                        <li>Maintain your login session</li>
                        <li>Remember your preferences</li>
                        <li>Analyze usage patterns and improve our services</li>
                        <li>Provide personalized content</li>
                    </ul>
                    <p>You can control cookies through your browser settings, but disabling them may affect platform functionality.</p>
                </div>

                <div class="content-block">
                    <h3><i class="fas fa-user-shield"></i> Your Rights and Choices</h3>
                    <p>You have the following rights regarding your personal information:</p>
                    <ul>
                        <li><strong>Access:</strong> Request a copy of your personal data</li>
                        <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                        <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                        <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                        <li><strong>Data Portability:</strong> Request your data in a portable format</li>
                        <li><strong>Object:</strong> Object to certain types of data processing</li>
                    </ul>
                    <p>To exercise these rights, please contact us using the information provided below.</p>
                </div>

                <div class="content-block">
                    <h3><i class="fas fa-child"></i> Children's Privacy</h3>
                    <p>Our platform is not intended for users under the age of 18. We do not knowingly collect personal information from children. If you believe we have inadvertently collected information from a child, please contact us immediately.</p>
                </div>

                <div class="content-block">
                    <h3><i class="fas fa-clock"></i> Data Retention</h3>
                    <p>We retain your personal information for as long as necessary to:</p>
                    <ul>
                        <li>Provide our services</li>
                        <li>Comply with legal obligations</li>
                        <li>Resolve disputes</li>
                        <li>Enforce our agreements</li>
                    </ul>
                    <p>When data is no longer needed, we securely delete or anonymize it.</p>
                </div>

                <div class="content-block">
                    <h3><i class="fas fa-globe"></i> International Data Transfers</h3>
                    <p>Your information may be transferred to and maintained on servers located outside your country. We ensure appropriate safeguards are in place to protect your data during such transfers.</p>
                </div>

                <div class="content-block">
                    <h3><i class="fas fa-sync-alt"></i> Changes to Privacy Policy</h3>
                    <p>We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last Updated" date. We encourage you to review this policy periodically.</p>
                </div>

                <div class="content-block">
                    <h3><i class="fas fa-envelope"></i> Contact Us</h3>
                    <p>If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:</p>
                    <p><span class="highlight">Email:</span> privacy@smarttailoring.com</p>
                    <p><span class="highlight">Phone:</span> +91 1234567890</p>
                    <p><span class="highlight">Address:</span> Satna, Madhya Pradesh, India 485001</p>
                </div>

                <div class="last-updated">
                    Last Updated: November 15, 2025
                </div>
            </div>
        </div>
    </div>
</body>

</html>