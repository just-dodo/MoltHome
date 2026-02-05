import { Badge } from '@/components/ui/badge'

const statusConfig = {
  provisioning: { label: 'Provisioning', className: 'bg-yellow-600' },
  running: { label: 'Running', className: 'bg-green-600' },
  stopped: { label: 'Stopped', className: 'bg-slate-600' },
  error: { label: 'Error', className: 'bg-red-600' },
  deleted: { label: 'Deleted', className: 'bg-slate-700' },
}

interface InstanceStatusProps {
  status: keyof typeof statusConfig
}

export function InstanceStatus({ status }: InstanceStatusProps) {
  const config = statusConfig[status] || statusConfig.stopped
  return <Badge className={config.className}>{config.label}</Badge>
}
