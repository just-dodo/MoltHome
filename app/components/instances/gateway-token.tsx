'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function GatewayToken({ token }: { token: string }) {
  const [visible, setVisible] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(token)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex gap-2">
      <Input
        value={visible ? token : '••••••••••••••••'}
        readOnly
        className="font-mono text-sm"
      />
      <Button variant="outline" size="sm" onClick={() => setVisible(!visible)}>
        {visible ? 'Hide' : 'Show'}
      </Button>
      <Button variant="outline" size="sm" onClick={handleCopy}>
        {copied ? 'Copied!' : 'Copy'}
      </Button>
    </div>
  )
}
