#!/bin/sh
set -e

# Run database migrations before starting the server
npm run migrate || echo "⚠️  Migration failed or already applied"

exec "$@"
