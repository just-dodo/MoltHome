import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { InstanceCard } from '@/components/instances/instance-card'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: instances } = await supabase
    .schema('molthome')
    .from('instances')
    .select('*')
    .eq('user_id', user!.id)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Instances</h1>
          <p className="text-muted-foreground">Manage your OpenClaw Gateway instances</p>
        </div>
        <Link href="/dashboard/new">
          <Button>+ New Instance</Button>
        </Link>
      </div>

      {!instances?.length ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold mb-2">No instances yet</h3>
            <p className="text-muted-foreground mb-4">Deploy your first OpenClaw Gateway instance</p>
            <Link href="/dashboard/new">
              <Button>Create Instance</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {instances.map((instance) => (
            <InstanceCard key={instance.id} instance={instance} />
          ))}
        </div>
      )}
    </div>
  )
}
