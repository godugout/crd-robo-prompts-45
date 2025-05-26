
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Eye } from 'lucide-react';
import { toast } from 'sonner';

interface QuickTextEditProps {
  onTextUpdate: (field: string, value: string) => void;
  onSwitchToPreview: () => void;
}

export const QuickTextEdit = ({ onTextUpdate, onSwitchToPreview }: QuickTextEditProps) => {
  const [cardText, setCardText] = useState({
    title: 'Card Title',
    subtitle: 'Subtitle text',
    description: 'Card description goes here...'
  });

  const handleTextUpdate = (field: keyof typeof cardText, value: string) => {
    setCardText(prev => ({
      ...prev,
      [field]: value
    }));
    onTextUpdate(field, value);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-white font-medium text-sm uppercase tracking-wide">Quick Text Edit</h4>
        <Button
          variant="outline"
          size="sm"
          onClick={onSwitchToPreview}
          className="border-crd-green text-crd-green hover:bg-crd-green hover:text-black"
        >
          <Eye className="w-4 h-4 mr-1" />
          Preview Mode
        </Button>
      </div>
      
      <div className="space-y-3">
        <div>
          <label className="text-white text-sm font-medium">Card Title</label>
          <Input
            value={cardText.title}
            onChange={(e) => handleTextUpdate('title', e.target.value)}
            className="mt-1 bg-editor-dark border-editor-border text-white"
            placeholder="Enter card title..."
          />
        </div>
        
        <div>
          <label className="text-white text-sm font-medium">Subtitle</label>
          <Input
            value={cardText.subtitle}
            onChange={(e) => handleTextUpdate('subtitle', e.target.value)}
            className="mt-1 bg-editor-dark border-editor-border text-white"
            placeholder="Enter subtitle..."
          />
        </div>
        
        <div>
          <label className="text-white text-sm font-medium">Description</label>
          <Textarea
            value={cardText.description}
            onChange={(e) => handleTextUpdate('description', e.target.value)}
            className="mt-1 bg-editor-dark border-editor-border text-white resize-none"
            placeholder="Enter card description..."
            rows={3}
          />
        </div>
      </div>

      <div className="p-3 bg-crd-green/10 border border-crd-green/30 rounded-lg">
        <p className="text-crd-green text-xs">
          💡 Tip: Use Preview Mode to edit text directly on the card for real-time visual feedback!
        </p>
      </div>
    </div>
  );
};
