
import { useState, useCallback } from 'react';
import { useCardEditor } from './useCardEditor';
import { analyzeCardImage } from '@/services/cardAnalyzer';
import { DEFAULT_TEMPLATES } from '@/components/editor/wizard/wizardConfig';
import { toast } from 'sonner';

interface StickerData {
  id: string;
  type: 'emoji' | 'icon' | 'shape';
  content: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  color?: string;
}

export const useUnifiedCardCreator = () => {
  const [currentPhoto, setCurrentPhoto] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState(DEFAULT_TEMPLATES[0]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [step, setStep] = useState<'upload' | 'create' | 'enhance'>('upload');
  const [stickers, setStickers] = useState<StickerData[]>([]);
  const [selectedStickerId, setSelectedStickerId] = useState<string>('');

  const cardEditor = useCardEditor({
    initialData: {
      title: 'My Awesome Card',
      rarity: 'common',
      tags: [],
      design_metadata: DEFAULT_TEMPLATES[0].template_data,
      template_id: DEFAULT_TEMPLATES[0].id,
      visibility: 'private',
      creator_attribution: { collaboration_type: 'solo' },
      publishing_options: {
        marketplace_listing: false,
        crd_catalog_inclusion: true,
        print_available: false,
        pricing: { currency: 'USD' },
        distribution: { limited_edition: false }
      }
    },
    autoSave: true
  });

  const handlePhotoUpload = useCallback(async (file: File) => {
    const preview = URL.createObjectURL(file);
    setCurrentPhoto(preview);
    cardEditor.updateCardField('image_url', preview);
    setStep('create');

    // AI Magic
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeCardImage(file);
      
      // Apply AI suggestions
      cardEditor.updateCardField('title', analysis.title);
      cardEditor.updateCardField('description', analysis.description);
      cardEditor.updateCardField('rarity', analysis.rarity);
      cardEditor.updateCardField('tags', analysis.tags);
      
      // Auto-select best template - prefer full-bleed for photos
      const suggestedTemplate = DEFAULT_TEMPLATES.find(t => 
        t.category === 'full-bleed' || analysis.tags.some(tag => t.tags.includes(tag))
      ) || DEFAULT_TEMPLATES.find(t => t.category === 'full-bleed') || DEFAULT_TEMPLATES[0];
      
      setSelectedTemplate(suggestedTemplate);
      cardEditor.updateCardField('template_id', suggestedTemplate.id);
      cardEditor.updateCardField('design_metadata', suggestedTemplate.template_data);
      
      toast.success('✨ AI magic applied! Your card is looking amazing!');
    } catch (error) {
      console.error('AI analysis failed:', error);
      toast.error('AI analysis failed, but your photo looks great!');
    } finally {
      setIsAnalyzing(false);
    }
  }, [cardEditor]);

  const handleTemplateChange = useCallback((template: any) => {
    setSelectedTemplate(template);
    cardEditor.updateCardField('template_id', template.id);
    cardEditor.updateCardField('design_metadata', template.template_data);
    
    // Clear stickers when switching away from social templates
    if (template.template_data.layout_type !== 'full-bleed-social') {
      setStickers([]);
      setSelectedStickerId('');
    }
    
    toast.success(`${template.name} template applied!`);
  }, [cardEditor]);

  const handleMagicEnhance = useCallback(() => {
    const enhancements = {
      rarity: cardEditor.cardData.rarity === 'common' ? 'rare' : cardEditor.cardData.rarity,
      tags: [...new Set([...cardEditor.cardData.tags, 'enhanced', 'special'])],
    };
    
    cardEditor.updateCardField('rarity', enhancements.rarity as any);
    cardEditor.updateCardField('tags', enhancements.tags);
    
    toast.success('🪄 Magic enhancement applied!');
    setStep('enhance');
  }, [cardEditor]);

  const handleAddSticker = useCallback((sticker: any) => {
    const newSticker: StickerData = {
      id: `sticker-${Date.now()}`,
      type: sticker.emoji ? 'emoji' : 'icon',
      content: sticker.emoji || sticker.name,
      x: Math.random() * 200 + 50, // Random position
      y: Math.random() * 300 + 50,
      rotation: 0,
      scale: 1,
      color: sticker.color
    };
    
    setStickers(prev => [...prev, newSticker]);
    setSelectedStickerId(newSticker.id);
    
    // Store stickers in card metadata
    cardEditor.updateDesignMetadata('stickers', [...stickers, newSticker]);
  }, [stickers, cardEditor]);

  const handleStickersChange = useCallback((newStickers: StickerData[]) => {
    setStickers(newStickers);
    cardEditor.updateDesignMetadata('stickers', newStickers);
  }, [cardEditor]);

  return {
    // State
    currentPhoto,
    selectedTemplate,
    isAnalyzing,
    step,
    cardEditor,
    stickers,
    selectedStickerId,
    
    // Actions
    handlePhotoUpload,
    handleTemplateChange,
    handleMagicEnhance,
    handleAddSticker,
    handleStickersChange,
    setStep,
    setSelectedStickerId
  };
};
