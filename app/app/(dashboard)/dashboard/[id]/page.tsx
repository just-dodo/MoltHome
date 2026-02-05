import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { InstanceDetail } from '@/components/instances/instance-detail'

export default async function InstancePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) notFound()

  const { data: instance } = await supabase
    .schema('molthome')
    .from('instances')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!instance) notFound()

  return <InstanceDetail instance={instance} />
}
