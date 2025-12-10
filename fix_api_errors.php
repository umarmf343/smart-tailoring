<?php
// Add error suppression to all API files
$apiFiles = [
    'C:\xampp\htdocs\smart\smart-tailoring\api\check_capacity.php',
    'C:\xampp\htdocs\smart\smart-tailoring\api\get_status.php',
    'C:\xampp\htdocs\smart\smart-tailoring\api\health.php',
    'C:\xampp\htdocs\smart\smart-tailoring\api\submit_contact.php',
    'C:\xampp\htdocs\smart\smart-tailoring\api\auth\forgot_password.php',
    'C:\xampp\htdocs\smart\smart-tailoring\api\auth\reset_password.php',
];

$errorSuppression = "// Disable error display for clean JSON response\nini_set('display_errors', 0);\nerror_reporting(0);\n\n";

foreach ($apiFiles as $file) {
    if (file_exists($file)) {
        $content = file_get_contents($file);

        // Check if already has error suppression
        if (strpos($content, "ini_set('display_errors', 0)") === false) {
            // Find the position after opening <?php tag
            $phpTag = '<?php';
            $pos = strpos($content, $phpTag);

            if ($pos !== false) {
                // Insert after <?php and any immediate comments
                $insertPos = $pos + strlen($phpTag);

                // Skip whitespace and find first non-comment line
                $lines = explode("\n", $content);
                $insertLine = 1;

                foreach ($lines as $i => $line) {
                    $trimmed = trim($line);
                    if ($trimmed === '<?php' || $trimmed === '' || strpos($trimmed, '/*') === 0 || strpos($trimmed, '*') === 0 || strpos($trimmed, '//') === 0 || strpos($trimmed, '*/') === 0) {
                        $insertLine = $i + 1;
                    } else {
                        break;
                    }
                }

                array_splice($lines, $insertLine, 0, [$errorSuppression]);
                $newContent = implode("\n", $lines);

                file_put_contents($file, $newContent);
                echo "✅ Updated: " . basename($file) . "\n";
            }
        } else {
            echo "⏭️  Skipped: " . basename($file) . " (already has error suppression)\n";
        }
    }
}

echo "\n✅ All API files updated!\n";
