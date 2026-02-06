'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function NewInstancePage() {
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
    // TODO: Call API to create instance
    // router.push('/dashboard')
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Create New Instance</h1>
        <p className="text-muted-foreground">Deploy a new OpenClaw Gateway instance</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Instance Configuration</CardTitle>
          <CardDescription>
            Configure your OpenClaw Gateway settings
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
              <Select
                value={formData.zone}
                onValueChange={(value) => setFormData({ ...formData, zone: value })}
              >
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
              <p className="text-xs text-muted-foreground">Your API key is encrypted and stored securely</p>
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Instance'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
