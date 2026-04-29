#!/bin/sh
set -e

echo "[entrypoint] Pushing schema to main database..."
prisma db push \
  --schema ./src/modules/server/prisma/main-database/schema.prisma \
  --skip-generate

echo "[entrypoint] Pushing schema to telemedicine database..."
prisma db push \
  --schema ./src/modules/server/prisma/telemedicine-database/schema.prisma \
  --skip-generate

echo "[entrypoint] Pushing schema to filenest database..."
prisma db push \
  --schema ./src/modules/server/prisma/filenest-database/schema.prisma \
  --skip-generate

echo "[entrypoint] Starting server..."
exec node server.js
