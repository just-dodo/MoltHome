import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { encrypt } from '@/lib/utils/crypto'

// POST /api/secrets - Add API key
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { name, type, value } = await request.json()

  if (!name || !type || !value) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const encryptedValue = encrypt(value)

  const { data, error } = await supabase
    .schema('molthome')
    .from('api_keys')
    .insert({
      user_id: user.id,
      name,
      type,
      encrypted_value: encryptedValue,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data: { id: data.id, name: data.name, type: data.type } })
}

// DELETE /api/secrets - Delete API key
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'ID required' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await supabase
    .schema('molthome')
    .from('api_keys')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  return NextResponse.json({ success: true })
}
