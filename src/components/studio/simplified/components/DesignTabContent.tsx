
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { 
  Type, Image as ImageIcon, Upload, Eye, EyeOff
} from 'lucide-react';
import { toast } from 'sonner';

interface GridCard {
  id: string;
  cardData: any;
  gridPosition: number;
  currentPhoto?: string;
}

interface DesignTabContentProps {
  selectedCard: GridCard;
  onUpdateCard: (cardId: string, field: string, value: any) => void;
}

export const DesignTabContent: React.FC<DesignTabContentProps> = ({
  selectedCard,
  onUpdateCard
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { cardData } = selectedCard;

  const handleFieldUpdate = (field: string, value: any) => {
    onUpdateCard(selectedCard.id, field, value);
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onUpdateCard(selectedCard.id, 'currentPhoto', url);
      onUpdateCard(selectedCard.id, 'image_url', url);
      toast.success('Photo uploaded successfully');
    }
  };

  return (
    <div className="space-y-8 mt-8">
      {/* Card Details Section */}
      <Card className="bg-studio-darker/50 border-studio-border/30 p-8 space-y-8 rounded-2xl shadow-xl backdrop-blur-sm">
        <div className="flex items-center gap-4 mb-6">
          <Type className="w-6 h-6 text-studio-accent" />
          <h4 className="text-studio-text font-bold text-xl">Card Details</h4>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="text-studio-text text-sm font-semibold mb-4 block">
              Card Title
            </label>
            <Input
              value={cardData.title}
              onChange={(e) => handleFieldUpdate('title', e.target.value)}
              className="bg-studio-dark border-studio-border/50 text-studio-text placeholder:text-studio-text/50 focus:border-studio-accent focus:ring-2 focus:ring-studio-accent/30 transition-all duration-200 rounded-xl h-14 text-base"
              placeholder="Enter your card title..."
            />
          </div>
          
          <div>
            <label className="text-studio-text text-sm font-semibold mb-4 block">
              Description
            </label>
            <Textarea
              value={cardData.description || ''}
              onChange={(e) => handleFieldUpdate('description', e.target.value)}
              className="bg-studio-dark border-studio-border/50 text-studio-text placeholder:text-studio-text/50 focus:border-studio-accent focus:ring-2 focus:ring-studio-accent/30 transition-all duration-200 rounded-xl h-28 resize-none text-base"
              placeholder="Describe your card..."
            />
          </div>
          
          <div>
            <label className="text-studio-text text-sm font-semibold mb-4 block">
              Rarity Level
            </label>
            <select
              value={cardData.rarity}
              onChange={(e) => handleFieldUpdate('rarity', e.target.value)}
              className="w-full bg-studio-dark border border-studio-border/50 rounded-xl px-5 py-4 text-studio-text text-base focus:border-studio-accent focus:ring-2 focus:ring-studio-accent/30 transition-all duration-200"
            >
              <option value="common">Common</option>
              <option value="uncommon">Uncommon</option>
              <option value="rare">Rare</option>
              <option value="epic">Epic</option>
              <option value="legendary">Legendary</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Image Upload Section */}
      <Card className="bg-studio-darker/50 border-studio-border/30 p-8 rounded-2xl shadow-xl backdrop-blur-sm">
        <div className="flex items-center gap-4 mb-6">
          <ImageIcon className="w-6 h-6 text-studio-accent" />
          <h4 className="text-studio-text font-bold text-xl">Card Image</h4>
        </div>
        
        <div className="space-y-6">
          <div className="border-2 border-dashed border-studio-border/50 rounded-2xl p-10 text-center hover:border-studio-accent/50 hover:bg-studio-accent/5 transition-all duration-300 group">
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
              id="photo-upload"
            />
            <label htmlFor="photo-upload" className="cursor-pointer">
              <Upload className="w-12 h-12 mx-auto mb-5 text-studio-text/50 group-hover:text-studio-accent transition-colors duration-200" />
              <p className="text-studio-text text-lg font-semibold mb-3">Upload New Photo</p>
              <p className="text-studio-text/60 text-sm">PNG, JPG up to 10MB</p>
            </label>
          </div>
          
          {selectedCard.currentPhoto && (
            <div className="aspect-video rounded-xl overflow-hidden border-2 border-studio-border/30 shadow-lg">
              <img 
                src={selectedCard.currentPhoto} 
                alt="Card preview" 
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </Card>

      {/* Advanced Options */}
      <div className="pt-2">
        <Button
          onClick={() => setShowAdvanced(!showAdvanced)}
          variant="ghost"
          className="w-full text-studio-text/70 hover:text-studio-text hover:bg-studio-darker/50 justify-between py-5 rounded-xl text-base"
        >
          <span className="font-semibold">Advanced Options</span>
          {showAdvanced ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </Button>
        
        {showAdvanced && (
          <Card className="bg-studio-darker/30 border-studio-border/30 p-6 mt-5 rounded-xl">
            <p className="text-xs text-studio-text/50 text-center">
              Publishing settings, metadata, and other advanced options will appear here.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};
