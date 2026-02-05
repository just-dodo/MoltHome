#!/bin/bash

# Configuration
PROJECT_ID="${GCP_PROJECT:-molthome-486509}"
ZONE="${GCP_ZONE:-us-central1-a}"
INSTANCE_NAME="${INSTANCE_NAME:-openclaw-gateway}"

gcloud config set project "$PROJECT_ID"
gcloud compute ssh "$INSTANCE_NAME" --zone="$ZONE" --command='
cd ~/openclaw
docker compose logs -f openclaw-gateway
'
