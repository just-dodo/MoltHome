import { NodeSSH } from 'node-ssh'

const GCP_SSH_USER = process.env.GCP_SSH_USER || 'openclaw'
const GCP_SSH_PRIVATE_KEY = process.env.GCP_SSH_PRIVATE_KEY

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
      privateKey: GCP_SSH_PRIVATE_KEY,
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
      privateKey: GCP_SSH_PRIVATE_KEY,
    })

    await ssh.putFile(localPath, remotePath)
  } finally {
    ssh.dispose()
  }
}
