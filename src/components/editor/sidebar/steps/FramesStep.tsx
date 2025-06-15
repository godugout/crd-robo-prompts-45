
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { FramePreviewGrid } from '../../frames/FramePreviewGrid';

interface FramesStepProps {
  selectedTemplate: string;
  onSelectTemplate: (templateId: string) => void;
  searchQuery: string;
}

export const FramesStep = ({ selectedTemplate, onSelectTemplate, searchQuery }: FramesStepProps) => {
  const handleFrameSelect = (templateId: string) => {
    onSelectTemplate(templateId);
  };

  return (
    <ScrollArea className="h-full px-4">
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-white font-medium text-lg mb-2">Choose Your Frame</h3>
          <p className="text-crd-lightGray text-sm">
            Select a professional card frame template
          </p>
        </div>

        <FramePreviewGrid
          selectedFrame={selectedTemplate}
          onSelectFrame={handleFrameSelect}
          searchQuery={searchQuery}
        />

        {/* Continue Button - only show if frame is selected */}
        {selectedTemplate && (
          <div className="pt-4 border-t border-editor-border">
            <Button 
              className="w-full bg-crd-green hover:bg-crd-green/90 text-black font-medium"
              onClick={() => onSelectTemplate(selectedTemplate)}
            >
              Continue to Photo
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};
