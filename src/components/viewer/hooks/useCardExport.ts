
import { useCallback, useState } from 'react';
import html2canvas from 'html2canvas';
// @ts-ignore
import GIF from 'gif.js';
import { toast } from 'sonner';
import type { CardData } from '@/hooks/useCardEditor';
import type { EffectValues } from './useEnhancedCardEffects';

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

interface UseCardExportProps {
  cardRef: React.RefObject<HTMLDivElement>;
  card: CardData;
  onRotationChange: (rotation: { x: number; y: number }) => void;
  onEffectChange: (effectId: string, parameterId: string, value: number | boolean | string) => void;
  effectValues: EffectValues;
}

export const useCardExport = ({
  cardRef,
  card,
  onRotationChange,
  onEffectChange,
  effectValues
}: UseCardExportProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const captureFrame = useCallback(async (options: ExportOptions): Promise<string> => {
    if (!cardRef.current) throw new Error('Card element not found');

    const canvas = await html2canvas(cardRef.current, {
      scale: options.resolution,
      backgroundColor: options.background === 'transparent' ? null : 
                      options.background === 'solid' ? '#000000' : undefined,
      useCORS: true,
      allowTaint: true,
      removeContainer: true
    });

    return canvas.toDataURL(
      options.format === 'jpg' ? 'image/jpeg' : 'image/png',
      options.quality || 0.9
    );
  }, [cardRef]);

  const exportStaticImage = useCallback(async (options: ExportOptions) => {
    try {
      setIsExporting(true);
      setExportProgress(50);

      const dataUrl = await captureFrame(options);
      
      // Create download link
      const link = document.createElement('a');
      link.download = `${card.title.replace(/\s+/g, '_')}_card.${options.format}`;
      link.href = dataUrl;
      link.click();

      setExportProgress(100);
      toast.success(`Card exported as ${options.format.toUpperCase()}`);
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export card');
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  }, [captureFrame, card.title]);

  const exportAnimatedGif = useCallback(async (options: ExportOptions) => {
    if (!options.animation) return;

    try {
      setIsExporting(true);
      setExportProgress(0);

      const gif = new GIF({
        workers: 2,
        quality: 10,
        width: 400 * options.resolution,
        height: 560 * options.resolution,
        workerScript: '/gif.worker.js'
      });

      const totalFrames = Math.floor(options.animation.duration * options.animation.frameRate);
      const rotationStep = 360 / totalFrames;
      
      // Preset effect combinations for cycling
      const effectPresets = [
        { holographic: { intensity: 85 } },
        { chrome: { intensity: 90 } },
        { crystal: { intensity: 80 } },
        { interference: { intensity: 75 } },
        { foilspray: { intensity: 70 } }
      ];

      for (let frame = 0; frame < totalFrames; frame++) {
        const progress = frame / totalFrames;
        setExportProgress(Math.round(progress * 80)); // Reserve 20% for GIF encoding

        // Rotation
        const rotationY = frame * rotationStep;
        onRotationChange({ x: 0, y: rotationY });

        // Effect cycling
        if (options.animation.effectCycling && frame % 15 === 0) {
          const presetIndex = Math.floor((frame / 15) % effectPresets.length);
          const preset = effectPresets[presetIndex];
          Object.entries(preset).forEach(([effectId, params]) => {
            Object.entries(params).forEach(([paramId, value]) => {
              onEffectChange(effectId, paramId, value);
            });
          });
        }

        // Small delay to let effects render
        await new Promise(resolve => setTimeout(resolve, 50));

        // Capture frame
        const canvas = await html2canvas(cardRef.current!, {
          scale: options.resolution,
          backgroundColor: options.background === 'transparent' ? null : '#000000',
          useCORS: true,
          allowTaint: true
        });

        gif.addFrame(canvas, { delay: 1000 / options.animation.frameRate });
      }

      // Reset rotation and effects
      onRotationChange({ x: 0, y: 0 });
      
      setExportProgress(85);

      gif.on('finished', (blob: Blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `${card.title.replace(/\s+/g, '_')}_animated.gif`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);

        setExportProgress(100);
        toast.success('Animated GIF exported successfully');
        setIsExporting(false);
        setExportProgress(0);
      });

      gif.on('progress', (progress: number) => {
        setExportProgress(85 + Math.round(progress * 15));
      });

      gif.render();
    } catch (error) {
      console.error('Animated export failed:', error);
      toast.error('Failed to export animated GIF');
      setIsExporting(false);
      setExportProgress(0);
    }
  }, [cardRef, card.title, onRotationChange, onEffectChange]);

  const exportCard = useCallback(async (options: ExportOptions) => {
    if (options.format === 'gif') {
      await exportAnimatedGif(options);
    } else {
      await exportStaticImage(options);
    }
  }, [exportStaticImage, exportAnimatedGif]);

  return {
    exportCard,
    isExporting,
    exportProgress
  };
};
