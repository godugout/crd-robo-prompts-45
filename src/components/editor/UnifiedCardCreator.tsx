import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Camera, Sparkles, Download, Share2, Wand2, ArrowLeft } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { useCardEditor, CardRarity } from '@/hooks/useCardEditor';
import { analyzeCardImage } from '@/services/cardAnalyzer';
import { DEFAULT_TEMPLATES } from './wizard/wizardConfig';
import { DynamicTemplateRenderer } from './canvas/DynamicTemplateRenderer';

export const UnifiedCardCreator = () => {
  const navigate = useNavigate();
  const [currentPhoto, setCurrentPhoto] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(DEFAULT_TEMPLATES[0]);
  const [isExporting, setIsExporting] = useState(false);
  const cardPreviewRef = useRef<HTMLDivElement>(null);

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

  const onDrop = async (acceptedFiles: File[]) => {
    if (!acceptedFiles.length) return;

    const file = acceptedFiles[0];
    const preview = URL.createObjectURL(file);
    setCurrentPhoto(preview);
    cardEditor.updateCardField('image_url', preview);

    // AI Magic - analyze the photo
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeCardImage(file);
      
      // Apply AI suggestions with celebration
      cardEditor.updateCardField('title', analysis.title);
      cardEditor.updateCardField('description', analysis.description);
      cardEditor.updateCardField('rarity', analysis.rarity);
      cardEditor.updateCardField('tags', analysis.tags);
      
      // Auto-select best template based on analysis
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
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1
  });

  const handleTemplateSelect = (template: any) => {
    setSelectedTemplate(template);
    cardEditor.updateCardField('template_id', template.id);
    cardEditor.updateCardField('design_metadata', template.template_data);
    toast.success(`${template.name} template applied!`);
  };

  const handleMagicEnhance = () => {
    // Magic enhancement - apply some smart defaults and effects
    const enhancements = {
      rarity: cardEditor.cardData.rarity === 'common' ? 'rare' : cardEditor.cardData.rarity,
      tags: [...new Set([...cardEditor.cardData.tags, 'enhanced', 'special'])],
    };
    
    cardEditor.updateCardField('rarity', enhancements.rarity as CardRarity);
    cardEditor.updateCardField('tags', enhancements.tags);
    
    toast.success('🪄 Magic enhancement applied!');
  };

  const handleExport = async () => {
    if (!cardPreviewRef.current) return;
    
    setIsExporting(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(cardPreviewRef.current, {
        backgroundColor: 'transparent',
        scale: 3,
        useCORS: true
      });
      
      const link = document.createElement('a');
      link.download = `${cardEditor.cardData.title.replace(/\s+/g, '_')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      toast.success('🎉 Card exported successfully!');
    } catch (error) {
      toast.error('Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  const handleSaveAndShare = async () => {
    const success = await cardEditor.saveCard();
    if (success) {
      toast.success('🎉 Card saved! Ready to share with the world!');
    }
  };

  const handlePhotoUpload = () => {
    document.getElementById('photo-input')?.click();
  };

  const renderCardPreview = () => {
    // Convert DesignTemplate to the expected format for DynamicTemplateRenderer
    const templateForRenderer = {
      id: selectedTemplate.id,
      name: selectedTemplate.name,
      template_data: selectedTemplate.template_data
    };

    return (
      <div ref={cardPreviewRef}>
        <DynamicTemplateRenderer
          template={templateForRenderer}
          cardData={cardEditor.cardData}
          currentPhoto={currentPhoto}
          scaleFactor={0.8}
          onPhotoUpload={handlePhotoUpload}
          onElementSelect={(elementId) => {
            if (elementId === 'image') {
              handlePhotoUpload();
            }
          }}
        />
        
        {/* Loading overlay during AI analysis */}
        {isAnalyzing && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm rounded-xl">
            <div className="text-center text-white">
              <Sparkles className="w-8 h-8 mx-auto mb-2 animate-spin" />
              <p className="text-sm">AI is working its magic...</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  const getRarityColor = (rarity: string) => {
    const colors = {
      common: '#6b7280',
      uncommon: '#10b981',
      rare: '#3b82f6',
      epic: '#8b5cf6',
      legendary: '#f59e0b'
    };
    return colors[rarity as keyof typeof colors] || colors.common;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-crd-darkest via-editor-dark to-crd-darkest">
      {/* Header */}
      <div className="border-b border-editor-border bg-editor-dark/80 backdrop-blur-sm">
        <div className="flex items-center justify-between max-w-7xl mx-auto px-4 h-16">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/cards')}
              className="text-white hover:bg-editor-border"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-xl font-bold text-white">Create Your Card</h1>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleMagicEnhance}
              variant="outline"
              size="sm"
              className="border-crd-purple text-crd-purple hover:bg-crd-purple hover:text-white"
            >
              <Wand2 className="w-4 h-4 mr-2" />
              Magic
            </Button>
            <Button
              onClick={handleExport}
              disabled={isExporting}
              variant="outline"
              size="sm"
              className="border-crd-green text-crd-green hover:bg-crd-green hover:text-black"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button
              onClick={handleSaveAndShare}
              disabled={cardEditor.isSaving}
              className="bg-crd-green hover:bg-crd-green/90 text-black"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Save & Share
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8 p-8 max-w-7xl mx-auto">
        {/* Left: Photo Upload */}
        <div className="lg:w-1/3 space-y-6">
          <div className="bg-editor-dark rounded-xl p-6 border border-editor-border">
            <h2 className="text-white font-semibold mb-4 flex items-center">
              <Camera className="w-5 h-5 mr-2" />
              Upload Your Photo
            </h2>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${
                isDragActive 
                  ? 'border-crd-green bg-crd-green/5' 
                  : 'border-editor-border hover:border-crd-green/50 hover:bg-crd-green/5'
              }`}
            >
              <input {...getInputProps()} />
              <Camera className="w-12 h-12 mx-auto text-crd-green mb-4" />
              <p className="text-white mb-2">
                {isDragActive ? 'Drop it here!' : 'Drag & drop your photo'}
              </p>
              <p className="text-crd-lightGray text-sm">or click to browse</p>
            </div>
            
            {/* Hidden file input for manual photo upload */}
            <input
              id="photo-input"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onDrop([file]);
                e.target.value = '';
              }}
              className="hidden"
            />
          </div>

          {/* Template Selection */}
          <div className="bg-editor-dark rounded-xl p-6 border border-editor-border">
            <h3 className="text-white font-semibold mb-4">Choose Template</h3>
            <div className="grid grid-cols-2 gap-3">
              {DEFAULT_TEMPLATES.slice(0, 4).map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateSelect(template)}
                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                    selectedTemplate.id === template.id
                      ? 'border-crd-green bg-crd-green/10'
                      : 'border-editor-border hover:border-crd-green/50'
                  }`}
                >
                  <div className="text-white font-medium text-sm">{template.name}</div>
                  <div className="text-crd-lightGray text-xs">{template.category}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center: Live Preview */}
        <div className="lg:w-1/3 flex flex-col items-center justify-center">
          <div className="mb-6 relative">
            {renderCardPreview()}
          </div>
          <p className="text-crd-lightGray text-sm text-center max-w-sm">
            Your card updates in real-time! Upload a photo and watch the magic happen ✨
          </p>
        </div>

        {/* Right: Card Details */}
        <div className="lg:w-1/3 space-y-6">
          <div className="bg-editor-dark rounded-xl p-6 border border-editor-border">
            <h3 className="text-white font-semibold mb-4">Card Details</h3>
            <div className="space-y-4">
              <div>
                <label className="text-crd-lightGray text-sm mb-2 block">Title</label>
                <Input
                  value={cardEditor.cardData.title}
                  onChange={(e) => cardEditor.updateCardField('title', e.target.value)}
                  className="bg-editor-tool border-editor-border text-white"
                  placeholder="Enter card title"
                />
              </div>
              
              <div>
                <label className="text-crd-lightGray text-sm mb-2 block">Description</label>
                <Textarea
                  value={cardEditor.cardData.description || ''}
                  onChange={(e) => cardEditor.updateCardField('description', e.target.value)}
                  className="bg-editor-tool border-editor-border text-white"
                  placeholder="Describe your card..."
                  rows={3}
                />
              </div>
              
              <div>
                <label className="text-crd-lightGray text-sm mb-2 block">Rarity</label>
                <Select value={cardEditor.cardData.rarity} onValueChange={(value) => cardEditor.updateCardField('rarity', value as CardRarity)}>
                  <SelectTrigger className="bg-editor-tool border-editor-border text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="common">Common</SelectItem>
                    <SelectItem value="uncommon">Uncommon</SelectItem>
                    <SelectItem value="rare">Rare</SelectItem>
                    <SelectItem value="epic">Epic</SelectItem>
                    <SelectItem value="legendary">Legendary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-crd-lightGray text-sm mb-2 block">Tags</label>
                <Input
                  value={cardEditor.cardData.tags.join(', ')}
                  onChange={(e) => {
                    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
                    cardEditor.updateCardField('tags', tags);
                  }}
                  className="bg-editor-tool border-editor-border text-white"
                  placeholder="Add tags (comma separated)"
                />
              </div>
            </div>
          </div>

          {/* Save Status */}
          {cardEditor.lastSaved && (
            <div className="bg-crd-green/10 border border-crd-green/30 rounded-xl p-4">
              <p className="text-crd-green text-sm">
                ✅ Auto-saved at {cardEditor.lastSaved.toLocaleTimeString()}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
