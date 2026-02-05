import Link from 'next/link'

export function MarketingFooter() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-slate-400">
            © {new Date().getFullYear()} MoltHome. All rights reserved.
          </div>
          <nav className="flex gap-6">
            <Link href="/pricing" className="text-slate-400 hover:text-white transition">
              Pricing
            </Link>
            <Link href="/login" className="text-slate-400 hover:text-white transition">
              Sign In
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
