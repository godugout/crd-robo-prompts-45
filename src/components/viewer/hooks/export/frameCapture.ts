
import html2canvas from 'html2canvas';
import type { ExportOptions } from './types';

export const captureFrame = async (
  cardRef: React.RefObject<HTMLDivElement>,
  options: ExportOptions
): Promise<string> => {
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
    width: 600 * options.resolution,
    height: 800 * options.resolution,
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
};
