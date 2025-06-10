import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Instagram, Scissors, Wand2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { InstagramImportModal } from '../InstagramImportModal';
import { CardExtractionUpload } from '../../upload/CardExtractionUpload';
import { GeneratorTab } from '../GeneratorTab';
import { DetectedCard } from '@/services/cardDetector';
import type { ExtractedCard } from '@/services/cardExtractor';
import { FramePreviewGrid } from '../../frames/FramePreviewGrid';

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

interface FramesStepProps {
  selectedTemplate: string;
  onSelectTemplate: (templateId: string) => void;
  searchQuery: string;
}

export const FramesStep = ({ selectedTemplate, onSelectTemplate, searchQuery }: FramesStepProps) => {
  const [activeSection, setActiveSection] = useState<'frames' | 'extract' | 'instagram' | 'generate'>('frames');
  const [isInstagramModalOpen, setIsInstagramModalOpen] = useState(false);
  const [importedFrames, setImportedFrames] = useState<Frame[]>([]);

  const handleFrameSelect = (templateId: string) => {
    onSelectTemplate(templateId);
    
    // Send frame change event to main preview
    window.dispatchEvent(new CustomEvent('frameChange', {
      detail: { 
        frameId: templateId,
        frameType: 'enhanced'
      }
    }));
    
    toast.success(`Enhanced frame selected: ${templateId}`);
  };

  const handleImportCards = (cards: DetectedCard[]) => {
    const newFrames: Frame[] = cards.map((card, index) => ({
      id: `instagram-${Date.now()}-${index}`,
      name: `Instagram Frame ${index + 1}`,
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
      name: `Extracted Frame ${index + 1}`,
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
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-white font-medium text-lg mb-2">Choose Your Frame</h3>
          <p className="text-crd-lightGray text-sm">
            Professional card frames inspired by premium trading cards
          </p>
        </div>

        {/* Frame Source Options */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={activeSection === 'frames' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveSection('frames')}
            className={activeSection === 'frames' ? 'bg-crd-green text-black' : 'border-editor-border text-white'}
          >
            Frames
          </Button>
          <Button
            variant={activeSection === 'extract' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveSection('extract')}
            className={activeSection === 'extract' ? 'bg-crd-green text-black' : 'border-editor-border text-white'}
          >
            <Scissors className="w-3 h-3 mr-1" />
            Extract
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={activeSection === 'instagram' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveSection('instagram')}
            className={activeSection === 'instagram' ? 'bg-crd-green text-black' : 'border-editor-border text-white'}
          >
            <Instagram className="w-3 h-3 mr-1" />
            Instagram
          </Button>
          <Button
            variant={activeSection === 'generate' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveSection('generate')}
            className={activeSection === 'generate' ? 'bg-crd-green text-black' : 'border-editor-border text-white'}
          >
            <Wand2 className="w-3 h-3 mr-1" />
            Generate
          </Button>
        </div>

        {/* Content based on active section */}
        {activeSection === 'frames' && (
          <FramePreviewGrid
            selectedFrame={selectedTemplate}
            onSelectFrame={handleFrameSelect}
            searchQuery={searchQuery}
          />
        )}

        {activeSection === 'extract' && (
          <CardExtractionUpload onCardsExtracted={handleExtractedCards} />
        )}

        {activeSection === 'instagram' && (
          <div className="space-y-4">
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
          </div>
        )}

        {activeSection === 'generate' && (
          <GeneratorTab />
        )}

        {/* Continue Button - only show if frame is selected */}
        {selectedTemplate && (
          <div className="pt-4 border-t border-editor-border">
            <Button 
              className="w-full bg-crd-green hover:bg-crd-green/90 text-black font-medium"
              onClick={() => onSelectTemplate(selectedTemplate)}
            >
              Continue to Photo
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        <InstagramImportModal
          isOpen={isInstagramModalOpen}
          onClose={() => setIsInstagramModalOpen(false)}
          onImportCards={handleImportCards}
        />
      </div>
    </ScrollArea>
  );
};
