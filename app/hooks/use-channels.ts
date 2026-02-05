'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Database } from '@/lib/supabase/types'

type Channel = Database['molthome']['Tables']['channels']['Row']

async function fetchChannels(instanceId: string): Promise<Channel[]> {
  const res = await fetch(`/api/instances/${instanceId}/channels`)
  if (!res.ok) throw new Error('Failed to fetch channels')
  const { data } = await res.json()
  return data
}

async function addChannel(instanceId: string, input: { type: string; config: object }) {
  const res = await fetch(`/api/instances/${instanceId}/channels`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error('Failed to add channel')
  const { data } = await res.json()
  return data
}

async function removeChannel(instanceId: string, channelId: string) {
  const res = await fetch(`/api/instances/${instanceId}/channels?channelId=${channelId}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error('Failed to remove channel')
}

export function useChannels(instanceId: string) {
  return useQuery({
    queryKey: ['channels', instanceId],
    queryFn: () => fetchChannels(instanceId),
    enabled: !!instanceId,
  })
}

export function useAddChannel(instanceId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: { type: string; config: object }) => addChannel(instanceId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['channels', instanceId] })
    },
  })
}

export function useRemoveChannel(instanceId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (channelId: string) => removeChannel(instanceId, channelId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['channels', instanceId] })
    },
  })
}
