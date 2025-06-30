
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ImageUploader } from './components/ImageUploader';
import { FrameSelector } from './components/FrameSelector';
import { CardRenderer } from './components/CardRenderer';
import { CardExporter } from './components/CardExporter';
import { Upload, Download, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

interface CardData {
  title: string;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  image: File | null;
  imageUrl: string;
  frameId: string;
}

export const FunctionalCardCreator: React.FC = () => {
  const [cardData, setCardData] = useState<CardData>({
    title: 'My Awesome Card',
    description: 'A powerful card with amazing abilities',
    rarity: 'common',
    image: null,
    imageUrl: '',
    frameId: 'classic'
  });

  const [isExporting, setIsExporting] = useState(false);
  const cardRendererRef = useRef<{ exportCard: () => Promise<Blob> }>(null);

  const handleImageUpload = (file: File, url: string) => {
    setCardData(prev => ({
      ...prev,
      image: file,
      imageUrl: url
    }));
    toast.success('Image uploaded successfully!');
  };

  const handleFieldChange = (field: keyof CardData, value: any) => {
    setCardData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleExport = async () => {
    if (!cardRendererRef.current) {
      toast.error('Card renderer not ready');
      return;
    }

    setIsExporting(true);
    try {
      const blob = await cardRendererRef.current.exportCard();
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${cardData.title.replace(/\s+/g, '_').toLowerCase()}_card.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Card exported successfully!');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export card');
    } finally {
      setIsExporting(false);
    }
  };

  const handleReset = () => {
    setCardData({
      title: 'My Awesome Card',
      description: 'A powerful card with amazing abilities',
      rarity: 'common',
      image: null,
      imageUrl: '',
      frameId: 'classic'
    });
    toast.success('Card reset to defaults');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Card Creator Studio</h1>
          <p className="text-gray-300">Create professional trading cards with real-time preview</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls Panel */}
          <div className="space-y-6">
            {/* Image Upload */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Upload Image
                </h3>
                <ImageUploader onImageUpload={handleImageUpload} />
              </CardContent>
            </Card>

            {/* Card Details */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-xl font-semibold text-white mb-4">Card Details</h3>
                
                <div>
                  <Label htmlFor="title" className="text-gray-300">Title</Label>
                  <Input
                    id="title"
                    value={cardData.title}
                    onChange={(e) => handleFieldChange('title', e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Enter card title"
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-gray-300">Description</Label>
                  <Textarea
                    id="description"
                    value={cardData.description}
                    onChange={(e) => handleFieldChange('description', e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Enter card description"
                    rows={3}
                  />
                </div>

                <div>
                  <Label className="text-gray-300">Rarity</Label>
                  <Select 
                    value={cardData.rarity} 
                    onValueChange={(value) => handleFieldChange('rarity', value)}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
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
              </CardContent>
            </Card>

            {/* Frame Selection */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Frame Style</h3>
                <FrameSelector
                  selectedFrameId={cardData.frameId}
                  onFrameSelect={(frameId) => handleFieldChange('frameId', frameId)}
                />
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                onClick={handleExport}
                disabled={isExporting || !cardData.imageUrl}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <Download className="w-4 h-4 mr-2" />
                {isExporting ? 'Exporting...' : 'Export Card'}
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:sticky lg:top-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Live Preview</h3>
                <div className="flex justify-center">
                  <CardRenderer
                    ref={cardRendererRef}
                    cardData={cardData}
                    width={400}
                    height={560}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
