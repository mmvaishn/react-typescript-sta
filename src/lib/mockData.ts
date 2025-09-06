import { CMSContent } from './types';

export const mockCMSData: CMSContent[] = [
  {
    id: 'cms-1',
    title: 'Welcome to Our Platform',
    content: 'Our innovative platform transforms the way businesses handle document creation. With cutting-edge technology and user-centered design, we empower teams to create professional documents efficiently. Experience seamless collaboration and automated workflows that save time and reduce errors.',
    type: 'page',
    author: 'Content Team',
    lastModified: new Date('2024-01-15'),
    tags: ['welcome', 'platform', 'introduction'],
    metadata: {
      wordCount: 42,
      readingTime: 1,
      category: 'Marketing'
    }
  },
  {
    id: 'cms-2',
    title: 'Privacy Policy Guidelines',
    content: 'We are committed to protecting your privacy and personal information. This policy outlines how we collect, use, and safeguard your data. We implement industry-standard security measures to ensure your information remains confidential and secure. Your trust is fundamental to our relationship.',
    type: 'article',
    author: 'Legal Team',
    lastModified: new Date('2024-01-10'),
    tags: ['privacy', 'legal', 'data-protection'],
    metadata: {
      wordCount: 48,
      readingTime: 1,
      category: 'Legal'
    }
  },
  {
    id: 'cms-3',
    title: 'Product Feature Overview',
    content: 'Our comprehensive feature set includes real-time collaboration, automated formatting, template management, and advanced export options. Users can create documents from scratch or leverage our extensive template library. Integration with popular business tools ensures seamless workflow adoption.',
    type: 'post',
    author: 'Product Team',
    lastModified: new Date('2024-01-12'),
    tags: ['features', 'product', 'overview'],
    metadata: {
      wordCount: 41,
      readingTime: 1,
      category: 'Product'
    }
  },
  {
    id: 'cms-4',
    title: 'Customer Success Stories',
    content: 'Companies worldwide have transformed their document workflows using our platform. From small startups to enterprise organizations, our solution scales to meet diverse needs. Discover how businesses have reduced document creation time by 60% while improving quality and consistency.',
    type: 'article',
    author: 'Marketing Team',
    lastModified: new Date('2024-01-08'),
    tags: ['success', 'customers', 'case-studies'],
    metadata: {
      wordCount: 44,
      readingTime: 1,
      category: 'Marketing'
    }
  },
  {
    id: 'cms-5',
    title: 'Technical Documentation Standards',
    content: 'Effective technical documentation requires clear structure, consistent formatting, and comprehensive coverage. Our guidelines ensure documentation remains accessible to both technical and non-technical users. Regular updates and version control maintain accuracy and relevance over time.',
    type: 'template',
    author: 'Documentation Team',
    lastModified: new Date('2024-01-14'),
    tags: ['documentation', 'technical', 'standards'],
    metadata: {
      wordCount: 40,
      readingTime: 1,
      category: 'Technical'
    }
  }
];

export const generateMockCMSData = (): Promise<CMSContent[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockCMSData);
    }, 800);
  });
};