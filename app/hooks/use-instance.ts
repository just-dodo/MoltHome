'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Database } from '@/lib/supabase/types'

type Instance = Database['molthome']['Tables']['instances']['Row']

async function fetchInstance(id: string): Promise<Instance> {
  const res = await fetch(`/api/instances/${id}`)
  if (!res.ok) throw new Error('Failed to fetch instance')
  const { data } = await res.json()
  return data
}

async function performAction(id: string, action: 'start' | 'stop' | 'restart') {
  const res = await fetch(`/api/instances/${id}/${action}`, { method: 'POST' })
  if (!res.ok) throw new Error(`Failed to ${action} instance`)
  const { data } = await res.json()
  return data
}

async function deleteInstance(id: string) {
  const res = await fetch(`/api/instances/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete instance')
}

export function useInstance(id: string) {
  return useQuery({
    queryKey: ['instance', id],
    queryFn: () => fetchInstance(id),
    enabled: !!id,
    refetchInterval: 5000, // Poll every 5 seconds for status updates
  })
}

export function useInstanceAction(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (action: 'start' | 'stop' | 'restart') => performAction(id, action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instance', id] })
      queryClient.invalidateQueries({ queryKey: ['instances'] })
    },
  })
}

export function useDeleteInstance() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteInstance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instances'] })
    },
  })
}
