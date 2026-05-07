#!/bin/sh
set -e

echo "[entrypoint] Pushing schema to telemedicine database..."
prisma db push \
  --schema ./src/modules/server/prisma/telemedicine-database/schema.prisma \
  --skip-generate

echo "[entrypoint] Starting server..."
exec node server.js
