
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Share2, Eye, FileImage, Box, Sparkles } from 'lucide-react';

interface PublishingWorkflowProps {
  cardData: any;
  onDataUpdate: (data: any) => void;
}

const EXPORT_FORMATS = [
  {
    id: 'crd',
    name: 'CRD File',
    description: 'Full card data with 3D information',
    icon: Box,
    extension: '.crd'
  },
  {
    id: 'cci',
    name: 'CRD Catalog Image',
    description: 'Optimized for marketplace display',
    icon: FileImage,
    extension: '.cci'
  },
  {
    id: 'png',
    name: 'PNG Image',
    description: 'High-quality transparent background',
    icon: FileImage,
    extension: '.png'
  },
  {
    id: 'jpeg',
    name: 'JPEG Image',
    description: 'Standard image format',
    icon: FileImage,
    extension: '.jpg'
  }
];

export const PublishingWorkflow: React.FC<PublishingWorkflowProps> = ({
  cardData,
  onDataUpdate
}) => {
  const handleFieldUpdate = (field: string, value: any) => {
    onDataUpdate({
      ...cardData,
      [field]: value
    });
  };

  const handleExport = (format: string) => {
    console.log(`Exporting card as ${format}...`);
    // Export logic would go here
  };

  const handlePublish = () => {
    console.log('Publishing card...', cardData);
    // Publishing logic would go here
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
        {/* Publishing Details */}
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-black text-[#FCFCFD] mb-2">Publish Your Card</h2>
            <p className="text-[#777E90]">Add details and export your professional card</p>
          </div>

          {/* Card Details Form */}
          <Card className="p-6 bg-[#23262F] border-[#353945]">
            <h3 className="text-lg font-bold text-[#FCFCFD] mb-4">Card Information</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-[#777E90] mb-2 block">Card Title *</label>
                <Input
                  value={cardData.title || ''}
                  onChange={(e) => handleFieldUpdate('title', e.target.value)}
                  placeholder="Enter card title..."
                  className="bg-[#141416] border-[#353945] text-[#FCFCFD] placeholder:text-[#777E90]"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-[#777E90] mb-2 block">Description</label>
                <Textarea
                  value={cardData.description || ''}
                  onChange={(e) => handleFieldUpdate('description', e.target.value)}
                  placeholder="Describe your card..."
                  className="bg-[#141416] border-[#353945] text-[#FCFCFD] placeholder:text-[#777E90] resize-none"
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-[#777E90] mb-2 block">Rarity</label>
                <Select value={cardData.rarity} onValueChange={(value) => handleFieldUpdate('rarity', value)}>
                  <SelectTrigger className="bg-[#141416] border-[#353945] text-[#FCFCFD]">
                    <SelectValue placeholder="Select rarity..." />
                  </SelectTrigger>
                  <SelectContent className="bg-[#23262F] border-[#353945]">
                    <SelectItem value="common">Common</SelectItem>
                    <SelectItem value="rare">Rare</SelectItem>
                    <SelectItem value="epic">Epic</SelectItem>
                    <SelectItem value="legendary">Legendary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Export Options */}
          <Card className="p-6 bg-[#23262F] border-[#353945]">
            <h3 className="text-lg font-bold text-[#FCFCFD] mb-4">Export Formats</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {EXPORT_FORMATS.map((format) => {
                const IconComponent = format.icon;
                return (
                  <Button
                    key={format.id}
                    onClick={() => handleExport(format.id)}
                    variant="outline"
                    className="h-auto p-4 border-[#353945] text-left hover:border-[#3772FF]/50 hover:bg-[#3772FF]/10"
                  >
                    <div className="flex items-start gap-3 w-full">
                      <IconComponent className="w-5 h-5 text-[#3772FF] mt-0.5" />
                      <div>
                        <div className="font-semibold text-[#FCFCFD] text-sm">{format.name}</div>
                        <div className="text-xs text-[#777E90]">{format.description}</div>
                        <Badge className="mt-1 bg-[#353945] text-[#B1B5C3] text-xs">
                          {format.extension}
                        </Badge>
                      </div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </Card>

          {/* Publishing Actions */}
          <div className="flex gap-3">
            <Button
              onClick={() => handleExport('preview')}
              variant="outline"
              className="flex-1 border-[#353945] text-[#777E90] hover:text-[#FCFCFD] hover:bg-[#353945]"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button
              onClick={handlePublish}
              disabled={!cardData.title}
              className="flex-1 bg-[#3772FF] hover:bg-[#3772FF]/90 text-white font-extrabold"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Publish Card
            </Button>
          </div>
        </div>

        {/* Final Preview */}
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-[#FCFCFD] mb-2">Final Preview</h3>
            <p className="text-[#777E90]">Your completed card ready for export</p>
          </div>

          {/* Card Preview */}
          <Card className="aspect-[5/7] bg-gradient-to-br from-[#353945] to-[#23262F] border-[#353945] overflow-hidden relative">
            {cardData.uploadedImage && cardData.selectedFrame ? (
              <div className="w-full h-full flex items-center justify-center p-8">
                <div className="relative w-full h-full bg-[#141416] rounded-lg overflow-hidden shadow-2xl">
                  <img
                    src={cardData.uploadedImage}
                    alt="Final Card"
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Effects overlay */}
                  {Object.keys(cardData.effects || {}).length > 0 && (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#3772FF]/20 to-[#F97316]/20" />
                  )}
                  
                  {/* Card title overlay */}
                  {cardData.title && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <h4 className="text-white font-bold text-lg">{cardData.title}</h4>
                      {cardData.rarity && (
                        <Badge className="mt-1 bg-[#3772FF] text-white text-xs">
                          {cardData.rarity}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#777E90]">
                <div className="text-center">
                  <Sparkles className="w-12 h-12 mx-auto mb-2" />
                  <p className="text-sm">Complete all steps to see final preview</p>
                </div>
              </div>
            )}
          </Card>

          {/* Card Summary */}
          <Card className="p-4 bg-[#23262F] border-[#353945]">
            <h4 className="text-sm font-bold text-[#FCFCFD] mb-3">Card Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#777E90]">Frame:</span>
                <span className="text-[#FCFCFD]">{cardData.selectedFrame || 'None selected'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#777E90]">Image:</span>
                <span className="text-[#FCFCFD]">{cardData.uploadedImage ? 'Uploaded' : 'None'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#777E90]">Effects:</span>
                <span className="text-[#FCFCFD]">{Object.keys(cardData.effects || {}).length} applied</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#777E90]">Environment:</span>
                <span className="text-[#FCFCFD] capitalize">{cardData.environment || 'studio'}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
