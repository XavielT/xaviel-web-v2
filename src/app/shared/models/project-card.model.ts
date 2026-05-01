export interface ProjectCard{
    image: string;
    title: string;
    description: string;
    badges: string[];
    url?: string;
    variant?: 'default' | 'featured' | 'minimal';
  }