
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { exportStaticImage } from './export/staticImageExport';
import { exportAnimatedGif } from './export/animatedGifExport';
import type { UseCardExportProps, ExportOptions, ExportHookReturn } from './export/types';

export const useCardExport = ({
  cardRef,
  card,
  onRotationChange,
  onEffectChange,
  effectValues
}: UseCardExportProps): ExportHookReturn => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const exportCard = useCallback(async (options: ExportOptions) => {
    try {
      setIsExporting(true);
      setExportProgress(0);

      if (options.format === 'gif') {
        await exportAnimatedGif(
          cardRef,
          card.title,
          options,
          onRotationChange,
          onEffectChange,
          setExportProgress
        );
      } else {
        await exportStaticImage(
          cardRef,
          card.title,
          options,
          setExportProgress
        );
      }
    } catch (error) {
      console.error('Export failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(`Failed to export: ${errorMessage}`);
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  }, [cardRef, card.title, onRotationChange, onEffectChange]);

  return {
    exportCard,
    isExporting,
    exportProgress
  };
};

// Re-export types for convenience
export type { ExportOptions, UseCardExportProps, ExportHookReturn } from './export/types';
