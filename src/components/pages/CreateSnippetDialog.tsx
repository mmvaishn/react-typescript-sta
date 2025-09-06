import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { X } from '@phosphor-icons/react';
import { CMSContent } from '@/lib/types';
import { createSnippetFromText } from '@/lib/snippetUtils';
import { toast } from 'sonner';

interface CreateSnippetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sourceContent: CMSContent;
  onSnippetCreated: (snippet: any) => void;
}

export function CreateSnippetDialog({ 
  open, 
  onOpenChange, 
  sourceContent, 
  onSnippetCreated 
}: CreateSnippetDialogProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(sourceContent.metadata.category);
  const [tags, setTags] = useState<string[]>([...sourceContent.tags]);
  const [newTag, setNewTag] = useState('');

  const handleReset = () => {
    setTitle('');
    setContent('');
    setCategory(sourceContent.metadata.category);
    setTags([...sourceContent.tags]);
    setNewTag('');
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleCreateSnippet = () => {
    if (!title.trim()) {
      toast.error('Please enter a title for the snippet');
      return;
    }

    if (!content.trim()) {
      toast.error('Please enter content for the snippet');
      return;
    }

    if (!category.trim()) {
      toast.error('Please enter a category for the snippet');
      return;
    }

    const snippet = createSnippetFromText(
      content,
      title,
      category,
      tags,
      sourceContent.id
    );

    onSnippetCreated(snippet);
    handleReset();
    onOpenChange(false);
    toast.success('Snippet created successfully!');
  };

  const handleUseFullContent = () => {
    setTitle(sourceContent.title);
    setContent(sourceContent.content);
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) handleReset();
      onOpenChange(newOpen);
    }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Content Snippet</DialogTitle>
          <DialogDescription>
            Create a reusable snippet from "{sourceContent.title}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="p-4 bg-card rounded-lg border">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium">Source Content</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={handleUseFullContent}
              >
                Use Full Content
              </Button>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {sourceContent.content}
            </p>
          </div>

          <Separator />

          <div className="space-y-4">
            <div>
              <Label htmlFor="snippet-title">Snippet Title</Label>
              <Input
                id="snippet-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a descriptive title..."
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="snippet-content">Content</Label>
              <Textarea
                id="snippet-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter or modify the content for this snippet..."
                className="mt-1 min-h-32"
              />
            </div>

            <div>
              <Label htmlFor="snippet-category">Category</Label>
              <Input
                id="snippet-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Enter category..."
                className="mt-1"
              />
            </div>

            <div>
              <Label>Tags</Label>
              <div className="mt-1 space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddTag}
                    disabled={!newTag.trim()}
                  >
                    Add
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X size={12} />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateSnippet}
              disabled={!title.trim() || !content.trim() || !category.trim()}
            >
              Create Snippet
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}