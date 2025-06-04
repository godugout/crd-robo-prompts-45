
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

    // Ensure we capture the full card area with padding for effects
    const canvas = await html2canvas(cardRef.current, {
      scale: options.resolution,
      backgroundColor: options.background === 'transparent' ? null : 
                      options.background === 'solid' ? '#000000' : undefined,
      useCORS: true,
      allowTaint: true,
      removeContainer: false,
      // Increase capture area to include full card with effects
      width: 600 * options.resolution, // Increased from default
      height: 800 * options.resolution, // Increased from default
      x: 0,
      y: 0,
      scrollX: 0,
      scrollY: 0,
      // Ensure we capture transformations
      foreignObjectRendering: true,
      imageTimeout: 0,
      logging: false
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

    let gif: any = null;
    let renderTimeout: NodeJS.Timeout | null = null;

    try {
      setIsExporting(true);
      setExportProgress(0);

      // Create GIF with improved settings
      gif = new GIF({
        workers: 2,
        quality: 10,
        width: 600 * options.resolution,
        height: 800 * options.resolution,
        workerScript: '/gif.worker.js',
        debug: false // Disable debug to prevent console spam
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

      console.log(`Starting GIF capture: ${totalFrames} frames`);

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

        try {
          // Capture frame with error handling
          const canvas = await html2canvas(cardRef.current!, {
            scale: options.resolution,
            backgroundColor: options.background === 'transparent' ? null : '#000000',
            useCORS: true,
            allowTaint: true,
            width: 600 * options.resolution,
            height: 800 * options.resolution,
            foreignObjectRendering: true,
            logging: false,
            imageTimeout: 0
          });

          gif.addFrame(canvas, { delay: 1000 / options.animation.frameRate });
          console.log(`Frame ${frame + 1}/${totalFrames} captured`);
        } catch (frameError) {
          console.error(`Failed to capture frame ${frame}:`, frameError);
          // Continue with next frame instead of failing completely
        }
      }

      // Reset rotation and effects
      onRotationChange({ x: 0, y: 0 });
      
      setExportProgress(85);
      console.log('Starting GIF render...');

      // Create a promise that resolves when GIF is finished or times out
      const renderPromise = new Promise<Blob>((resolve, reject) => {
        let hasFinished = false;

        // Set up success handler
        gif.on('finished', (blob: Blob) => {
          if (hasFinished) return;
          hasFinished = true;
          
          if (renderTimeout) {
            clearTimeout(renderTimeout);
            renderTimeout = null;
          }
          
          console.log('GIF render completed successfully');
          resolve(blob);
        });

        // Set up progress handler
        gif.on('progress', (progress: number) => {
          if (hasFinished) return;
          const progressPercent = 85 + Math.round(progress * 15);
          setExportProgress(progressPercent);
          console.log(`GIF render progress: ${Math.round(progress * 100)}%`);
        });

        // Set up error handler
        gif.on('abort', () => {
          if (hasFinished) return;
          hasFinished = true;
          
          if (renderTimeout) {
            clearTimeout(renderTimeout);
            renderTimeout = null;
          }
          
          console.error('GIF render was aborted');
          reject(new Error('GIF rendering was aborted'));
        });

        // Set up timeout (30 seconds max)
        renderTimeout = setTimeout(() => {
          if (hasFinished) return;
          hasFinished = true;
          
          console.error('GIF render timed out');
          
          // Try to abort the gif if possible
          try {
            if (gif && typeof gif.abort === 'function') {
              gif.abort();
            }
          } catch (e) {
            console.warn('Could not abort GIF render:', e);
          }
          
          reject(new Error('GIF rendering timed out after 30 seconds'));
        }, 30000);

        // Start the render
        try {
          gif.render();
        } catch (renderError) {
          if (hasFinished) return;
          hasFinished = true;
          
          if (renderTimeout) {
            clearTimeout(renderTimeout);
            renderTimeout = null;
          }
          
          console.error('Failed to start GIF render:', renderError);
          reject(renderError);
        }
      });

      // Wait for the GIF to be completed or timeout
      const blob = await renderPromise;

      // Download the GIF
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `${card.title.replace(/\s+/g, '_')}_animated.gif`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);

      setExportProgress(100);
      toast.success('Animated GIF exported successfully');

    } catch (error) {
      console.error('Animated export failed:', error);
      
      // Clean up timeout if it exists
      if (renderTimeout) {
        clearTimeout(renderTimeout);
        renderTimeout = null;
      }
      
      // Try to abort the gif if it exists
      if (gif && typeof gif.abort === 'function') {
        try {
          gif.abort();
        } catch (abortError) {
          console.warn('Could not abort GIF render:', abortError);
        }
      }
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(`Failed to export animated GIF: ${errorMessage}`);
    } finally {
      setIsExporting(false);
      setExportProgress(0);
      
      // Final cleanup
      if (renderTimeout) {
        clearTimeout(renderTimeout);
      }
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
