
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, ArrowLeft, Upload, Image, Check, Star, Globe, Lock, Users } from 'lucide-react';
import { toast } from 'sonner';
import { useCardEditor, CardData, DesignTemplate, PublishingOptions, CreatorAttribution } from '@/hooks/useCardEditor';

interface EnhancedCardWizardProps {
  onComplete: (cardData: CardData) => void;
  onCancel: () => void;
}

export const EnhancedCardWizard = ({ onComplete, onCancel }: EnhancedCardWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPhoto, setSelectedPhoto] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<DesignTemplate | null>(null);
  
  const { cardData, updateCardField, saveCard, isSaving } = useCardEditor({
    initialData: {
      creator_attribution: {
        collaboration_type: 'solo'
      },
      publishing_options: {
        marketplace_listing: false,
        crd_catalog_inclusion: true,
        print_available: false,
        pricing: {
          currency: 'USD'
        },
        distribution: {
          limited_edition: false
        }
      }
    }
  });

  const templates: DesignTemplate[] = [
    { 
      id: 'classic', 
      name: 'Classic Frame', 
      category: 'Traditional',
      description: 'Timeless design with elegant borders',
      preview_url: '',
      template_data: { style: 'classic', borderWidth: 2 },
      is_premium: false,
      usage_count: 1250,
      tags: ['classic', 'elegant']
    },
    { 
      id: 'vintage', 
      name: 'Vintage Sports', 
      category: 'Sports',
      description: 'Retro-inspired trading card style',
      preview_url: '',
      template_data: { style: 'vintage', overlay: 'sepia' },
      is_premium: false,
      usage_count: 890,
      tags: ['vintage', 'sports', 'retro']
    },
    { 
      id: 'modern', 
      name: 'Modern Minimal', 
      category: 'Contemporary',
      description: 'Clean, modern design aesthetic',
      preview_url: '',
      template_data: { style: 'modern', layout: 'minimal' },
      is_premium: false,
      usage_count: 2100,
      tags: ['modern', 'minimal', 'clean']
    },
    { 
      id: 'neon', 
      name: 'Neon Cyber', 
      category: 'Futuristic',
      description: 'Futuristic cyberpunk-inspired design',
      preview_url: '',
      template_data: { style: 'neon', effects: ['glow', 'gradient'] },
      is_premium: true,
      usage_count: 750,
      tags: ['neon', 'cyber', 'futuristic']
    }
  ];

  const steps = [
    { number: 1, title: 'Upload Photo', description: 'Add your image' },
    { number: 2, title: 'Choose Template', description: 'Select design style' },
    { number: 3, title: 'Card Details', description: 'Add information' },
    { number: 4, title: 'Publishing', description: 'Set visibility & options' }
  ];

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedPhoto(e.target?.result as string);
        updateCardField('image_url', e.target?.result as string);
        toast.success('Photo uploaded!');
      };
      reader.readAsDataURL(file);
    }
    event.target.value = '';
  };

  const handleTemplateSelect = (template: DesignTemplate) => {
    setSelectedTemplate(template);
    updateCardField('template_id', template.id);
    updateCardField('design_metadata', template.template_data);
  };

  const handleNext = () => {
    if (currentStep === 1 && !selectedPhoto) {
      toast.error('Please upload a photo first');
      return;
    }
    if (currentStep === 2 && !selectedTemplate) {
      toast.error('Please select a template');
      return;
    }
    if (currentStep === 3 && !cardData.title.trim()) {
      toast.error('Please enter a card title');
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleComplete = async () => {
    try {
      const success = await saveCard();
      if (success) {
        onComplete(cardData);
        toast.success('Card created successfully!');
      }
    } catch (error) {
      toast.error('Failed to create card');
    }
  };

  const updatePublishingOptions = (key: keyof PublishingOptions, value: any) => {
    updateCardField('publishing_options', {
      ...cardData.publishing_options,
      [key]: value
    });
  };

  const updateCreatorAttribution = (key: keyof CreatorAttribution, value: any) => {
    updateCardField('creator_attribution', {
      ...cardData.creator_attribution,
      [key]: value
    });
  };

  return (
    <div className="min-h-screen bg-editor-darker p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Create New Card</h1>
          <p className="text-crd-lightGray">Follow the steps to create your custom card</p>
        </div>

        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                    currentStep >= step.number ? 'bg-crd-green text-black' : 
                    currentStep === step.number ? 'bg-crd-blue text-white' : 'bg-editor-border text-gray-400'
                  }`}>
                    {currentStep > step.number ? <Check size={16} /> : step.number}
                  </div>
                  <div className="ml-3 hidden md:block">
                    <p className={`text-sm font-medium ${currentStep >= step.number ? 'text-white' : 'text-gray-400'}`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-px mx-4 ${currentStep > step.number ? 'bg-crd-green' : 'bg-editor-border'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="bg-editor-dark border-editor-border">
          <CardContent className="p-8">
            {/* Step 1: Photo Upload */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-white mb-2">Upload Your Photo</h2>
                  <p className="text-crd-lightGray">Choose the image that will be featured on your card</p>
                </div>
                
                <div className="border-2 border-dashed border-editor-border rounded-xl p-8 text-center">
                  {selectedPhoto ? (
                    <div className="space-y-4">
                      <img src={selectedPhoto} alt="Selected" className="w-48 h-48 object-cover rounded-lg mx-auto" />
                      <p className="text-crd-green">Photo selected!</p>
                      <Button
                        onClick={() => document.getElementById('photo-input')?.click()}
                        variant="outline"
                        className="border-editor-border text-white hover:bg-editor-border"
                      >
                        Choose Different Photo
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Image className="w-16 h-16 text-gray-400 mx-auto" />
                      <div>
                        <p className="text-crd-lightGray mb-4">Drag and drop or click to upload</p>
                        <Button
                          onClick={() => document.getElementById('photo-input')?.click()}
                          className="bg-crd-green hover:bg-crd-green/90 text-black"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Select Photo
                        </Button>
                      </div>
                    </div>
                  )}
                  <input
                    id="photo-input"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Template Selection */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-white mb-2">Choose Your Template</h2>
                  <p className="text-crd-lightGray">Select a design style that fits your vision</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      onClick={() => handleTemplateSelect(template)}
                      className={`p-4 rounded-xl cursor-pointer transition-all border ${
                        selectedTemplate?.id === template.id
                          ? 'ring-2 ring-crd-green bg-editor-tool border-crd-green'
                          : 'bg-editor-tool hover:bg-editor-border border-editor-border'
                      }`}
                    >
                      <div className={`h-32 rounded-lg bg-gradient-to-br mb-3 ${
                        template.id === 'classic' ? 'from-blue-500 to-purple-500' :
                        template.id === 'vintage' ? 'from-amber-500 to-orange-500' :
                        template.id === 'modern' ? 'from-green-500 to-teal-500' :
                        'from-pink-500 to-purple-500'
                      }`} />
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="text-white font-medium">{template.name}</h3>
                          {template.is_premium && (
                            <Badge className="bg-yellow-500 text-black">
                              <Star className="w-3 h-3 mr-1" />
                              Premium
                            </Badge>
                          )}
                        </div>
                        <p className="text-crd-lightGray text-sm">{template.description}</p>
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span>{template.usage_count} uses</span>
                          <span>{template.category}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Card Details */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-white mb-2">Card Details</h2>
                  <p className="text-crd-lightGray">Add information about your card</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-white">Card Title *</Label>
                      <Input
                        value={cardData.title}
                        onChange={(e) => updateCardField('title', e.target.value)}
                        placeholder="Enter card title"
                        className="bg-editor-tool border-editor-border text-white"
                      />
                    </div>

                    <div>
                      <Label className="text-white">Description</Label>
                      <Textarea
                        value={cardData.description || ''}
                        onChange={(e) => updateCardField('description', e.target.value)}
                        placeholder="Describe your card..."
                        className="bg-editor-tool border-editor-border text-white"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label className="text-white">Rarity</Label>
                      <Select value={cardData.rarity} onValueChange={(value) => updateCardField('rarity', value)}>
                        <SelectTrigger className="bg-editor-tool border-editor-border text-white">
                          <SelectValue placeholder="Select rarity" />
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
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-white">Creator Attribution</Label>
                      <Select 
                        value={cardData.creator_attribution.collaboration_type} 
                        onValueChange={(value) => updateCreatorAttribution('collaboration_type', value)}
                      >
                        <SelectTrigger className="bg-editor-tool border-editor-border text-white">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="solo">Solo Creation</SelectItem>
                          <SelectItem value="collaboration">Collaboration</SelectItem>
                          <SelectItem value="commission">Commission</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-white">Tags</Label>
                      <Input
                        placeholder="Add tags (comma separated)"
                        className="bg-editor-tool border-editor-border text-white"
                        onChange={(e) => {
                          const tags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
                          updateCardField('tags', tags);
                        }}
                      />
                    </div>

                    <div>
                      <Label className="text-white">Visibility</Label>
                      <Select value={cardData.visibility} onValueChange={(value) => updateCardField('visibility', value)}>
                        <SelectTrigger className="bg-editor-tool border-editor-border text-white">
                          <SelectValue placeholder="Select visibility" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="private">
                            <div className="flex items-center">
                              <Lock className="h-4 w-4 mr-2" />
                              Private
                            </div>
                          </SelectItem>
                          <SelectItem value="public">
                            <div className="flex items-center">
                              <Globe className="h-4 w-4 mr-2" />
                              Public
                            </div>
                          </SelectItem>
                          <SelectItem value="shared">
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-2" />
                              Shared
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Publishing Options */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-white mb-2">Publishing Options</h2>
                  <p className="text-crd-lightGray">Configure how your card will be shared and distributed</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-editor-tool border-editor-border">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-white">Marketplace Listing</Label>
                          <p className="text-xs text-crd-lightGray">List on CRD marketplace</p>
                        </div>
                        <Switch
                          checked={cardData.publishing_options.marketplace_listing}
                          onCheckedChange={(checked) => updatePublishingOptions('marketplace_listing', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-white">CRD Catalog</Label>
                          <p className="text-xs text-crd-lightGray">Include in main catalog</p>
                        </div>
                        <Switch
                          checked={cardData.publishing_options.crd_catalog_inclusion}
                          onCheckedChange={(checked) => updatePublishingOptions('crd_catalog_inclusion', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-white">Print Available</Label>
                          <p className="text-xs text-crd-lightGray">Allow physical printing</p>
                        </div>
                        <Switch
                          checked={cardData.publishing_options.print_available}
                          onCheckedChange={(checked) => updatePublishingOptions('print_available', checked)}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-editor-tool border-editor-border">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">Edition Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-white">Limited Edition</Label>
                          <p className="text-xs text-crd-lightGray">Restrict number of copies</p>
                        </div>
                        <Switch
                          checked={cardData.publishing_options.distribution?.limited_edition}
                          onCheckedChange={(checked) => updatePublishingOptions('distribution', {
                            ...cardData.publishing_options.distribution,
                            limited_edition: checked
                          })}
                        />
                      </div>

                      {cardData.publishing_options.distribution?.limited_edition && (
                        <div>
                          <Label className="text-white">Edition Size</Label>
                          <Input
                            type="number"
                            min="1"
                            max="10000"
                            placeholder="100"
                            className="bg-editor-darker border-editor-border text-white"
                            onChange={(e) => updatePublishingOptions('distribution', {
                              ...cardData.publishing_options.distribution,
                              edition_size: parseInt(e.target.value) || undefined
                            })}
                          />
                        </div>
                      )}

                      <div className="pt-4 border-t border-editor-border">
                        <div className="text-sm text-crd-lightGray space-y-1">
                          <p>Status: <span className="text-crd-green">Ready to publish</span></p>
                          <p>Template: <span className="text-white">{selectedTemplate?.name}</span></p>
                          <p>Verification: <span className="text-yellow-500">Pending review</span></p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-editor-border">
              <div className="flex space-x-3">
                <Button
                  onClick={onCancel}
                  variant="outline"
                  className="border-editor-border text-white hover:bg-editor-border"
                >
                  Cancel
                </Button>
                {currentStep > 1 && (
                  <Button
                    onClick={handleBack}
                    variant="outline"
                    className="border-editor-border text-white hover:bg-editor-border"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                )}
              </div>

              <div className="flex space-x-3">
                {currentStep < 4 ? (
                  <Button
                    onClick={handleNext}
                    className="bg-crd-green hover:bg-crd-green/90 text-black"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleComplete}
                    disabled={isSaving}
                    className="bg-crd-green hover:bg-crd-green/90 text-black"
                  >
                    {isSaving ? 'Creating...' : 'Create Card'}
                    <Check className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
