#!/bin/bash
set -e

# Download ca.pem for Aiven MySQL SSL connection if URL is provided
if [ ! -z "$AIVEN_CA_CERT_URL" ]; then
    echo "🔐 Downloading Aiven SSL certificate..."
    curl -o ca.pem "$AIVEN_CA_CERT_URL"
    chmod 644 ca.pem
fi

# Run database migrations
echo "🗄️  Running database migrations..."
php migrate.php run || echo "⚠️  Migration failed or already up to date"

# Execute the CMD from Dockerfile (apache2-foreground)
exec "$@"
