
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { SidebarSection } from '../SidebarSection';

export const CardDetailsSection = () => {
  const [title, setTitle] = useState('No roads needed');
  const [description, setDescription] = useState('Where we\'re going, there are only cards. An original digital art piece inspired by BTTF.');

  return (
    <SidebarSection title="Card Details">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title" className="text-sm text-cardshow-lightGray uppercase">Title</Label>
          <Input 
            id="title"
            className="input-dark mt-1"
            placeholder="Card title" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="description" className="text-sm text-cardshow-lightGray uppercase">Description</Label>
          <Textarea 
            id="description"
            className="input-dark mt-1 min-h-[80px] resize-none"
            placeholder="Card description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>
    </SidebarSection>
  );
};

