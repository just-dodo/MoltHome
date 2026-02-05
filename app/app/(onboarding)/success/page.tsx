import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function SuccessPage() {
  return (
    <div>
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-3xl font-bold mb-2">You're All Set!</h1>
        <p className="text-slate-400">Your OpenClaw Gateway is now running</p>
      </div>

      <Card className="bg-slate-800 border-slate-700 mb-6">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-white mb-4">Next Steps</h3>
          <ul className="space-y-3 text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-blue-500">1.</span>
              Add a channel (Telegram or Discord) to connect your bot
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500">2.</span>
              Approve device pairing requests from your clients
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500">3.</span>
              Start chatting with Claude through your gateway!
            </li>
          </ul>
        </CardContent>
      </Card>

      <Link href="/dashboard">
        <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
          Go to Dashboard
        </Button>
      </Link>
    </div>
  )
}
