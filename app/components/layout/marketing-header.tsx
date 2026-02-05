import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function MarketingHeader() {
  return (
    <header className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-sm border-b border-slate-800">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-white">
          MoltHome
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/pricing" className="text-slate-300 hover:text-white transition">
            Pricing
          </Link>
          <Link href="/login">
            <Button variant="outline" className="border-slate-700 text-white hover:bg-slate-800">
              Sign In
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}
