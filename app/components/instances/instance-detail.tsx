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
          <p className="text-slate-400">{current.external_ip || 'No IP assigned'}</p>
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
        <TabsList className="bg-slate-800">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="channels">Channels</TabsTrigger>
          <TabsTrigger value="pairing">Pairing</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Gateway Token</CardTitle>
                <CardDescription className="text-slate-400">
                  Use this token to connect clients
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GatewayToken token={current.gateway_token} />
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Instance Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Zone</span>
                  <span className="text-white">{current.zone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Machine Type</span>
                  <span className="text-white">{current.machine_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Created</span>
                  <span className="text-white">{new Date(current.created_at).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="channels">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Channels</CardTitle>
              <CardDescription className="text-slate-400">
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
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Device Pairing</CardTitle>
              <CardDescription className="text-slate-400">
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
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Deployment Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-slate-900 p-4 rounded-lg text-xs overflow-auto max-h-96">
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
