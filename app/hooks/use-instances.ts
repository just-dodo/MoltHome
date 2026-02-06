'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Database } from '@/lib/supabase/types'

type Instance = Database['molthome']['Tables']['instances']['Row']

async function fetchInstances(): Promise<Instance[]> {
  const res = await fetch('/api/instances')
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || 'Failed to fetch instances')
  }
  const { data } = await res.json()
  return data
}

async function createInstance(input: { name: string; zone: string; aiProvider?: string; aiApiKey?: string; anthropicKey?: string }) {
  const res = await fetch('/api/instances', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || 'Failed to create instance')
  }
  const { data } = await res.json()
  return data
}

export function useInstances() {
  return useQuery({
    queryKey: ['instances'],
    queryFn: fetchInstances,
  })
}

export function useCreateInstance() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createInstance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instances'] })
    },
  })
}
