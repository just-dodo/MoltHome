import { UserMenu } from './user-menu'

export function DashboardHeader() {
  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-end px-6">
      <UserMenu />
    </header>
  )
}
