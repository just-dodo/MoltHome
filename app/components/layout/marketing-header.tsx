import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function MarketingHeader() {
  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          MoltHome
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition">
            Pricing
          </Link>
          <Link href="/login">
            <Button variant="outline">
              Sign In
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}
