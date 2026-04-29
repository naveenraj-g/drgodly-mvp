#!/usr/bin/env bash
# Build the Docker image, reading NEXT_PUBLIC_* vars from .env so they
# get baked into the client bundle correctly.

set -euo pipefail

ENV_FILE="${1:-.env}"
IMAGE_TAG="${2:-drgodly-mvp:latest}"

if [ ! -f "$ENV_FILE" ]; then
  echo "Error: env file '$ENV_FILE' not found."
  echo "Usage: ./docker-build.sh [.env] [image-tag]"
  exit 1
fi

# Extract NEXT_PUBLIC_* values from the env file
get_var() {
  grep -E "^${1}=" "$ENV_FILE" | cut -d '=' -f2- | tr -d '"' | tr -d "'"
}

docker build --no-cache \
  --build-arg NEXT_PUBLIC_APP_URL="$(get_var NEXT_PUBLIC_APP_URL)" \
  --build-arg NEXT_PUBLIC_BETTER_AUTH_URL="$(get_var NEXT_PUBLIC_BETTER_AUTH_URL)" \
  --build-arg NEXT_PUBLIC_BETTER_AUTH_CLIENT_ID="$(get_var NEXT_PUBLIC_BETTER_AUTH_CLIENT_ID)" \
  --build-arg NEXT_PUBLIC_LIVEKIT_URL="$(get_var NEXT_PUBLIC_LIVEKIT_URL)" \
  --build-arg NEXT_PUBLIC_VAPI_API_KEY="$(get_var NEXT_PUBLIC_VAPI_API_KEY)" \
  --build-arg NEXT_PUBLIC_VAPI_AGENT_ID="$(get_var NEXT_PUBLIC_VAPI_AGENT_ID)" \
  --build-arg NEXT_PUBLIC_PY_AGENT_URL="$(get_var NEXT_PUBLIC_PY_AGENT_URL)" \
  -t "$IMAGE_TAG" \
  .

echo ""
echo "Build complete: $IMAGE_TAG"
echo ""
echo "Run with:"
echo "  docker run --env-file $ENV_FILE -p 3000:3000 $IMAGE_TAG"
