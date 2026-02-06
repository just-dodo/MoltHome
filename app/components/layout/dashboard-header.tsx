import { UserMenu } from './user-menu'

export function DashboardHeader() {
  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-end px-6">
      <UserMenu />
    </header>
  )
}
