
import { OakTemplate } from '@/types/oakTemplates';

export const SAMPLE_OAK_TEMPLATES: OakTemplate[] = [
  {
    id: 'bash-brothers',
    name: 'Bash Brothers Era',
    category: 'Nostalgia',
    thumbnail: '/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png',
    completionPercentage: 85,
    era: '1988-1990',
    description: 'Classic design from the Championship years',
    tags: ['mcgwire', 'canseco', 'championship', '80s'],
    isTrending: true,
    colors: {
      primary: '#0f4c3a',
      secondary: '#ffd700',
      accent: '#ffffff'
    }
  },
  {
    id: 'moneyball',
    name: 'Moneyball Magic',
    category: 'Nostalgia',
    thumbnail: '/lovable-uploads/b3f6335f-9e0a-4a64-a665-15d04f456d50.png',
    completionPercentage: 92,
    era: '2002-2006',
    description: 'Celebrating the analytics revolution',
    tags: ['beane', 'analytics', '2000s', 'underdog'],
    isTrending: false,
    colors: {
      primary: '#0f4c3a',
      secondary: '#ffd700'
    }
  },
  {
    id: 'world-series-89',
    name: '1989 Championship',
    category: 'Celebration',
    thumbnail: '/lovable-uploads/25cbcac9-64c0-4969-9baa-7a3fdf9eb00a.png',
    completionPercentage: 78,
    era: '1989',
    description: 'World Series Champions template',
    tags: ['championship', 'world-series', 'earthquake', 'giants'],
    isTrending: true,
    colors: {
      primary: '#0f4c3a',
      secondary: '#ffd700',
      accent: '#c0392b'
    }
  },
  {
    id: 'stay-rally',
    name: 'Stay in Oakland',
    category: 'Protest',
    thumbnail: '/lovable-uploads/4db063a6-f43a-42c6-8670-41f27f772be8.png',
    completionPercentage: 67,
    description: 'Rally to keep the A\'s in Oakland',
    tags: ['stay', 'oakland', 'loyalty', 'fans'],
    isTrending: true,
    colors: {
      primary: '#0f4c3a',
      secondary: '#ffd700',
      accent: '#e74c3c'
    }
  },
  {
    id: 'oakland-roots',
    name: 'Oakland Roots',
    category: 'Community',
    thumbnail: '/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png',
    completionPercentage: 88,
    description: 'Celebrating Oakland community spirit',
    tags: ['community', 'roots', 'oakland', 'culture'],
    isTrending: false,
    colors: {
      primary: '#0f4c3a',
      secondary: '#ffd700'
    }
  },
  {
    id: 'drumline-thunder',
    name: 'Drumline Thunder',
    category: 'Community',
    thumbnail: '/lovable-uploads/b3f6335f-9e0a-4a64-a665-15d04f456d50.png',
    completionPercentage: 75,
    description: 'Inspired by the famous Oakland drumline',
    tags: ['drumline', 'music', 'atmosphere', 'fans'],
    isTrending: false,
    colors: {
      primary: '#0f4c3a',
      secondary: '#ffd700'
    }
  },
  {
    id: 'rickey-runs',
    name: 'Rickey Henderson',
    category: 'Nostalgia',
    thumbnail: '/lovable-uploads/25cbcac9-64c0-4969-9baa-7a3fdf9eb00a.png',
    completionPercentage: 94,
    era: '1979-1984, 1989-1995, 1998',
    description: 'Man of Steal tribute design',
    tags: ['rickey', 'stolen-bases', 'legend', 'hall-of-fame'],
    isTrending: true,
    colors: {
      primary: '#0f4c3a',
      secondary: '#ffd700'
    }
  },
  {
    id: 'young-core',
    name: 'Young Core Rising',
    category: 'Celebration',
    thumbnail: '/lovable-uploads/4db063a6-f43a-42c6-8670-41f27f772be8.png',
    completionPercentage: 82,
    description: 'Celebrating the new generation',
    tags: ['young', 'prospects', 'future', 'development'],
    isTrending: true,
    colors: {
      primary: '#0f4c3a',
      secondary: '#ffd700'
    }
  }
];

export const TEMPLATE_CATEGORIES = ['All', 'Nostalgia', 'Celebration', 'Protest', 'Community'] as const;
