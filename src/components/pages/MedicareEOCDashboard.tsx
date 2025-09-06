import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Edit,
  Settings,
  Eye,
  BookOpen,
  Shield,
  Users,
  Download,
  ArrowLeft
} from '@phosphor-icons/react';

interface MedicareEOCDashboardProps {
  onNavigate: (page: string) => void;
}

export function MedicareEOCDashboard({ onNavigate }: MedicareEOCDashboardProps) {
  const medicareEOCCards = [
    {
      id: 'view-eoc',
      title: 'View EOC Document',
      description: 'Review the current Medicare Evidence of Coverage document',
      icon: Eye,
      color: 'bg-primary text-primary-foreground',
      action: () => console.log('View EOC clicked')
    },
    {
      id: 'edit-eoc',
      title: 'Edit EOC Content',
      description: 'Modify and update Medicare EOC content and rules',
      icon: Edit,
      color: 'bg-accent text-accent-foreground',
      action: () => onNavigate('medicare-eoc-editor')
    },
    {
      id: 'chapter-management',
      title: 'Chapter Management',
      description: 'Organize and manage EOC chapters and sections',
      icon: BookOpen,
      color: 'bg-secondary text-secondary-foreground',
      action: () => console.log('Chapter Management clicked')
    },
    {
      id: 'compliance-review',
      title: 'Compliance Review',
      description: 'Verify EOC compliance with Medicare regulations',
      icon: Shield,
      color: 'bg-muted text-muted-foreground',
      action: () => console.log('Compliance Review clicked')
    },
    {
      id: 'member-materials',
      title: 'Member Materials',
      description: 'Generate member-facing EOC summaries and notices',
      icon: Users,
      color: 'bg-destructive text-destructive-foreground',
      action: () => onNavigate('generate')
    },
    {
      id: 'export-publish',
      title: 'Export & Publish',
      description: 'Export EOC in various formats for distribution',
      icon: Download,
      color: 'bg-primary text-primary-foreground',
      action: () => onNavigate('integrate')
    }
  ];

  return (
    <div className="h-full bg-background overflow-auto">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Medicare EOC Dashboard
              </h1>
              <p className="text-muted-foreground">
                Manage your Medicare Evidence of Coverage documents and compliance workflows.
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Back to Main Dashboard
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Chapters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">12</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Rules
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">156</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Last Updated
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">Today</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Compliance Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">98%</div>
            </CardContent>
          </Card>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {medicareEOCCards.map((card) => {
            const IconComponent = card.icon;
            return (
              <Card 
                key={card.id}
                className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
                onClick={card.action}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${card.color}`}>
                      <IconComponent size={24} />
                    </div>
                    <CardTitle className="text-lg">{card.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{card.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}