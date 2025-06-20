
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Image, 
  Loader2, 
  CheckCircle2, 
  X
} from 'lucide-react';

export interface BatchProcessingItemData {
  id: string;
  file: File;
  preview: string;
  status: 'pending' | 'processing' | 'complete' | 'error';
  processedUrl?: string;
  error?: string;
}

interface BatchProcessingItemProps {
  item: BatchProcessingItemData;
  onRemove: (id: string) => void;
  isProcessing: boolean;
}

export const BatchProcessingItem: React.FC<BatchProcessingItemProps> = ({
  item,
  onRemove,
  isProcessing
}) => {
  const getStatusIcon = (status: BatchProcessingItemData['status']) => {
    switch (status) {
      case 'pending':
        return <Image className="w-4 h-4 text-crd-lightGray" />;
      case 'processing':
        return <Loader2 className="w-4 h-4 text-crd-green animate-spin" />;
      case 'complete':
        return <CheckCircle2 className="w-4 h-4 text-crd-green" />;
      case 'error':
        return <X className="w-4 h-4 text-red-400" />;
    }
  };

  return (
    <div className="flex items-center gap-3 p-2 bg-editor-dark rounded border border-editor-border">
      <img 
        src={item.preview}
        alt={item.file.name}
        className="w-8 h-8 object-cover rounded"
      />
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm truncate">{item.file.name}</p>
        <p className="text-crd-lightGray text-xs">
          {(item.file.size / 1024 / 1024).toFixed(1)} MB
        </p>
      </div>
      <div className="flex items-center gap-2">
        {getStatusIcon(item.status)}
        {item.status === 'pending' && !isProcessing && (
          <Button
            onClick={() => onRemove(item.id)}
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
          >
            <X className="w-3 h-3" />
          </Button>
        )}
      </div>
    </div>
  );
};
