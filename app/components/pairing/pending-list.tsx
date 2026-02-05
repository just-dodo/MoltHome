'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface PendingRequest {
  request_id: string
  device_id: string
  platform: string
  created_at: string
}

export function PendingList({ instanceId }: { instanceId: string }) {
  const [pending, setPending] = useState<PendingRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPending()
  }, [instanceId])

  const fetchPending = async () => {
    try {
      const res = await fetch(`/api/instances/${instanceId}/pairing`)
      const { data } = await res.json()
      setPending(data?.pending || [])
    } catch (error) {
      console.error('Failed to fetch pending:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <Card className="bg-slate-800 border-slate-700 animate-pulse h-32" />
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Pending Requests</CardTitle>
        <CardDescription className="text-slate-400">
          Devices waiting for approval
        </CardDescription>
      </CardHeader>
      <CardContent>
        {pending.length === 0 ? (
          <p className="text-slate-500 text-center py-4">No pending requests</p>
        ) : (
          <div className="space-y-3">
            {pending.map((req) => (
              <div key={req.request_id} className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                <div>
                  <p className="text-white font-medium">{req.platform}</p>
                  <p className="text-slate-400 text-sm">{new Date(req.created_at).toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    Approve
                  </Button>
                  <Button size="sm" variant="destructive">
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
