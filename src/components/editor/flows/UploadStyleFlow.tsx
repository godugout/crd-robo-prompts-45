
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Upload, Check, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface PresetStyle {
  id: string;
  name: string;
  description: string;
  preview: string;
  overlayConfig: {
    logoPosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    namePosition: 'bottom' | 'top';
    style: 'minimal' | 'classic' | 'modern';
  };
}

const PRESET_STYLES: PresetStyle[] = [
  {
    id: 'minimal-clean',
    name: 'Minimal Clean',
    description: 'Simple CRD logo and name overlay',
    preview: '/placeholder.svg',
    overlayConfig: {
      logoPosition: 'top-left',
      namePosition: 'bottom',
      style: 'minimal'
    }
  },
  {
    id: 'classic-frame',
    name: 'Classic Frame',
    description: 'Traditional card border with info',
    preview: '/placeholder.svg',
    overlayConfig: {
      logoPosition: 'top-right',
      namePosition: 'bottom',
      style: 'classic'
    }
  },
  {
    id: 'modern-gradient',
    name: 'Modern Gradient',
    description: 'Sleek gradient overlay effects',
    preview: '/placeholder.svg',
    overlayConfig: {
      logoPosition: 'bottom-right',
      namePosition: 'bottom',
      style: 'modern'
    }
  }
];

export const UploadStyleFlow = () => {
  const navigate = useNavigate();
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [selectedPreset, setSelectedPreset] = useState<PresetStyle | null>(null);
  const [cardTitle, setCardTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleCreateCard = async () => {
    if (!uploadedImage || !selectedPreset || !cardTitle.trim()) {
      toast.error('Please complete all steps');
      return;
    }

    setIsCreating(true);
    try {
      // Simulate card creation
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Card created successfully!');
      navigate('/gallery');
    } catch (error) {
      toast.error('Failed to create card');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-crd-darkest">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/cards')}
            className="text-crd-lightGray hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">Upload & Style</h1>
            <p className="text-crd-lightGray">Create a full-bleed photo card with preset styles</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Steps */}
          <div className="space-y-6">
            {/* Step 1: Upload Photo */}
            <Card className="bg-editor-dark border-editor-border">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-crd-green text-black flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <h3 className="text-white font-semibold">Upload Your Photo</h3>
                </div>

                {!uploadedImage ? (
                  <div className="border-2 border-dashed border-editor-border rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 text-crd-lightGray mx-auto mb-4" />
                    <p className="text-crd-lightGray mb-4">
                      Choose a high-quality photo for your card
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="photo-upload"
                    />
                    <label htmlFor="photo-upload">
                      <Button asChild className="bg-crd-green hover:bg-crd-green/90 text-black">
                        <span>Select Photo</span>
                      </Button>
                    </label>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={uploadedImage}
                      alt="Uploaded"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-crd-green text-black">
                        <Check className="w-3 h-3 mr-1" />
                        Uploaded
                      </Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Step 2: Choose Preset */}
            <Card className="bg-editor-dark border-editor-border">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    uploadedImage ? 'bg-crd-green text-black' : 'bg-editor-border text-crd-lightGray'
                  }`}>
                    2
                  </div>
                  <h3 className="text-white font-semibold">Choose Style Preset</h3>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {PRESET_STYLES.map((preset) => (
                    <div
                      key={preset.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedPreset?.id === preset.id
                          ? 'border-crd-green bg-crd-green/10'
                          : 'border-editor-border hover:border-crd-green/50'
                      } ${!uploadedImage ? 'opacity-50 pointer-events-none' : ''}`}
                      onClick={() => uploadedImage && setSelectedPreset(preset)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-white font-medium">{preset.name}</h4>
                          <p className="text-crd-lightGray text-sm">{preset.description}</p>
                        </div>
                        {selectedPreset?.id === preset.id && (
                          <Check className="w-5 h-5 text-crd-green" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Step 3: Card Details */}
            <Card className="bg-editor-dark border-editor-border">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    selectedPreset ? 'bg-crd-green text-black' : 'bg-editor-border text-crd-lightGray'
                  }`}>
                    3
                  </div>
                  <h3 className="text-white font-semibold">Add Card Title</h3>
                </div>

                <input
                  type="text"
                  value={cardTitle}
                  onChange={(e) => setCardTitle(e.target.value)}
                  placeholder="Enter card title..."
                  className="w-full p-3 bg-editor-border border border-editor-border rounded-lg text-white placeholder-crd-lightGray focus:border-crd-green focus:outline-none"
                  disabled={!selectedPreset}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Preview */}
          <div className="lg:sticky lg:top-8 lg:h-fit">
            <Card className="bg-editor-dark border-editor-border">
              <CardContent className="p-6">
                <h3 className="text-white font-semibold mb-4 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-crd-green" />
                  Preview
                </h3>

                <div className="aspect-[3/4] bg-editor-border rounded-lg flex items-center justify-center mb-6">
                  {uploadedImage ? (
                    <div className="relative w-full h-full">
                      <img
                        src={uploadedImage}
                        alt="Card preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                      {selectedPreset && (
                        <div className="absolute inset-0 flex flex-col justify-between p-4">
                          {/* Logo overlay */}
                          <div className={`flex ${
                            selectedPreset.overlayConfig.logoPosition.includes('right') ? 'justify-end' : 'justify-start'
                          }`}>
                            <div className="bg-black/70 px-2 py-1 rounded text-xs text-white">
                              CRD
                            </div>
                          </div>
                          
                          {/* Title overlay */}
                          <div className="bg-black/70 px-3 py-2 rounded">
                            <div className="text-white font-semibold">
                              {cardTitle || 'Card Title'}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="w-12 h-12 text-crd-lightGray mx-auto mb-2" />
                      <p className="text-crd-lightGray">Upload a photo to see preview</p>
                    </div>
                  )}
                </div>

                <Button
                  onClick={handleCreateCard}
                  disabled={!uploadedImage || !selectedPreset || !cardTitle.trim() || isCreating}
                  className="w-full bg-crd-green hover:bg-crd-green/90 text-black font-medium"
                >
                  {isCreating ? 'Creating Card...' : 'Create Card'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
