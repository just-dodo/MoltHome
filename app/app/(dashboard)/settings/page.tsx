import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function SettingsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings</p>
      </div>

      <div className="grid gap-4 max-w-2xl">
        <Link href="/settings/profile">
          <Card className="hover:border-border/80 transition cursor-pointer">
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                Update your profile information
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/settings/api-keys">
          <Card className="hover:border-border/80 transition cursor-pointer">
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>
                Manage your AI provider API keys (Anthropic, OpenAI, Gemini)
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  )
}
