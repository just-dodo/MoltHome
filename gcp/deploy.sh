#!/bin/bash
set -e

# Configuration
PROJECT_ID="${GCP_PROJECT:-molthome-486509}"
ZONE="${GCP_ZONE:-us-central1-a}"
INSTANCE_NAME="${INSTANCE_NAME:-openclaw-gateway}"
MACHINE_TYPE="${MACHINE_TYPE:-e2-small}"
BOOT_DISK_SIZE="${BOOT_DISK_SIZE:-20GB}"

echo "=== OpenClaw Gateway GCP Deployment ==="
echo "Project: $PROJECT_ID"
echo "Zone: $ZONE"
echo "Instance: $INSTANCE_NAME"
echo "Machine Type: $MACHINE_TYPE"
echo ""

# Set project
gcloud config set project "$PROJECT_ID"

# Enable Compute Engine API
echo "Enabling Compute Engine API..."
gcloud services enable compute.googleapis.com

# Check if instance exists
if gcloud compute instances describe "$INSTANCE_NAME" --zone="$ZONE" &>/dev/null; then
    echo "Instance $INSTANCE_NAME already exists. Skipping creation."
else
    echo "Creating VM instance..."
    gcloud compute instances create "$INSTANCE_NAME" \
        --zone="$ZONE" \
        --machine-type="$MACHINE_TYPE" \
        --boot-disk-size="$BOOT_DISK_SIZE" \
        --image-family=debian-12 \
        --image-project=debian-cloud \
        --tags=openclaw-gateway

    echo "Waiting for instance to be ready..."
    sleep 30
fi

# Get instance external IP
EXTERNAL_IP=$(gcloud compute instances describe "$INSTANCE_NAME" --zone="$ZONE" --format='get(networkInterfaces[0].accessConfigs[0].natIP)')
echo "Instance IP: $EXTERNAL_IP"

echo ""
echo "=== Configuring VM ==="

# Copy deployment files to VM
echo "Copying deployment files..."
gcloud compute scp --zone="$ZONE" \
    .env docker-compose.yml Dockerfile \
    "$INSTANCE_NAME:~/"

# Run setup script on VM
echo "Installing Docker and dependencies..."
gcloud compute ssh "$INSTANCE_NAME" --zone="$ZONE" --command='
set -e

# Install Docker if not present
if ! command -v docker &>/dev/null; then
    echo "Installing Docker..."
    sudo apt-get update
    sudo apt-get install -y git curl ca-certificates
    curl -fsSL https://get.docker.com | sudo sh
    sudo usermod -aG docker $USER
fi

# Create persistent directories
echo "Creating persistent directories..."
mkdir -p ~/.openclaw
mkdir -p ~/.openclaw/workspace

# Clone OpenClaw repository if not present
if [ ! -d ~/openclaw ]; then
    echo "Cloning OpenClaw repository..."
    git clone https://github.com/openclaw/openclaw.git ~/openclaw
fi

# Move config files
mv ~/*.yml ~/openclaw/ 2>/dev/null || true
mv ~/Dockerfile ~/openclaw/ 2>/dev/null || true
mv ~/.env ~/openclaw/ 2>/dev/null || true

echo "Setup complete on VM!"
'

echo ""
echo "=== Building and Starting Container ==="

# Build and start (needs new SSH session for docker group membership)
gcloud compute ssh "$INSTANCE_NAME" --zone="$ZONE" --command='
cd ~/openclaw

# Update environment paths for current user
sed -i "s|/home/dodopark|$HOME|g" .env

# Build and start
docker compose build
docker compose up -d openclaw-gateway

# Verify binaries are baked in
echo ""
echo "Verifying baked binaries..."
docker compose exec -T openclaw-gateway which gog || echo "gog not found"
docker compose exec -T openclaw-gateway which goplaces || echo "goplaces not found"
docker compose exec -T openclaw-gateway which wacli || echo "wacli not found"

# Show status
echo ""
echo "Container status:"
docker compose ps

echo ""
echo "Recent logs:"
docker compose logs --tail=20 openclaw-gateway
'

echo ""
echo "=== Deployment Complete ==="
echo ""
echo "To access the gateway, create an SSH tunnel:"
echo "  gcloud compute ssh $INSTANCE_NAME --zone=$ZONE -- -L 18789:127.0.0.1:18789"
echo ""
echo "Then open: http://127.0.0.1:18789/"
echo ""
echo "Gateway token is in your .env file (OPENCLAW_GATEWAY_TOKEN)"
