import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { InstanceStatus } from './instance-status'
import type { Database } from '@/lib/supabase/types'

type Instance = Database['molthome']['Tables']['instances']['Row']

export function InstanceCard({ instance }: { instance: Instance }) {
  return (
    <Link href={`/dashboard/${instance.id}`}>
      <Card className="bg-slate-800 border-slate-700 hover:border-slate-600 transition cursor-pointer">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">{instance.name}</CardTitle>
            <InstanceStatus status={instance.status} />
          </div>
          <CardDescription className="text-slate-400">
            {instance.external_ip || 'No IP assigned'} • {instance.zone}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  )
}
