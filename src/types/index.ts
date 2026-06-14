export interface Product {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  category: string;
  subcategory?: string;
  image: string;
  features: string[];
  benefits: string[];
  ctaText: string;
  cta_link?: string | null;
}

export type Category = 'All' | 'AI & Writing' | 'Graphic Design' | 'Video Editing' | 'Marketing' | 'Learning' | 'Entertainment' | 'Productivity';

