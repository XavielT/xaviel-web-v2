export interface ProjectCard{
    image: string;
    title: string;
    description: string;
    badges: string[];
    link?: string;
    variant?: 'default' | 'featured' | 'minimal';
  }