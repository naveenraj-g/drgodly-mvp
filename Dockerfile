# syntax=docker.io/docker/dockerfile:1

FROM node:22-alpine AS base

# ─── deps: install node_modules ───────────────────────────────────────────────
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --legacy-peer-deps

# ─── builder: generate prisma clients + next build ────────────────────────────
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* vars are baked into the client bundle at build time.
# Pass them with --build-arg (see docker-build.sh).
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_BETTER_AUTH_URL
ARG NEXT_PUBLIC_BETTER_AUTH_CLIENT_ID
ARG NEXT_PUBLIC_LIVEKIT_URL
ARG NEXT_PUBLIC_VAPI_API_KEY
ARG NEXT_PUBLIC_VAPI_AGENT_ID
ARG NEXT_PUBLIC_PY_AGENT_URL

ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_BETTER_AUTH_URL=$NEXT_PUBLIC_BETTER_AUTH_URL
ENV NEXT_PUBLIC_BETTER_AUTH_CLIENT_ID=$NEXT_PUBLIC_BETTER_AUTH_CLIENT_ID
ENV NEXT_PUBLIC_LIVEKIT_URL=$NEXT_PUBLIC_LIVEKIT_URL
ENV NEXT_PUBLIC_VAPI_API_KEY=$NEXT_PUBLIC_VAPI_API_KEY
ENV NEXT_PUBLIC_VAPI_AGENT_ID=$NEXT_PUBLIC_VAPI_AGENT_ID
ENV NEXT_PUBLIC_PY_AGENT_URL=$NEXT_PUBLIC_PY_AGENT_URL

ENV DOCKER_BUILD=true
ENV NODE_OPTIONS="--max-old-space-size=4096"
ENV NEXT_TELEMETRY_DISABLED=1

RUN npx prisma generate --schema ./src/modules/server/prisma/main-database/schema.prisma
RUN npx prisma generate --schema ./src/modules/server/prisma/filenest-database/schema.prisma
RUN npx prisma generate --schema ./src/modules/server/prisma/telemedicine-database/schema.prisma

RUN npm run build

# ─── runner: minimal production image ─────────────────────────────────────────
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

# Next.js standalone output
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/src/messages ./src/messages

# Install Prisma CLI globally so db push has all transitive deps available
RUN npm install -g prisma@6 --legacy-peer-deps

# Prisma schema files (needed by db push at runtime)
COPY --from=builder --chown=nextjs:nodejs \
  /app/src/modules/server/prisma/main-database/schema.prisma \
  ./src/modules/server/prisma/main-database/schema.prisma
COPY --from=builder --chown=nextjs:nodejs \
  /app/src/modules/server/prisma/telemedicine-database/schema.prisma \
  ./src/modules/server/prisma/telemedicine-database/schema.prisma
COPY --from=builder --chown=nextjs:nodejs \
  /app/src/modules/server/prisma/filenest-database/schema.prisma \
  ./src/modules/server/prisma/filenest-database/schema.prisma

# Entrypoint: runs db push for all 3 schemas, then starts the server
COPY --chown=nextjs:nodejs docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

# Writable runtime directories
RUN mkdir -p /app/uploads /app/logs \
 && chown -R nextjs:nodejs /app/uploads /app/logs

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# All server-side env vars (DB URLs, secrets, etc.) are injected via --env-file .env
ENTRYPOINT ["./docker-entrypoint.sh"]
