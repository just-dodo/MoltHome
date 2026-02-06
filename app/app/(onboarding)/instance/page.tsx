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
        <p className="text-muted-foreground">Configure your OpenClaw Gateway</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Instance Configuration</CardTitle>
          <CardDescription>
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
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="zone">Region</Label>
              <Select value={formData.zone} onValueChange={(v) => setFormData({ ...formData, zone: v })}>
                <SelectTrigger>
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
                required
              />
              <p className="text-xs text-muted-foreground">Your key is encrypted and stored securely</p>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating...' : 'Deploy Instance'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
