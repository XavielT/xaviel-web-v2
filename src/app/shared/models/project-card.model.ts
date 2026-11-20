export interface ProjectCard{
    image: string;
    title: string;
    description: string;
    badges: string[];
    url?: string;
    /** Optional live demo; shows a "Live demo" button when set. */
    demoUrl?: string;
    variant?: 'default' | 'featured' | 'minimal';
  }