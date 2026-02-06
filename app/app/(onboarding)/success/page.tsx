import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function SuccessPage() {
  return (
    <div>
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-3xl font-bold mb-2">You're All Set!</h1>
        <p className="text-muted-foreground">Your OpenClaw Gateway is now running</p>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-4">Next Steps</h3>
          <ul className="space-y-3 text-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary">1.</span>
              Add a channel (Telegram or Discord) to connect your bot
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">2.</span>
              Approve device pairing requests from your clients
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">3.</span>
              Start chatting with Claude through your gateway!
            </li>
          </ul>
        </CardContent>
      </Card>

      <Link href="/dashboard">
        <Button className="w-full" size="lg">
          Go to Dashboard
        </Button>
      </Link>
    </div>
  )
}
