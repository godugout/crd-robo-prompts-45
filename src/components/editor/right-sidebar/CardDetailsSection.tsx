
import React from 'react';
import { useCardEditor } from '@/hooks/useCardEditor';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { SidebarSection } from '../SidebarSection';

interface CardDetailsSectionProps {
  cardEditor: ReturnType<typeof useCardEditor>;
}

export const CardDetailsSection = ({ cardEditor }: CardDetailsSectionProps) => {
  const { cardData, updateCardField } = cardEditor;

  return (
    <SidebarSection title="Card Details">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title" className="text-sm text-cardshow-lightGray uppercase">Title</Label>
          <Input 
            id="title"
            className="input-dark mt-1"
            placeholder="Card title" 
            value={cardData.title}
            onChange={(e) => updateCardField('title', e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="description" className="text-sm text-cardshow-lightGray uppercase">Description</Label>
          <Textarea 
            id="description"
            className="input-dark mt-1 min-h-[80px] resize-none"
            placeholder="Card description"
            value={cardData.description}
            onChange={(e) => updateCardField('description', e.target.value)}
          />
        </div>
      </div>
    </SidebarSection>
  );
};
