<?php

/**
 * Tailor Cache Service
 *
 * Provides a lightweight JSON cache for GET /api/get_tailors.php so the
 * frontend can continue to render results even when the primary database is
 * temporarily unavailable.
 */
class TailorCacheService
{
    private string $cacheFile;
    private int $ttlSeconds;

    public function __construct(string $cacheFile = __DIR__ . '/../logs/cache/tailors_cache.json', int $ttlSeconds = 1800)
    {
        $this->cacheFile = $cacheFile;
        $this->ttlSeconds = $ttlSeconds;

        $directory = dirname($this->cacheFile);
        if (!is_dir($directory)) {
            mkdir($directory, 0755, true);
        }
    }

    /**
     * Persist the latest tailors payload to disk.
     */
    public function save(array $tailors): void
    {
        $payload = [
            'tailors' => $tailors,
            'count' => count($tailors),
            'cached_at' => date('c')
        ];

        file_put_contents($this->cacheFile, json_encode($payload, JSON_PRETTY_PRINT));
    }

    /**
     * Load cached tailors when the database is unavailable.
     */
    public function load(): ?array
    {
        if (!file_exists($this->cacheFile)) {
            return null;
        }

        $contents = file_get_contents($this->cacheFile);
        $data = json_decode($contents, true);

        if (!is_array($data) || !isset($data['tailors'], $data['cached_at'])) {
            return null;
        }

        $cachedAt = strtotime($data['cached_at']);
        if ($cachedAt === false) {
            return null;
        }

        if ((time() - $cachedAt) > $this->ttlSeconds) {
            return null; // Cache is stale
        }

        return [
            'tailors' => $data['tailors'],
            'count' => $data['count'] ?? count($data['tailors']),
            'cached_at' => $data['cached_at']
        ];
    }
}
