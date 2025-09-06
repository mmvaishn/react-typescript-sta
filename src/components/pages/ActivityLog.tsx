import { useState, useEffect } from 'react';
import { useKV } from '@github/spark/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, User, FileText, Edit, Eye, Trash2, X, CaretUp } from '@phosphor-icons/react';

export interface ActivityLogEntry {
  id: string;
  timestamp: Date;
  user: string;
  action: 'view' | 'edit' | 'delete' | 'create' | 'export' | 'filter' | 'upload';
  target: string;
  details: string;
  ruleId?: string;
  oldValue?: string;
  newValue?: string;
}

interface ActivityLogProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export function ActivityLog({ isCollapsed = false, onToggle }: ActivityLogProps) {
  const [activities, setActivities] = useKV<ActivityLogEntry[]>('activity-log', []);
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);

  // Add a new activity entry
  const addActivity = (activity: Omit<ActivityLogEntry, 'id' | 'timestamp'>) => {
    const newActivity: ActivityLogEntry = {
      ...activity,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    
    setActivities(current => [newActivity, ...current].slice(0, 100)); // Keep only last 100 entries
  };

  // Clear all activities
  const clearActivities = () => {
    setActivities([]);
  };

  // Format timestamp for display
  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  // Get icon for action type
  const getActionIcon = (action: ActivityLogEntry['action']) => {
    switch (action) {
      case 'view': return <Eye size={14} className="text-blue-500" />;
      case 'edit': return <Edit size={14} className="text-green-500" />;
      case 'delete': return <Trash2 size={14} className="text-red-500" />;
      case 'create': return <FileText size={14} className="text-purple-500" />;
      case 'export': return <FileText size={14} className="text-orange-500" />;
      case 'filter': return <Eye size={14} className="text-gray-500" />;
      default: return <Clock size={14} className="text-gray-500" />;
    }
  };

  // Get badge color for action type
  const getActionBadgeColor = (action: ActivityLogEntry['action']) => {
    switch (action) {
      case 'view': return 'bg-blue-100 text-blue-800';
      case 'edit': return 'bg-green-100 text-green-800';
      case 'delete': return 'bg-red-100 text-red-800';
      case 'create': return 'bg-purple-100 text-purple-800';
      case 'export': return 'bg-orange-100 text-orange-800';
      case 'filter': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Expose addActivity function globally for other components to use
  useEffect(() => {
    // Store the addActivity function globally so other components can access it
    (window as any).addActivityLog = addActivity;
    
    return () => {
      delete (window as any).addActivityLog;
    };
  }, []);

  if (isCollapsed) {
    return (
      <div className="h-12 bg-card border-t border-border flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Activity Log</span>
          <Badge variant="secondary" className="text-xs">
            {activities.length} entries
          </Badge>
        </div>
        {onToggle && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="h-8 w-8 p-0"
          >
            <CaretUp size={16} />
          </Button>
        )}
      </div>
    );
  }

  return (
    <Card className="border-t-0 rounded-t-none">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-muted-foreground" />
            <CardTitle className="text-base">Activity Log</CardTitle>
            <Badge variant="secondary" className="text-xs">
              {activities.length} entries
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            {activities.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearActivities}
                className="h-8 text-xs text-muted-foreground hover:text-destructive"
              >
                Clear All
              </Button>
            )}
            {onToggle && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className="h-8 w-8 p-0"
              >
                <X size={16} />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <ScrollArea className="h-48">
          {activities.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              <div className="text-center">
                <Clock size={24} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">No activity yet</p>
                <p className="text-xs">User actions will appear here</p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors cursor-pointer"
                  onClick={() => setExpandedEntry(expandedEntry === activity.id ? null : activity.id)}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {getActionIcon(activity.action)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${getActionBadgeColor(activity.action)}`}
                      >
                        {activity.action.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(activity.timestamp)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <User size={12} className="text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">{activity.user}</span>
                    </div>
                    <p className="text-sm text-foreground">{activity.target}</p>
                    <p className="text-xs text-muted-foreground truncate">{activity.details}</p>
                    
                    {expandedEntry === activity.id && (activity.oldValue || activity.newValue) && (
                      <div className="mt-2 pt-2 border-t border-border/50">
                        {activity.oldValue && (
                          <div className="mb-2">
                            <span className="text-xs font-medium text-muted-foreground">Previous:</span>
                            <p className="text-xs text-muted-foreground bg-red-50 p-2 rounded mt-1 max-h-16 overflow-y-auto">
                              {activity.oldValue.length > 100 
                                ? `${activity.oldValue.substring(0, 100)}...` 
                                : activity.oldValue}
                            </p>
                          </div>
                        )}
                        {activity.newValue && (
                          <div>
                            <span className="text-xs font-medium text-muted-foreground">Current:</span>
                            <p className="text-xs text-muted-foreground bg-green-50 p-2 rounded mt-1 max-h-16 overflow-y-auto">
                              {activity.newValue.length > 100 
                                ? `${activity.newValue.substring(0, 100)}...` 
                                : activity.newValue}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

// Utility function to add activity from other components
export const logActivity = (activity: Omit<ActivityLogEntry, 'id' | 'timestamp'>) => {
  if ((window as any).addActivityLog) {
    (window as any).addActivityLog(activity);
  }
};