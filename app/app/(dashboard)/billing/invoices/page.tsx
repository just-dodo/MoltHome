import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export default function InvoicesPage() {
  // In a real implementation, fetch from Paddle API
  const invoices: Array<{
    id: string
    date: string
    amount: string
    status: 'paid' | 'pending'
  }> = [
    { id: 'inv_001', date: 'January 2026', amount: '$30.00', status: 'paid' as const },
    { id: 'inv_002', date: 'December 2025', amount: '$30.00', status: 'paid' as const },
    { id: 'inv_003', date: 'November 2025', amount: '$30.00', status: 'paid' as const },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Invoice History</h1>
        <p className="text-muted-foreground">View and download past invoices</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          {invoices.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No invoices yet</p>
          ) : (
            <div className="space-y-3">
              {invoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p>{invoice.date}</p>
                    <p className="text-muted-foreground text-sm">{invoice.amount}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={invoice.status === 'paid' ? 'bg-green-600' : 'bg-yellow-600'}>
                      {invoice.status}
                    </Badge>
                    <Button variant="ghost" size="sm" asChild>
                      <a href="#">PDF</a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
