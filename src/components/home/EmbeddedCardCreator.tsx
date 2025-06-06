
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CRDButton, Typography } from '@/components/ui/design-system';
import { useSimpleCardEditor } from '@/hooks/useSimpleCardEditor';
import { uploadCardImage } from '@/lib/cardImageUploader';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Upload, Sparkles } from 'lucide-react';
import type { CardRarity } from '@/types/card';

const RARITIES: { value: CardRarity; label: string; color: string }[] = [
  { value: 'common', label: 'Common', color: 'text-gray-400' },
  { value: 'uncommon', label: 'Uncommon', color: 'text-green-400' },
  { value: 'rare', label: 'Rare', color: 'text-blue-400' },
  { value: 'epic', label: 'Epic', color: 'text-purple-400' },
  { value: 'legendary', label: 'Legendary', color: 'text-yellow-400' }
];

export const EmbeddedCardCreator: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { cardData, updateField, saveCard, isSaving } = useSimpleCardEditor();
  const [isUploading, setIsUploading] = useState(false);
  const [step, setStep] = useState<'upload' | 'details' | 'preview'>('upload');

  const onDrop = async (acceptedFiles: File[]) => {
    if (!acceptedFiles.length) return;

    const file = acceptedFiles[0];
    setIsUploading(true);

    try {
      if (user) {
        const result = await uploadCardImage({
          file,
          cardId: cardData.id || 'temp',
          userId: user.id
        });

        if (result) {
          updateField('image_url', result.url);
          if (result.thumbnailUrl) {
            updateField('thumbnail_url', result.thumbnailUrl);
          }
          setStep('details');
        }
      } else {
        // For non-authenticated users, create a local preview
        const imageUrl = URL.createObjectURL(file);
        updateField('image_url', imageUrl);
        setStep('details');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1
  });

  const handleContinueInStudio = async () => {
    if (user) {
      const saved = await saveCard();
      if (saved) {
        navigate('/cards/create', { state: { cardData } });
      }
    } else {
      // Store in localStorage for non-authenticated users
      localStorage.setItem('draft-card', JSON.stringify(cardData));
      navigate('/cards/create');
    }
  };

  const handleQuickPublish = async () => {
    if (!user) {
      toast.error('Please sign in to publish cards');
      navigate('/auth');
      return;
    }

    if (!cardData.title.trim()) {
      toast.error('Please enter a card title');
      return;
    }

    const saved = await saveCard();
    if (saved) {
      toast.success('Card created successfully!');
      setStep('upload');
      // Reset form
      updateField('title', '');
      updateField('description', '');
      updateField('image_url', '');
      updateField('rarity', 'common');
    }
  };

  const renderUploadStep = () => (
    <div className="text-center">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-12 transition-all duration-300 cursor-pointer ${
          isDragActive 
            ? 'border-crd-green bg-crd-green/5' 
            : 'border-crd-mediumGray hover:border-crd-green/50 hover:bg-crd-green/5'
        }`}
      >
        <input {...getInputProps()} />
        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-crd-green/20 to-crd-green/10 rounded-full flex items-center justify-center">
            <Upload className="w-8 h-8 text-crd-green" />
          </div>
          <div>
            <Typography variant="h3" className="mb-2">
              {isUploading ? 'Uploading...' : 'Upload Your Image'}
            </Typography>
            <Typography variant="body" className="text-crd-lightGray">
              {isDragActive 
                ? 'Drop your image here...' 
                : 'Drag and drop an image, or click to browse'
              }
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDetailsStep = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Form */}
      <div className="space-y-6">
        <div>
          <Typography variant="h3" className="mb-4">
            Card Details
          </Typography>
        </div>

        <div>
          <label className="block text-sm font-medium text-crd-lightGray mb-2">
            Card Title *
          </label>
          <Input
            value={cardData.title}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="Enter your card title"
            className="bg-[#353945] border-crd-mediumGray text-crd-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-crd-lightGray mb-2">
            Description
          </label>
          <Textarea
            value={cardData.description || ''}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="Describe your card..."
            rows={3}
            className="bg-[#353945] border-crd-mediumGray text-crd-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-crd-lightGray mb-2">
            Rarity
          </label>
          <Select 
            value={cardData.rarity} 
            onValueChange={(value) => updateField('rarity', value as CardRarity)}
          >
            <SelectTrigger className="bg-[#353945] border-crd-mediumGray text-crd-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {RARITIES.map((rarity) => (
                <SelectItem key={rarity.value} value={rarity.value}>
                  <span className={rarity.color}>{rarity.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-3 pt-4">
          <CRDButton
            variant="secondary"
            onClick={() => setStep('upload')}
            className="flex-1"
          >
            Back
          </CRDButton>
          <CRDButton
            onClick={() => setStep('preview')}
            disabled={!cardData.title.trim()}
            className="flex-1"
          >
            Preview
          </CRDButton>
        </div>
      </div>

      {/* Live Preview */}
      <div className="flex flex-col items-center justify-center">
        <div className="relative">
          <div className="w-64 h-[22rem] bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden shadow-2xl">
            {cardData.image_url ? (
              <img 
                src={cardData.image_url} 
                alt="Card preview" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-300 rounded-lg flex items-center justify-center">
                    <Upload className="w-8 h-8" />
                  </div>
                  <p className="text-sm">Your image here</p>
                </div>
              </div>
            )}
            {/* Card title overlay */}
            {cardData.title && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <h3 className="text-white font-bold text-lg">{cardData.title}</h3>
                {cardData.rarity !== 'common' && (
                  <span className={`text-sm font-medium ${RARITIES.find(r => r.value === cardData.rarity)?.color}`}>
                    {RARITIES.find(r => r.value === cardData.rarity)?.label}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPreviewStep = () => (
    <div className="text-center space-y-8">
      <div>
        <Typography variant="h3" className="mb-2">
          Your Card is Ready!
        </Typography>
        <Typography variant="body" className="text-crd-lightGray">
          You can publish it now or continue editing in our full studio
        </Typography>
      </div>

      {/* Card Preview */}
      <div className="flex justify-center">
        <div className="w-80 h-[28rem] bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform">
          {cardData.image_url && (
            <img 
              src={cardData.image_url} 
              alt={cardData.title} 
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
            <h3 className="text-white font-bold text-xl mb-1">{cardData.title}</h3>
            {cardData.description && (
              <p className="text-gray-200 text-sm mb-2">{cardData.description}</p>
            )}
            <span className={`text-sm font-medium ${RARITIES.find(r => r.value === cardData.rarity)?.color}`}>
              {RARITIES.find(r => r.value === cardData.rarity)?.label}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        <CRDButton
          variant="secondary"
          onClick={() => setStep('details')}
        >
          Edit Details
        </CRDButton>
        <CRDButton
          onClick={handleQuickPublish}
          disabled={isSaving}
        >
          {isSaving ? 'Publishing...' : 'Publish Now'}
        </CRDButton>
        <CRDButton
          variant="secondary"
          onClick={handleContinueInStudio}
          className="border-crd-green text-crd-green hover:bg-crd-green hover:text-black"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Continue in Studio
        </CRDButton>
      </div>
    </div>
  );

  return (
    <div className="bg-[#141416] py-20 px-4 md:px-8 lg:px-[352px]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Typography as="h2" variant="h1" className="mb-4">
            Create Your First Card in Minutes
          </Typography>
          <Typography variant="body" className="text-crd-lightGray text-lg max-w-2xl mx-auto">
            Upload an image, add some details, and watch your card come to life. No experience needed!
          </Typography>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-4">
            {['upload', 'details', 'preview'].map((stepName, index) => (
              <div key={stepName} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  step === stepName 
                    ? 'bg-crd-green text-black' 
                    : index < ['upload', 'details', 'preview'].indexOf(step)
                    ? 'bg-crd-green text-black'
                    : 'bg-crd-mediumGray text-gray-400'
                }`}>
                  {index + 1}
                </div>
                {index < 2 && (
                  <div className={`w-12 h-1 mx-2 transition-colors ${
                    index < ['upload', 'details', 'preview'].indexOf(step) 
                      ? 'bg-crd-green' 
                      : 'bg-crd-mediumGray'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-[#23262F] rounded-2xl p-8 min-h-[400px]">
          {step === 'upload' && renderUploadStep()}
          {step === 'details' && renderDetailsStep()}
          {step === 'preview' && renderPreviewStep()}
        </div>
      </div>
    </div>
  );
};
