<?php

/**
 * FAQ Page - Frequently Asked Questions
 */

session_start();
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FAQ - Smart Tailoring Service</title>

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

        .faq-section {
            background: white;
            padding: 3rem;
            border-radius: 20px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        }

        .faq-intro {
            text-align: center;
            margin-bottom: 3rem;
        }

        .faq-intro h2 {
            font-size: 2rem;
            color: var(--text-dark);
            margin-bottom: 1rem;
        }

        .faq-intro p {
            color: var(--text-light);
            font-size: 1.1rem;
        }

        .faq-item {
            margin-bottom: 1.5rem;
            border: 1px solid #e0e0e0;
            border-radius: 10px;
            overflow: hidden;
            transition: all 0.3s ease;
        }

        .faq-item:hover {
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .faq-question {
            background: #f8f9fa;
            padding: 1.5rem;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            user-select: none;
        }

        .faq-question h3 {
            font-size: 1.1rem;
            color: var(--text-dark);
            font-weight: 500;
        }

        .faq-question i {
            color: var(--primary-color);
            font-size: 1.2rem;
            transition: transform 0.3s ease;
        }

        .faq-question.active i {
            transform: rotate(180deg);
        }

        .faq-answer {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease;
        }

        .faq-answer-content {
            padding: 1.5rem;
            color: var(--text-light);
            line-height: 1.8;
        }

        .faq-answer.active {
            max-height: 500px;
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

            .faq-section {
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
        <h1>Ask Questions</h1>
    </div>

    <!-- Page Content -->
    <div class="page-content">
        <div class="container">
            <div class="faq-section">
                <div class="faq-intro">
                    <h2>Frequently Asked Questions</h2>
                    <p>Find answers to common questions about our tailoring services</p>
                </div>

                <!-- FAQ Items -->
                <div class="faq-item">
                    <div class="faq-question" onclick="toggleFaq(this)">
                        <h3>How do I find a tailor near me?</h3>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="faq-answer">
                        <div class="faq-answer-content">
                            You can use our search feature on the homepage to find tailors by name, location, or services. You can also browse through our verified and premium tailors to find the best match for your needs.
                        </div>
                    </div>
                </div>

                <div class="faq-item">
                    <div class="faq-question" onclick="toggleFaq(this)">
                        <h3>What is the difference between verified and premium tailors?</h3>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="faq-answer">
                        <div class="faq-answer-content">
                            Verified tailors have been authenticated by our team and meet our quality standards. Premium tailors are verified tailors with a 5-star rating, indicating exceptional service quality and customer satisfaction.
                        </div>
                    </div>
                </div>

                <div class="faq-item">
                    <div class="faq-question" onclick="toggleFaq(this)">
                        <h3>How do I book an appointment with a tailor?</h3>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="faq-answer">
                        <div class="faq-answer-content">
                            Click on any tailor's profile to view their details, services, and contact information. You can then contact them directly through phone or visit their shop to schedule an appointment.
                        </div>
                    </div>
                </div>

                <div class="faq-item">
                    <div class="faq-question" onclick="toggleFaq(this)">
                        <h3>Can I register as a tailor on this platform?</h3>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="faq-answer">
                        <div class="faq-answer-content">
                            Yes! Click on the "Login/Register" button and select the "Tailor" option. Fill in your details including shop name, services, location, and contact information to create your tailor profile.
                        </div>
                    </div>
                </div>

                <div class="faq-item">
                    <div class="faq-question" onclick="toggleFaq(this)">
                        <h3>How are tailors rated and reviewed?</h3>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="faq-answer">
                        <div class="faq-answer-content">
                            Customers who have used a tailor's services can leave ratings and reviews based on their experience. These ratings help other customers make informed decisions and help tailors improve their services.
                        </div>
                    </div>
                </div>

                <div class="faq-item">
                    <div class="faq-question" onclick="toggleFaq(this)">
                        <h3>What services can I find on this platform?</h3>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="faq-answer">
                        <div class="faq-answer-content">
                            Our platform features tailors offering various services including custom stitching, alterations, embroidery, suit tailoring, dress making, and more. Each tailor's profile lists their specific services and specializations.
                        </div>
                    </div>
                </div>

                <div class="faq-item">
                    <div class="faq-question" onclick="toggleFaq(this)">
                        <h3>Is there a fee to use this platform?</h3>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="faq-answer">
                        <div class="faq-answer-content">
                            Our platform is completely free for customers to search and find tailors. Tailors can create basic profiles for free. Premium features and verified badges may have associated fees for tailors.
                        </div>
                    </div>
                </div>

                <div class="faq-item">
                    <div class="faq-question" onclick="toggleFaq(this)">
                        <h3>How do I contact customer support?</h3>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="faq-answer">
                        <div class="faq-answer-content">
                            You can reach us through our Contact page, send an email to support@smarttailoring.com, or call us at +91 1234567890. We're here to help with any questions or concerns you may have.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        function toggleFaq(element) {
            const answer = element.nextElementSibling;
            const isActive = element.classList.contains('active');

            // Close all FAQ items
            document.querySelectorAll('.faq-question').forEach(q => {
                q.classList.remove('active');
                q.nextElementSibling.classList.remove('active');
            });

            // Toggle current item
            if (!isActive) {
                element.classList.add('active');
                answer.classList.add('active');
            }
        }
    </script>
</body>

</html>