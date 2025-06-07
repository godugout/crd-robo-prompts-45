
import { useState, useCallback } from 'react';
import { useCardEditor } from './useCardEditor';
import { analyzeCardImage } from '@/services/cardAnalyzer';
import { DEFAULT_TEMPLATES } from '@/components/editor/wizard/wizardConfig';
import { toast } from 'sonner';

export const useUnifiedCardCreator = () => {
  const [currentPhoto, setCurrentPhoto] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState(DEFAULT_TEMPLATES[0]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [step, setStep] = useState<'upload' | 'create' | 'enhance'>('upload');

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
      
      // Auto-select best template
      const suggestedTemplate = DEFAULT_TEMPLATES.find(t => 
        analysis.tags.some(tag => t.tags.includes(tag))
      ) || DEFAULT_TEMPLATES[0];
      
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

  return {
    // State
    currentPhoto,
    selectedTemplate,
    isAnalyzing,
    step,
    cardEditor,
    
    // Actions
    handlePhotoUpload,
    handleTemplateChange,
    handleMagicEnhance,
    setStep
  };
};
