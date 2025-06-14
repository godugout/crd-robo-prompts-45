
export interface MinimalistFrame {
  id: string;
  name: string;
  description: string;
  category: 'minimal' | 'classic' | 'modern' | 'fun';
  borderStyle: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
}

export const MINIMALIST_FRAMES: MinimalistFrame[] = [
  {
    id: 'clean-white',
    name: 'Clean White',
    description: 'Pure and simple',
    category: 'minimal',
    borderStyle: 'border-2 border-gray-200',
    backgroundColor: 'bg-white',
    textColor: 'text-gray-900',
    accentColor: 'bg-gray-100'
  },
  {
    id: 'soft-shadow',
    name: 'Soft Shadow',
    description: 'Subtle depth',
    category: 'minimal',
    borderStyle: 'shadow-lg border border-gray-100',
    backgroundColor: 'bg-white',
    textColor: 'text-gray-800',
    accentColor: 'bg-gray-50'
  },
  {
    id: 'simple-black',
    name: 'Simple Black',
    description: 'Bold and clean',
    category: 'classic',
    borderStyle: 'border-2 border-black',
    backgroundColor: 'bg-black',
    textColor: 'text-white',
    accentColor: 'bg-gray-900'
  },
  {
    id: 'rounded-modern',
    name: 'Rounded Modern',
    description: 'Friendly curves',
    category: 'modern',
    borderStyle: 'border-2 border-blue-200 rounded-xl',
    backgroundColor: 'bg-blue-50',
    textColor: 'text-blue-900',
    accentColor: 'bg-blue-100'
  },
  {
    id: 'neon-edge',
    name: 'Neon Edge',
    description: 'Vibrant accent',
    category: 'fun',
    borderStyle: 'border-2 border-crd-green shadow-lg shadow-crd-green/20',
    backgroundColor: 'bg-gray-900',
    textColor: 'text-white',
    accentColor: 'bg-crd-green/10'
  },
  {
    id: 'warm-cream',
    name: 'Warm Cream',
    description: 'Cozy and inviting',
    category: 'minimal',
    borderStyle: 'border-2 border-orange-200',
    backgroundColor: 'bg-orange-50',
    textColor: 'text-orange-900',
    accentColor: 'bg-orange-100'
  }
];
