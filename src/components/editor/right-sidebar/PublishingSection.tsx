
import React, { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { SidebarSection } from '../SidebarSection';

export const PublishingSection = () => {
  const [isAvailableForPrinting, setIsAvailableForPrinting] = useState(true);
  const [isForSale, setIsForSale] = useState(false);
  const [isInCatalog, setIsInCatalog] = useState(false);

  return (
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
  );
};

