import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ChannelList } from '@/components/channels/channel-list'

export default async function ChannelsPage({ params }: { params: Promise<{ id: string }> }) {
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

  const { data: channels } = await supabase
    .schema('molthome')
    .from('channels')
    .select('*')
    .eq('instance_id', id)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{instance.name} - Channels</h1>
        <p className="text-muted-foreground">Manage connected channels</p>
      </div>
      <ChannelList instanceId={id} initialChannels={channels || []} />
    </div>
  )
}
