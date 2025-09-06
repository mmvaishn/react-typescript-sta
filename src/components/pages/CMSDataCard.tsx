import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, Calendar, User, Type } from '@phosphor-icons/react';
import { CMSContent } from '@/lib/types';
import { CreateSnippetDialog } from './CreateSnippetDialog';

interface CMSDataCardProps {
  content: CMSContent;
  onSnippetCreated: (snippet: any) => void;
}

export function CMSDataCard({ content, onSnippetCreated }: CMSDataCardProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <>
      <Card className="h-full transition-all duration-200 hover:shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg leading-6 truncate">{content.title}</CardTitle>
              <CardDescription className="mt-1">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Type size={14} />
                    <span className="capitalize">{content.type}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User size={14} />
                    <span>{content.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>{formatDate(content.lastModified)}</span>
                  </div>
                </div>
              </CardDescription>
            </div>
            <Button
              size="sm"
              onClick={() => setShowCreateDialog(true)}
              className="shrink-0"
            >
              <Plus size={16} />
              Create Snippet
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="space-y-4">
            <div>
              <p className="text-sm leading-relaxed text-foreground line-clamp-4">
                {content.content}
              </p>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {content.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="text-xs text-muted-foreground">
                {content.metadata.wordCount} words • {content.metadata.readingTime} min read
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <CreateSnippetDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        sourceContent={content}
        onSnippetCreated={onSnippetCreated}
      />
    </>
  );
}