import { Badge } from '@/components/ui/badge'

const statusConfig = {
  provisioning: { label: 'Provisioning', className: 'bg-yellow-600' },
  running: { label: 'Running', className: 'bg-green-600' },
  stopped: { label: 'Stopped', className: 'bg-muted-foreground' },
  error: { label: 'Error', className: 'bg-destructive' },
  deleted: { label: 'Deleted', className: 'bg-muted' },
}

interface InstanceStatusProps {
  status: keyof typeof statusConfig
}

export function InstanceStatus({ status }: InstanceStatusProps) {
  const config = statusConfig[status] || statusConfig.stopped
  return <Badge className={config.className}>{config.label}</Badge>
}
