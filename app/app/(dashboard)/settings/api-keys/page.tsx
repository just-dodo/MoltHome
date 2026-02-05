'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

type ApiKeyType = 'anthropic' | 'openai' | 'gemini'

interface ApiKey {
  id: string
  name: string
  type: ApiKeyType
  created_at: string
}

const providerInfo: Record<ApiKeyType, { label: string; placeholder: string; color: string }> = {
  anthropic: { label: 'Anthropic', placeholder: 'sk-ant-...', color: 'bg-orange-600' },
  openai: { label: 'OpenAI', placeholder: 'sk-...', color: 'bg-green-600' },
  gemini: { label: 'Google Gemini', placeholder: 'AI...', color: 'bg-blue-600' },
}

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([])
  const [newKeyName, setNewKeyName] = useState('')
  const [newKeyType, setNewKeyType] = useState<ApiKeyType>('anthropic')
  const [newKeyValue, setNewKeyValue] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchKeys()
  }, [])

  const fetchKeys = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .schema('molthome')
      .from('api_keys')
      .select('id, name, type, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    setKeys(data || [])
  }

  const handleAdd = async () => {
    if (!newKeyName || !newKeyValue) return

    setLoading(true)
    try {
      const res = await fetch('/api/secrets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newKeyName, type: newKeyType, value: newKeyValue }),
      })

      if (res.ok) {
        setNewKeyName('')
        setNewKeyValue('')
        fetchKeys()
      }
    } catch (error) {
      console.error('Failed to add key:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this API key?')) return

    try {
      await fetch(`/api/secrets?id=${id}`, { method: 'DELETE' })
      setKeys(keys.filter(k => k.id !== id))
    } catch (error) {
      console.error('Failed to delete key:', error)
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">API Keys</h1>
        <p className="text-slate-400">Manage your AI provider API keys</p>
      </div>

      <Card className="bg-slate-800 border-slate-700 mb-6">
        <CardHeader>
          <CardTitle className="text-white">Add New Key</CardTitle>
          <CardDescription className="text-slate-400">
            Add API keys for Anthropic, OpenAI, or Google Gemini
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                placeholder="My API Key"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                className="bg-slate-900 border-slate-700"
              />
            </div>
            <div className="space-y-2">
              <Label>Provider</Label>
              <Select value={newKeyType} onValueChange={(v) => setNewKeyType(v as ApiKeyType)}>
                <SelectTrigger className="bg-slate-900 border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="anthropic">Anthropic (Claude)</SelectItem>
                  <SelectItem value="openai">OpenAI (GPT)</SelectItem>
                  <SelectItem value="gemini">Google Gemini</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>API Key</Label>
            <Input
              type="password"
              placeholder={providerInfo[newKeyType].placeholder}
              value={newKeyValue}
              onChange={(e) => setNewKeyValue(e.target.value)}
              className="bg-slate-900 border-slate-700"
            />
          </div>
          <Button onClick={handleAdd} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
            {loading ? 'Adding...' : 'Add Key'}
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Saved Keys</CardTitle>
        </CardHeader>
        <CardContent>
          {keys.length === 0 ? (
            <p className="text-slate-500 text-center py-4">No API keys saved</p>
          ) : (
            <div className="space-y-3">
              {keys.map((key) => (
                <div key={key.id} className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge className={providerInfo[key.type].color}>
                      {providerInfo[key.type].label}
                    </Badge>
                    <div>
                      <p className="text-white">{key.name}</p>
                      <p className="text-slate-400 text-xs">Added {new Date(key.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(key.id)}>
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
