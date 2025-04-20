
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Crown } from 'lucide-react';
import { SidebarSection } from '../SidebarSection';

export const RaritySection = () => {
  const [isLimited, setIsLimited] = useState(false);
  const [rarityLevel, setRarityLevel] = useState(0);
  const rarityLabels = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];

  return (
    <SidebarSection title="Rarity & Edition">
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="text-cardshow-white font-medium">Limited Edition</h4>
            <p className="text-xs text-cardshow-lightGray mt-1">Create a limited number of this card</p>
          </div>
          <Switch checked={isLimited} onCheckedChange={setIsLimited} />
        </div>
        
        {isLimited && (
          <div className="space-y-4 p-3 bg-editor-darker rounded-lg">
            <div>
              <Label htmlFor="edition-size" className="text-xs text-cardshow-lightGray">EDITION SIZE</Label>
              <Input 
                id="edition-size"
                className="input-dark mt-1"
                type="number" 
                min="1"
                defaultValue="50"
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs text-cardshow-lightGray">RARITY LEVEL</Label>
                <span className="text-xs font-medium" style={{ color: rarityLevel >= 4 ? '#FFD700' : rarityLevel >= 3 ? '#9b87f5' : rarityLevel >= 2 ? '#1E90FF' : rarityLevel >= 1 ? '#32CD32' : '#white' }}>
                  {rarityLabels[rarityLevel]}
                </span>
              </div>
              <Slider 
                value={[rarityLevel]} 
                onValueChange={(val) => setRarityLevel(val[0])} 
                min={0} 
                max={4} 
                step={1}
                className="py-0"
              />
              <div className="flex justify-between mt-1 text-[10px] text-cardshow-lightGray">
                <span>Common</span>
                <span>Uncommon</span>
                <span>Rare</span>
                <span>Epic</span>
                <span>Legendary</span>
              </div>
            </div>
            
            {rarityLevel === 4 && (
              <div className="flex items-center p-2 bg-gradient-to-r from-yellow-900/30 to-yellow-600/30 rounded border border-yellow-600/50">
                <Crown className="text-yellow-500 mr-2" size={18} />
                <span className="text-xs text-yellow-400">Legendary cards have special effects</span>
              </div>
            )}
          </div>
        )}
      </div>
    </SidebarSection>
  );
};

