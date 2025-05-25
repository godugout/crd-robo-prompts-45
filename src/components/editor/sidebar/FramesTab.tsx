
import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Instagram, Scissors } from 'lucide-react';
import { toast } from 'sonner';
import { InstagramImportModal } from './InstagramImportModal';
import { CardExtractionUpload } from '../upload/CardExtractionUpload';
import { DetectedCard } from '@/services/cardDetector';
import { ExtractedCard } from '@/services/cardExtractor';

interface Frame {
  id: string;
  name: string;
  preview: string;
  category: string;
  gradient: string;
}

interface FramesTabProps {
  selectedTemplate: string;
  onSelectTemplate: (templateId: string) => void;
  searchQuery: string;
}

export const FramesTab = ({ selectedTemplate, onSelectTemplate, searchQuery }: FramesTabProps) => {
  const [isInstagramModalOpen, setIsInstagramModalOpen] = useState(false);
  const [importedFrames, setImportedFrames] = useState<Frame[]>([]);

  const defaultFrames: Frame[] = [
    { 
      id: 'template1', 
      name: 'Cardshow Nostalgia', 
      preview: '/placeholder.svg',
      category: 'featured',
      gradient: 'from-green-500 to-blue-500'
    },
    { 
      id: 'template2', 
      name: 'Classic Cardboard', 
      preview: '/placeholder.svg',
      category: 'featured',
      gradient: 'from-orange-500 to-red-500'
    },
    { 
      id: 'template3', 
      name: 'Nifty Framework', 
      preview: '/placeholder.svg',
      category: 'popular',
      gradient: 'from-purple-500 to-pink-500'
    },
    { 
      id: 'template4', 
      name: 'Synthwave Dreams', 
      preview: '/placeholder.svg',
      category: 'popular',
      gradient: 'from-cyan-500 to-purple-500'
    }
  ];

  const allFrames = [...defaultFrames, ...importedFrames];
  
  const filteredFrames = allFrames.filter(frame => 
    frame.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleImportCards = (cards: DetectedCard[]) => {
    const newFrames: Frame[] = cards.map((card, index) => ({
      id: `instagram-${Date.now()}-${index}`,
      name: `Instagram Card ${index + 1}`,
      preview: card.imageUrl,
      category: 'imported',
      gradient: 'from-pink-500 to-purple-500'
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
      gradient: 'from-blue-500 to-purple-500'
    }));

    setImportedFrames(prev => [...prev, ...newFrames]);
    toast.success(`Added ${newFrames.length} extracted cards as frames!`);
  };

  return (
    <ScrollArea className="h-full px-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-medium text-sm uppercase tracking-wide">Card Frames</h3>
        </div>

        <Tabs defaultValue="templates" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-editor-darker">
            <TabsTrigger value="templates" className="text-white">Templates</TabsTrigger>
            <TabsTrigger value="extract" className="text-white">Extract</TabsTrigger>
            <TabsTrigger value="instagram" className="text-white">Instagram</TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {filteredFrames.map((frame) => (
                <div 
                  key={frame.id}
                  className={`relative group cursor-pointer rounded-xl overflow-hidden transition-all duration-200 ${
                    selectedTemplate === frame.id
                      ? 'ring-2 ring-crd-green shadow-lg scale-105' 
                      : 'hover:scale-102 hover:shadow-md'
                  }`}
                  onClick={() => {
                    onSelectTemplate(frame.id);
                    toast.success(`Frame "${frame.name}" applied`);
                  }}
                >
                  {frame.category === 'imported' || frame.category === 'extracted' ? (
                    <div className="aspect-[3/4] relative">
                      <img 
                        src={frame.preview} 
                        alt={frame.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className={`aspect-[3/4] bg-gradient-to-br ${frame.gradient} flex items-center justify-center`}>
                      <div className="text-white font-bold text-xs opacity-80">FRAME</div>
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                    <p className="text-white text-xs font-medium truncate">{frame.name}</p>
                    {frame.category === 'imported' && (
                      <p className="text-pink-300 text-xs opacity-80">From Instagram</p>
                    )}
                    {frame.category === 'extracted' && (
                      <p className="text-blue-300 text-xs opacity-80">Extracted</p>
                    )}
                  </div>
                  {selectedTemplate === frame.id && (
                    <div className="absolute top-2 right-2 w-4 h-4 bg-crd-green rounded-full shadow-lg flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
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
