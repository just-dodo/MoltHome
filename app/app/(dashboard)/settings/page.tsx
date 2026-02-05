import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function SettingsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-slate-400">Manage your account settings</p>
      </div>

      <div className="grid gap-4 max-w-2xl">
        <Link href="/settings/profile">
          <Card className="bg-slate-800 border-slate-700 hover:border-slate-600 transition cursor-pointer">
            <CardHeader>
              <CardTitle className="text-white">Profile</CardTitle>
              <CardDescription className="text-slate-400">
                Update your profile information
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/settings/api-keys">
          <Card className="bg-slate-800 border-slate-700 hover:border-slate-600 transition cursor-pointer">
            <CardHeader>
              <CardTitle className="text-white">API Keys</CardTitle>
              <CardDescription className="text-slate-400">
                Manage your AI provider API keys (Anthropic, OpenAI, Gemini)
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  )
}
