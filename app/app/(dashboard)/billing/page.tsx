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
        <p className="text-slate-400">Manage your subscription and billing</p>
      </div>

      <div className="grid gap-6 max-w-2xl">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">Current Plan</CardTitle>
              <Badge className="bg-blue-600 capitalize">{subscription.tier}</Badge>
            </div>
            <CardDescription className="text-slate-400">
              Your subscription is {subscription.status}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Next billing date</p>
                <p className="text-white">{subscription.nextBillingDate}</p>
              </div>
              <Link href="/billing/plans">
                <Button variant="outline" className="border-slate-600">
                  Change Plan
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Link href="/billing/invoices">
          <Card className="bg-slate-800 border-slate-700 hover:border-slate-600 transition cursor-pointer">
            <CardHeader>
              <CardTitle className="text-white">Invoice History</CardTitle>
              <CardDescription className="text-slate-400">
                View and download past invoices
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  )
}
