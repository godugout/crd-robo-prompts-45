
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, BarChart3, Eye } from 'lucide-react';
import { DetectedCardsReview } from '@/components/catalog/DetectedCardsReview';
import { SmartCardGrid } from '@/components/catalog/SmartCardGrid';
import { CardsUploadFeature } from './CardsUploadFeature';
import { DetectedCard } from '@/services/cardCatalog/types';

interface CardsMainContentProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  showReview: boolean;
  totalCards: number;
  detectedCardsArray: DetectedCard[];
  selectedCards: Set<string>;
  onCardToggle: (cardId: string) => void;
  onCardEdit: (cardId: string, bounds: DetectedCard['bounds']) => void;
  onCreateSelected: () => void;
  onClearAll: () => void;
  onUploadComplete: (count: number) => void;
  onCardCreate: (card: DetectedCard) => void;
}

export const CardsMainContent: React.FC<CardsMainContentProps> = ({
  activeTab,
  onTabChange,
  showReview,
  totalCards,
  detectedCardsArray,
  selectedCards,
  onCardToggle,
  onCardEdit,
  onCreateSelected,
  onClearAll,
  onUploadComplete,
  onCardCreate
}) => {
  const handleCardEditForGrid = (card: DetectedCard) => {
    // TODO: Open card editor/viewer modal for grid view
    console.log('Card editor coming soon for grid view!', card);
  };

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="bg-[#1A1A1A] p-1 rounded-md mb-8">
        <TabsTrigger 
          value="upload" 
          className={`px-6 py-3 ${activeTab === 'upload' ? 'bg-[#3772FF] text-white' : 'text-[#777E90]'}`}
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Smart Upload
        </TabsTrigger>
        {showReview && (
          <TabsTrigger 
            value="review" 
            className={`px-6 py-3 ${activeTab === 'review' ? 'bg-[#3772FF] text-white' : 'text-[#777E90]'}`}
          >
            <Eye className="w-4 h-4 mr-2" />
            Review ({totalCards})
          </TabsTrigger>
        )}
        <TabsTrigger 
          value="catalog" 
          className={`px-6 py-3 ${activeTab === 'catalog' ? 'bg-[#3772FF] text-white' : 'text-[#777E90]'}`}
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          Card Catalog
        </TabsTrigger>
      </TabsList>

      <TabsContent value="upload" className="mt-0">
        <CardsUploadFeature onUploadComplete={onUploadComplete} />
      </TabsContent>

      <TabsContent value="review" className="mt-0">
        {showReview && (
          <DetectedCardsReview
            detectedCards={detectedCardsArray}
            selectedCards={selectedCards}
            onCardToggle={onCardToggle}
            onCardEdit={onCardEdit}
            onCreateSelected={onCreateSelected}
            onClearAll={onClearAll}
          />
        )}
      </TabsContent>

      <TabsContent value="catalog" className="mt-0">
        <SmartCardGrid 
          onCardEdit={handleCardEditForGrid}
          onCardCreate={onCardCreate}
        />
      </TabsContent>
    </Tabs>
  );
};
