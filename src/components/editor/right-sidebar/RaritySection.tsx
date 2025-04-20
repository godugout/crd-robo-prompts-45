
import React from 'react';
import { useCardEditor } from '@/hooks/useCardEditor';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { SidebarSection } from '../SidebarSection';

interface RaritySectionProps {
  cardEditor: ReturnType<typeof useCardEditor>;
}

export const RaritySection = ({ cardEditor }: RaritySectionProps) => {
  const { cardData, updateCardField } = cardEditor;
  
  const rarityOptions = [
    { value: 'common', label: 'Common', color: 'bg-gray-400' },
    { value: 'uncommon', label: 'Uncommon', color: 'bg-green-500' },
    { value: 'rare', label: 'Rare', color: 'bg-blue-500' },
    { value: 'legendary', label: 'Legendary', color: 'bg-purple-500' },
    { value: 'mythic', label: 'Mythic', color: 'bg-cardshow-orange' }
  ];
  
  return (
    <SidebarSection title="Rarity">
      <div className="space-y-4">
        <div>
          <Label className="text-sm text-cardshow-lightGray uppercase">Card Rarity</Label>
          <Select value={cardData.rarity} onValueChange={(value: any) => updateCardField('rarity', value)}>
            <SelectTrigger className="input-dark mt-1">
              <SelectValue placeholder="Select rarity" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Rarity</SelectLabel>
                {rarityOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center">
                      <div className={`h-3 w-3 rounded-full ${option.color} mr-2`}></div>
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center justify-between px-4 py-3 bg-editor-darker rounded-lg">
          <div>
            <p className="text-cardshow-white font-medium">Edition Size</p>
            <p className="text-cardshow-lightGray text-xs">How many copies will exist</p>
          </div>
          <div className="h-8 w-16 px-3 bg-editor-dark text-white flex items-center justify-center rounded-md font-mono">
            1/1
          </div>
        </div>
      </div>
    </SidebarSection>
  );
};
