import { Skeleton } from '@/components/ui/skeleton'

export default function SettingsLoading() {
  return (
    <div>
      <div className="mb-8">
        <Skeleton className="h-8 w-32 mb-2" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="grid gap-4 max-w-2xl">
        <Skeleton className="h-32 rounded-lg" />
        <Skeleton className="h-32 rounded-lg" />
      </div>
    </div>
  )
}
