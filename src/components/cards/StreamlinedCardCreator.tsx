
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Upload, Sparkles, Share2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useSimpleCardEditor } from '@/hooks/useSimpleCardEditor';
import { getFrameConfigs } from '../studio/enhanced/frames/CardFrameConfigs';
import { FrameRenderer } from '../editor/frames/FrameRenderer';
import type { CardRarity } from '@/types/card';

export const StreamlinedCardCreator: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cardData, updateField, saveCard, isSaving } = useSimpleCardEditor();
  
  // Simple state management with debugging
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');
  const [selectedFrameId, setSelectedFrameId] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  console.log('🎨 StreamlinedCardCreator render:', {
    uploadedImageUrl: uploadedImageUrl ? 'Present' : 'Empty',
    selectedFrameId,
    cardDataImageUrl: cardData.image_url,
    user: user ? 'Authenticated' : 'Not authenticated'
  });

  // Load saved draft on mount
  React.useEffect(() => {
    const savedDraft = localStorage.getItem('streamlined-card-draft');
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        console.log('📋 Loading draft:', draft);
        setUploadedImageUrl(draft.imageUrl || '');
        setSelectedFrameId(draft.frameId || '');
        updateField('title', draft.title || '');
        updateField('description', draft.description || '');
        updateField('rarity', draft.rarity || 'common');
      } catch (error) {
        console.warn('Failed to load draft:', error);
      }
    }
  }, [updateField]);

  // Save draft whenever state changes
  const saveDraft = useCallback(() => {
    const draft = {
      imageUrl: uploadedImageUrl,
      frameId: selectedFrameId,
      title: cardData.title,
      description: cardData.description,
      rarity: cardData.rarity
    };
    localStorage.setItem('streamlined-card-draft', JSON.stringify(draft));
    console.log('💾 Draft saved:', draft);
  }, [uploadedImageUrl, selectedFrameId, cardData]);

  React.useEffect(() => {
    saveDraft();
  }, [saveDraft]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!acceptedFiles.length) {
      console.warn('No files accepted');
      return;
    }

    if (!user) {
      toast.error('Please sign in to upload images');
      return;
    }

    const file = acceptedFiles[0];
    console.log('📁 File dropped:', {
      name: file.name,
      size: file.size,
      type: file.type
    });

    setIsUploading(true);

    try {
      // Create a blob URL for immediate preview
      const blobUrl = URL.createObjectURL(file);
      console.log('🔗 Created blob URL:', blobUrl);
      
      // Set the image URL immediately for preview
      setUploadedImageUrl(blobUrl);
      updateField('image_url', blobUrl);
      
      toast.success('Image uploaded successfully!');
      console.log('✅ Image upload completed, URL set to:', blobUrl);
    } catch (error) {
      console.error('❌ Upload failed:', error);
      toast.error('Upload failed. Please try again.');
      setUploadedImageUrl('');
    } finally {
      setIsUploading(false);
    }
  }, [user, updateField]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1,
    disabled: isUploading
  });

  const handleFrameSelect = useCallback((frameId: string) => {
    console.log('🖼️ Frame selected:', frameId);
    setSelectedFrameId(frameId);
    updateField('template_id', frameId);
    toast.success('Frame applied!');
  }, [updateField]);

  const handlePublish = async () => {
    if (!user) {
      toast.error('Please sign in to publish cards');
      navigate('/auth');
      return;
    }

    if (!cardData.title.trim()) {
      toast.error('Please enter a card title');
      return;
    }

    if (!uploadedImageUrl) {
      toast.error('Please upload an image');
      return;
    }

    console.log('🚀 Publishing card with data:', {
      title: cardData.title,
      imageUrl: uploadedImageUrl,
      frameId: selectedFrameId
    });

    const success = await saveCard();
    if (success) {
      toast.success('🎉 Card published successfully!');
      // Clear draft
      localStorage.removeItem('streamlined-card-draft');
      // Reset form
      setUploadedImageUrl('');
      setSelectedFrameId('');
      updateField('title', '');
      updateField('description', '');
      updateField('rarity', 'common');
    }
  };

  const frames = getFrameConfigs();

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
              onClick={handlePublish}
              disabled={isSaving || !uploadedImageUrl || !cardData.title.trim()}
              className="bg-crd-green hover:bg-crd-green/90 text-black"
            >
              <Share2 className="w-4 h-4 mr-2" />
              {isSaving ? 'Publishing...' : 'Publish Card'}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side: Upload and Details */}
          <div className="space-y-6">
            {/* Image Upload */}
            <Card className="p-6 bg-editor-dark border-editor-border">
              <h2 className="text-white font-semibold mb-4 flex items-center">
                <Upload className="w-5 h-5 mr-2" />
                Upload Your Image
              </h2>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${
                  isDragActive 
                    ? 'border-crd-green bg-crd-green/5' 
                    : 'border-editor-border hover:border-crd-green/50 hover:bg-crd-green/5'
                } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <input {...getInputProps()} />
                <Upload className="w-12 h-12 mx-auto text-crd-green mb-4" />
                <p className="text-white mb-2">
                  {isUploading ? 'Uploading...' : isDragActive ? 'Drop it here!' : 'Drag & drop your photo'}
                </p>
                <p className="text-crd-lightGray text-sm">or click to browse</p>
                
                {/* Debug info */}
                {uploadedImageUrl && (
                  <div className="mt-4 p-3 bg-crd-green/10 rounded-lg">
                    <p className="text-crd-green text-sm font-medium">✓ Image loaded</p>
                    <p className="text-xs text-crd-lightGray truncate">URL: {uploadedImageUrl}</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Card Details */}
            <Card className="p-6 bg-editor-dark border-editor-border">
              <h3 className="text-white font-semibold mb-4">Card Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-crd-lightGray text-sm mb-2 block">Title *</label>
                  <Input
                    value={cardData.title}
                    onChange={(e) => updateField('title', e.target.value)}
                    className="bg-editor-tool border-editor-border text-white"
                    placeholder="Enter card title"
                  />
                </div>
                
                <div>
                  <label className="text-crd-lightGray text-sm mb-2 block">Description</label>
                  <Textarea
                    value={cardData.description || ''}
                    onChange={(e) => updateField('description', e.target.value)}
                    className="bg-editor-tool border-editor-border text-white"
                    placeholder="Describe your card..."
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="text-crd-lightGray text-sm mb-2 block">Rarity</label>
                  <Select value={cardData.rarity} onValueChange={(value) => updateField('rarity', value as CardRarity)}>
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
              </div>
            </Card>
          </div>

          {/* Right Side: Preview and Frames */}
          <div className="space-y-6">
            {/* Card Preview */}
            <Card className="p-6 bg-editor-dark border-editor-border">
              <h3 className="text-white font-semibold mb-4">Live Preview</h3>
              <div className="flex justify-center">
                <div className="w-80 h-96 relative">
                  {uploadedImageUrl ? (
                    <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-600 overflow-hidden">
                      {selectedFrameId ? (
                        <FrameRenderer
                          frameId={selectedFrameId}
                          imageUrl={uploadedImageUrl}
                          title={cardData.title || 'Your Card'}
                          subtitle={cardData.description || cardData.rarity}
                          width={320}
                          height={384}
                          cardData={cardData}
                        />
                      ) : (
                        <div className="relative w-full h-full">
                          <img 
                            src={uploadedImageUrl} 
                            alt="Card preview" 
                            className="w-full h-full object-cover"
                            onLoad={() => console.log('✅ Image loaded successfully in preview')}
                            onError={(e) => console.error('❌ Image failed to load in preview:', e)}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
                          <div className="absolute bottom-4 left-4 right-4 text-center">
                            <h3 className="text-white text-lg font-bold mb-1">
                              {cardData.title || 'Your Card'}
                            </h3>
                            <p className="text-gray-200 text-sm">
                              Select a frame below
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border-2 border-dashed border-gray-600 flex items-center justify-center">
                      <div className="text-center text-gray-400">
                        <Sparkles className="w-12 h-12 mx-auto mb-4" />
                        <p className="text-lg font-medium mb-2">Your Card Preview</p>
                        <p className="text-sm">Upload an image to get started</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Frame Selection */}
            <Card className="p-6 bg-editor-dark border-editor-border">
              <h3 className="text-white font-semibold mb-4">Choose Frame</h3>
              <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto">
                {frames.map((frame) => (
                  <button
                    key={frame.id}
                    onClick={() => handleFrameSelect(frame.id)}
                    className={`p-3 rounded-lg border-2 transition-all text-left ${
                      selectedFrameId === frame.id
                        ? 'border-crd-green bg-crd-green/10'
                        : 'border-editor-border hover:border-crd-green/50'
                    }`}
                  >
                    <div className="text-white font-medium text-sm mb-1">{frame.name}</div>
                    <div className="text-crd-lightGray text-xs">{frame.category}</div>
                  </button>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
