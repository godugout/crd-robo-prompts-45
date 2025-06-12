
import { TemplateConfig } from '@/components/editor/wizard/wizardConfig';
import { SAMPLE_OAK_TEMPLATES } from '@/data/oakTemplateData';

export const OAK_STUDIO_CONFIG = {
  // Oakland A's branding
  branding: {
    primary: '#0f4c3a',
    secondary: '#ffd700',
    accent: '#ffffff',
    name: "Oakland A's Memory Creator",
    logo: '/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png'
  },
  
  // Convert OAK templates to studio format
  templates: SAMPLE_OAK_TEMPLATES.map((template): TemplateConfig => {
    return {
      id: template.id,
      name: template.name,
      category: template.category.toLowerCase(),
      preview_url: template.thumbnail,
      description: template.description || template.name,
      tags: template.tags || [],
      template_data: {
        layout: 'full-bleed',
        style: {
          primaryColor: template.colors?.primary || '#0f4c3a',
          accentColor: template.colors?.secondary || '#ffd700',
          backgroundColor: template.colors?.accent || '#ffffff',
          borderRadius: 8,
          borderWidth: 2
        },
        typography: {
          titleFont: 'Inter',
          bodyFont: 'Inter',
          titleSize: 24,
          bodySize: 14
        },
        effects: ['vintage'],
        supports_stickers: true
      }
    };
  }),
  
  // Available studio tabs for Oakland A's users
  enabledTabs: [
    'photo',
    '3d-preview',
    'effects',
    'lighting',
    'export'
  ],
  
  // Oakland A's specific presets
  effectPresets: [
    {
      id: 'oakland-vintage',
      name: 'Oakland Vintage',
      effects: {
        vintage: { intensity: 0.6 },
        warmth: { temperature: 200 }
      }
    },
    {
      id: 'championship-glow',
      name: 'Championship Glow',
      effects: {
        glow: { intensity: 0.8, color: '#ffd700' },
        contrast: { value: 1.2 }
      }
    }
  ],
  
  // Lighting presets
  lightingPresets: [
    {
      id: 'stadium-lights',
      name: 'Stadium Lights',
      ambientIntensity: 0.4,
      directionalIntensity: 1.2,
      position: [2, 3, 1]
    },
    {
      id: 'trophy-case',
      name: 'Trophy Case',
      ambientIntensity: 0.6,
      directionalIntensity: 0.8,
      position: [1, 2, 2]
    }
  ]
};
