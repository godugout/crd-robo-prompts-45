
import { EnhancedFrameTemplate } from '../../editor/frames/types';
import { ALL_FRAME_CONFIGS } from '../../editor/frames/VintageFrameConfigs';
import {
  ClassicSportsFrame,
  ModernHolographicFrame,
  VintageOrnateFrame,
  DonrussSpecialFrame,
  DonrussRookieFrame,
  ChromeEditionFrame
} from '../../editor/frames/components';

// Organized frame templates for optimal user experience
export const ENHANCED_FRAME_TEMPLATES: EnhancedFrameTemplate[] = [
  {
    id: 'classic-sports',
    name: 'Classic Sports',
    category: 'Professional',
    description: 'Traditional sports card design with premium borders',
    preview_component: ClassicSportsFrame,
    config: ALL_FRAME_CONFIGS.find(c => c.id === 'donruss-1987-classic')
  },
  {
    id: 'holographic-modern',
    name: 'Holographic',
    category: 'Premium',
    description: 'Modern holographic design with prismatic effects',
    preview_component: ModernHolographicFrame,
    config: ALL_FRAME_CONFIGS.find(c => c.id === 'holographic-premium')
  },
  {
    id: 'vintage-ornate',
    name: 'Vintage Ornate',
    category: 'Classic',
    description: 'Ornate vintage design with decorative elements',
    preview_component: VintageOrnateFrame,
    config: ALL_FRAME_CONFIGS.find(c => c.id === 'vintage-gold')
  },
  {
    id: 'chrome-edition',
    name: 'Chrome Edition',
    category: 'Modern',
    description: 'Sleek chrome finish with metallic elements',
    preview_component: ChromeEditionFrame,
    config: ALL_FRAME_CONFIGS.find(c => c.id === 'chrome-edition')
  },
  {
    id: 'donruss-special',
    name: 'Donruss Special',
    category: 'Vintage',
    description: '1987 Donruss special edition with ornate corners',
    preview_component: DonrussSpecialFrame,
    config: ALL_FRAME_CONFIGS.find(c => c.id === 'donruss-1987-special')
  },
  {
    id: 'donruss-rookie',
    name: 'Rookie Card',
    category: 'Vintage',
    description: '1987 Donruss rookie card design with red accents',
    preview_component: DonrussRookieFrame,
    config: ALL_FRAME_CONFIGS.find(c => c.id === 'donruss-1987-rookie')
  }
];

export type { EnhancedFrameTemplate };
