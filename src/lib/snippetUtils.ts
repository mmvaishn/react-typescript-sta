import { ContentSnippet, SnippetFilter } from './types';

export const generateSnippetId = (): string => {
  return `snippet-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const createSnippetFromText = (
  content: string,
  title: string,
  category: string,
  tags: string[] = [],
  sourceId?: string
): ContentSnippet => {
  return {
    id: generateSnippetId(),
    title: title.trim(),
    content: content.trim(),
    sourceId,
    tags: tags.filter(tag => tag.trim().length > 0),
    category: category.trim(),
    createdAt: new Date(),
    usageCount: 0
  };
};

export const filterSnippets = (
  snippets: ContentSnippet[],
  filter: SnippetFilter
): ContentSnippet[] => {
  let filtered = [...snippets];

  if (filter.category) {
    filtered = filtered.filter(snippet => 
      snippet.category?.toLowerCase() === filter.category?.toLowerCase()
    );
  }

  if (filter.tags && filter.tags.length > 0) {
    filtered = filtered.filter(snippet =>
      filter.tags!.some(tag =>
        snippet.tags?.some(snippetTag =>
          snippetTag?.toLowerCase().includes(tag?.toLowerCase() ?? '') ?? false
        ) ?? false
      )
    );
  }

  if (filter.searchQuery) {
    const query = filter.searchQuery.toLowerCase();
    filtered = filtered.filter(snippet =>
      (snippet.title?.toLowerCase().includes(query) ?? false) ||
      (snippet.content?.toLowerCase().includes(query) ?? false) ||
      (snippet.tags?.some(tag => tag?.toLowerCase().includes(query) ?? false) ?? false)
    );
  }

  const sortBy = filter.sortBy || 'createdAt';
  const sortOrder = filter.sortOrder || 'desc';

  filtered.sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortBy) {
      case 'title':
        aValue = a.title?.toLowerCase() ?? '';
        bValue = b.title?.toLowerCase() ?? '';
        break;
      case 'usageCount':
        aValue = a.usageCount ?? 0;
        bValue = b.usageCount ?? 0;
        break;
      case 'createdAt':
      default:
        aValue = a.createdAt?.getTime() ?? 0;
        bValue = b.createdAt?.getTime() ?? 0;
        break;
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  return filtered;
};

export const getUniqueCategories = (snippets: ContentSnippet[]): string[] => {
  const categories = snippets.map(snippet => snippet.category).filter(category => category != null);
  return Array.from(new Set(categories)).sort();
};

export const getUniqueTags = (snippets: ContentSnippet[]): string[] => {
  const allTags = snippets.flatMap(snippet => snippet.tags || []).filter(tag => tag != null);
  return Array.from(new Set(allTags)).sort();
};

export const incrementSnippetUsage = (snippet: ContentSnippet): ContentSnippet => {
  return {
    ...snippet,
    usageCount: snippet.usageCount + 1,
    lastUsed: new Date()
  };
};