
import { useCallback, useEffect } from 'react';
import { toast } from 'sonner';

interface UseClipboardPasteProps {
  onFilesAdded: (files: File[]) => void;
}

export const useClipboardPaste = ({ onFilesAdded }: UseClipboardPasteProps) => {
  const handlePaste = useCallback(async (e: ClipboardEvent) => {
    e.preventDefault();
    
    const items = e.clipboardData?.items;
    if (!items) return;

    const imageFiles: File[] = [];
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          const namedFile = new File([file], `pasted-image-${Date.now()}-${i}.png`, {
            type: file.type
          });
          imageFiles.push(namedFile);
        }
      }
    }

    if (imageFiles.length > 0) {
      onFilesAdded(imageFiles);
      toast.success(`Pasted ${imageFiles.length} image${imageFiles.length > 1 ? 's' : ''} from clipboard`);
    } else {
      toast.warning('No images found in clipboard');
    }
  }, [onFilesAdded]);

  useEffect(() => {
    document.addEventListener('paste', handlePaste);
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, [handlePaste]);

  return { handlePaste };
};
