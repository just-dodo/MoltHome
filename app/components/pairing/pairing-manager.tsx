'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PendingList } from './pending-list'
import { PairedDevices } from './paired-devices'

export function PairingManager({ instanceId }: { instanceId: string }) {
  const [pairingCode, setPairingCode] = useState('')
  const [channel, setChannel] = useState('telegram')
  const [loading, setLoading] = useState(false)

  const handleApprove = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!pairingCode) return

    setLoading(true)
    try {
      const res = await fetch(`/api/instances/${instanceId}/pairing`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channel, code: pairingCode }),
      })

      if (res.ok) {
        setPairingCode('')
        alert('Pairing approved successfully!')
      }
    } catch (error) {
      console.error('Failed to approve pairing:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Manual Pairing Approval */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Approve Pairing Code</CardTitle>
          <CardDescription className="text-slate-400">
            Enter a pairing code to approve a device connection
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleApprove} className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="code" className="sr-only">Pairing Code</Label>
              <Input
                id="code"
                placeholder="Enter pairing code (e.g., ABC123)"
                value={pairingCode}
                onChange={(e) => setPairingCode(e.target.value.toUpperCase())}
                className="bg-slate-900 border-slate-700 font-mono"
                maxLength={8}
              />
            </div>
            <Button type="submit" disabled={loading || !pairingCode} className="bg-green-600 hover:bg-green-700">
              {loading ? 'Approving...' : 'Approve'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Pending Requests */}
      <PendingList instanceId={instanceId} />

      {/* Paired Devices */}
      <PairedDevices instanceId={instanceId} />
    </div>
  )
}
