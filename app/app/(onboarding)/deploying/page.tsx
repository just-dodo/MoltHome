'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

const deploymentSteps = [
  { id: 'vm', label: 'Creating VM instance' },
  { id: 'docker', label: 'Installing Docker' },
  { id: 'openclaw', label: 'Deploying OpenClaw' },
  { id: 'config', label: 'Configuring gateway' },
  { id: 'verify', label: 'Verifying health' },
]

function DeployingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const instanceId = searchParams.get('id')
  const [currentStep, setCurrentStep] = useState(0)
  const [status, setStatus] = useState<'deploying' | 'success' | 'error'>('deploying')

  useEffect(() => {
    if (!instanceId) return

    const pollStatus = async () => {
      try {
        const res = await fetch(`/api/instances/${instanceId}`)
        const { data } = await res.json()

        if (data.status === 'running') {
          setStatus('success')
          setTimeout(() => router.push('/onboarding/success'), 1500)
        } else if (data.status === 'error') {
          setStatus('error')
        } else {
          // Simulate progress
          setCurrentStep((prev) => Math.min(prev + 1, deploymentSteps.length - 1))
        }
      } catch (error) {
        console.error('Poll error:', error)
      }
    }

    const interval = setInterval(pollStatus, 3000)
    return () => clearInterval(interval)
  }, [instanceId, router])

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {status === 'success' ? 'Deployment Complete!' : 'Deploying Your Instance'}
        </h1>
        <p className="text-muted-foreground">
          {status === 'success' ? 'Your gateway is ready' : 'This may take a few minutes...'}
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {deploymentSteps.map((step, index) => (
              <div key={step.id} className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index < currentStep ? 'bg-green-600' :
                  index === currentStep ? 'bg-primary' : 'bg-muted'
                }`}>
                  {index < currentStep ? '✓' : index === currentStep ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (index + 1)}
                </div>
                <span className={index <= currentStep ? '' : 'text-muted-foreground'}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function DeployingPage() {
  return (
    <Suspense fallback={
      <div className="space-y-4">
        <Skeleton className="h-10 w-64 mx-auto bg-muted" />
        <Skeleton className="h-64 w-full bg-muted" />
      </div>
    }>
      <DeployingContent />
    </Suspense>
  )
}
