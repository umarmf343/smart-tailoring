<?php

/**
 * Registration Queue
 *
 * When the database is unavailable, registration requests are queued to disk
 * so users are not blocked with a 503 response. Admins can replay the queued
 * entries once connectivity is restored.
 */
class RegistrationQueue
{
    private string $queueFile;
    private int $maxEntries;

    public function __construct(string $queueFile = __DIR__ . '/../logs/registration_queue.json', int $maxEntries = 200)
    {
        $this->queueFile = $queueFile;
        $this->maxEntries = $maxEntries;

        $directory = dirname($this->queueFile);
        if (!is_dir($directory)) {
            mkdir($directory, 0755, true);
        }
    }

    /**
     * Persist a queued registration.
     */
    public function enqueue(array $payload): array
    {
        $payload['queued_at'] = date('c');
        $payload['reference'] = uniqid('reg_', true);

        $existing = $this->readQueue();
        $existing[] = $payload;

        // Keep the queue bounded to avoid disk bloat
        if (count($existing) > $this->maxEntries) {
            $existing = array_slice($existing, -$this->maxEntries);
        }

        file_put_contents($this->queueFile, json_encode($existing, JSON_PRETTY_PRINT));

        return [
            'reference' => $payload['reference'],
            'position' => count($existing)
        ];
    }

    private function readQueue(): array
    {
        if (!file_exists($this->queueFile)) {
            return [];
        }

        $contents = file_get_contents($this->queueFile);
        $decoded = json_decode($contents, true);

        return is_array($decoded) ? $decoded : [];
    }
}
