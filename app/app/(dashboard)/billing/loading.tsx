import { Skeleton } from '@/components/ui/skeleton'

export default function BillingLoading() {
  return (
    <div>
      <div className="mb-8">
        <Skeleton className="h-8 w-32 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="grid gap-6 max-w-2xl">
        <Skeleton className="h-40 rounded-lg" />
        <Skeleton className="h-24 rounded-lg" />
      </div>
    </div>
  )
}
