import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { Plus, FileText, Users, TrendingUp, FolderOpen, FilePdf, ShareNetwork, Robot, PaintBrush, ArrowsClockwise, Eye, Calendar, Funnel, CaretDown, Clock } from '@phosphor-icons/react'

interface DashboardProps {
  onNavigate?: (page: string) => void
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const [selectedTaskFilter, setSelectedTaskFilter] = useState('open')

  // Mock recent activity data
  const recentActivities = [
    { action: 'Document generated', item: 'Medicare Plan SBC', time: '2 minutes ago' },
    { action: 'Review completed', item: 'EOC Template', time: '15 minutes ago' },
    { action: 'Published to portal', item: 'EGWP Documents', time: '1 hour ago' },
    { action: 'Collaboration started', item: 'Annual Notice', time: '2 hours ago' }
  ]

  // Mock task data
  const mockTasks = [
    {
      id: 1,
      taskNumber: 'T001',
      folder: 'EOC Documents',
      effectiveDate: '01/15/2024',
      workflow: 'Review',
      state: 'In Progress',
      plan: 'Medicare Advantage',
      planName: 'MA Plan 2024',
      planType: 'HMO',
      view: 'PDF',
      task: 'Content Review',
      status: 'Active',
      starred: false
    },
    {
      id: 2,
      taskNumber: 'T002',
      folder: 'SBC Templates',
      effectiveDate: '02/01/2024',
      workflow: 'Approval',
      state: 'Pending',
      plan: 'Individual',
      planName: 'Silver Plan',
      planType: 'PPO',
      view: 'HTML',
      task: 'Final Review',
      status: 'Waiting',
      starred: true
    }
  ]

  const navigationTiles = [
    {
      id: 'master-list',
      title: 'Manage',
      description: 'Manage collateral content',
      icon: FolderOpen,
      gradient: 'from-blue-500/20 to-blue-600/20',
      iconColor: 'text-blue-600',
      bgHover: 'hover:bg-blue-50'
    },
    {
      id: 'generate',
      title: 'Generate',
      description: 'Generate PDF documents',
      icon: FilePdf,
      gradient: 'from-purple-500/20 to-purple-600/20',
      iconColor: 'text-purple-600',
      bgHover: 'hover:bg-purple-50'
    },
    {
      id: 'publish',
      title: 'Publish',
      description: 'Publish content to portal',
      icon: ShareNetwork,
      gradient: 'from-green-500/20 to-green-600/20',
      iconColor: 'text-green-600',
      bgHover: 'hover:bg-green-50'
    },
    {
      id: 'ask-benny',
      title: 'Ask Benny',
      description: 'AI assistant help',
      icon: Robot,
      gradient: 'from-orange-500/20 to-orange-600/20',
      iconColor: 'text-orange-600',
      bgHover: 'hover:bg-orange-50'
    },
    {
      id: 'collaborate',
      title: 'Collaborate',
      description: 'Work together',
      icon: Users,
      gradient: 'from-pink-500/20 to-pink-600/20',
      iconColor: 'text-pink-600',
      bgHover: 'hover:bg-pink-50'
    }
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back to SimplifyDocs</p>
      </div>

      {/* Quick Navigation Tiles */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {navigationTiles.map((tile) => {
          const IconComponent = tile.icon
          return (
            <Card 
              key={tile.id}
              className={`cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg ${tile.bgHover} group min-h-[120px]`}
              onClick={() => onNavigate?.(tile.id)}
            >
              <CardContent className="p-4 text-center h-full flex flex-col justify-center">
                <div className={`w-12 h-12 mx-auto mb-3 rounded-lg bg-gradient-to-br ${tile.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                  <IconComponent size={24} className={tile.iconColor} weight="duotone" />
                </div>
                <h3 className="font-semibold text-sm mb-1 leading-tight">{tile.title}</h3>
                <p className="text-xs text-muted-foreground leading-tight">{tile.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="min-h-[100px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold">4 new</div>
            <p className="text-xs text-muted-foreground">Latest updates</p>
          </CardContent>
        </Card>
        
        <Card className="min-h-[100px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold">247</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card className="min-h-[100px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents Generated</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">+15 this month</p>
          </CardContent>
        </Card>
        
        <Card className="min-h-[100px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collaborate Completed</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold">34</div>
            <p className="text-xs text-muted-foreground">+8 this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Work Queue Task Manager */}
      <Card className="mt-6">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <CardTitle className="text-lg font-medium">Work Queue (0)</CardTitle>
              <div className="flex items-center gap-4">
                <RadioGroup value={selectedTaskFilter} onValueChange={setSelectedTaskFilter} className="flex items-center gap-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="open" id="open" />
                    <Label htmlFor="open" className="text-sm font-normal">Open Tasks (0)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="completed" id="completed" />
                    <Label htmlFor="completed" className="text-sm font-normal">Completed Tasks (0)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="all" />
                    <Label htmlFor="all" className="text-sm font-normal">All Tasks (0)</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowsClockwise className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Eye className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Calendar className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Funnel className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Task Table */}
          <div className="border-t">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-2 p-2 bg-muted/50 border-b text-xs font-medium">
              <div className="col-span-1 px-2 py-1 text-left">Task #</div>
              <div className="col-span-1 px-2 py-1 text-left">Folder</div>
              <div className="col-span-1 px-2 py-1 text-left">Effective Date</div>
              <div className="col-span-1 px-2 py-1 text-left">Workflow</div>
              <div className="col-span-1 px-2 py-1 text-left">State</div>
              <div className="col-span-1 px-2 py-1 text-left">Plan</div>
              <div className="col-span-1 px-2 py-1 text-left">PlanName</div>
              <div className="col-span-1 px-2 py-1 text-left">PlanType</div>
              <div className="col-span-1 px-2 py-1 text-left">View</div>
              <div className="col-span-1 px-2 py-1 text-left">Task</div>
              <div className="col-span-1 px-2 py-1 text-left">Status</div>
              <div className="col-span-1 px-2 py-1 text-left">Star</div>
            </div>

            {/* Filter Row */}
            <div className="grid grid-cols-12 gap-2 p-2 bg-white border-b">
              <div className="col-span-1 px-2">
                <div className="flex items-center gap-1">
                  <Input className="h-6 text-xs" placeholder="" />
                  <CaretDown className="h-3 w-3 text-muted-foreground" />
                </div>
              </div>
              <div className="col-span-1 px-2">
                <div className="flex items-center gap-1">
                  <Input className="h-6 text-xs" placeholder="" />
                  <CaretDown className="h-3 w-3 text-muted-foreground" />
                </div>
              </div>
              <div className="col-span-1 px-2">
                <div className="flex items-center gap-1">
                  <Input className="h-6 text-xs" placeholder="m/d/yyyy" />
                  <CaretDown className="h-3 w-3 text-muted-foreground" />
                </div>
              </div>
              <div className="col-span-1 px-2">
                <div className="flex items-center gap-1">
                  <Input className="h-6 text-xs" placeholder="" />
                  <CaretDown className="h-3 w-3 text-muted-foreground" />
                </div>
              </div>
              <div className="col-span-1 px-2">
                <div className="flex items-center gap-1">
                  <Input className="h-6 text-xs" placeholder="" />
                  <CaretDown className="h-3 w-3 text-muted-foreground" />
                </div>
              </div>
              <div className="col-span-1 px-2">
                <div className="flex items-center gap-1">
                  <Input className="h-6 text-xs" placeholder="" />
                  <CaretDown className="h-3 w-3 text-muted-foreground" />
                </div>
              </div>
              <div className="col-span-1 px-2">
                <div className="flex items-center gap-1">
                  <Input className="h-6 text-xs" placeholder="" />
                  <CaretDown className="h-3 w-3 text-muted-foreground" />
                </div>
              </div>
              <div className="col-span-1 px-2">
                <div className="flex items-center gap-1">
                  <Input className="h-6 text-xs" placeholder="" />
                  <CaretDown className="h-3 w-3 text-muted-foreground" />
                </div>
              </div>
              <div className="col-span-1 px-2">
                <div className="flex items-center gap-1">
                  <Input className="h-6 text-xs" placeholder="" />
                  <CaretDown className="h-3 w-3 text-muted-foreground" />
                </div>
              </div>
              <div className="col-span-1 px-2">
                <div className="flex items-center gap-1">
                  <Input className="h-6 text-xs" placeholder="" />
                  <CaretDown className="h-3 w-3 text-muted-foreground" />
                </div>
              </div>
              <div className="col-span-1 px-2">
                <div className="flex items-center gap-1">
                  <Input className="h-6 text-xs" placeholder="" />
                  <CaretDown className="h-3 w-3 text-muted-foreground" />
                </div>
              </div>
              <div className="col-span-1 px-2">
                <div className="flex items-center gap-1">
                  <Input className="h-6 text-xs" placeholder="" />
                  <CaretDown className="h-3 w-3 text-muted-foreground" />
                </div>
              </div>
            </div>

            {/* Empty State */}
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="text-sm text-muted-foreground">No Rows To Show</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}