export interface Post {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  content?: string;
  date: string;
  category: string;
  tags: string[];
  coverImage: string;
  author: string;
  featured: boolean;
  subtitle?: string;
} 