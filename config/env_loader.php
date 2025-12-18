<?php

/**
 * Environment Loader
 * Centralizes environment loading with sensible defaults for production.
 * - Loads Dotenv when available
 * - Seeds $_ENV/putenv() from .env without overriding existing values
 * - Derives APP_URL from the current request when not provided
 * - Falls back to https://quranseed.com.ng to keep canonical URLs valid
 */

if (!function_exists('env_value')) {
    /**
     * Read an environment value with fallback support.
     */
    function env_value(string $key, $default = null)
    {
        $value = getenv($key);
        if ($value !== false) {
            return $value;
        }

        return $_ENV[$key] ?? $default;
    }
}

if (!function_exists('seed_env_from_file')) {
    /**
     * Load values from a .env file without overwriting existing environment variables.
     */
    function seed_env_from_file(string $path): void
    {
        if (!file_exists($path)) {
            return;
        }

        $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            $line = trim($line);
            if ($line === '' || strpos($line, '#') === 0 || strpos($line, '=') === false) {
                continue;
            }

            [$key, $value] = explode('=', $line, 2);
            $key = trim($key);
            $value = trim($value);

            if ($key === '' || env_value($key) !== null) {
                continue; // Respect existing server-provided values
            }

            putenv($key . '=' . $value);
            $_ENV[$key] = $value;
        }
    }
}

if (!function_exists('load_env_config')) {
    /**
     * Load environment configuration once and expose consolidated values.
     */
    function load_env_config(): array
    {
        static $config = null;
        if ($config !== null) {
            return $config;
        }

        $root = dirname(__DIR__);
        $autoloadPath = $root . '/vendor/autoload.php';

        if (file_exists($autoloadPath)) {
            require_once $autoloadPath;
            if (class_exists('Dotenv\\Dotenv')) {
                Dotenv\Dotenv::createImmutable($root)->safeLoad();
            }
        }

        // Seed environment variables from .env without overriding server values
        seed_env_from_file($root . '/.env');

        $isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
            || (!empty($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https')
            || (!empty($_SERVER['SERVER_PORT']) && (string)$_SERVER['SERVER_PORT'] === '443');

        $appEnv = env_value('APP_ENV', 'production');
        $appDebug = filter_var(env_value('APP_DEBUG', 'false'), FILTER_VALIDATE_BOOLEAN);

        // Derive a sane base URL for canonical/meta tags
        $baseUrl = env_value('APP_URL', '');
        if (empty($baseUrl) && !empty($_SERVER['HTTP_HOST'])) {
            $baseUrl = ($isHttps ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'];
        }
        if (empty($baseUrl)) {
            $baseUrl = 'https://quranseed.com.ng';
        }
        $baseUrl = rtrim($baseUrl, '/');

        // Persist computed values for the rest of the request lifecycle
        putenv('APP_ENV=' . $appEnv);
        $_ENV['APP_ENV'] = $appEnv;

        putenv('APP_DEBUG=' . ($appDebug ? 'true' : 'false'));
        $_ENV['APP_DEBUG'] = $appDebug ? 'true' : 'false';

        putenv('APP_URL=' . $baseUrl);
        $_ENV['APP_URL'] = $baseUrl;

        $config = [
            'app_env' => $appEnv,
            'app_debug' => $appDebug,
            'app_url' => $baseUrl,
            'is_https' => $isHttps,
        ];

        return $config;
    }
}
