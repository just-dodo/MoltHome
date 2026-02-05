import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function DashboardPage() {
  // TODO: Fetch instances from API
  const instances: Array<{
    id: string
    name: string
    status: 'running' | 'stopped' | 'provisioning'
    external_ip: string | null
  }> = []

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Instances</h1>
          <p className="text-slate-400">Manage your OpenClaw Gateway instances</p>
        </div>
        <Link href="/dashboard/new">
          <Button className="bg-blue-600 hover:bg-blue-700">
            + New Instance
          </Button>
        </Link>
      </div>

      {instances.length === 0 ? (
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="py-12 text-center">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold mb-2">No instances yet</h3>
            <p className="text-slate-400 mb-4">Deploy your first OpenClaw Gateway instance</p>
            <Link href="/dashboard/new">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Create Instance
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {instances.map((instance) => (
            <Link key={instance.id} href={`/dashboard/${instance.id}`}>
              <Card className="bg-slate-800 border-slate-700 hover:border-slate-600 transition cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">{instance.name}</CardTitle>
                    <Badge
                      variant={instance.status === 'running' ? 'default' : 'secondary'}
                      className={instance.status === 'running' ? 'bg-green-600' : ''}
                    >
                      {instance.status}
                    </Badge>
                  </div>
                  <CardDescription className="text-slate-400">
                    {instance.external_ip || 'No IP assigned'}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
