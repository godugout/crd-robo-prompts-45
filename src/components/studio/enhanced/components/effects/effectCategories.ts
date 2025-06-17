
import { Sparkles, Zap, Star, Chrome } from 'lucide-react';

export const EFFECT_CATEGORIES = [
  {
    id: 'prismatic',
    name: 'Prismatic',
    icon: Sparkles,
    color: 'bg-gradient-to-r from-pink-500 to-purple-500',
    description: 'Rainbow and holographic effects'
  },
  {
    id: 'metallic',
    name: 'Metallic',
    icon: Chrome,
    color: 'bg-gradient-to-r from-gray-400 to-gray-600',
    description: 'Chrome and metallic finishes'
  },
  {
    id: 'surface',
    name: 'Surface',
    icon: Star,
    color: 'bg-gradient-to-r from-yellow-400 to-orange-500',
    description: 'Surface textures and patterns'
  },
  {
    id: 'vintage',
    name: 'Vintage',
    icon: Zap,
    color: 'bg-gradient-to-r from-amber-500 to-orange-600',
    description: 'Aged and weathered effects'
  }
];
