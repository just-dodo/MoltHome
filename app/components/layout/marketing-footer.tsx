import Link from 'next/link'

export function MarketingFooter() {
  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-muted-foreground">
            © {new Date().getFullYear()} MoltHome. All rights reserved.
          </div>
          <nav className="flex gap-6">
            <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition">
              Pricing
            </Link>
            <Link href="/login" className="text-muted-foreground hover:text-foreground transition">
              Sign In
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
