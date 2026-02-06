'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useChannels, useRemoveChannel } from '@/hooks/use-channels'
import { AddChannelModal } from './add-channel-modal'
import type { Database } from '@/lib/supabase/types'

type Channel = Database['molthome']['Tables']['channels']['Row']

const channelIcons: Record<string, string> = {
  telegram: '📱',
  discord: '💬',
}

export function ChannelList({ instanceId, initialChannels }: { instanceId: string; initialChannels: Channel[] }) {
  const [showAddModal, setShowAddModal] = useState(false)
  const { data: channels } = useChannels(instanceId)
  const { mutate: removeChannel, isPending } = useRemoveChannel(instanceId)

  const currentChannels = channels || initialChannels

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Connected Channels</h2>
        <Button onClick={() => setShowAddModal(true)}>
          + Add Channel
        </Button>
      </div>

      {currentChannels.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">No channels connected yet</p>
            <Button className="mt-4" onClick={() => setShowAddModal(true)}>
              Add Your First Channel
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {currentChannels.map((channel) => (
            <Card key={channel.id}>
              <CardHeader className="flex flex-row items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{channelIcons[channel.type] || '📡'}</span>
                  <div>
                    <CardTitle className="capitalize">{channel.type}</CardTitle>
                    <Badge variant={channel.status === 'active' ? 'default' : 'secondary'} className={channel.status === 'active' ? 'bg-green-600' : ''}>
                      {channel.status}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeChannel(channel.id)}
                  disabled={isPending}
                >
                  Remove
                </Button>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      <AddChannelModal
        instanceId={instanceId}
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </>
  )
}
