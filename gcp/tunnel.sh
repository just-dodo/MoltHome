#!/bin/bash

# Configuration
PROJECT_ID="${GCP_PROJECT:-molthome-486509}"
ZONE="${GCP_ZONE:-us-central1-a}"
INSTANCE_NAME="${INSTANCE_NAME:-openclaw-gateway}"
LOCAL_PORT="${LOCAL_PORT:-18789}"

gcloud config set project "$PROJECT_ID" 2>/dev/null

echo "Opening SSH tunnel to OpenClaw Gateway..."
echo ""
echo "Access at: http://127.0.0.1:$LOCAL_PORT/"
echo "Gateway token: 31d4d845cfa8a992c0e95b7d1f50fedfecc63e3cfbb458489e39b76a105b2bb3"
echo ""
echo "Press Ctrl+C to close tunnel"
echo ""

gcloud compute ssh "$INSTANCE_NAME" --zone="$ZONE" -- -N -L "$LOCAL_PORT:127.0.0.1:18789"
