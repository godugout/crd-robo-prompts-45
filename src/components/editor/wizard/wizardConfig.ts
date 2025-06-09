export interface TemplateConfig {
  id: string;
  name: string;
  category: string;
  description: string;
  preview_url?: string;
  template_data: Record<string, any>;
  is_premium: boolean;
  usage_count: number;
  tags: string[];
}

export const DEFAULT_TEMPLATES: TemplateConfig[] = [
  {
    id: 'classic-portrait',
    name: 'Classic Portrait',
    category: 'Portrait',
    description: 'A timeless portrait template with elegant borders and typography.',
    template_data: {
      layout: 'portrait',
      border: 'classic',
      typography: 'serif',
      colorScheme: 'neutral'
    },
    is_premium: false,
    usage_count: 1247,
    tags: ['portrait', 'classic', 'elegant', 'border']
  },
  {
    id: 'modern-minimal',
    name: 'Modern Minimal',
    category: 'Modern',
    description: 'Clean, minimalist design with focus on your image.',
    template_data: {
      layout: 'minimal',
      border: 'none',
      typography: 'sans-serif',
      colorScheme: 'monochrome'
    },
    is_premium: false,
    usage_count: 892,
    tags: ['modern', 'minimal', 'clean', 'simple']
  },
  {
    id: 'gaming-legend',
    name: 'Gaming Legend',
    category: 'Gaming',
    description: 'Epic template for gaming characters and moments.',
    template_data: {
      layout: 'gaming',
      border: 'metallic',
      typography: 'display',
      colorScheme: 'electric',
      effects: ['glow', 'metallic']
    },
    is_premium: true,
    usage_count: 634,
    tags: ['gaming', 'epic', 'metallic', 'glow', 'character']
  },
  {
    id: 'sports-action',
    name: 'Sports Action',
    category: 'Sports',
    description: 'Dynamic template perfect for capturing sports moments.',
    template_data: {
      layout: 'action',
      border: 'dynamic',
      typography: 'bold',
      colorScheme: 'energetic',
      effects: ['motion-blur', 'energy']
    },
    is_premium: false,
    usage_count: 1156,
    tags: ['sports', 'action', 'dynamic', 'energy', 'motion']
  },
  {
    id: 'vintage-classic',
    name: 'Vintage Classic',
    category: 'Vintage',
    description: 'Nostalgic design with vintage colors and decorative elements.',
    template_data: {
      layout: 'vintage',
      border: 'ornate',
      typography: 'vintage',
      colorScheme: 'sepia',
      effects: ['aged', 'vintage-filter']
    },
    is_premium: false,
    usage_count: 723,
    tags: ['vintage', 'nostalgic', 'ornate', 'sepia', 'classic']
  },
  {
    id: 'holographic-premium',
    name: 'Holographic Premium',
    category: 'Premium',
    description: 'Stunning holographic effects with premium finishes.',
    template_data: {
      layout: 'premium',
      border: 'holographic',
      typography: 'futuristic',
      colorScheme: 'rainbow',
      effects: ['holographic', 'rainbow', 'shine']
    },
    is_premium: true,
    usage_count: 445,
    tags: ['holographic', 'premium', 'rainbow', 'futuristic', 'shine']
  }
];

export const WIZARD_STEPS = [
  {
    id: 1,
    title: 'Upload Photo',
    description: 'Choose your image',
    component: 'PhotoUploadStep'
  },
  {
    id: 2,
    title: 'Adjust Image',
    description: 'Crop and position for perfect cards',
    component: 'ImageAdjustmentStep'
  },
  {
    id: 3,
    title: 'Choose Template',
    description: 'Select card style',
    component: 'TemplateSelectionStep'
  },
  {
    id: 4,
    title: 'Card Details',
    description: 'Add information',
    component: 'CardDetailsStep'
  },
  {
    id: 5,
    title: 'Publishing',
    description: 'Final settings',
    component: 'PublishingOptionsStep'
  }
];
