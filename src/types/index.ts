export interface Product {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  category: string;
  image: string;
  features: string[];
  benefits: string[];
  ctaText: string;
}

export type Category = 'All' | 'AI Writing' | 'Generative Art' | 'Development' | 'Data Science' | 'Productivity';
