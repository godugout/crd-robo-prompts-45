
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Heart, Star, Zap, Trophy, Camera, Smile } from 'lucide-react';
import { toast } from 'sonner';

interface Sticker {
  id: string;
  name: string;
  category: string;
  emoji?: string;
  icon?: React.ComponentType<{ className?: string }>;
  color?: string;
  size?: 'small' | 'medium' | 'large';
}

interface StickerLibraryProps {
  onStickerSelect: (sticker: Sticker) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const STICKER_CATEGORIES = [
  { id: 'emojis', name: 'Emojis', icon: Smile },
  { id: 'sports', name: 'Sports', icon: Trophy },
  { id: 'social', name: 'Social', icon: Heart },
  { id: 'effects', name: 'Effects', icon: Zap },
  { id: 'shapes', name: 'Shapes', icon: Star },
  { id: 'crd', name: 'CRD Brand', icon: Camera }
];

const STICKERS: Sticker[] = [
  // Emoji Stickers
  { id: 'fire', name: 'Fire', category: 'emojis', emoji: '🔥' },
  { id: 'star-eyes', name: 'Star Eyes', category: 'emojis', emoji: '🤩' },
  { id: 'cool', name: 'Cool', category: 'emojis', emoji: '😎' },
  { id: 'heart', name: 'Heart', category: 'emojis', emoji: '❤️' },
  { id: 'lightning', name: 'Lightning', category: 'emojis', emoji: '⚡' },
  { id: 'crown', name: 'Crown', category: 'emojis', emoji: '👑' },
  
  // Sports Stickers
  { id: 'trophy-gold', name: 'Gold Trophy', category: 'sports', emoji: '🏆' },
  { id: 'medal', name: 'Medal', category: 'sports', emoji: '🥇' },
  { id: 'soccer', name: 'Soccer Ball', category: 'sports', emoji: '⚽' },
  { id: 'basketball', name: 'Basketball', category: 'sports', emoji: '🏀' },
  { id: 'football', name: 'Football', category: 'sports', emoji: '🏈' },
  
  // Social Stickers
  { id: 'thumbs-up', name: 'Thumbs Up', category: 'social', emoji: '👍' },
  { id: 'clap', name: 'Clapping', category: 'social', emoji: '👏' },
  { id: 'party', name: 'Party', category: 'social', emoji: '🎉' },
  { id: 'muscle', name: 'Muscle', category: 'social', emoji: '💪' },
  
  // Effect Stickers (using icons)
  { id: 'star-effect', name: 'Star Effect', category: 'effects', icon: Star, color: '#fbbf24' },
  { id: 'zap-effect', name: 'Zap Effect', category: 'effects', icon: Zap, color: '#3b82f6' },
  
  // Shape Stickers
  { id: 'heart-shape', name: 'Heart Shape', category: 'shapes', icon: Heart, color: '#ef4444' },
  { id: 'star-shape', name: 'Star Shape', category: 'shapes', icon: Star, color: '#fbbf24' },
  
  // CRD Brand Stickers
  { id: 'crd-logo', name: 'CRD Logo', category: 'crd', icon: Camera, color: '#16a085' },
  { id: 'crd-badge', name: 'CRD Badge', category: 'crd', emoji: '🎯' }
];

export const StickerLibrary: React.FC<StickerLibraryProps> = ({
  onStickerSelect,
  searchQuery,
  onSearchChange
}) => {
  const [selectedCategory, setSelectedCategory] = useState('emojis');

  const filteredStickers = STICKERS.filter(sticker => 
    sticker.category === selectedCategory &&
    sticker.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStickerClick = (sticker: Sticker) => {
    onStickerSelect(sticker);
    toast.success(`Added ${sticker.name} sticker!`);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-crd-lightGray w-4 h-4" />
        <Input
          placeholder="Search stickers..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-editor-darker border-editor-border text-white"
        />
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid grid-cols-3 w-full bg-editor-darker">
          {STICKER_CATEGORIES.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="text-xs data-[state=active]:bg-crd-green data-[state=active]:text-black"
            >
              <category.icon className="w-3 h-3 mr-1" />
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {STICKER_CATEGORIES.map((category) => (
          <TabsContent key={category.id} value={category.id} className="mt-4">
            <ScrollArea className="h-[300px]">
              <div className="grid grid-cols-4 gap-2">
                {filteredStickers.map((sticker) => (
                  <Button
                    key={sticker.id}
                    variant="ghost"
                    className="h-16 w-16 p-2 hover:bg-editor-border transition-colors"
                    onClick={() => handleStickerClick(sticker)}
                    title={sticker.name}
                  >
                    {sticker.emoji ? (
                      <span className="text-2xl">{sticker.emoji}</span>
                    ) : sticker.icon ? (
                      <sticker.icon 
                        className="w-6 h-6" 
                        style={{ color: sticker.color || '#ffffff' }}
                      />
                    ) : (
                      <div 
                        className="w-6 h-6 rounded"
                        style={{ backgroundColor: sticker.color || '#ccc' }}
                      />
                    )}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
