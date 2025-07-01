
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dice6, Loader2, Sparkles } from 'lucide-react';
import { useCardGeneration } from '@/hooks/useCardGeneration';
import { toast } from 'sonner';

export const CardGenerator = () => {
  const { generateCards, isGenerating, generatedCards } = useCardGeneration();

  const handleGenerate = async () => {
    await generateCards(101);
  };

  const handleQuickGenerate = async (count: number) => {
    await generateCards(count);
  };

  return (
    <Card className="p-6 bg-editor-dark border-editor-border">
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-crd-green" />
          <h3 className="text-white text-lg font-semibold">Card Generator</h3>
        </div>
        
        <p className="text-crd-lightGray text-sm mb-4">
          Generate random CRDs based on sports card designs with player stats, team info, and custom styling.
        </p>

        <div className="space-y-3">
          <div className="flex gap-2">
            <Button
              onClick={() => handleQuickGenerate(10)}
              variant="outline"
              size="sm"
              disabled={isGenerating}
              className="bg-editor-tool border-editor-border text-white hover:bg-editor-border"
            >
              <Dice6 className="w-4 h-4 mr-2" />
              Generate 10
            </Button>
            
            <Button
              onClick={() => handleQuickGenerate(25)}
              variant="outline"
              size="sm"
              disabled={isGenerating}
              className="bg-editor-tool border-editor-border text-white hover:bg-editor-border"
            >
              <Dice6 className="w-4 h-4 mr-2" />
              Generate 25
            </Button>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full bg-crd-green hover:bg-crd-green/90 text-white"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Cards...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate 101 CRDs
              </>
            )}
          </Button>
        </div>

        {generatedCards.length > 0 && (
          <div className="mt-4 p-3 bg-editor-darker rounded-lg">
            <p className="text-crd-green text-sm font-medium">
              ✅ Generated {generatedCards.length} cards successfully!
            </p>
            <p className="text-crd-lightGray text-xs mt-1">
              Visit the Cards page to view your generated collection.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
