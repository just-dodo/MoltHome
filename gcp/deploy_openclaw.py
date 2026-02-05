#!/usr/bin/env python3
"""
OpenClaw Gateway GCP Deployment Script

This script automates the deployment of OpenClaw Gateway on Google Cloud Platform.
Each step is a separate function that can be called independently.

Usage:
    python deploy_openclaw.py deploy --project <project_id>
    python deploy_openclaw.py add-telegram --token <bot_token>
    python deploy_openclaw.py approve-pairing --channel telegram --code <code>
    python deploy_openclaw.py resize --machine-type e2-small
    python deploy_openclaw.py tunnel
    python deploy_openclaw.py logs
    python deploy_openclaw.py status
"""

import argparse
import subprocess
import json
import secrets
import time
import sys
from pathlib import Path
from typing import Optional


# Default configuration
DEFAULT_CONFIG = {
    "project_id": "molthome-486509",
    "zone": "us-central1-a",
    "instance_name": "openclaw-gateway",
    "machine_type": "e2-small",
    "boot_disk_size": "20GB",
    "image_family": "debian-12",
    "image_project": "debian-cloud",
    "gateway_port": 18789,
}


def run_command(cmd: str, capture_output: bool = True, timeout: int = 300) -> subprocess.CompletedProcess:
    """Run a shell command and return the result."""
    print(f"[CMD] {cmd[:100]}{'...' if len(cmd) > 100 else ''}")
    result = subprocess.run(
        cmd,
        shell=True,
        capture_output=capture_output,
        text=True,
        timeout=timeout
    )
    if result.returncode != 0 and capture_output:
        print(f"[ERROR] {result.stderr}")
    return result


def run_ssh_command(instance: str, zone: str, command: str, timeout: int = 300) -> subprocess.CompletedProcess:
    """Run a command on the remote VM via SSH."""
    ssh_cmd = f"gcloud compute ssh {instance} --zone={zone} --command='{command}'"
    return run_command(ssh_cmd, timeout=timeout)


def generate_token() -> str:
    """Generate a secure random token."""
    return secrets.token_hex(32)


# =============================================================================
# STEP 1: Project Setup
# =============================================================================

def set_project(project_id: str) -> bool:
    """Set the active GCP project."""
    result = run_command(f"gcloud config set project {project_id}")
    return result.returncode == 0


def enable_compute_api(project_id: str) -> bool:
    """Enable the Compute Engine API for the project."""
    print(f"[INFO] Enabling Compute Engine API for {project_id}...")
    result = run_command(f"gcloud services enable compute.googleapis.com --project={project_id}")
    if result.returncode != 0:
        print("[ERROR] Failed to enable Compute Engine API. Is billing enabled?")
        print("       Visit: https://console.cloud.google.com/billing")
        return False
    return True


# =============================================================================
# STEP 2: VM Instance Management
# =============================================================================

def check_instance_exists(instance_name: str, zone: str) -> bool:
    """Check if a VM instance already exists."""
    result = run_command(f"gcloud compute instances describe {instance_name} --zone={zone} 2>/dev/null")
    return result.returncode == 0


def create_vm_instance(
    instance_name: str,
    zone: str,
    machine_type: str = "e2-small",
    boot_disk_size: str = "20GB",
    image_family: str = "debian-12",
    image_project: str = "debian-cloud"
) -> bool:
    """Create a new GCP Compute Engine VM instance."""
    if check_instance_exists(instance_name, zone):
        print(f"[INFO] Instance {instance_name} already exists. Skipping creation.")
        return True

    print(f"[INFO] Creating VM instance {instance_name}...")
    cmd = f"""gcloud compute instances create {instance_name} \
        --zone={zone} \
        --machine-type={machine_type} \
        --boot-disk-size={boot_disk_size} \
        --image-family={image_family} \
        --image-project={image_project} \
        --tags=openclaw-gateway"""

    result = run_command(cmd, timeout=180)
    if result.returncode == 0:
        print(f"[INFO] VM instance created. Waiting for SSH to be ready...")
        time.sleep(30)
        return True
    return False


def get_instance_ip(instance_name: str, zone: str) -> Optional[str]:
    """Get the external IP of a VM instance."""
    result = run_command(
        f"gcloud compute instances describe {instance_name} --zone={zone} "
        f"--format='get(networkInterfaces[0].accessConfigs[0].natIP)'"
    )
    if result.returncode == 0:
        return result.stdout.strip()
    return None


def resize_vm(instance_name: str, zone: str, machine_type: str) -> bool:
    """Resize a VM instance to a different machine type."""
    print(f"[INFO] Stopping instance {instance_name}...")
    result = run_command(f"gcloud compute instances stop {instance_name} --zone={zone}", timeout=300)
    if result.returncode != 0:
        return False

    print(f"[INFO] Resizing to {machine_type}...")
    result = run_command(
        f"gcloud compute instances set-machine-type {instance_name} "
        f"--zone={zone} --machine-type={machine_type}"
    )
    if result.returncode != 0:
        return False

    print(f"[INFO] Starting instance...")
    result = run_command(f"gcloud compute instances start {instance_name} --zone={zone}", timeout=180)
    if result.returncode != 0:
        return False

    print(f"[INFO] Waiting for VM to be ready...")
    time.sleep(30)
    return True


def delete_vm(instance_name: str, zone: str) -> bool:
    """Delete a VM instance."""
    print(f"[WARNING] This will delete instance {instance_name} and all its data!")
    confirm = input("Type 'yes' to confirm: ")
    if confirm.lower() != 'yes':
        print("[INFO] Aborted.")
        return False

    result = run_command(f"gcloud compute instances delete {instance_name} --zone={zone} --quiet")
    return result.returncode == 0


# =============================================================================
# STEP 3: Docker Installation
# =============================================================================

def install_docker(instance_name: str, zone: str) -> bool:
    """Install Docker on the VM instance."""
    print(f"[INFO] Installing Docker on {instance_name}...")

    install_script = """
set -e
if command -v docker &>/dev/null; then
    echo "Docker already installed"
    docker --version
    exit 0
fi
sudo apt-get update
sudo apt-get install -y git curl ca-certificates
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
echo "Docker installed successfully"
"""
    result = run_ssh_command(instance_name, zone, install_script, timeout=600)
    return result.returncode == 0


# =============================================================================
# STEP 4: OpenClaw Setup
# =============================================================================

def clone_openclaw_repo(instance_name: str, zone: str) -> bool:
    """Clone the OpenClaw repository on the VM."""
    print(f"[INFO] Cloning OpenClaw repository...")

    clone_script = """
set -e
if [ -d ~/openclaw ]; then
    echo "OpenClaw repo already exists. Pulling latest..."
    cd ~/openclaw && git pull
else
    git clone https://github.com/openclaw/openclaw.git ~/openclaw
fi
mkdir -p ~/.openclaw
mkdir -p ~/.openclaw/workspace
echo "Done"
"""
    result = run_ssh_command(instance_name, zone, clone_script, timeout=120)
    return result.returncode == 0


def create_gateway_config(
    instance_name: str,
    zone: str,
    gateway_token: str,
    anthropic_token: Optional[str] = None
) -> bool:
    """Create the OpenClaw gateway configuration files."""
    print(f"[INFO] Creating gateway configuration...")

    # Create openclaw.json config
    config = {
        "gateway": {
            "auth": {
                "token": gateway_token
            }
        }
    }
    config_json = json.dumps(config, indent=2)

    config_script = f"""
cat > ~/.openclaw/openclaw.json << 'EOF'
{config_json}
EOF
echo "Config created:"
cat ~/.openclaw/openclaw.json
"""
    result = run_ssh_command(instance_name, zone, config_script)
    if result.returncode != 0:
        return False

    # Create docker-compose.override.yml with environment variables
    env_vars = []
    if anthropic_token:
        if anthropic_token.startswith("sk-ant-oat"):
            env_vars.append(f"- ANTHROPIC_OAUTH_TOKEN={anthropic_token}")
        else:
            env_vars.append(f"- ANTHROPIC_API_KEY={anthropic_token}")

    env_section = "\n      ".join(env_vars) if env_vars else ""

    override_content = f"""services:
  openclaw-gateway:
    environment:
      {env_section}
    command:
      [
        "node",
        "dist/index.js",
        "gateway",
        "--allow-unconfigured",
        "--bind",
        "lan",
        "--port",
        "18789",
      ]
"""

    override_script = f"""
cd ~/openclaw
cat > docker-compose.override.yml << 'EOF'
{override_content}
EOF
echo "Override created"
"""
    result = run_ssh_command(instance_name, zone, override_script)
    return result.returncode == 0


# =============================================================================
# STEP 5: Build and Run
# =============================================================================

def build_openclaw(instance_name: str, zone: str) -> bool:
    """Build the OpenClaw Docker image."""
    print(f"[INFO] Building OpenClaw Docker image (this may take several minutes)...")

    build_script = """
cd ~/openclaw
export OPENCLAW_CONFIG_DIR=$HOME/.openclaw
export OPENCLAW_WORKSPACE_DIR=$HOME/.openclaw/workspace
sudo -E ./docker-setup.sh build 2>&1 | tail -30
"""
    result = run_ssh_command(instance_name, zone, build_script, timeout=900)
    return result.returncode == 0


def start_gateway(instance_name: str, zone: str) -> bool:
    """Start the OpenClaw gateway container."""
    print(f"[INFO] Starting OpenClaw gateway...")

    start_script = """
cd ~/openclaw
export OPENCLAW_CONFIG_DIR=$HOME/.openclaw
export OPENCLAW_WORKSPACE_DIR=$HOME/.openclaw/workspace
sudo docker compose down 2>/dev/null || true
sudo docker compose up -d openclaw-gateway
sleep 10
sudo docker compose ps
"""
    result = run_ssh_command(instance_name, zone, start_script, timeout=120)
    return result.returncode == 0


def stop_gateway(instance_name: str, zone: str) -> bool:
    """Stop the OpenClaw gateway container."""
    print(f"[INFO] Stopping OpenClaw gateway...")
    result = run_ssh_command(instance_name, zone, "cd ~/openclaw && sudo docker compose down")
    return result.returncode == 0


def restart_gateway(instance_name: str, zone: str) -> bool:
    """Restart the OpenClaw gateway container."""
    print(f"[INFO] Restarting OpenClaw gateway...")
    result = run_ssh_command(
        instance_name, zone,
        "cd ~/openclaw && sudo docker compose down && sudo docker compose up -d openclaw-gateway && sleep 10"
    )
    return result.returncode == 0


# =============================================================================
# STEP 6: Channel Configuration
# =============================================================================

def add_telegram_channel(instance_name: str, zone: str, bot_token: str) -> bool:
    """Add a Telegram bot channel to the gateway."""
    print(f"[INFO] Adding Telegram channel...")

    cmd = f"""
cd ~/openclaw
sudo docker compose exec openclaw-gateway node dist/index.js config set channels.telegram.botToken "{bot_token}"
"""
    result = run_ssh_command(instance_name, zone, cmd)
    if result.returncode != 0:
        return False

    # Restart to apply
    return restart_gateway(instance_name, zone)


def add_discord_channel(instance_name: str, zone: str, bot_token: str) -> bool:
    """Add a Discord bot channel to the gateway."""
    print(f"[INFO] Adding Discord channel...")

    cmd = f"""
cd ~/openclaw
sudo docker compose exec openclaw-gateway node dist/index.js config set channels.discord.botToken "{bot_token}"
"""
    result = run_ssh_command(instance_name, zone, cmd)
    if result.returncode != 0:
        return False

    return restart_gateway(instance_name, zone)


def set_anthropic_key(instance_name: str, zone: str, api_key: str) -> bool:
    """Set the Anthropic API key or OAuth token."""
    print(f"[INFO] Setting Anthropic API key...")

    # Determine if it's an OAuth token or regular API key
    if api_key.startswith("sk-ant-oat"):
        env_var = "ANTHROPIC_OAUTH_TOKEN"
    else:
        env_var = "ANTHROPIC_API_KEY"

    override_script = f"""
cd ~/openclaw
cat > docker-compose.override.yml << 'EOF'
services:
  openclaw-gateway:
    environment:
      - {env_var}={api_key}
    command:
      [
        "node",
        "dist/index.js",
        "gateway",
        "--allow-unconfigured",
        "--bind",
        "lan",
        "--port",
        "18789",
      ]
EOF
"""
    result = run_ssh_command(instance_name, zone, override_script)
    if result.returncode != 0:
        return False

    return restart_gateway(instance_name, zone)


# =============================================================================
# STEP 7: Device Pairing
# =============================================================================

def approve_pairing_code(instance_name: str, zone: str, channel: str, code: str) -> bool:
    """Approve a pairing code for a channel."""
    print(f"[INFO] Approving pairing code {code} for {channel}...")

    cmd = f"""
cd ~/openclaw
sudo docker compose exec openclaw-gateway node dist/index.js pairing approve {channel} {code}
"""
    result = run_ssh_command(instance_name, zone, cmd)
    return result.returncode == 0


def list_pending_pairings(instance_name: str, zone: str) -> bool:
    """List pending pairing requests."""
    cmd = """
cd ~/openclaw
cat ~/.openclaw/devices/pending.json 2>/dev/null || echo "{}"
"""
    result = run_ssh_command(instance_name, zone, cmd)
    if result.returncode == 0:
        print(result.stdout)
    return result.returncode == 0


# =============================================================================
# STEP 8: Monitoring and Utilities
# =============================================================================

def get_gateway_status(instance_name: str, zone: str) -> bool:
    """Get the status of the gateway and VM."""
    print(f"\n{'='*60}")
    print("OPENCLAW GATEWAY STATUS")
    print(f"{'='*60}\n")

    # VM status
    ip = get_instance_ip(instance_name, zone)
    print(f"Instance: {instance_name}")
    print(f"Zone: {zone}")
    print(f"External IP: {ip}")

    # Container status
    print(f"\n--- Container Status ---")
    run_ssh_command(instance_name, zone, "cd ~/openclaw && sudo docker compose ps")

    # Memory usage
    print(f"\n--- Resource Usage ---")
    run_ssh_command(
        instance_name, zone,
        "sudo docker stats --no-stream --format 'table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}' 2>/dev/null || echo 'No containers running'"
    )

    # Config
    print(f"\n--- Configuration ---")
    run_ssh_command(
        instance_name, zone,
        "cd ~/openclaw && sudo docker compose exec -T openclaw-gateway node dist/index.js config get channels 2>/dev/null | grep -v 'variable is not set' || echo 'No channels configured'"
    )

    return True


def get_gateway_logs(instance_name: str, zone: str, lines: int = 50) -> bool:
    """Get recent gateway logs."""
    cmd = f"""
cd ~/openclaw
sudo docker compose logs --tail={lines} openclaw-gateway 2>&1 | grep -v "variable is not set"
"""
    result = run_ssh_command(instance_name, zone, cmd)
    if result.returncode == 0:
        print(result.stdout)
    return result.returncode == 0


def open_tunnel(instance_name: str, zone: str, local_port: int = 18789) -> None:
    """Open an SSH tunnel to the gateway (blocking)."""
    print(f"Opening SSH tunnel to {instance_name}...")
    print(f"Access at: http://127.0.0.1:{local_port}/")
    print("Press Ctrl+C to close tunnel\n")

    cmd = f"gcloud compute ssh {instance_name} --zone={zone} -- -N -L {local_port}:127.0.0.1:18789"
    subprocess.run(cmd, shell=True)


def update_openclaw(instance_name: str, zone: str) -> bool:
    """Update OpenClaw to the latest version."""
    print(f"[INFO] Updating OpenClaw...")

    update_script = """
cd ~/openclaw
git pull
export OPENCLAW_CONFIG_DIR=$HOME/.openclaw
export OPENCLAW_WORKSPACE_DIR=$HOME/.openclaw/workspace
sudo -E ./docker-setup.sh build 2>&1 | tail -20
sudo docker compose down
sudo docker compose up -d openclaw-gateway
sleep 10
sudo docker compose ps
"""
    result = run_ssh_command(instance_name, zone, update_script, timeout=900)
    return result.returncode == 0


# =============================================================================
# FULL DEPLOYMENT
# =============================================================================

def full_deploy(
    project_id: str,
    zone: str = "us-central1-a",
    instance_name: str = "openclaw-gateway",
    machine_type: str = "e2-medium",  # Use medium for build, can resize after
    gateway_token: Optional[str] = None,
    anthropic_token: Optional[str] = None,
    telegram_token: Optional[str] = None
) -> dict:
    """
    Perform a full deployment of OpenClaw Gateway.

    Returns a dict with deployment info including tokens.
    """
    result = {
        "success": False,
        "instance_name": instance_name,
        "zone": zone,
        "gateway_token": gateway_token or generate_token(),
        "external_ip": None
    }

    print(f"\n{'='*60}")
    print("OPENCLAW GATEWAY DEPLOYMENT")
    print(f"{'='*60}")
    print(f"Project: {project_id}")
    print(f"Zone: {zone}")
    print(f"Instance: {instance_name}")
    print(f"Machine Type: {machine_type}")
    print(f"{'='*60}\n")

    # Step 1: Set project and enable API
    print("\n[STEP 1/7] Setting up GCP project...")
    if not set_project(project_id):
        return result
    if not enable_compute_api(project_id):
        return result

    # Step 2: Create VM
    print("\n[STEP 2/7] Creating VM instance...")
    if not create_vm_instance(instance_name, zone, machine_type):
        return result

    result["external_ip"] = get_instance_ip(instance_name, zone)

    # Step 3: Install Docker
    print("\n[STEP 3/7] Installing Docker...")
    if not install_docker(instance_name, zone):
        return result

    # Step 4: Clone repo
    print("\n[STEP 4/7] Cloning OpenClaw repository...")
    if not clone_openclaw_repo(instance_name, zone):
        return result

    # Step 5: Create config
    print("\n[STEP 5/7] Creating configuration...")
    if not create_gateway_config(instance_name, zone, result["gateway_token"], anthropic_token):
        return result

    # Step 6: Build and start
    print("\n[STEP 6/7] Building and starting gateway...")
    if not build_openclaw(instance_name, zone):
        return result
    if not start_gateway(instance_name, zone):
        return result

    # Step 7: Add channels (optional)
    print("\n[STEP 7/7] Configuring channels...")
    if telegram_token:
        add_telegram_channel(instance_name, zone, telegram_token)

    result["success"] = True

    print(f"\n{'='*60}")
    print("DEPLOYMENT COMPLETE!")
    print(f"{'='*60}")
    print(f"External IP: {result['external_ip']}")
    print(f"Gateway Token: {result['gateway_token']}")
    print(f"\nTo access, run:")
    print(f"  python {__file__} tunnel")
    print(f"\nThen open: http://127.0.0.1:18789/")
    print(f"{'='*60}\n")

    return result


# =============================================================================
# CLI Interface
# =============================================================================

def main():
    parser = argparse.ArgumentParser(
        description="OpenClaw Gateway GCP Deployment Tool",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Full deployment
  python deploy_openclaw.py deploy --project my-project --anthropic-token sk-ant-xxx

  # Add Telegram channel
  python deploy_openclaw.py add-telegram --token 123456:ABC-xyz

  # Approve pairing
  python deploy_openclaw.py approve-pairing --channel telegram --code ABC123

  # Resize VM
  python deploy_openclaw.py resize --machine-type e2-small

  # Open tunnel
  python deploy_openclaw.py tunnel

  # View logs
  python deploy_openclaw.py logs

  # Check status
  python deploy_openclaw.py status
"""
    )

    # Global options
    parser.add_argument("--project", default=DEFAULT_CONFIG["project_id"], help="GCP project ID")
    parser.add_argument("--zone", default=DEFAULT_CONFIG["zone"], help="GCP zone")
    parser.add_argument("--instance", default=DEFAULT_CONFIG["instance_name"], help="VM instance name")

    subparsers = parser.add_subparsers(dest="command", help="Command to run")

    # Deploy command
    deploy_parser = subparsers.add_parser("deploy", help="Full deployment")
    deploy_parser.add_argument("--machine-type", default="e2-medium", help="VM machine type")
    deploy_parser.add_argument("--gateway-token", help="Gateway auth token (generated if not provided)")
    deploy_parser.add_argument("--anthropic-token", help="Anthropic API key or OAuth token")
    deploy_parser.add_argument("--telegram-token", help="Telegram bot token")

    # Add Telegram
    telegram_parser = subparsers.add_parser("add-telegram", help="Add Telegram channel")
    telegram_parser.add_argument("--token", required=True, help="Telegram bot token")

    # Add Discord
    discord_parser = subparsers.add_parser("add-discord", help="Add Discord channel")
    discord_parser.add_argument("--token", required=True, help="Discord bot token")

    # Set Anthropic key
    anthropic_parser = subparsers.add_parser("set-anthropic", help="Set Anthropic API key")
    anthropic_parser.add_argument("--token", required=True, help="Anthropic API key or OAuth token")

    # Approve pairing
    pairing_parser = subparsers.add_parser("approve-pairing", help="Approve pairing code")
    pairing_parser.add_argument("--channel", required=True, help="Channel (telegram, discord, etc)")
    pairing_parser.add_argument("--code", required=True, help="Pairing code")

    # Resize
    resize_parser = subparsers.add_parser("resize", help="Resize VM")
    resize_parser.add_argument("--machine-type", required=True, help="New machine type (e2-small, e2-medium)")

    # Other commands
    subparsers.add_parser("tunnel", help="Open SSH tunnel to gateway")
    subparsers.add_parser("logs", help="View gateway logs")
    subparsers.add_parser("status", help="Get gateway status")
    subparsers.add_parser("start", help="Start gateway")
    subparsers.add_parser("stop", help="Stop gateway")
    subparsers.add_parser("restart", help="Restart gateway")
    subparsers.add_parser("update", help="Update OpenClaw to latest version")
    subparsers.add_parser("delete", help="Delete VM instance")
    subparsers.add_parser("pending", help="List pending pairing requests")

    args = parser.parse_args()

    if not args.command:
        parser.print_help()
        return

    # Execute command
    if args.command == "deploy":
        result = full_deploy(
            project_id=args.project,
            zone=args.zone,
            instance_name=args.instance,
            machine_type=args.machine_type,
            gateway_token=args.gateway_token,
            anthropic_token=args.anthropic_token,
            telegram_token=args.telegram_token
        )
        sys.exit(0 if result["success"] else 1)

    elif args.command == "add-telegram":
        success = add_telegram_channel(args.instance, args.zone, args.token)
        sys.exit(0 if success else 1)

    elif args.command == "add-discord":
        success = add_discord_channel(args.instance, args.zone, args.token)
        sys.exit(0 if success else 1)

    elif args.command == "set-anthropic":
        success = set_anthropic_key(args.instance, args.zone, args.token)
        sys.exit(0 if success else 1)

    elif args.command == "approve-pairing":
        success = approve_pairing_code(args.instance, args.zone, args.channel, args.code)
        sys.exit(0 if success else 1)

    elif args.command == "resize":
        success = resize_vm(args.instance, args.zone, args.machine_type)
        sys.exit(0 if success else 1)

    elif args.command == "tunnel":
        open_tunnel(args.instance, args.zone)

    elif args.command == "logs":
        get_gateway_logs(args.instance, args.zone)

    elif args.command == "status":
        get_gateway_status(args.instance, args.zone)

    elif args.command == "start":
        success = start_gateway(args.instance, args.zone)
        sys.exit(0 if success else 1)

    elif args.command == "stop":
        success = stop_gateway(args.instance, args.zone)
        sys.exit(0 if success else 1)

    elif args.command == "restart":
        success = restart_gateway(args.instance, args.zone)
        sys.exit(0 if success else 1)

    elif args.command == "update":
        success = update_openclaw(args.instance, args.zone)
        sys.exit(0 if success else 1)

    elif args.command == "delete":
        success = delete_vm(args.instance, args.zone)
        sys.exit(0 if success else 1)

    elif args.command == "pending":
        list_pending_pairings(args.instance, args.zone)


if __name__ == "__main__":
    main()
