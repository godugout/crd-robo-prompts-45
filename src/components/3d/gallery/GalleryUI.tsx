
import React, { useState } from 'react';
import { Search, Grid, Circle, MoreHorizontal, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Collection } from '@/types/collections';
import type { Card } from '@/types/cards';

interface GalleryUIProps {
  collection: Collection;
  cards: Card[];
  selectedCard: Card | null;
  layoutType: string;
  onLayoutChange: (layout: string) => void;
  navigationState: any;
  onNavigateToCard: (cardId: string) => void;
  preferences: any;
  onPreferencesChange: (preferences: any) => void;
}

export const GalleryUI: React.FC<GalleryUIProps> = ({
  collection,
  cards,
  selectedCard,
  layoutType,
  onLayoutChange,
  navigationState,
  onNavigateToCard,
  preferences,
  onPreferencesChange
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  
  const layoutOptions = [
    { value: 'grid', label: 'Grid', icon: Grid },
    { value: 'circle', label: 'Circle', icon: Circle },
    { value: 'spiral', label: 'Spiral', icon: MoreHorizontal },
    { value: 'wall', label: 'Gallery Wall', icon: MoreHorizontal },
    { value: 'scatter', label: 'Scatter', icon: MoreHorizontal }
  ];
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Implement search logic
  };
  
  return (
    <>
      {/* Top toolbar */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
        <div className="flex items-center space-x-4 bg-black/80 backdrop-blur-sm rounded-lg p-3">
          <h2 className="text-white font-bold text-lg">{collection.title}</h2>
          <div className="text-white/70 text-sm">
            {cards.length} cards
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 w-4 h-4" />
            <Input
              placeholder="Search cards..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 bg-black/80 backdrop-blur-sm border-white/20 text-white placeholder-white/50 w-64"
            />
          </div>
          
          {/* Settings */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
            className="text-white hover:bg-white/20"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {/* Layout selector */}
      <div className="absolute top-20 right-4 z-10">
        <div className="bg-black/80 backdrop-blur-sm rounded-lg p-3">
          <div className="text-white text-sm mb-2">Layout</div>
          <div className="flex space-x-2">
            {layoutOptions.map((option) => {
              const Icon = option.icon;
              return (
                <Button
                  key={option.value}
                  variant={layoutType === option.value ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onLayoutChange(option.value)}
                  className="w-10 h-10 p-0"
                  title={option.label}
                >
                  <Icon className="w-4 h-4" />
                </Button>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Collection stats */}
      <div className="absolute bottom-4 left-4 z-10">
        <div className="bg-black/80 backdrop-blur-sm rounded-lg p-4">
          <div className="text-white text-sm space-y-2">
            <div>Total Cards: {cards.length}</div>
            <div>Completion: {collection.completion_rate}%</div>
            {selectedCard && (
              <div className="border-t border-white/20 pt-2 mt-2">
                <div className="font-medium">{selectedCard.title}</div>
                <div className="text-white/70">{selectedCard.rarity}</div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Navigation help */}
      <div className="absolute bottom-4 right-4 z-10">
        <div className="bg-black/80 backdrop-blur-sm rounded-lg p-3 text-white text-xs space-y-1">
          <div>Mouse: Orbit & Zoom</div>
          <div>WASD: Navigate</div>
          <div>Click: Select Card</div>
          <div>Space: Center View</div>
        </div>
      </div>
      
      {/* Settings panel */}
      {showSettings && (
        <div className="absolute top-20 right-4 z-20 w-80">
          <div className="bg-black/90 backdrop-blur-sm rounded-lg p-4 text-white">
            <h3 className="font-bold mb-4">Gallery Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Auto Rotate</label>
                <input
                  type="checkbox"
                  checked={preferences.autoRotate}
                  onChange={(e) => onPreferencesChange({
                    ...preferences,
                    autoRotate: e.target.checked
                  })}
                  className="w-4 h-4"
                />
              </div>
              
              <div>
                <label className="block text-sm mb-2">Quality</label>
                <Select
                  value={preferences.quality}
                  onValueChange={(value) => onPreferencesChange({
                    ...preferences,
                    quality: value
                  })}
                >
                  <SelectTrigger className="bg-black/50 border-white/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="ultra">Ultra</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm mb-2">Particles</label>
                <input
                  type="checkbox"
                  checked={preferences.enableParticles}
                  onChange={(e) => onPreferencesChange({
                    ...preferences,
                    enableParticles: e.target.checked
                  })}
                  className="w-4 h-4"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
