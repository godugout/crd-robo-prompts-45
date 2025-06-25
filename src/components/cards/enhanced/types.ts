
export type Step = 'frameAndImage' | 'customize' | 'polish' | 'preview';

export interface EnhancedCardCreatorProps {
  initialImage?: string;
  initialTitle?: string;
  theme?: string;
  primaryColor?: string;
  mode?: 'full' | 'embedded' | 'compact';
}
