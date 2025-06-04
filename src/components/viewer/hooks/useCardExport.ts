
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import type { CardData } from '@/hooks/useCardEditor';
import type { EffectValues } from './useEnhancedCardEffects';

export interface UseCardExportProps {
  cardRef: React.RefObject<HTMLDivElement>;
  card: CardData;
  onRotationChange: (rotation: { x: number; y: number }) => void;
  onEffectChange: (effectId: string, parameterId: string, value: number | boolean | string) => void;
  effectValues: EffectValues;
}

export const useCardExport = ({ cardRef, card, onRotationChange, onEffectChange, effectValues }: UseCardExportProps) => {
  const [isExporting, setIsExporting] = useState(false);

  const exportCard = useCallback(async (format: 'png' | 'jpg', quality: number = 0.9) => {
    if (!cardRef.current) {
      toast.error('Card element not found');
      return;
    }

    setIsExporting(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });

      canvas.toBlob((blob) => {
        if (!blob) {
          toast.error('Failed to generate image');
          return;
        }

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${card.title.replace(/\s+/g, '_')}_card.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, `image/${format}`, quality);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export card');
    } finally {
      setIsExporting(false);
    }
  }, [cardRef, card]);

  return { exportCard, isExporting };
};
