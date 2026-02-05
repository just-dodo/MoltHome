import { SecretManagerServiceClient } from '@google-cloud/secret-manager'

const projectId = process.env.GCP_PROJECT_ID!
const credentials = process.env.GCP_SERVICE_ACCOUNT_KEY
  ? JSON.parse(process.env.GCP_SERVICE_ACCOUNT_KEY)
  : undefined

const client = new SecretManagerServiceClient({ projectId, credentials })

export async function createSecret(secretId: string, value: string) {
  const parent = `projects/${projectId}`

  // Create the secret
  const [secret] = await client.createSecret({
    parent,
    secretId,
    secret: { replication: { automatic: {} } },
  })

  // Add the secret version
  await client.addSecretVersion({
    parent: secret.name,
    payload: { data: Buffer.from(value, 'utf8') },
  })

  return secret.name
}

export async function getSecret(secretId: string): Promise<string> {
  const name = `projects/${projectId}/secrets/${secretId}/versions/latest`
  const [version] = await client.accessSecretVersion({ name })
  return version.payload?.data?.toString() || ''
}

export async function deleteSecret(secretId: string) {
  const name = `projects/${projectId}/secrets/${secretId}`
  await client.deleteSecret({ name })
}
