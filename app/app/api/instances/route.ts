import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createInstanceSchema } from '@/lib/utils/validation'
import { randomUUID } from 'crypto'
import { deployOpenClaw } from '@/lib/openclaw/deploy'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Ensure user exists in molthome.profiles
  const { data: existingUser } = await supabase
    .schema('molthome')
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .single()

  if (!existingUser) {
    await supabase
      .schema('molthome')
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email!,
        name: user.user_metadata?.full_name || null,
        avatar_url: user.user_metadata?.avatar_url || null,
      })
  }

  const { data, error } = await supabase
    .schema('molthome')
    .from('instances')
    .select('*')
    .eq('user_id', user.id)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Ensure user exists in molthome.profiles (may not exist if they signed up before migration)
  const { data: existingUser } = await supabase
    .schema('molthome')
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .single()

  if (!existingUser) {
    const { error: userError } = await supabase
      .schema('molthome')
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email!,
        name: user.user_metadata?.full_name || null,
        avatar_url: user.user_metadata?.avatar_url || null,
      })
    if (userError && !userError.message.includes('duplicate')) {
      return NextResponse.json({ error: 'Failed to create user profile: ' + userError.message }, { status: 500 })
    }
  }

  const body = await request.json()
  const parsed = createInstanceSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { name, zone, aiProvider, aiApiKey } = parsed.data
  const gcpInstanceName = `openclaw-${user.id.slice(0, 8)}-${Date.now()}`
  const gatewayToken = randomUUID()

  const { data, error } = await supabase
    .schema('molthome')
    .from('instances')
    .insert({
      user_id: user.id,
      name,
      zone,
      gcp_instance_name: gcpInstanceName,
      machine_type: 'e2-small',
      status: 'provisioning',
      gateway_token: gatewayToken,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Store the AI API key in the api_keys table
  await supabase
    .schema('molthome')
    .from('api_keys')
    .insert({
      user_id: user.id,
      name: `${name} - ${aiProvider}`,
      type: aiProvider,
      encrypted_value: aiApiKey, // TODO: encrypt with ENCRYPTION_KEY in production
    })

  // Trigger deployment asynchronously (don't await — runs in background)
  deployOpenClaw({
    instanceId: data.id,
    gcpInstanceName: data.gcp_instance_name,
    zone: data.zone,
    gatewayToken: data.gateway_token,
    aiProvider,
    aiApiKey,
    onProgress: async (step, message) => {
      // Update deployment log in real-time
      const { data: current } = await supabase
        .schema('molthome')
        .from('instances')
        .select('deployment_log')
        .eq('id', data.id)
        .single()

      const logs = Array.isArray(current?.deployment_log) ? current.deployment_log : []
      logs.push({ step, message, timestamp: new Date().toISOString() })

      await supabase
        .schema('molthome')
        .from('instances')
        .update({ deployment_log: logs })
        .eq('id', data.id)
    },
  }).then(async (result) => {
    // Mark as running on success
    await supabase
      .schema('molthome')
      .from('instances')
      .update({
        status: 'running',
        external_ip: result.externalIp,
      })
      .eq('id', data.id)
  }).catch(async (error) => {
    // Mark as error on failure
    const { data: current } = await supabase
      .schema('molthome')
      .from('instances')
      .select('deployment_log')
      .eq('id', data.id)
      .single()

    const logs = Array.isArray(current?.deployment_log) ? current.deployment_log : []
    logs.push({ step: 'error', message: String(error), timestamp: new Date().toISOString() })

    await supabase
      .schema('molthome')
      .from('instances')
      .update({ status: 'error', deployment_log: logs })
      .eq('id', data.id)
  })

  return NextResponse.json({ data })
}
