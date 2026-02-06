import { NodeSSH } from 'node-ssh'
import fs from 'fs'
import path from 'path'

const GCP_SSH_USER = process.env.GCP_SSH_USER || 'openclaw'

function getPrivateKey(): string | undefined {
  // Try inline key from env (replace literal \n with newlines)
  if (process.env.GCP_SSH_PRIVATE_KEY) {
    return process.env.GCP_SSH_PRIVATE_KEY.replace(/\\n/g, '\n')
  }
  // Try key file
  const keyPath = process.env.GCP_SSH_KEY_PATH ||
    path.join(process.cwd(), '..', 'gcp', 'molthome-ssh')
  if (fs.existsSync(keyPath)) {
    return fs.readFileSync(keyPath, 'utf-8')
  }
  return undefined
}

export interface SSHOptions {
  timeout?: number
}

export async function executeSSH(
  host: string,
  command: string,
  options: SSHOptions = {}
): Promise<string> {
  const ssh = new NodeSSH()

  try {
    await ssh.connect({
      host,
      username: GCP_SSH_USER,
      privateKey: getPrivateKey(),
      readyTimeout: options.timeout || 30000,
    })

    const result = await ssh.execCommand(command, {
      execOptions: { pty: true },
    })

    if (result.code !== 0 && result.code !== null) {
      throw new Error(`Command failed: ${result.stderr}`)
    }

    return result.stdout
  } finally {
    ssh.dispose()
  }
}

export async function uploadFile(
  host: string,
  localPath: string,
  remotePath: string
): Promise<void> {
  const ssh = new NodeSSH()

  try {
    await ssh.connect({
      host,
      username: GCP_SSH_USER,
      privateKey: getPrivateKey(),
    })

    await ssh.putFile(localPath, remotePath)
  } finally {
    ssh.dispose()
  }
}
