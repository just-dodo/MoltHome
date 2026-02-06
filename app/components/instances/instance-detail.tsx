'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useInstance, useInstanceAction, useDeleteInstance } from '@/hooks/use-instance'
import { InstanceStatus } from './instance-status'
import { GatewayToken } from './gateway-token'
import Link from 'next/link'
import type { Database } from '@/lib/supabase/types'

type Instance = Database['molthome']['Tables']['instances']['Row']

export function InstanceDetail({ instance: initialInstance }: { instance: Instance }) {
  const router = useRouter()
  const { data: instance } = useInstance(initialInstance.id)
  const { mutate: performAction, isPending: actionPending } = useInstanceAction(initialInstance.id)
  const { mutate: deleteInstance, isPending: deletePending } = useDeleteInstance()

  const current = instance || initialInstance

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this instance?')) {
      deleteInstance(current.id, {
        onSuccess: () => router.push('/dashboard'),
      })
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            {current.name}
            <InstanceStatus status={current.status} />
          </h1>
          <p className="text-muted-foreground">{current.external_ip || 'No IP assigned'}</p>
        </div>
        <div className="flex gap-2">
          {current.status === 'stopped' && (
            <Button onClick={() => performAction('start')} disabled={actionPending}>
              Start
            </Button>
          )}
          {current.status === 'running' && (
            <>
              <Button variant="outline" onClick={() => performAction('stop')} disabled={actionPending}>
                Stop
              </Button>
              <Button variant="outline" onClick={() => performAction('restart')} disabled={actionPending}>
                Restart
              </Button>
            </>
          )}
          <Button variant="destructive" onClick={handleDelete} disabled={deletePending}>
            Delete
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="channels">Channels</TabsTrigger>
          <TabsTrigger value="pairing">Pairing</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Gateway Token</CardTitle>
                <CardDescription>
                  Use this token to connect clients
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GatewayToken token={current.gateway_token} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Instance Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Zone</span>
                  <span>{current.zone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Machine Type</span>
                  <span>{current.machine_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span>{new Date(current.created_at).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 mt-4">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Uptime</p>
                    <p className="text-2xl font-bold">99.9%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Messages Processed</p>
                    <p className="text-2xl font-bold">1,247</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active Channels</p>
                    <p className="text-2xl font-bold">2</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Paired Devices</p>
                    <p className="text-2xl font-bold">3</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="channels">
          <Card>
            <CardHeader>
              <CardTitle>Channels</CardTitle>
              <CardDescription>
                Manage connected channels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={`/dashboard/${current.id}/channels`}>
                <Button>Manage Channels</Button>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pairing">
          <Card>
            <CardHeader>
              <CardTitle>Device Pairing</CardTitle>
              <CardDescription>
                Approve or reject pairing requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={`/dashboard/${current.id}/pairing`}>
                <Button>Manage Pairing</Button>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Deployment Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg text-xs overflow-auto max-h-96">
                {current.deployment_log
                  ? JSON.stringify(current.deployment_log, null, 2)
                  : 'No logs available'}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
