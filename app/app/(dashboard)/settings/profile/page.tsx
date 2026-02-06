'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function ProfilePage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setEmail(user.email || '')
        setName(user.user_metadata?.full_name || '')
        setAvatarUrl(user.user_metadata?.avatar_url || '')
      }
    })
  }, [])

  const handleSave = async () => {
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      await supabase
        .schema('molthome')
        .from('profiles')
        .update({ name })
        .eq('id', user.id)

      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
    setLoading(false)
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your account information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback className="bg-muted text-xl">
                {name?.[0]?.toUpperCase() || email?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{name || 'No name set'}</p>
              <p className="text-muted-foreground text-sm">{email}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Display Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={email}
              disabled
              className="opacity-50"
            />
            <p className="text-xs text-muted-foreground">Email is managed by Google authentication</p>
          </div>

          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
