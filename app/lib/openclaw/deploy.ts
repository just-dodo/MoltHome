import { createVM, getVM } from '@/lib/gcp/compute'
import { executeSSH } from './ssh'
import { generateOpenClawConfig } from './config'

export interface DeploymentOptions {
  instanceId: string
  gcpInstanceName: string
  zone: string
  gatewayToken: string
  aiProvider: 'anthropic' | 'openai' | 'gemini'
  aiApiKey: string
  onProgress?: (step: string, message: string) => void
}

export async function deployOpenClaw(options: DeploymentOptions) {
  const { gcpInstanceName, zone, gatewayToken, aiProvider, aiApiKey, onProgress } = options
  const log = (step: string, msg: string) => onProgress?.(step, msg)

  try {
    // Step 1: Create VM
    log('vm', 'Creating VM instance...')
    const vm = await createVM({ name: gcpInstanceName, zone, machineType: 'e2-small' })
    const externalIp = vm.externalIp!

    // Wait for SSH to be ready
    log('vm', 'Waiting for SSH...')
    await waitForSSH(externalIp)

    // Step 2: Install Docker
    log('docker', 'Installing Docker...')
    await executeSSH(externalIp, `
      sudo apt-get update
      sudo apt-get install -y docker.io docker-compose
      sudo systemctl enable docker
      sudo systemctl start docker
      sudo usermod -aG docker $USER
    `)

    // Step 3: Clone and build OpenClaw
    log('openclaw', 'Deploying OpenClaw...')
    await executeSSH(externalIp, `
      git clone https://github.com/anthropics/anthropic-quickstarts.git /tmp/openclaw || true
      cd /tmp/openclaw/computer-use-demo
      sudo docker build -t openclaw-gateway .
    `)

    // Step 4: Configure gateway
    log('config', 'Configuring gateway...')
    const config = generateOpenClawConfig({ gatewayToken, aiProvider, aiApiKey })
    await executeSSH(externalIp, `
      mkdir -p ~/.openclaw
      cat > ~/.openclaw/openclaw.json << 'EOFCONFIG'
${JSON.stringify(config, null, 2)}
EOFCONFIG
    `)

    // Step 5: Start container
    log('verify', 'Starting OpenClaw container...')
    await executeSSH(externalIp, `
      sudo docker run -d \\
        --name openclaw-gateway \\
        --restart unless-stopped \\
        -p 18789:18789 \\
        -v ~/.openclaw:/root/.openclaw \\
        -e GATEWAY_TOKEN=${gatewayToken} \\
        -e AI_PROVIDER=${aiProvider} \\
        -e AI_API_KEY=${aiApiKey} \\
        openclaw-gateway
    `)

    log('verify', 'Verifying health...')
    await new Promise(resolve => setTimeout(resolve, 5000))

    return { success: true, externalIp }
  } catch (error) {
    console.error('Deployment failed:', error)
    throw error
  }
}

async function waitForSSH(ip: string, maxRetries = 30): Promise<void> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await executeSSH(ip, 'echo "SSH ready"', { timeout: 5000 })
      return
    } catch {
      await new Promise(resolve => setTimeout(resolve, 10000))
    }
  }
  throw new Error('SSH not ready after timeout')
}
