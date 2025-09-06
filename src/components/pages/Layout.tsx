import { ReactNode } from 'react';
import { 
  LayoutDashboard, 
  List, 
  Users, 
  FileText, 
  Share, 
  Settings, 
  Palette,
  CaretLeft,
  CaretRight,
  File
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useKV } from '@github/spark/hooks';

interface LayoutProps {
  children: ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'master-list', label: 'Global Template', icon: List },
  { id: 'digital-content-manager', label: 'Digital Content Manager', icon: File },
  { id: 'collaborate', label: 'Collaborate', icon: Users },
  { id: 'generate', label: 'Generate', icon: FileText },
  { id: 'integrate', label: 'Integrate', icon: Share },
  { id: 'admin-settings', label: 'Admin Settings', icon: Settings },
  { id: 'design-studio', label: 'Design Studio', icon: Palette },
];

export function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  const [isCollapsed, setIsCollapsed] = useKV('sidebar-collapsed', false);

  return (
    <div className="flex h-screen bg-background">
      {/* Left Navigation Pane */}
      <div className={cn(
        "bg-card border-r border-border flex flex-col transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}>
        {/* Logo/Header */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          {!isCollapsed && (
            <h1 className="text-xl font-semibold text-foreground">SimplifyDocs</h1>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 h-8 w-8 hover:bg-secondary"
          >
            {isCollapsed ? (
              <CaretRight size={16} className="text-muted-foreground" />
            ) : (
              <CaretLeft size={16} className="text-muted-foreground" />
            )}
          </Button>
        </div>
        
        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 text-left",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary",
                  isCollapsed && "justify-center gap-0"
                )}
                onClick={() => onNavigate(item.id)}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon size={20} />
                {!isCollapsed && <span>{item.label}</span>}
              </Button>
            );
          })}
        </nav>
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
}