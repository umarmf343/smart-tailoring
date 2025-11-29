<?php

/**
 * Location Search Proxy
 * Proxies requests to Nominatim API to avoid CORS issues
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

// Get search query
$query = isset($_GET['q']) ? trim($_GET['q']) : '';

if (empty($query)) {
    echo json_encode([
        'success' => false,
        'error' => 'Search query is required'
    ]);
    exit;
}

// Try multiple search strategies for better results
$searchQueries = [];

// Strategy 1: Original query
$searchQueries[] = $query;

// Strategy 2: If comma exists, try without comma
if (strpos($query, ',') !== false) {
    $searchQueries[] = str_replace(',', ' ', $query);
}

// Strategy 3: If it looks like "place, city", try just the place with city
if (strpos($query, ',') !== false) {
    $parts = explode(',', $query);
    if (count($parts) >= 2) {
        // Try "place city" format
        $searchQueries[] = trim($parts[0]) . ' ' . trim($parts[1]);
        // Try with "near" keyword
        $searchQueries[] = trim($parts[0]) . ' near ' . trim($parts[1]);
    }
}

// Try each query until we get results
$allResults = [];
foreach ($searchQueries as $searchQuery) {
    // Build Nominatim API URL with enhanced parameters for better results
    $nominatimUrl = 'https://nominatim.openstreetmap.org/search?' . http_build_query([
        'q' => $searchQuery,
        'format' => 'json',
        'limit' => 10,
        'countrycodes' => 'in',
        'addressdetails' => 1,
        'extratags' => 1,
        'namedetails' => 1,
    ]);

    // Initialize cURL
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $nominatimUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    curl_setopt($ch, CURLOPT_USERAGENT, 'TailorServiceWebsite/1.0 (Smart Tailoring Platform)');
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);

    // Execute request
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);

    if (!$error && $httpCode === 200) {
        $results = json_decode($response, true);
        if (is_array($results) && count($results) > 0) {
            // Merge unique results
            foreach ($results as $result) {
                $placeId = $result['place_id'] ?? '';
                $allResults[$placeId] = $result; // Use place_id as key to avoid duplicates
            }

            // If we have enough results, stop searching
            if (count($allResults) >= 10) {
                break;
            }
        }
    }

    // Add small delay to respect Nominatim rate limits
    usleep(500000); // 0.5 second delay
}

// Convert associative array back to indexed array
$finalResults = array_values($allResults);

// Limit to 10 results
$finalResults = array_slice($finalResults, 0, 10);

// Check for errors
if (count($finalResults) === 0) {
    echo json_encode([
        'success' => false,
        'error' => 'No results found. Try searching for: City name (e.g., "Satna"), nearby landmark (e.g., "Railway Station Satna"), or area name.'
    ]);
    exit;
}

echo json_encode([
    'success' => true,
    'results' => $finalResults
]);
