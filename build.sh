#!/bin/sh
set -e

echo "🚀 Installing dependencies"
npm ci --quiet

echo "🗄️  Running SQL migrations"
npm run migrate || echo "⚠️  Migration failed or already applied"

echo "✅ Build completed"
