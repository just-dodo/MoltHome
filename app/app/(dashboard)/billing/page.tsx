import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export default function BillingPage() {
  // TODO: Fetch subscription from API
  const subscription = {
    tier: 'starter',
    status: 'active',
    nextBillingDate: '2026-03-05',
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Billing</h1>
        <p className="text-muted-foreground">Manage your subscription and billing</p>
      </div>

      <div className="grid gap-6 max-w-2xl">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Current Plan</CardTitle>
              <Badge className="capitalize">{subscription.tier}</Badge>
            </div>
            <CardDescription>
              Your subscription is {subscription.status}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Next billing date</p>
                <p>{subscription.nextBillingDate}</p>
              </div>
              <Link href="/billing/plans">
                <Button variant="outline">
                  Change Plan
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Link href="/billing/invoices">
          <Card className="hover:border-border/80 transition cursor-pointer">
            <CardHeader>
              <CardTitle>Invoice History</CardTitle>
              <CardDescription>
                View and download past invoices
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  )
}
