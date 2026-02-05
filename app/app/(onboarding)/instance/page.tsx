'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function CreateInstancePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    zone: 'us-central1-a',
    anthropicKey: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/instances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        const { data } = await res.json()
        router.push(`/onboarding/deploying?id=${data.id}`)
      }
    } catch (error) {
      console.error('Failed to create instance:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Create Your First Instance</h1>
        <p className="text-slate-400">Configure your OpenClaw Gateway</p>
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Instance Configuration</CardTitle>
          <CardDescription className="text-slate-400">
            Set up your gateway settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Instance Name</Label>
              <Input
                id="name"
                placeholder="My Gateway"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-slate-900 border-slate-700"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="zone">Region</Label>
              <Select value={formData.zone} onValueChange={(v) => setFormData({ ...formData, zone: v })}>
                <SelectTrigger className="bg-slate-900 border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us-central1-a">US Central (Iowa)</SelectItem>
                  <SelectItem value="us-east1-b">US East (South Carolina)</SelectItem>
                  <SelectItem value="europe-west1-b">Europe West (Belgium)</SelectItem>
                  <SelectItem value="asia-east1-a">Asia East (Taiwan)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="anthropicKey">Anthropic API Key</Label>
              <Input
                id="anthropicKey"
                type="password"
                placeholder="sk-ant-..."
                value={formData.anthropicKey}
                onChange={(e) => setFormData({ ...formData, anthropicKey: e.target.value })}
                className="bg-slate-900 border-slate-700"
                required
              />
              <p className="text-xs text-slate-500">Your key is encrypted and stored securely</p>
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading ? 'Creating...' : 'Deploy Instance'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
