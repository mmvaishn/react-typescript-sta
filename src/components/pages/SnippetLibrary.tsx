import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Search, Plus, Calendar, Hash, Folder } from '@phosphor-icons/react';
import { ContentSnippet, SnippetFilter } from '@/lib/types';
import { filterSnippets, getUniqueCategories, getUniqueTags } from '@/lib/snippetUtils';

interface SnippetLibraryProps {
  snippets: ContentSnippet[];
  onSnippetSelect: (snippet: ContentSnippet) => void;
  onCreateDocument: () => void;
}

export function SnippetLibrary({ snippets, onSnippetSelect, onCreateDocument }: SnippetLibraryProps) {
  const [filter, setFilter] = useState<SnippetFilter>({
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const filteredSnippets = filterSnippets(snippets, filter);
  const categories = getUniqueCategories(snippets);
  const tags = getUniqueTags(snippets);

  const updateFilter = (updates: Partial<SnippetFilter>) => {
    setFilter(prev => ({ ...prev, ...updates }));
  };

  const clearFilters = () => {
    setFilter({
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const hasActiveFilters = !!(filter.category || filter.tags?.length || filter.searchQuery);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Snippet Library</h2>
          <p className="text-muted-foreground">
            {filteredSnippets.length} of {snippets.length} snippets
          </p>
        </div>
        <Button onClick={onCreateDocument} className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Plus size={16} />
          Create Document
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search snippets..."
                value={filter.searchQuery || ''}
                onChange={(e) => updateFilter({ searchQuery: e.target.value || undefined })}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Select value={filter.category || 'all'} onValueChange={(value) => 
              updateFilter({ category: value === 'all' ? undefined : value })
            }>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={`${filter.sortBy}-${filter.sortOrder}`} onValueChange={(value) => {
              const [sortBy, sortOrder] = value.split('-') as [string, 'asc' | 'desc'];
              updateFilter({ sortBy: sortBy as any, sortOrder });
            }}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt-desc">Newest First</SelectItem>
                <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                <SelectItem value="title-asc">Title A-Z</SelectItem>
                <SelectItem value="title-desc">Title Z-A</SelectItem>
                <SelectItem value="usageCount-desc">Most Used</SelectItem>
                <SelectItem value="usageCount-asc">Least Used</SelectItem>
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        {filter.tags && filter.tags.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Filtered by tags:</span>
            <div className="flex gap-1">
              {filter.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <button
                    onClick={() => updateFilter({ 
                      tags: filter.tags?.filter(t => t !== tag) 
                    })}
                    className="ml-1 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      <Separator />

      {filteredSnippets.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground">
            {snippets.length === 0 ? (
              <>
                <Folder size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">No snippets yet</p>
                <p>Create your first snippet from CMS content above</p>
              </>
            ) : (
              <>
                <Search size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">No snippets match your filters</p>
                <p>Try adjusting your search or filters</p>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredSnippets.map((snippet) => (
            <Card 
              key={snippet.id} 
              className="cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02]"
              onClick={() => onSnippetSelect(snippet)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-base leading-5 line-clamp-2">
                  {snippet.title}
                </CardTitle>
                <CardDescription className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <Folder size={12} />
                    <span>{snippet.category}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    <span>{formatDate(snippet.createdAt)}</span>
                  </div>
                  {snippet.usageCount > 0 && (
                    <div className="flex items-center gap-1">
                      <Hash size={12} />
                      <span>Used {snippet.usageCount}x</span>
                    </div>
                  )}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                  {snippet.content}
                </p>
                
                {snippet.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {snippet.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {snippet.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{snippet.tags.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}