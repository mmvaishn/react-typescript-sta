import { useState } from 'react'
import { 
  House, 
  FolderOpen, 
  Users, 
  FilePdf, 
  Export, 
  Gear, 
  Palette,
  CaretLeft,
  Robot,
  ListBullets,
  MagnifyingGlass
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface NavigationProps {
  currentPage: string
  onNavigate: (page: string) => void
  isCollapsed: boolean
  onToggleCollapse: () => void
}

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: House },
  { id: 'dcm', label: 'Digital Content Manager', icon: Palette },
  { id: 'global-template', label: 'Global Template', icon: FolderOpen },
  { id: 'masterlist', label: 'Master List', icon: ListBullets },
  { id: 'lookups', label: 'Look-ups', icon: MagnifyingGlass },
  { id: 'collaborate', label: 'Collaborate', icon: Users },
  { id: 'generate', label: 'Generate', icon: FilePdf },
  { id: 'publish', label: 'Publish', icon: Export },
  { id: 'ask-benny', label: 'Ask Benny', icon: Robot },
  { id: 'admin-settings', label: 'Admin Settings', icon: Gear },
  { id: 'design-studio', label: 'Design Studio', icon: Palette },
]

export function Navigation({ currentPage, onNavigate, isCollapsed, onToggleCollapse }: NavigationProps) {
  return (
    <aside className={cn(
      "bg-card border-r border-border transition-all duration-300 ease-in-out flex flex-col",
      isCollapsed ? "w-16" : "w-72"
    )}>
      <div className="px-3 py-3 border-b border-border flex items-center justify-between">
        {!isCollapsed && (
          <h1 className="text-lg font-semibold text-foreground">
            SimplifyDocs
          </h1>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className={cn(
            "h-7 w-7 p-0 hover:bg-muted transition-transform duration-200",
            isCollapsed && "rotate-180"
          )}
        >
          <CaretLeft size={14} />
        </Button>
      </div>
      
      <nav className="flex-1 px-2 py-3">
        <ul className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPage === item.id
            
            return (
              <li key={item.id}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start h-9 transition-all duration-200",
                    isActive 
                      ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                      : "hover:bg-muted text-muted-foreground hover:text-foreground",
                    isCollapsed && "px-2"
                  )}
                  onClick={() => onNavigate(item.id)}
                >
                  <Icon 
                    size={16} 
                    className={cn(
                      "flex-shrink-0",
                      !isCollapsed && "mr-2"
                    )} 
                  />
                  {!isCollapsed && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}
                </Button>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}