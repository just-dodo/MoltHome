#!/bin/bash
set -e

# Configuration
PROJECT_ID="${GCP_PROJECT:-molthome-486509}"
ZONE="${GCP_ZONE:-us-central1-a}"
INSTANCE_NAME="${INSTANCE_NAME:-openclaw-gateway}"

echo "=== Updating OpenClaw Gateway ==="

gcloud config set project "$PROJECT_ID"

gcloud compute ssh "$INSTANCE_NAME" --zone="$ZONE" --command='
cd ~/openclaw
echo "Pulling latest changes..."
git pull

echo "Rebuilding container..."
docker compose build

echo "Restarting with new image..."
docker compose up -d

echo ""
echo "Container status:"
docker compose ps

echo ""
echo "Recent logs:"
docker compose logs --tail=20 openclaw-gateway
'

echo "Update complete!"
