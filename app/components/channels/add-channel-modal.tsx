'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAddChannel } from '@/hooks/use-channels'

interface AddChannelModalProps {
  instanceId: string
  open: boolean
  onClose: () => void
}

export function AddChannelModal({ instanceId, open, onClose }: AddChannelModalProps) {
  const [type, setType] = useState<'telegram' | 'discord'>('telegram')
  const [botToken, setBotToken] = useState('')
  const { mutate: addChannel, isPending } = useAddChannel(instanceId)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addChannel(
      { type, config: { botToken } },
      {
        onSuccess: () => {
          setBotToken('')
          onClose()
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Channel</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Channel Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as 'telegram' | 'discord')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="telegram">Telegram</SelectItem>
                <SelectItem value="discord">Discord</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Bot Token</Label>
            <Input
              type="password"
              placeholder={type === 'telegram' ? '123456:ABC...' : 'Discord bot token'}
              value={botToken}
              onChange={(e) => setBotToken(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              {type === 'telegram'
                ? 'Get this from @BotFather on Telegram'
                : 'Get this from Discord Developer Portal'}
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Adding...' : 'Add Channel'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
