'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

interface Subscription {
  tier: 'starter' | 'pro'
  status: 'active' | 'paused' | 'cancelled' | 'none'
  customerId: string | null
  subscriptionId: string | null
}

async function fetchSubscription(): Promise<Subscription> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const { data } = await supabase
    .schema('molthome')
    .from('profiles')
    .select('tier, subscription_status, paddle_customer_id, paddle_subscription_id')
    .eq('id', user.id)
    .single()

  return {
    tier: data?.tier || 'starter',
    status: data?.subscription_status || 'none',
    customerId: data?.paddle_customer_id || null,
    subscriptionId: data?.paddle_subscription_id || null,
  }
}

export function useSubscription() {
  return useQuery({
    queryKey: ['subscription'],
    queryFn: fetchSubscription,
  })
}
