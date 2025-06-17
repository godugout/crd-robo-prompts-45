
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Edit3 } from 'lucide-react';

interface BasicCardInfoProps {
  cardName: string;
  cardDescription: string;
  onNameChange: (name: string) => void;
  onDescriptionChange: (description: string) => void;
}

export const BasicCardInfo: React.FC<BasicCardInfoProps> = ({
  cardName,
  cardDescription,
  onNameChange,
  onDescriptionChange
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Edit3 className="w-5 h-5 text-crd-green" />
        <h2 className="text-lg font-bold text-white">Card Information</h2>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="card-name" className="text-sm font-medium text-white">
            Card Name
          </Label>
          <Input
            id="card-name"
            value={cardName}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Enter your card name..."
            className="bg-black/30 border-white/20 text-white placeholder:text-gray-400 focus:border-crd-green"
            maxLength={50}
          />
          <p className="text-xs text-gray-400">
            {cardName.length}/50 characters
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="card-description" className="text-sm font-medium text-white">
            Description
          </Label>
          <Textarea
            id="card-description"
            value={cardDescription}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Describe your card..."
            className="bg-black/30 border-white/20 text-white placeholder:text-gray-400 focus:border-crd-green min-h-[80px] resize-none"
            maxLength={200}
          />
          <p className="text-xs text-gray-400">
            {cardDescription.length}/200 characters
          </p>
        </div>
      </div>
    </div>
  );
};
