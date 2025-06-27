
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkles, Home, Plus } from 'lucide-react';
import { UnifiedCardRenderer } from './UnifiedCardRenderer';
import { CardExportModal } from './CardExportModal';
import type { UnifiedCardData } from '@/types/cardCreation';

interface CardExportProps {
  cardData: UnifiedCardData;
  uploadedImage: string;
  onCreateAnother: () => void;
}

export const CardExport: React.FC<CardExportProps> = ({
  cardData,
  uploadedImage,
  onCreateAnother
}) => {
  const [showExportModal, setShowExportModal] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-crd-green rounded-full flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-black" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Card Created Successfully!</h2>
        <p className="text-gray-400">Your card has been saved to your collection</p>
      </div>

      {/* Card Preview */}
      <div className="flex justify-center">
        <UnifiedCardRenderer
          cardData={cardData}
          imageUrl={uploadedImage}
          width={300}
          height={420}
          mode="3d"
          className="shadow-2xl"
        />
      </div>

      {/* Export Options */}
      <Card className="p-6 bg-gray-800/50 border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4 text-center">What's Next?</h3>
        <div className="flex gap-4 justify-center flex-wrap">
          <Button
            onClick={() => setShowExportModal(true)}
            className="bg-crd-green hover:bg-crd-green/90 text-black font-semibold"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Export & Share
          </Button>
          <Button
            onClick={onCreateAnother}
            variant="outline"
            className="border-crd-green text-crd-green hover:bg-crd-green/10"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Another
          </Button>
          <Button
            onClick={() => window.location.href = '/'}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </Button>
        </div>
      </Card>

      <CardExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        cardData={{
          title: cardData.title,
          description: cardData.description,
          imageUrl: uploadedImage,
          frameId: cardData.frame
        }}
      />
    </div>
  );
};
