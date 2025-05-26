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
  const [activeSection, setActiveSection] = useState<'templates' | 'extract' | 'instagram' | 'generate'>('templates');
  const [isInstagramModalOpen, setIsInstagramModalOpen] = useState(false);
  const [importedFrames, setImportedFrames] = useState<Frame[]>([]);

  const defaultFrames: Frame[] = [
    { 
      id: 'template1', 
      name: 'Cardshow Nostalgia', 
      preview: '/placeholder.svg',
      category: 'featured',
      gradient: 'from-green-500 to-blue-500',
      defaultStyle: {
        primaryColor: '#16a085',
        accentColor: '#eee',
        backgroundColor: '#1a1a2e'
      }
    },
    { 
      id: 'template2', 
      name: 'Classic Cardboard', 
      preview: '/placeholder.svg',
      category: 'featured',
      gradient: 'from-orange-500 to-red-500',
      defaultStyle: {
        primaryColor: '#e07a5f',
        accentColor: '#3d405b',
        backgroundColor: '#f4f1de'
      }
    },
    { 
      id: 'template3', 
      name: 'Nifty Framework', 
      preview: '/placeholder.svg',
      category: 'popular',
      gradient: 'from-purple-500 to-pink-500',
      defaultStyle: {
        primaryColor: '#8e44ad',
        accentColor: '#f39c12',
        backgroundColor: '#2d1b69'
      }
    },
    { 
      id: 'template4', 
      name: 'Synthwave Dreams', 
      preview: '/placeholder.svg',
      category: 'popular',
      gradient: 'from-cyan-500 to-purple-500',
      defaultStyle: {
        primaryColor: '#ff006e',
        accentColor: '#8338ec',
        backgroundColor: '#0f0f23'
      }
    }
  ];

  const allFrames = [...defaultFrames, ...importedFrames];
  const filteredFrames = allFrames.filter(frame => 
    frame.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTemplateSelect = (templateId: string) => {
    onSelectTemplate(templateId);
    
    // Send template change event to main preview
    const template = defaultFrames.find(t => t.id === templateId);
    if (template) {
      window.dispatchEvent(new CustomEvent('templateChange', {
        detail: { 
          templateId, 
          colors: template.defaultStyle 
        }
      }));
    }
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
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-white font-medium text-lg mb-2">Choose Your Frame</h3>
          <p className="text-crd-lightGray text-sm">
            Select a template style that matches your vision
          </p>
        </div>

        {/* Frame Source Options */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={activeSection === 'templates' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveSection('templates')}
            className={activeSection === 'templates' ? 'bg-crd-green text-black' : 'border-editor-border text-white'}
          >
            Templates
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
        {activeSection === 'templates' && (
          <div className="grid grid-cols-2 gap-3">
            {filteredFrames.map((frame) => (
              <div 
                key={frame.id}
                className={`relative group cursor-pointer rounded-xl overflow-hidden transition-all duration-200 ${
                  selectedTemplate === frame.id
                    ? 'ring-2 ring-crd-green shadow-lg scale-105' 
                    : 'hover:scale-102 hover:shadow-md'
                }`}
                onClick={() => handleTemplateSelect(frame.id)}
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
                  <div 
                    className="aspect-[3/4] relative"
                    style={{ backgroundColor: frame.defaultStyle.backgroundColor }}
                  >
                    {/* Template preview with placeholder photo */}
                    <div className="absolute inset-2 border-2 border-dashed border-gray-500 rounded-lg overflow-hidden">
                      <img 
                        src={`https://images.unsplash.com/photo-1472396961693-142e6e269027?w=300&h=400&fit=crop`}
                        alt="Placeholder"
                        className="w-full h-full object-cover opacity-60"
                      />
                    </div>
                    
                    {/* Frame elements */}
                    <div 
                      className="absolute top-2 left-2 right-2 h-6 rounded flex items-center justify-center"
                      style={{ backgroundColor: frame.defaultStyle.primaryColor }}
                    >
                      <span className="text-white text-xs font-bold">FRAME HEADER</span>
                    </div>
                    
                    <div 
                      className="absolute bottom-2 left-2 right-2 h-4 rounded flex items-center justify-center"
                      style={{ backgroundColor: frame.defaultStyle.accentColor }}
                    >
                      <span className="text-black text-xs">Footer</span>
                    </div>
                  </div>
                )}
                
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                  <p className="text-white text-xs font-medium truncate">{frame.name}</p>
                </div>
                {selectedTemplate === frame.id && (
                  <div className="absolute top-2 left-2 w-4 h-4 bg-crd-green rounded-full shadow-lg flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
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

        {/* Continue Button - only show if template is selected */}
        {selectedTemplate && (
          <div className="pt-4 border-t border-editor-border">
            <Button 
              className="w-full bg-crd-green hover:bg-crd-green/90 text-black font-medium"
              onClick={() => onSelectTemplate(selectedTemplate)}
            >
              Continue to Elements
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
