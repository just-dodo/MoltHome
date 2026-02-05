'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { getPaddle, PADDLE_PRICES, type PlanTier } from '@/lib/paddle/client'

interface CheckoutButtonProps {
  tier: PlanTier
  userId: string
  userEmail: string
  className?: string
  children?: React.ReactNode
}

export function CheckoutButton({ tier, userId, userEmail, className, children }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    setLoading(true)
    try {
      const paddle = await getPaddle()
      await paddle.Checkout.open({
        items: [{ priceId: PADDLE_PRICES[tier], quantity: 1 }],
        customData: { user_id: userId },
        customer: { email: userEmail },
        settings: {
          successUrl: `${window.location.origin}/onboarding/instance`,
          theme: 'dark',
        },
      })
    } catch (error) {
      console.error('Checkout error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleCheckout} disabled={loading} className={className}>
      {loading ? 'Loading...' : children || 'Subscribe'}
    </Button>
  )
}
