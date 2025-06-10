
import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Instagram, Scissors, Wand2 } from 'lucide-react';
import { toast } from 'sonner';
import { InstagramImportModal } from './InstagramImportModal';
import { CardExtractionUpload } from '../upload/CardExtractionUpload';
import { GeneratorTab } from './GeneratorTab';
import { DetectedCard } from '@/services/cardDetector';
import type { ExtractedCard } from '@/services/cardExtractor';
import { FramePreviewGrid } from '../frames/FramePreviewGrid';

interface Frame {
  id: string;
  name: string;
  preview: string;
  category: string;
  gradient: string;
  defaultStyle: {
    primaryColor: string;
    accentColor: string;
    backgroundColor: string;
  };
}

interface FramesTabProps {
  selectedTemplate: string;
  onSelectTemplate: (templateId: string) => void;
  searchQuery: string;
}

export const FramesTab = ({ selectedTemplate, onSelectTemplate, searchQuery }: FramesTabProps) => {
  const [isInstagramModalOpen, setIsInstagramModalOpen] = useState(false);
  const [importedFrames, setImportedFrames] = useState<Frame[]>([]);

  const handleFrameSelect = (frameId: string) => {
    onSelectTemplate(frameId);
    toast.success(`Enhanced frame "${frameId}" selected`);
  };

  const handleImportCards = (cards: DetectedCard[]) => {
    const newFrames: Frame[] = cards.map((card, index) => ({
      id: `instagram-${Date.now()}-${index}`,
      name: `Instagram Card ${index + 1}`,
      preview: card.imageUrl,
      category: 'imported',
      gradient: 'from-pink-500 to-purple-500',
      defaultStyle: {
        primaryColor: '#e91e63',
        accentColor: '#ffffff',
        backgroundColor: '#000000'
      }
    }));

    setImportedFrames(prev => [...prev, ...newFrames]);
    toast.success(`Added ${newFrames.length} new frames from Instagram!`);
  };

  const handleExtractedCards = (cards: ExtractedCard[]) => {
    const newFrames: Frame[] = cards.map((card, index) => ({
      id: `extracted-${Date.now()}-${index}`,
      name: `Extracted Card ${index + 1}`,
      preview: URL.createObjectURL(card.imageBlob),
      category: 'extracted',
      gradient: 'from-blue-500 to-purple-500',
      defaultStyle: {
        primaryColor: '#2196f3',
        accentColor: '#ffffff',
        backgroundColor: '#1a1a1a'
      }
    }));

    setImportedFrames(prev => [...prev, ...newFrames]);
    toast.success(`Added ${newFrames.length} extracted cards as frames!`);
  };

  return (
    <ScrollArea className="h-full px-4">
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-white font-medium text-lg mb-2">Choose Frame Template</h3>
          <p className="text-crd-lightGray text-sm">
            Professional card frames inspired by premium trading cards
          </p>
        </div>

        <Tabs defaultValue="templates" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-editor-darker">
            <TabsTrigger value="templates" className="text-white">Templates</TabsTrigger>
            <TabsTrigger value="extract" className="text-white">Extract</TabsTrigger>
            <TabsTrigger value="instagram" className="text-white">Instagram</TabsTrigger>
            <TabsTrigger value="generate" className="text-white">Generate</TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="space-y-4">
            <FramePreviewGrid
              selectedFrame={selectedTemplate}
              onSelectFrame={handleFrameSelect}
              searchQuery={searchQuery}
            />

            {/* Legacy imported frames */}
            {importedFrames.length > 0 && (
              <div className="mt-6">
                <h4 className="text-white font-medium mb-3">Imported Frames</h4>
                <div className="grid grid-cols-2 gap-3">
                  {importedFrames
                    .filter(frame => frame.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((frame) => (
                      <div 
                        key={frame.id}
                        className={`relative group cursor-pointer rounded-xl overflow-hidden transition-all duration-200 ${
                          selectedTemplate === frame.id
                            ? 'ring-2 ring-crd-green shadow-lg scale-105' 
                            : 'hover:scale-102 hover:shadow-md'
                        }`}
                        onClick={() => handleFrameSelect(frame.id)}
                      >
                        <div className="aspect-[3/4] relative">
                          <img 
                            src={frame.preview} 
                            alt={frame.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                          <p className="text-white text-xs font-medium truncate">{frame.name}</p>
                          <p className="text-pink-300 text-xs opacity-80">Imported</p>
                        </div>
                        {selectedTemplate === frame.id && (
                          <div className="absolute top-2 left-2 w-4 h-4 bg-crd-green rounded-full shadow-lg flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="extract" className="space-y-4">
            <CardExtractionUpload onCardsExtracted={handleExtractedCards} />
          </TabsContent>

          <TabsContent value="instagram" className="space-y-4">
            <Button
              onClick={() => setIsInstagramModalOpen(true)}
              className="w-full bg-pink-600 hover:bg-pink-700 text-white"
            >
              <Instagram className="w-4 h-4 mr-2" />
              Import from Instagram
            </Button>
            <p className="text-crd-lightGray text-xs text-center">
              Note: Only works with public accounts
            </p>
          </TabsContent>

          <TabsContent value="generate" className="space-y-4">
            <GeneratorTab />
          </TabsContent>
        </Tabs>

        <InstagramImportModal
          isOpen={isInstagramModalOpen}
          onClose={() => setIsInstagramModalOpen(false)}
          onImportCards={handleImportCards}
        />
      </div>
    </ScrollArea>
  );
};
