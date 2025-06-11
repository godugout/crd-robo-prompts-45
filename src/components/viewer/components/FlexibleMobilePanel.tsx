
import React from 'react';
import { FlexiblePanel, FlexiblePanelTab } from '@/components/ui/flexible-panel';
import { DetailsTabContent } from './DetailsTabContent';
import { StudioTabContent } from './StudioTabContent';
import { Info, Settings } from 'lucide-react';
import type { CardData } from '@/types/card';
import type { EffectValues } from '../hooks/useEffectValues';

interface FlexibleMobilePanelProps {
  card: CardData;
  cardDetails?: {
    id: string;
    title: string;
    description?: string;
    rarity: string;
    creator_name?: string;
    creator_verified?: boolean;
    price?: string;
    created_at: string;
    tags?: string[];
    view_count?: number;
    like_count?: number;
  };
  effectValues: EffectValues;
  onEffectChange: (effectId: string, parameterId: string, value: number | boolean | string) => void;
  onResetAllEffects: () => void;
  overallBrightness: number[];
  onBrightnessChange: (value: number[]) => void;
  interactiveLighting: boolean;
  onInteractiveLightingToggle: () => void;
  materialSettings: {
    metalness: number;
    roughness: number;
    clearcoat: number;
    transmission: number;
    reflectivity: number;
  };
  onMaterialSettingsChange: (settings: any) => void;
  onLike?: () => void;
  onBookmark?: () => void;
  onShare?: () => void;
  onDownload?: () => void;
}

export const FlexibleMobilePanel: React.FC<FlexibleMobilePanelProps> = ({
  card,
  cardDetails,
  effectValues,
  onEffectChange,
  onResetAllEffects,
  overallBrightness,
  onBrightnessChange,
  interactiveLighting,
  onInteractiveLightingToggle,
  materialSettings,
  onMaterialSettingsChange,
  onLike,
  onBookmark,
  onShare,
  onDownload
}) => {
  const tabs: FlexiblePanelTab[] = [
    {
      id: 'details',
      label: 'Details',
      icon: <Info className="w-4 h-4" />,
      content: (
        <DetailsTabContent
          card={card}
          cardDetails={cardDetails}
          onLike={onLike}
          onBookmark={onBookmark}
          onShare={onShare}
          onDownload={onDownload}
        />
      )
    },
    {
      id: 'studio',
      label: 'Studio',
      icon: <Settings className="w-4 h-4" />,
      content: (
        <StudioTabContent
          effectValues={effectValues}
          onEffectChange={onEffectChange}
          onResetAllEffects={onResetAllEffects}
          overallBrightness={overallBrightness}
          onBrightnessChange={onBrightnessChange}
          interactiveLighting={interactiveLighting}
          onInteractiveLightingToggle={onInteractiveLightingToggle}
          materialSettings={materialSettings}
          onMaterialSettingsChange={onMaterialSettingsChange}
        />
      )
    }
  ];

  return (
    <FlexiblePanel
      tabs={tabs}
      defaultTab="details"
      className="h-full bg-black/40 backdrop-blur-md border-l border-white/10"
    />
  );
};
