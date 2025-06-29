
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Camera, Star, Grid3X3 } from 'lucide-react';
import { FramePreviewRenderer } from '@/components/studio/frames/FramePreviewRenderer';
import { ENHANCED_FRAME_TEMPLATES } from '@/components/studio/frames/EnhancedFrameTemplates';
import { 
  ProfessionalPanel,
  ProfessionalCard,
  ProfessionalButton 
} from '@/components/ui/design-system/professional-components';

interface CardPreviewPanelProps {
  selectedFrame: string;
  uploadedImage: string;
  onImageUpload: (imageUrl: string) => void;
  onFrameSelect: (frameId: string) => void;
  rating: number;
}

export const CardPreviewPanel: React.FC<CardPreviewPanelProps> = ({
  selectedFrame,
  uploadedImage,
  onImageUpload,
  onFrameSelect,
  rating
}) => {
  const frameTemplate = ENHANCED_FRAME_TEMPLATES.find(f => f.id === selectedFrame);
  const [showFrameSelection, setShowFrameSelection] = React.useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onImageUpload(url);
    }
  };

  return (
    <ProfessionalPanel
      header={
        <div className="flex items-center justify-between w-full">
          <div>
            <h2 className="text-lg font-semibold text-[#FFFFFF]">Card Preview</h2>
            <p className="text-sm text-[#9CA3AF] mt-1">Professional grading visualization</p>
          </div>
          <ProfessionalButton
            variant="ghost"
            size="sm"
            onClick={() => setShowFrameSelection(!showFrameSelection)}
          >
            <Grid3X3 className="w-4 h-4" />
            Frames
          </ProfessionalButton>
        </div>
      }
    >
      {/* Card Preview Area */}
      <div className="flex-1 p-6 flex flex-col items-center justify-center bg-[#0A0A0B]">
        <div className="relative">
          {/* Professional Grading Slab Effect */}
          <ProfessionalCard variant="professional" padding="md" className="bg-gradient-to-br from-[#252526] to-[#2D2D30]">
            <ProfessionalCard variant="elevated" padding="sm">
              {frameTemplate && uploadedImage ? (
                <FramePreviewRenderer
                  template={frameTemplate}
                  width={280}
                  height={392}
                  showContent={true}
                  uploadedImage={uploadedImage}
                  cardName="Professional Card"
                  previewMode="interactive"
                />
              ) : (
                <div className="w-[280px] h-[392px] bg-[#1A1A1B] rounded border-2 border-dashed border-[#404040] flex items-center justify-center">
                  <div className="text-center text-[#9CA3AF]">
                    <Camera className="w-12 h-12 mx-auto mb-3 text-[#F97316]" />
                    <p className="text-sm">Upload image to preview</p>
                  </div>
                </div>
              )}
            </ProfessionalCard>
            
            {/* Professional Grade Display */}
            <div className="mt-3 flex items-center justify-between bg-[#0A0A0B] rounded px-3 py-2 border border-[#404040]">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-[#FACC15] fill-current" />
                <span className="text-[#FFFFFF] font-semibold">Grade {rating}</span>
              </div>
              <div className="text-xs text-[#9CA3AF] font-medium">PROFESSIONAL</div>
            </div>
          </ProfessionalCard>
        </div>
      </div>

      {/* Frame Selection Grid */}
      {showFrameSelection && (
        <div className="border-t border-[#404040] bg-[#1A1A1B] p-4">
          <h3 className="text-white font-medium mb-3">Select Frame</h3>
          <div className="grid grid-cols-4 gap-2 max-h-32 overflow-y-auto">
            {ENHANCED_FRAME_TEMPLATES.slice(0, 8).map((frame) => (
              <button
                key={frame.id}
                onClick={() => {
                  onFrameSelect(frame.id);
                  setShowFrameSelection(false);
                }}
                className={`relative aspect-[2.5/3.5] rounded border-2 transition-all ${
                  selectedFrame === frame.id
                    ? 'border-[#F97316] ring-1 ring-[#F97316]'
                    : 'border-[#404040] hover:border-[#525552]'
                }`}
              >
                <div className="w-full h-full bg-gradient-to-br from-[#252526] to-[#1A1A1B] rounded flex items-center justify-center text-xs text-[#9CA3AF]">
                  {frame.name}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Upload Area */}
      <div className="p-4 border-t border-[#404040] bg-[#1A1A1B]">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
          id="image-upload"
        />
        <label htmlFor="image-upload">
          <ProfessionalButton 
            variant="primary"
            context="cards"
            className="w-full cursor-pointer"
            asChild
          >
            <div>
              <Upload className="w-4 h-4 mr-2" />
              Upload Image
            </div>
          </ProfessionalButton>
        </label>
      </div>
    </ProfessionalPanel>
  );
};
