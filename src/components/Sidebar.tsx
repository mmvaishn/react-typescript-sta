import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  ChartPieSlice,
  Files,
  FolderOpen,
  Users,
  Sparkle,
  LinkSimple,
  Gear,
  PaintBrush,
  X,
  List
} from '@phosphor-icons/react'

interface SidebarProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: ChartPieSlice },
  { name: 'Global Template', href: '/global-template', icon: Files },
  { name: 'Digital Content Manager', href: '/digital-content-manager', icon: FolderOpen },
  { name: 'Collaborate', href: '/collaborate', icon: Users },
  { name: 'Generate', href: '/generate', icon: Sparkle },
  { name: 'Integrate', href: '/integrate', icon: LinkSimple },
  { name: 'Admin Settings', href: '/admin-settings', icon: Gear },
  { name: 'Design Studio', href: '/design-studio', icon: PaintBrush },
]

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden bg-black/50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md text-foreground hover:bg-muted"
        >
          {sidebarOpen ? <X size={24} /> : <List size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center h-16 px-6 border-b border-border">
            <h1 className="text-xl font-bold text-foreground">SimplifyDocs</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )
                  }
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon size={20} />
                  {item.name}
                </NavLink>
              )
            })}
          </nav>
        </div>
      </div>
    </>
  )
}