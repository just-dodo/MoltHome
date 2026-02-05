import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { deployOpenClaw } from '@/lib/openclaw/deploy'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: instance } = await supabase
    .schema('molthome')
    .from('instances')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!instance) {
    return NextResponse.json({ error: 'Instance not found' }, { status: 404 })
  }

  const body = await request.json()
  const { aiProvider, aiApiKey } = body

  const logs: Array<{ step: string; message: string; timestamp: string }> = []

  try {
    const result = await deployOpenClaw({
      instanceId: id,
      gcpInstanceName: instance.gcp_instance_name,
      zone: instance.zone,
      gatewayToken: instance.gateway_token,
      aiProvider,
      aiApiKey,
      onProgress: (step, message) => {
        logs.push({ step, message, timestamp: new Date().toISOString() })
        // Update deployment log in real-time
        supabase
          .schema('molthome')
          .from('instances')
          .update({ deployment_log: logs })
          .eq('id', id)
      },
    })

    // Mark as running
    await supabase
      .schema('molthome')
      .from('instances')
      .update({
        status: 'running',
        external_ip: result.externalIp,
        deployment_log: logs,
      })
      .eq('id', id)

    return NextResponse.json({ success: true, externalIp: result.externalIp })
  } catch (error) {
    logs.push({ step: 'error', message: String(error), timestamp: new Date().toISOString() })

    await supabase
      .schema('molthome')
      .from('instances')
      .update({ status: 'error', deployment_log: logs })
      .eq('id', id)

    return NextResponse.json({ error: 'Deployment failed' }, { status: 500 })
  }
}
