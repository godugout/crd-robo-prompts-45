
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Check } from 'lucide-react';

interface CheckboxCardProps {
  id: string;
  title: string;
  imageUrl?: string;
  selected: boolean;
  onToggle: (id: string) => void;
}

export const CheckboxCard = ({ id, title, imageUrl, selected, onToggle }: CheckboxCardProps) => {
  return (
    <Card
      className={`cursor-pointer relative overflow-hidden transition-all duration-200 ${
        selected 
          ? 'border-2 border-blue-500 ring-2 ring-blue-500/20' 
          : 'border border-gray-200 hover:border-blue-300'
      }`}
      onClick={() => onToggle(id)}
    >
      {selected && (
        <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-1">
          <Check className="h-3 w-3 text-white" />
        </div>
      )}
      
      {imageUrl && (
        <div 
          className="h-28 bg-cover bg-center" 
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
      )}
      
      <CardContent className="p-3">
        <p className="font-medium text-sm truncate">{title}</p>
      </CardContent>
    </Card>
  );
};
