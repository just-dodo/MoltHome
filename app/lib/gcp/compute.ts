import { InstancesClient, ZoneOperationsClient } from '@google-cloud/compute'
import fs from 'fs'
import path from 'path'

const projectId = process.env.GCP_PROJECT_ID || 'molthome-486509'

// Load credentials from file or environment variable
function getCredentials() {
  // First try credentials file
  const credentialsPath = process.env.GCP_CREDENTIALS_PATH ||
    path.join(process.cwd(), '..', 'gcp', 'molthome-486509-3a83febb6828.json')

  if (fs.existsSync(credentialsPath)) {
    return JSON.parse(fs.readFileSync(credentialsPath, 'utf-8'))
  }

  // Fall back to environment variable
  if (process.env.GCP_SERVICE_ACCOUNT_KEY) {
    return JSON.parse(process.env.GCP_SERVICE_ACCOUNT_KEY)
  }

  return undefined
}

const credentials = getCredentials()
const instancesClient = new InstancesClient({ projectId, credentials })
const operationsClient = new ZoneOperationsClient({ projectId, credentials })

export interface CreateVMOptions {
  name: string
  zone: string
  machineType?: string
  diskSizeGb?: number
}

export async function createVM(options: CreateVMOptions) {
  const { name, zone, machineType = 'e2-small', diskSizeGb = 20 } = options

  const [operation] = await instancesClient.insert({
    project: projectId,
    zone,
    instanceResource: {
      name,
      machineType: `zones/${zone}/machineTypes/${machineType}`,
      disks: [{
        boot: true,
        autoDelete: true,
        initializeParams: {
          sourceImage: 'projects/debian-cloud/global/images/family/debian-12',
          diskSizeGb: diskSizeGb.toString(),
        },
      }],
      networkInterfaces: [{
        network: 'global/networks/default',
        accessConfigs: [{ type: 'ONE_TO_ONE_NAT', name: 'External NAT' }],
      }],
      tags: { items: ['http-server', 'https-server', 'openclaw'] },
      metadata: {
        items: [
          { key: 'enable-oslogin', value: 'true' },
        ],
      },
    },
  })

  // Wait for operation to complete
  await waitForOperation(zone, operation.name!)

  // Get the created instance
  const [instance] = await instancesClient.get({ project: projectId, zone, instance: name })
  const externalIp = instance.networkInterfaces?.[0]?.accessConfigs?.[0]?.natIP

  return { name, zone, externalIp, status: instance.status }
}

export async function deleteVM(name: string, zone: string) {
  const [operation] = await instancesClient.delete({
    project: projectId,
    zone,
    instance: name,
  })
  await waitForOperation(zone, operation.name!)
}

export async function startVM(name: string, zone: string) {
  const [operation] = await instancesClient.start({
    project: projectId,
    zone,
    instance: name,
  })
  await waitForOperation(zone, operation.name!)
}

export async function stopVM(name: string, zone: string) {
  const [operation] = await instancesClient.stop({
    project: projectId,
    zone,
    instance: name,
  })
  await waitForOperation(zone, operation.name!)
}

export async function getVM(name: string, zone: string) {
  const [instance] = await instancesClient.get({
    project: projectId,
    zone,
    instance: name,
  })
  return {
    name: instance.name,
    status: instance.status,
    externalIp: instance.networkInterfaces?.[0]?.accessConfigs?.[0]?.natIP,
  }
}

async function waitForOperation(zone: string, operationName: string) {
  let operation = { status: 'RUNNING' }
  while (operation.status !== 'DONE') {
    await new Promise(resolve => setTimeout(resolve, 2000))
    const [op] = await operationsClient.get({
      project: projectId,
      zone,
      operation: operationName,
    })
    operation = op as { status: string }
  }
}
