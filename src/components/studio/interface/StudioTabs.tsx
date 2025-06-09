
import React from 'react';
import { 
  Camera, 
  Layers, 
  Lightbulb, 
  Palette, 
  Eye,
  Sparkles,
  Wand2,
  Shapes,
  Zap
} from 'lucide-react';

export interface StudioTab {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  category: 'creation' | 'effects' | 'presentation' | 'advanced';
}

export const STUDIO_TABS: StudioTab[] = [
  { id: 'photo', label: 'Photo', icon: Camera, category: 'creation' },
  { id: '3d-preview', label: '3D View', icon: Sparkles, category: 'advanced' },
  { id: 'vector', label: 'Vector', icon: Shapes, category: 'advanced' },
  { id: 'effects', label: 'Effects', icon: Wand2, category: 'effects' },
  { id: 'layers', label: 'Layers', icon: Layers, category: 'effects' },
  { id: 'lighting', label: 'Lighting', icon: Lightbulb, category: 'effects' },
  { id: 'design', label: 'Design', icon: Palette, category: 'creation' },
  { id: 'branding', label: 'CRD Back', icon: Zap, category: 'creation' },
  { id: 'preview', label: 'Preview', icon: Eye, category: 'presentation' }
];
