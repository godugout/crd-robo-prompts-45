
import React, { useState } from 'react';
import { Copy, Palette, Shuffle, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface MobileCreateCardPanelProps {
  isVisible: boolean;
  onClose: () => void;
  card: any;
  onCreateVariation: (variationType: string) => void;
}

export const MobileCreateCardPanel: React.FC<MobileCreateCardPanelProps> = ({
  isVisible,
  onClose,
  card,
  onCreateVariation
}) => {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateVariation = async (type: string) => {
    setIsCreating(true);
    try {
      await onCreateVariation(type);
      toast({
        title: "Card variation created!",
        description: "New card saved to your drafts collection."
      });
    } catch (error) {
      toast({
        title: "Error creating variation",
        description: "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-80">
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-95 backdrop-blur border-t border-white/10 rounded-t-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-white font-semibold text-lg">Create Card Variation</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5 text-white" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          <p className="text-gray-300 text-sm">
            Create new card variations based on the current card design and effects.
          </p>

          {/* Variation Options */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="ghost"
              onClick={() => handleCreateVariation('exact-copy')}
              disabled={isCreating}
              className="flex flex-col items-center justify-center h-24 bg-white bg-opacity-10 hover:bg-opacity-20 text-white rounded-xl"
            >
              <Copy className="w-6 h-6 mb-2" />
              <span className="text-sm">Exact Copy</span>
            </Button>

            <Button
              variant="ghost"
              onClick={() => handleCreateVariation('color-variant')}
              disabled={isCreating}
              className="flex flex-col items-center justify-center h-24 bg-white bg-opacity-10 hover:bg-opacity-20 text-white rounded-xl"
            >
              <Palette className="w-6 h-6 mb-2" />
              <span className="text-sm">Color Variant</span>
            </Button>

            <Button
              variant="ghost"
              onClick={() => handleCreateVariation('style-remix')}
              disabled={isCreating}
              className="flex flex-col items-center justify-center h-24 bg-white bg-opacity-10 hover:bg-opacity-20 text-white rounded-xl"
            >
              <Shuffle className="w-6 h-6 mb-2" />
              <span className="text-sm">Style Remix</span>
            </Button>

            <Button
              variant="ghost"
              onClick={() => handleCreateVariation('enhanced')}
              disabled={isCreating}
              className="flex flex-col items-center justify-center h-24 bg-white bg-opacity-10 hover:bg-opacity-20 text-white rounded-xl"
            >
              <Save className="w-6 h-6 mb-2" />
              <span className="text-sm">Enhanced</span>
            </Button>
          </div>

          {/* Description */}
          <div className="text-xs text-gray-400 space-y-1">
            <p><strong>Exact Copy:</strong> Create identical duplicate</p>
            <p><strong>Color Variant:</strong> Same design, different colors</p>
            <p><strong>Style Remix:</strong> New effects with similar theme</p>
            <p><strong>Enhanced:</strong> Upgraded version with premium effects</p>
          </div>
        </div>
      </div>
    </div>
  );
};
