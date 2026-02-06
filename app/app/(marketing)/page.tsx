import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Deploy OpenClaw Gateway
            <br />in Minutes
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            MoltHome lets you deploy and manage your own OpenClaw Gateway instances on Google Cloud Platform with just a few clicks.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="px-8">
                Get Started
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-card/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why MoltHome?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'One-Click Deploy',
                description: 'Deploy your OpenClaw Gateway to GCP with a single click. No infrastructure expertise needed.',
                icon: '🚀',
              },
              {
                title: 'Multi-Channel Support',
                description: 'Connect Telegram, Discord, and more. Manage all your bot channels from one dashboard.',
                icon: '💬',
              },
              {
                title: 'Secure & Reliable',
                description: 'Your data stays on your own GCP instance. Full encryption and secure pairing.',
                icon: '🔒',
              },
            ].map((feature) => (
              <div key={feature.title} className="bg-card rounded-xl p-6 border">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-muted-foreground mb-8">Choose a plan and deploy your first instance today.</p>
          <Link href="/pricing">
            <Button size="lg" className="px-8">
              View Pricing
            </Button>
          </Link>
        </div>
      </section>
    </>
  )
}
