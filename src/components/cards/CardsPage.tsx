
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Grid, List, Filter } from 'lucide-react';
import { CardCollectionUpload } from './CardCollectionUpload';
import { ExtractedCard } from '@/services/cardExtractor';

export const CardsPage = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showUpload, setShowUpload] = useState(true);
  const [cards, setCards] = useState<ExtractedCard[]>([]);

  const handleCardsAdded = (newCards: ExtractedCard[]) => {
    setCards(prev => [...prev, ...newCards]);
    setShowUpload(false);
  };

  return (
    <div className="min-h-screen bg-crd-darkest pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">My Cards</h1>
            <p className="text-crd-lightGray">
              Upload and manage your trading card collection
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setShowUpload(!showUpload)}
              className="bg-crd-green hover:bg-crd-green/80 text-black"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Cards
            </Button>
            
            <div className="flex items-center border border-editor-border rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="border-0 rounded-r-none"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="border-0 rounded-l-none"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        {showUpload && (
          <div className="mb-8">
            <CardCollectionUpload onCardsAdded={handleCardsAdded} />
          </div>
        )}

        {/* Cards Collection */}
        {cards.length > 0 ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                Your Collection ({cards.length} cards)
              </h2>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>

            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                {cards.map((card, index) => (
                  <Card key={index} className="bg-editor-dark border-editor-border overflow-hidden group hover:border-crd-green/50 transition-colors">
                    <div className="aspect-[3/4] relative">
                      <img
                        src={URL.createObjectURL(card.imageBlob)}
                        alt={`Card ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {cards.map((card, index) => (
                  <Card key={index} className="bg-editor-dark border-editor-border">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="w-16 h-20 rounded-lg overflow-hidden bg-editor-tool">
                        <img
                          src={URL.createObjectURL(card.imageBlob)}
                          alt={`Card ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-medium">Card {index + 1}</h3>
                        <p className="text-crd-lightGray text-sm">
                          Confidence: {Math.round(card.confidence * 100)}%
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        ) : !showUpload ? (
          <Card className="bg-editor-dark border-editor-border">
            <CardContent className="p-12 text-center">
              <Grid className="w-16 h-16 text-crd-lightGray mx-auto mb-4" />
              <h3 className="text-white font-medium text-lg mb-2">No cards yet</h3>
              <p className="text-crd-lightGray mb-6">
                Start building your collection by uploading card images
              </p>
              <Button
                onClick={() => setShowUpload(true)}
                className="bg-crd-green hover:bg-crd-green/80 text-black"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Cards
              </Button>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
};
