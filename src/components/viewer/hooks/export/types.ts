
import type { CardData } from '@/hooks/useCardEditor';
import type { EffectValues } from '../useEnhancedCardEffects';

export interface ExportOptions {
  format: 'png' | 'jpg' | 'gif';
  resolution: 1 | 2 | 4;
  animation?: {
    duration: 2 | 4 | 6;
    effectCycling: boolean;
    lightingChanges: boolean;
    frameRate: 15 | 30 | 60;
  };
  background: 'transparent' | 'scene' | 'solid';
  quality?: number; // 0.1 to 1.0 for JPG
}

export interface UseCardExportProps {
  cardRef: React.RefObject<HTMLDivElement>;
  card: CardData;
  onRotationChange: (rotation: { x: number; y: number }) => void;
  onEffectChange: (effectId: string, parameterId: string, value: number | boolean | string) => void;
  effectValues: EffectValues;
}

export interface ExportHookReturn {
  exportCard: (options: ExportOptions) => Promise<void>;
  isExporting: boolean;
  exportProgress: number;
}
