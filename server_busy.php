<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Server Busy - Smart Tailoring Service</title>
    <link rel="icon" type="image/jpg" href="assets/images/STP-favicon.jpg">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 20px;
        }

        .container {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            padding: 3rem 2rem;
            max-width: 500px;
            text-align: center;
        }

        .icon {
            font-size: 5rem;
            margin-bottom: 1.5rem;
        }

        h1 {
            color: #2d3748;
            font-size: 2rem;
            margin-bottom: 1rem;
        }

        p {
            color: #718096;
            font-size: 1.1rem;
            line-height: 1.6;
            margin-bottom: 1.5rem;
        }

        .stats {
            background: #f7fafc;
            padding: 1.5rem;
            border-radius: 12px;
            margin: 1.5rem 0;
        }

        .stat-row {
            display: flex;
            justify-content: space-between;
            padding: 0.75rem 0;
            border-bottom: 1px solid #e2e8f0;
        }

        .stat-row:last-child {
            border-bottom: none;
        }

        .stat-label {
            font-weight: 600;
            color: #4a5568;
        }

        .stat-value {
            color: #667eea;
            font-weight: 700;
        }

        .retry-btn {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            padding: 1rem 2rem;
            border-radius: 50px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.3s ease;
            margin-top: 1rem;
        }

        .retry-btn:hover {
            transform: translateY(-2px);
        }

        .countdown {
            color: #667eea;
            font-weight: 700;
            font-size: 1.2rem;
            margin-top: 1rem;
        }

        @media (max-width: 768px) {
            .container {
                padding: 2rem 1.5rem;
            }

            h1 {
                font-size: 1.5rem;
            }

            p {
                font-size: 1rem;
            }

            .icon {
                font-size: 3.5rem;
            }
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="icon">🚦</div>
        <h1>Server is Currently Busy</h1>
        <p>We're experiencing high traffic right now. Please wait a moment and try again.</p>

        <div class="stats">
            <div class="stat-row">
                <span class="stat-label">Active Users:</span>
                <span class="stat-value" id="activeUsers"><?php echo $capacity['active_users'] ?? '0'; ?></span>
            </div>
            <div class="stat-row">
                <span class="stat-label">Server Capacity:</span>
                <span class="stat-value" id="maxUsers"><?php echo $capacity['max_users'] ?? '100'; ?></span>
            </div>
            <div class="stat-row">
                <span class="stat-label">Available Slots:</span>
                <span class="stat-value" id="availableSlots"><?php echo $capacity['available_slots'] ?? '0'; ?></span>
            </div>
        </div>

        <p class="countdown">Auto-retrying in <span id="countdown">10</span> seconds...</p>

        <button class="retry-btn" onclick="location.reload()">Try Again Now</button>
    </div>

    <script>
        let countdown = 10;
        const countdownElement = document.getElementById('countdown');

        const timer = setInterval(() => {
            countdown--;
            countdownElement.textContent = countdown;

            if (countdown <= 0) {
                clearInterval(timer);
                location.reload();
            }
        }, 1000);
    </script>
</body>

</html>