
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Sparkles, BarChart3, Eye } from 'lucide-react';
import { BulkCardUploader } from '@/components/catalog/BulkCardUploader';
import { SmartCardGrid } from '@/components/catalog/SmartCardGrid';
import { DetectedCardsReview } from '@/components/catalog/DetectedCardsReview';
import { useCardCatalog } from '@/hooks/useCardCatalog';
import { DetectedCard } from '@/services/cardCatalog/CardDetectionService';
import { toast } from 'sonner';

export const CardsPage = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const { 
    detectedCards, 
    selectedCards, 
    processingStatus, 
    showReview,
    toggleCardSelection,
    createSelectedCards,
    clearDetectedCards,
    editCardBounds
  } = useCardCatalog();
  
  const totalCards = detectedCards.size;
  const detectedCardsArray = Array.from(detectedCards.values()) as DetectedCard[];
  const averageConfidence = totalCards > 0 
    ? detectedCardsArray.reduce((sum, card) => sum + (card.confidence || 0), 0) / totalCards 
    : 0;

  const handleCardEdit = (card: DetectedCard) => {
    // TODO: Open card editor/viewer modal
    toast.info('Card viewer coming soon!');
  };

  const handleCardCreate = (card: DetectedCard) => {
    // TODO: Navigate to card creator with pre-filled data
    toast.success('Creating card from detection...');
    // This would typically navigate to the card editor with the detected card data
  };

  const handleUploadComplete = (count: number) => {
    toast.success(`Successfully processed ${count} images!`);
  };

  const handleReviewComplete = () => {
    createSelectedCards();
    setActiveTab('catalog');
  };

  return (
    <div className="min-h-screen bg-crd-darkest pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Card Catalog Manager</h1>
            <p className="text-crd-lightGray">
              AI-powered card detection and collection management
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setActiveTab('upload')}
              className="bg-crd-green hover:bg-crd-green/80 text-black"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Cards
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        {totalCards > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-editor-dark border-editor-border">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-crd-green">{totalCards}</div>
                <div className="text-xs text-crd-lightGray">Total Cards Detected</div>
              </CardContent>
            </Card>
            <Card className="bg-editor-dark border-editor-border">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-400">{selectedCards.size}</div>
                <div className="text-xs text-crd-lightGray">Cards Selected</div>
              </CardContent>
            </Card>
            <Card className="bg-editor-dark border-editor-border">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-400">{Math.round(averageConfidence * 100)}%</div>
                <div className="text-xs text-crd-lightGray">Avg. Confidence</div>
              </CardContent>
            </Card>
            <Card className="bg-editor-dark border-editor-border">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-400">{processingStatus.completed}</div>
                <div className="text-xs text-crd-lightGray">Processed</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Review Alert */}
        {showReview && (
          <Card className="bg-blue-600/20 border-blue-500 mb-8">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-blue-400" />
                  <div>
                    <h3 className="text-white font-medium">
                      {totalCards} cards detected and ready for review
                    </h3>
                    <p className="text-blue-200 text-sm">
                      Review the detected cards below, make any adjustments, and create your digital cards
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => setActiveTab('review')}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Review Cards
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Detection Review */}
        {showReview && activeTab === 'upload' && (
          <div className="mb-8">
            <DetectedCardsReview
              detectedCards={detectedCardsArray}
              selectedCards={selectedCards}
              onCardToggle={toggleCardSelection}
              onCardEdit={editCardBounds}
              onCreateSelected={handleReviewComplete}
              onClearAll={clearDetectedCards}
            />
          </div>
        )}

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
            <div className="space-y-8">
              {/* Feature Overview */}
              <Card className="bg-editor-dark border-editor-border">
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 rounded-full bg-crd-green/20 flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-10 h-10 text-crd-green" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      AI-Powered Card Detection
                    </h2>
                    <p className="text-crd-lightGray max-w-2xl mx-auto">
                      Upload multiple images and let our advanced AI automatically detect, crop, and enhance 
                      individual trading cards. Perfect for digitizing entire collections quickly.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4">
                      <div className="w-12 h-12 rounded-full bg-blue-600/20 flex items-center justify-center mx-auto mb-3">
                        <Sparkles className="w-6 h-6 text-blue-400" />
                      </div>
                      <h3 className="text-white font-medium mb-2">Multi-Card Detection</h3>
                      <p className="text-crd-lightGray text-sm">
                        Automatically detect multiple cards in a single photo with precise boundary detection.
                      </p>
                    </div>
                    
                    <div className="text-center p-4">
                      <div className="w-12 h-12 rounded-full bg-green-600/20 flex items-center justify-center mx-auto mb-3">
                        <Sparkles className="w-6 h-6 text-green-400" />
                      </div>
                      <h3 className="text-white font-medium mb-2">Smart Enhancement</h3>
                      <p className="text-crd-lightGray text-sm">
                        AI-powered perspective correction, background removal, and image enhancement.
                      </p>
                    </div>
                    
                    <div className="text-center p-4">
                      <div className="w-12 h-12 rounded-full bg-purple-600/20 flex items-center justify-center mx-auto mb-3">
                        <Sparkles className="w-6 h-6 text-purple-400" />
                      </div>
                      <h3 className="text-white font-medium mb-2">Batch Processing</h3>
                      <p className="text-crd-lightGray text-sm">
                        Process hundreds of images at once with intelligent queuing and progress tracking.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Upload Component */}
              <BulkCardUploader onUploadComplete={handleUploadComplete} />
            </div>
          </TabsContent>

          <TabsContent value="review" className="mt-0">
            {showReview && (
              <DetectedCardsReview
                detectedCards={detectedCardsArray}
                selectedCards={selectedCards}
                onCardToggle={toggleCardSelection}
                onCardEdit={editCardBounds}
                onCreateSelected={handleReviewComplete}
                onClearAll={clearDetectedCards}
              />
            )}
          </TabsContent>

          <TabsContent value="catalog" className="mt-0">
            <SmartCardGrid 
              onCardEdit={handleCardEdit}
              onCardCreate={handleCardCreate}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
