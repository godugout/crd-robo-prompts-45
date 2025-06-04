
import { toast } from 'sonner';
import { captureFrame } from './frameCapture';
import type { ExportOptions } from './types';

export const exportStaticImage = async (
  cardRef: React.RefObject<HTMLDivElement>,
  cardTitle: string,
  options: ExportOptions,
  setExportProgress: (progress: number) => void
): Promise<void> => {
  setExportProgress(50);

  const dataUrl = await captureFrame(cardRef, options);
  
  // Create download link
  const link = document.createElement('a');
  link.download = `${cardTitle.replace(/\s+/g, '_')}_card.${options.format}`;
  link.href = dataUrl;
  link.click();

  setExportProgress(100);
  toast.success(`Card exported as ${options.format.toUpperCase()}`);
};
