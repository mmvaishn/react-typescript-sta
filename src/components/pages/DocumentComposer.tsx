import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowUp, ArrowDown, X, Plus, Download, Save } from '@phosphor-icons/react';
import { ContentSnippet, Document, DocumentSnippet } from '@/lib/types';
import { incrementSnippetUsage } from '@/lib/snippetUtils';
import { toast } from 'sonner';

interface DocumentComposerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  snippets: ContentSnippet[];
  onSnippetUpdate: (snippet: ContentSnippet) => void;
  onDocumentSave?: (document: Document) => void;
}

interface ComposerSnippet extends DocumentSnippet {
  snippet: ContentSnippet;
}

export function DocumentComposer({ 
  open, 
  onOpenChange, 
  snippets,
  onSnippetUpdate,
  onDocumentSave 
}: DocumentComposerProps) {
  const [title, setTitle] = useState('');
  const [documentSnippets, setDocumentSnippets] = useState<ComposerSnippet[]>([]);
  const [availableSnippets, setAvailableSnippets] = useState<ContentSnippet[]>(snippets);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAvailable = availableSnippets.filter(snippet =>
    (snippet.title?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
    (snippet.content?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
    snippet.tags?.some(tag => tag?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ?? false
  );

  const handleReset = () => {
    setTitle('');
    setDocumentSnippets([]);
    setAvailableSnippets(snippets);
    setSearchQuery('');
  };

  const addSnippet = (snippet: ContentSnippet) => {
    const newSnippet: ComposerSnippet = {
      snippetId: snippet.id,
      position: documentSnippets.length,
      snippet
    };
    
    setDocumentSnippets([...documentSnippets, newSnippet]);
    
    const updatedSnippet = incrementSnippetUsage(snippet);
    onSnippetUpdate(updatedSnippet);
    
    setAvailableSnippets(prev => 
      prev.map(s => s.id === snippet.id ? updatedSnippet : s)
    );
  };

  const removeSnippet = (index: number) => {
    const newSnippets = documentSnippets.filter((_, i) => i !== index);
    setDocumentSnippets(newSnippets.map((snippet, i) => ({ ...snippet, position: i })));
  };

  const moveSnippet = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= documentSnippets.length) return;

    const newSnippets = [...documentSnippets];
    [newSnippets[index], newSnippets[newIndex]] = [newSnippets[newIndex], newSnippets[index]];
    
    setDocumentSnippets(newSnippets.map((snippet, i) => ({ ...snippet, position: i })));
  };

  const updateSnippetContent = (index: number, customContent: string) => {
    const newSnippets = [...documentSnippets];
    newSnippets[index] = { ...newSnippets[index], customContent };
    setDocumentSnippets(newSnippets);
  };

  const generateDocument = () => {
    if (!title.trim()) {
      toast.error('Please enter a document title');
      return;
    }

    if (documentSnippets.length === 0) {
      toast.error('Please add at least one snippet to the document');
      return;
    }

    const documentContent = documentSnippets
      .map(ds => ds.customContent || ds.snippet.content)
      .join('\n\n');

    const blob = new Blob([`# ${title}\n\n${documentContent}`], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(title || 'document').replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
    link.click();
    URL.revokeObjectURL(url);

    toast.success('Document exported successfully!');
  };

  const saveDocument = () => {
    if (!title.trim()) {
      toast.error('Please enter a document title');
      return;
    }

    const document: Document = {
      id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title,
      snippets: documentSnippets.map(({ snippet, ...rest }) => rest),
      createdAt: new Date(),
      lastModified: new Date(),
      status: 'draft'
    };

    onDocumentSave?.(document);
    toast.success('Document saved as draft!');
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) handleReset();
      onOpenChange(newOpen);
    }}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Document Composer</DialogTitle>
          <DialogDescription>
            Create a document by combining your content snippets
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden">
          {/* Left Panel - Available Snippets */}
          <div className="space-y-4 overflow-hidden flex flex-col">
            <div>
              <Label htmlFor="snippet-search">Available Snippets</Label>
              <Input
                id="snippet-search"
                placeholder="Search snippets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-2">
              {filteredAvailable.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No snippets found</p>
                </div>
              ) : (
                filteredAvailable.map((snippet) => (
                  <Card 
                    key={snippet.id} 
                    className="cursor-pointer transition-all duration-200 hover:shadow-sm"
                    onClick={() => addSnippet(snippet)}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center justify-between">
                        <span className="line-clamp-1">{snippet.title}</span>
                        <Plus size={16} />
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                        {snippet.content}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {snippet.category}
                        </Badge>
                        {snippet.usageCount > 0 && (
                          <span className="text-xs text-muted-foreground">
                            Used {snippet.usageCount}x
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Right Panel - Document Builder */}
          <div className="space-y-4 overflow-hidden flex flex-col">
            <div>
              <Label htmlFor="document-title">Document Title</Label>
              <Input
                id="document-title"
                placeholder="Enter document title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-3">
              {documentSnippets.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Add snippets from the left panel to build your document</p>
                </div>
              ) : (
                documentSnippets.map((docSnippet, index) => (
                  <Card key={`${docSnippet.snippetId}-${index}`} className="relative">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm line-clamp-1">
                          {docSnippet.snippet.title}
                        </CardTitle>
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => moveSnippet(index, 'up')}
                            disabled={index === 0}
                          >
                            <ArrowUp size={14} />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => moveSnippet(index, 'down')}
                            disabled={index === documentSnippets.length - 1}
                          >
                            <ArrowDown size={14} />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeSnippet(index)}
                          >
                            <X size={14} />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Textarea
                        value={docSnippet.customContent || docSnippet.snippet.content}
                        onChange={(e) => updateSnippetContent(index, e.target.value)}
                        className="min-h-20 text-sm"
                        placeholder="Edit content for this section..."
                      />
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={saveDocument}
              disabled={!title.trim() || documentSnippets.length === 0}
            >
              <Save size={16} />
              Save Draft
            </Button>
            <Button
              onClick={generateDocument}
              disabled={!title.trim() || documentSnippets.length === 0}
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              <Download size={16} />
              Export Document
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}