import { Product } from '../types';

export const products: Product[] = [
  {
    id: '1',
    title: 'Lumina Writer',
    description: 'An advanced AI writing assistant that masters your voice and helps you draft perfect copy in seconds.',
    shortDescription: 'Master your voice with AI writing.',
    category: 'AI Writing',
    image: 'https://picsum.photos/seed/writer/800/600',
    features: ['Contextual Drafting', 'Tone Analysis', 'Grammar Optimization', 'Content Rephrasing'],
    benefits: ['Save 70% writing time', 'Professional quality output', 'Infinite creative spark'],
    ctaText: 'Get Started'
  },
  {
    id: '2',
    title: 'NeonCanvas',
    description: 'Transform your wildest thoughts into breathtaking digital art using state-of-the-art diffusion models.',
    shortDescription: 'Breathtaking AI-generated art.',
    category: 'Generative Art',
    image: 'https://picsum.photos/seed/art/800/600',
    features: ['Infinite Variety', 'High Resolution', 'Style Transfer', 'Custom Presets'],
    benefits: ['No artistic skill required', 'Perfect for marketing', 'Unique visual identity'],
    ctaText: 'Start Creating'
  },
  {
    id: '3',
    title: 'CodeSync AI',
    description: 'The ultimate pair programmer that understands your codebase and helps you ship cleaner code faster.',
    shortDescription: 'Ship cleaner code with AI.',
    category: 'Development',
    image: 'https://picsum.photos/seed/code/800/600',
    features: ['Instant Refactoring', 'Bug Detection', 'Documentation Generator', 'Intelligent completion'],
    benefits: ['Reduce technical debt', 'Faster onboarding', 'Better code quality'],
    ctaText: 'Try for Free'
  },
  {
    id: '4',
    title: 'InsightEngine',
    description: 'Uncover hidden patterns in your business data with powerful AI-driven analytics and forecasting.',
    shortDescription: 'AI-driven data analytics.',
    category: 'Data Science',
    image: 'https://picsum.photos/seed/data/800/600',
    features: ['Predictive Modeling', 'Automatic Reports', 'Anomaly Detection', 'Trend Analysis'],
    benefits: ['Data-driven decisions', 'Identify opportunities', 'Mitigate risks'],
    ctaText: 'Analyze Now'
  },
  {
    id: '5',
    title: 'FocusFlow',
    description: 'A smart productivity suite that organizes your day and manages your tasks using cognitive behavioral science.',
    shortDescription: 'Cognitive productivity suite.',
    category: 'Productivity',
    image: 'https://picsum.photos/seed/productivity/800/600',
    features: ['Task Prioritization', 'Deep Work Timer', 'Focus Analytics', 'Seamless Integrations'],
    benefits: ['Increase focus by 40%', 'Stress-free management', 'Achieve your goals'],
    ctaText: 'Boost Focus'
  },
  {
    id: '6',
    title: 'EchoTranscribe',
    description: 'Ultra-accurate AI transcription service that captures every nuance of your meetings and lectures.',
    shortDescription: 'Accurate AI transcription.',
    category: 'Productivity',
    image: 'https://picsum.photos/seed/audio/800/600',
    features: ['Speaker Diarization', 'Sentiment Analysis', 'Summary Generator', 'Multi-language Support'],
    benefits: ['Never miss a detail', 'Searchable archives', 'Collaborative notes'],
    ctaText: 'Listen Now'
  },
  {
    id: '7',
    title: 'VisionaryAI',
    description: 'A robust computer vision platform for real-time object detection and visual data extraction.',
    shortDescription: 'Real-time computer vision.',
    category: 'Development',
    image: 'https://picsum.photos/seed/vision/800/600',
    features: ['Object Recognition', 'Face Detection', 'OCR Integration', 'Cloud/Edge Deploy'],
    benefits: ['Enhanced security', 'Automated monitoring', 'Scalable solutions'],
    ctaText: 'Explore API'
  },
  {
    id: '8',
    title: 'DraftFlow',
    description: 'Automated workflow optimization for legal and professional documents using deep learning.',
    shortDescription: 'Deep learning document optimization.',
    category: 'AI Writing',
    image: 'https://picsum.photos/seed/legal/800/600',
    features: ['Risk Assessment', 'Comparison Engine', 'Batch Processing', 'Compliance Check'],
    benefits: ['Legal-grade precision', 'Operational efficiency', 'Lower cost per doc'],
    ctaText: 'Optimize Now'
  }
];
