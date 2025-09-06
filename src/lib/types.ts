export interface RuleData {
  id: string;
  ruleId: string;
  effectiveDate: string;
  version: string;
  benefitType: string;
  businessArea: string;
  subBusinessArea: string;
  description: string;
  templateName?: string;
  serviceId?: string;
  cmsRegulated?: boolean;
  chapterName?: string;
  sectionName?: string;
  subsectionName?: string;
  serviceGroup?: string;
  sourceMapping?: string;
  tiers?: string;
  key?: string;
  rule?: string;
  ruleText?: string;
  content?: string;
  isTabular?: boolean;
  english?: string;
  englishStatus?: string;
  spanish?: string;
  spanishStatus?: string;
  published?: boolean;
  status?: string;
  tags?: string[];
  conditions?: any[];
  lastModified?: Date;
  lastModifiedBy?: string;
  createdAt?: Date;
}

export interface RuleFilter {
  templateName?: string;
  chapterName?: string;
  sectionName?: string;
  searchQuery?: string;
  sortBy?: 'ruleId' | 'templateName' | 'lastModified';
  sortOrder?: 'asc' | 'desc';
}

export interface EditingRule {
  id: string;
  field: keyof RuleData;
  value: string;
}

export interface CMSContent {
  id: string;
  title: string;
  content: string;
  type: 'article' | 'page' | 'post' | 'template';
  author: string;
  lastModified: Date;
  tags: string[];
  metadata: {
    wordCount: number;
    readingTime: number;
    category: string;
  };
}

export interface ContentSnippet {
  id: string;
  title: string;
  content: string;
  sourceId?: string;
  tags: string[];
  category: string;
  createdAt: Date;
  lastUsed?: Date;
  usageCount: number;
}

export interface Document {
  id: string;
  title: string;
  snippets: DocumentSnippet[];
  createdAt: Date;
  lastModified: Date;
  status: 'draft' | 'final';
}

export interface DocumentSnippet {
  snippetId: string;
  position: number;
  customContent?: string;
}

export interface SnippetFilter {
  category?: string;
  tags?: string[];
  searchQuery?: string;
  sortBy?: 'title' | 'createdAt' | 'usageCount';
  sortOrder?: 'asc' | 'desc';
}