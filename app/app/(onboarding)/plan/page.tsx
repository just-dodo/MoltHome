import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckoutButton } from '@/components/billing/checkout-button'

const plans = [
  {
    tier: 'starter' as const,
    name: 'Starter',
    price: '$30',
    description: 'Perfect for personal use',
    features: ['1 OpenClaw instance', '2 channels', 'Basic support'],
  },
  {
    tier: 'pro' as const,
    name: 'Pro',
    price: '$100',
    description: 'For power users and teams',
    features: ['5 OpenClaw instances', 'Unlimited channels', 'Priority support'],
    popular: true,
  },
]

export default async function PlanPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Choose Your Plan</h1>
        <p className="text-muted-foreground">Select a plan to get started with MoltHome</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {plans.map((plan) => (
          <Card key={plan.tier} className={plan.popular ? 'ring-2 ring-primary' : ''}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{plan.name}</CardTitle>
                {plan.popular && <Badge>Popular</Badge>}
              </div>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-foreground">
                    <span className="text-green-500">✓</span> {feature}
                  </li>
                ))}
              </ul>
              <CheckoutButton
                tier={plan.tier}
                userId={user.id}
                userEmail={user.email!}
                className={plan.popular ? "w-full" : "w-full bg-secondary hover:bg-secondary/80"}
              >
                Get Started
              </CheckoutButton>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
