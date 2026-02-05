'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface PairedDevice {
  device_id: string
  platform: string
  paired_at: string
}

export function PairedDevices({ instanceId }: { instanceId: string }) {
  const [devices, setDevices] = useState<PairedDevice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDevices()
  }, [instanceId])

  const fetchDevices = async () => {
    try {
      const res = await fetch(`/api/instances/${instanceId}/pairing`)
      const { data } = await res.json()
      setDevices(data?.paired || [])
    } catch (error) {
      console.error('Failed to fetch devices:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRevoke = async (deviceId: string) => {
    if (!confirm('Are you sure you want to revoke this device?')) return

    try {
      await fetch(`/api/instances/${instanceId}/pairing?deviceId=${deviceId}`, {
        method: 'DELETE',
      })
      setDevices(devices.filter(d => d.device_id !== deviceId))
    } catch (error) {
      console.error('Failed to revoke device:', error)
    }
  }

  if (loading) {
    return <Card className="bg-slate-800 border-slate-700 animate-pulse h-32" />
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Paired Devices</CardTitle>
        <CardDescription className="text-slate-400">
          Devices connected to this gateway
        </CardDescription>
      </CardHeader>
      <CardContent>
        {devices.length === 0 ? (
          <p className="text-slate-500 text-center py-4">No paired devices</p>
        ) : (
          <div className="space-y-3">
            {devices.map((device) => (
              <div key={device.device_id} className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge className="bg-green-600">Active</Badge>
                  <div>
                    <p className="text-white font-medium">{device.platform}</p>
                    <p className="text-slate-400 text-sm">Paired {new Date(device.paired_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-400 border-red-400 hover:bg-red-400/10"
                  onClick={() => handleRevoke(device.device_id)}
                >
                  Revoke
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
