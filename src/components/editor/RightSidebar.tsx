
import React, { useState } from 'react';
import { SidebarSection } from './SidebarSection';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface CardProperty {
  name: string;
  value: string;
}

export const RightSidebar = () => {
  const [properties, setProperties] = useState<CardProperty[]>([
    { name: 'Type', value: 'Handcrafted' },
    { name: 'Series', value: '80s VCR' },
    { name: 'Category', value: 'Movies' },
  ]);
  
  const [isAvailableForPrinting, setIsAvailableForPrinting] = useState(true);
  const [isForSale, setIsForSale] = useState(false);
  const [isInCatalog, setIsInCatalog] = useState(false);
  
  return (
    <div className="w-80 h-full bg-editor-dark border-l border-editor-border overflow-y-auto">
      <SidebarSection title="Card Details">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-sm text-cardshow-lightGray uppercase">Title</Label>
            <input 
              id="title"
              type="text" 
              className="input-dark mt-1"
              placeholder="Card title" 
              defaultValue="No roads needed"
            />
          </div>
          
          <div>
            <Label htmlFor="description" className="text-sm text-cardshow-lightGray uppercase">Description</Label>
            <textarea 
              id="description"
              className="input-dark mt-1 min-h-[80px] resize-none"
              placeholder="Card description"
              defaultValue="Where we're going, there are only cards. An original digital art piece inspired by BTTF."
            />
          </div>
        </div>
      </SidebarSection>
      
      <SidebarSection title="Properties">
        <div className="grid grid-cols-2 gap-4">
          {properties.map((prop, index) => (
            <div key={index} className="col-span-1">
              <Label htmlFor={`prop-${index}`} className="text-xs text-cardshow-lightGray uppercase">{prop.name}</Label>
              <select id={`prop-${index}`} className="input-dark mt-1 text-sm">
                <option>{prop.value}</option>
              </select>
            </div>
          ))}
        </div>
        
        <div className="mt-4">
          <Label htmlFor="tags" className="text-xs text-cardshow-lightGray uppercase">Tags</Label>
          <input 
            id="tags"
            type="text" 
            className="input-dark mt-1"
            placeholder="#MOVIES #HANDCRAFTED #80sVCR" 
            defaultValue="#MOVIES #HANDCRAFTED #80sVCR"
          />
        </div>
      </SidebarSection>
      
      <SidebarSection title="Publishing Options">
        <div className="space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-cardshow-white font-medium">Make available for printing</h4>
              <p className="text-xs text-cardshow-lightGray mt-1">See if there is any fan interest in prints of your card.</p>
            </div>
            <Switch checked={isAvailableForPrinting} onCheckedChange={setIsAvailableForPrinting} />
          </div>
          
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-cardshow-white font-medium">Add to the market for sale</h4>
              <p className="text-xs text-cardshow-lightGray mt-1">Put up for purchase as a digital download.</p>
            </div>
            <Switch checked={isForSale} onCheckedChange={setIsForSale} />
          </div>
          
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-cardshow-white font-medium">Include in CRD Catalog</h4>
              <p className="text-xs text-cardshow-lightGray mt-1">Contribute to our official CRD Catalog.</p>
            </div>
            <Switch checked={isInCatalog} onCheckedChange={setIsInCatalog} />
          </div>
        </div>
      </SidebarSection>
      
      <SidebarSection title="Customize Design">
        <p className="text-cardshow-lightGray text-sm mb-4">Customize your card with a new card frame and elements</p>
        
        <div className="grid grid-cols-3 gap-3">
          <div className="template-item active aspect-square bg-editor-darker flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
              <span className="text-editor-dark text-lg font-bold">+</span>
            </div>
          </div>
          
          <div className="template-item aspect-square bg-editor-darker flex items-center justify-center">
            <div className="w-10 h-10 bg-cardshow-green rounded"></div>
          </div>
          
          <div className="template-item aspect-square bg-editor-darker flex items-center justify-center">
            <div className="w-10 h-10 bg-cardshow-orange rounded"></div>
          </div>
          
          <div className="template-item aspect-square bg-editor-darker flex items-center justify-center">
            <div className="w-10 h-10 bg-cardshow-purple rounded"></div>
          </div>
        </div>
      </SidebarSection>
      
      <div className="p-6">
        <button 
          className="btn-primary w-full"
        >
          Create Card
        </button>
      </div>
    </div>
  );
};
