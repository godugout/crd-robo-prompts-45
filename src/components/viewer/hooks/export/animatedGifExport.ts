
// @ts-ignore
import GIF from 'gif.js';
import html2canvas from 'html2canvas';
import { toast } from 'sonner';
import type { ExportOptions } from './types';

const EFFECT_PRESETS = [
  { holographic: { intensity: 85 } },
  { chrome: { intensity: 90 } },
  { crystal: { intensity: 80 } },
  { interference: { intensity: 75 } },
  { foilspray: { intensity: 70 } }
];

export const exportAnimatedGif = async (
  cardRef: React.RefObject<HTMLDivElement>,
  cardTitle: string,
  options: ExportOptions,
  onRotationChange: (rotation: { x: number; y: number }) => void,
  onEffectChange: (effectId: string, parameterId: string, value: number | boolean | string) => void,
  setExportProgress: (progress: number) => void
): Promise<void> => {
  if (!options.animation) return;

  let gif: any = null;
  let renderTimeout: NodeJS.Timeout | null = null;

  try {
    // Create GIF with improved settings
    gif = new GIF({
      workers: 2,
      quality: 10,
      width: 600 * options.resolution,
      height: 800 * options.resolution,
      workerScript: '/gif.worker.js',
      debug: false
    });

    const totalFrames = Math.floor(options.animation.duration * options.animation.frameRate);
    const rotationStep = 360 / totalFrames;

    console.log(`Starting GIF capture: ${totalFrames} frames`);

    // Capture frames
    for (let frame = 0; frame < totalFrames; frame++) {
      const progress = frame / totalFrames;
      setExportProgress(Math.round(progress * 80)); // Reserve 20% for GIF encoding

      // Rotation
      const rotationY = frame * rotationStep;
      onRotationChange({ x: 0, y: rotationY });

      // Effect cycling
      if (options.animation.effectCycling && frame % 15 === 0) {
        const presetIndex = Math.floor((frame / 15) % EFFECT_PRESETS.length);
        const preset = EFFECT_PRESETS[presetIndex];
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
    link.download = `${cardTitle.replace(/\s+/g, '_')}_animated.gif`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);

    setExportProgress(100);
    toast.success('Animated GIF exported successfully');

  } finally {
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
  }
};
