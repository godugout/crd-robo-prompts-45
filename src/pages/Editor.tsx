
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Topbar } from '@/components/editor/Topbar';
import { Toolbar } from '@/components/editor/Toolbar';
import { LeftSidebar } from '@/components/editor/LeftSidebar';
import { RightSidebar } from '@/components/editor/RightSidebar';
import { Canvas } from '@/components/editor/Canvas';
import { toast } from 'sonner';
import { useCardEditor } from '@/hooks/useCardEditor';
import { CardRepository } from '@/repositories/cardRepository';

const Editor = () => {
  const { cardId } = useParams<{ cardId?: string }>();
  const [zoom, setZoom] = useState(100);
  const [selectedTemplate, setSelectedTemplate] = useState("template1");
  const [isLoading, setIsLoading] = useState(true);

  // Initialize card editor
  const cardEditor = useCardEditor({
    autoSave: true,
    autoSaveInterval: 30000, // 30 seconds
  });

  // Load card data if editing an existing card
  useEffect(() => {
    const loadCardData = async () => {
      if (!cardId) {
        setIsLoading(false);
        return;
      }
      
      try {
        const card = await CardRepository.getCardById(cardId);
        if (card) {
          // Update card editor with loaded data
          cardEditor.updateCardField('id', card.id);
          cardEditor.updateCardField('title', card.title);
          cardEditor.updateCardField('description', card.description || '');
          cardEditor.updateCardField('rarity', card.rarity as any);
          cardEditor.updateCardField('tags', card.tags || []);
          cardEditor.updateCardField('design_metadata', card.design_metadata);
          cardEditor.updateCardField('image_url', card.image_url);
          cardEditor.updateCardField('visibility', card.is_public ? 'public' : 'private');
          
          // Set template based on design metadata
          if (card.design_metadata?.templateId) {
            setSelectedTemplate(card.design_metadata.templateId);
          }
        }
      } catch (error) {
        console.error('Error loading card:', error);
        toast.error('Failed to load card data');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCardData();
  }, [cardId]);

  useEffect(() => {
    // Simulate loading of editor resources
    const timer = setTimeout(() => {
      setIsLoading(false);
      toast.success('Editor loaded successfully', {
        description: 'Start creating your amazing card!',
      });
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    cardEditor.updateDesignMetadata('templateId', templateId);
    
    // Different template presets based on selection
    if (templateId === 'template1') {
      cardEditor.updateCardField('series', '80s VCR');
    } else if (templateId === 'template2') {
      cardEditor.updateCardField('series', 'Classic Cardboard');
    } else if (templateId === 'template3') {
      cardEditor.updateCardField('series', 'Nifty Framework');
    } else if (templateId === 'template4') {
      cardEditor.updateCardField('series', 'Synthwave Dreams');
      cardEditor.updateCardField('category', 'Music');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen bg-editor-darker">
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-cardshow-green border-t-transparent rounded-full animate-spin mb-4"></div>
            <h2 className="text-white text-xl font-medium">Loading Editor</h2>
            <p className="text-cardshow-lightGray mt-2">Preparing your creative tools...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-editor-darker">
      <Topbar cardEditor={cardEditor} />
      <Toolbar onZoomChange={setZoom} currentZoom={zoom} />
      <div className="flex-1 flex overflow-hidden">
        <LeftSidebar 
          selectedTemplate={selectedTemplate}
          onSelectTemplate={handleTemplateSelect}
          cardEditor={cardEditor}
        />
        <Canvas zoom={zoom} cardEditor={cardEditor} />
        <RightSidebar />
      </div>
    </div>
  );
};

export default Editor;
