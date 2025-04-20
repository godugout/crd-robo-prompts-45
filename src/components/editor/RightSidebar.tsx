
import React from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { CardDetailsSection } from './right-sidebar/CardDetailsSection';
import { PropertiesSection } from './right-sidebar/PropertiesSection';
import { RaritySection } from './right-sidebar/RaritySection';
import { PublishingSection } from './right-sidebar/PublishingSection';
import { CustomizeDesignSection } from './right-sidebar/CustomizeDesignSection';

export const RightSidebar = () => {
  const handleCreateCard = () => {
    toast.success('Card created successfully!', {
      description: 'Your card has been saved and is ready for publishing.',
      action: {
        label: 'View Card',
        onClick: () => console.log('Viewing card')
      }
    });
  };
  
  return (
    <div className="w-80 h-full bg-editor-dark border-l border-editor-border overflow-y-auto">
      <CardDetailsSection />
      <PropertiesSection />
      <RaritySection />
      <PublishingSection />
      <CustomizeDesignSection />
      
      <div className="p-6">
        <Button 
          className="w-full bg-cardshow-green hover:bg-cardshow-green/90 text-white py-3 rounded-full font-medium transition-colors"
          onClick={handleCreateCard}
        >
          Create Card
        </Button>
      </div>
    </div>
  );
};

