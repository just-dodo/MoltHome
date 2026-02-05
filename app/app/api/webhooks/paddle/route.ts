import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verifyPaddleWebhook, type PaddleSubscriptionEvent } from '@/lib/paddle/webhooks'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  const rawBody = await request.text()
  const signature = request.headers.get('paddle-signature') || ''

  // Verify webhook signature in production
  if (process.env.PADDLE_WEBHOOK_SECRET) {
    const isValid = verifyPaddleWebhook(rawBody, signature, process.env.PADDLE_WEBHOOK_SECRET)
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }
  }

  const event: PaddleSubscriptionEvent = JSON.parse(rawBody)
  const { event_type, data } = event

  try {
    switch (event_type) {
      case 'subscription.created':
      case 'subscription.activated': {
        const userId = data.custom_data?.user_id
        if (userId) {
          const tier = data.items[0]?.price?.id?.includes('pro') ? 'pro' : 'starter'
          await supabaseAdmin
            .from('users')
            .update({
              paddle_customer_id: data.customer_id,
              paddle_subscription_id: data.id,
              subscription_status: 'active',
              tier,
            })
            .eq('id', userId)
        }
        break
      }

      case 'subscription.updated': {
        await supabaseAdmin
          .from('users')
          .update({
            subscription_status: data.status === 'active' ? 'active' : 'paused',
          })
          .eq('paddle_subscription_id', data.id)
        break
      }

      case 'subscription.canceled': {
        await supabaseAdmin
          .from('users')
          .update({ subscription_status: 'cancelled' })
          .eq('paddle_subscription_id', data.id)
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}
