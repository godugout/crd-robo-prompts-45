
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Type, 
  Palette, 
  Move,
  RotateCw,
  Scale,
  Eye
} from 'lucide-react';
import type { CardData } from '@/types/card';

interface PropertiesPanelProps {
  cardData: CardData;
  onUpdateCardData: (updates: Partial<CardData>) => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  cardData,
  onUpdateCardData
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-green-400">Properties</h3>
        <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
          <Settings className="w-3 h-3 mr-1" />
          Card
        </Badge>
      </div>

      {/* Card Information */}
      <Card className="p-4 bg-black/20 border-white/10">
        <h4 className="text-sm font-medium text-white mb-3 flex items-center">
          <Type className="w-4 h-4 mr-2" />
          Card Details
        </h4>
        
        <div className="space-y-3">
          <div>
            <Label htmlFor="card-title" className="text-xs text-gray-400">Title</Label>
            <Input
              id="card-title"
              value={cardData.title}
              onChange={(e) => onUpdateCardData({ title: e.target.value })}
              className="bg-black/30 border-white/20 text-white"
              placeholder="Enter card title"
            />
          </div>
          
          <div>
            <Label htmlFor="card-description" className="text-xs text-gray-400">Description</Label>
            <Input
              id="card-description"
              value={cardData.description}
              onChange={(e) => onUpdateCardData({ description: e.target.value })}
              className="bg-black/30 border-white/20 text-white"
              placeholder="Enter card description"
            />
          </div>
        </div>
      </Card>

      {/* Rarity Settings */}
      <Card className="p-4 bg-black/20 border-white/10">
        <h4 className="text-sm font-medium text-white mb-3 flex items-center">
          <Palette className="w-4 h-4 mr-2" />
          Rarity
        </h4>
        
        <div className="grid grid-cols-2 gap-2">
          {['common', 'uncommon', 'rare', 'epic', 'legendary'].map((rarity) => (
            <Button
              key={rarity}
              onClick={() => onUpdateCardData({ rarity: rarity as any })}
              variant={cardData.rarity === rarity ? "default" : "outline"}
              size="sm"
              className={`text-xs ${
                cardData.rarity === rarity 
                  ? 'bg-green-500 text-black' 
                  : 'border-white/20 text-white hover:bg-white/10'
              }`}
            >
              {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
            </Button>
          ))}
        </div>
      </Card>

      {/* Transform Controls */}
      <Card className="p-4 bg-black/20 border-white/10">
        <h4 className="text-sm font-medium text-white mb-3 flex items-center">
          <Move className="w-4 h-4 mr-2" />
          Transform
        </h4>
        
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Move className="w-3 h-3 mr-1" />
              Move
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <RotateCw className="w-3 h-3 mr-1" />
              Rotate
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Scale className="w-3 h-3 mr-1" />
              Scale
            </Button>
          </div>
        </div>
      </Card>

      {/* Visibility Settings */}
      <Card className="p-4 bg-black/20 border-white/10">
        <h4 className="text-sm font-medium text-white mb-3 flex items-center">
          <Eye className="w-4 h-4 mr-2" />
          Visibility
        </h4>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Public</span>
            <Badge 
              variant={cardData.visibility === 'public' ? "default" : "outline"}
              className={cardData.visibility === 'public' ? "bg-green-500 text-white" : "border-gray-500 text-gray-400"}
            >
              {cardData.visibility === 'public' ? 'Public' : 'Private'}
            </Badge>
          </div>
          <Button
            onClick={() => onUpdateCardData({ 
              visibility: cardData.visibility === 'public' ? 'private' : 'public' 
            })}
            variant="outline"
            size="sm"
            className="w-full border-white/20 text-white hover:bg-white/10"
          >
            Toggle Visibility
          </Button>
        </div>
      </Card>
    </div>
  );
};
