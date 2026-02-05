import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function InvoicesPage() {
  // In a real implementation, fetch from Paddle API
  const invoices: Array<{
    id: string
    date: string
    amount: string
    status: 'paid' | 'pending'
  }> = []

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Invoice History</h1>
        <p className="text-slate-400">View and download past invoices</p>
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          {invoices.length === 0 ? (
            <p className="text-slate-500 text-center py-8">No invoices yet</p>
          ) : (
            <div className="space-y-3">
              {invoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                  <div>
                    <p className="text-white">{invoice.date}</p>
                    <p className="text-slate-400 text-sm">{invoice.amount}</p>
                  </div>
                  <Badge className={invoice.status === 'paid' ? 'bg-green-600' : 'bg-yellow-600'}>
                    {invoice.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
