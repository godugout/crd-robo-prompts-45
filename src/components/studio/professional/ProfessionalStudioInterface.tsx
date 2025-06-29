
import React, { useState } from 'react';
import { CardPreviewPanel } from './components/CardPreviewPanel';
import { DebugInfoPanel } from './components/DebugInfoPanel';
import { StatsWorkflowPanel } from './components/StatsWorkflowPanel';
import { 
  ProfessionalLayout,
  ThreeColumnLayout,
  ProfessionalHeader 
} from '@/components/ui/design-system/professional-layout';
import { ProfessionalButton } from '@/components/ui/design-system/professional-components';
import { Settings, Download, Share2 } from 'lucide-react';

export const ProfessionalStudioInterface: React.FC = () => {
  const [selectedFrame, setSelectedFrame] = useState<string>('classic-sports');
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [currentPhase, setCurrentPhase] = useState<'upload' | 'frame' | 'effects' | 'studio'>('upload');
  const [cardData, setCardData] = useState({
    rating: 9.5,
    views: 1247,
    editions: 45,
    marketPrice: 2850
  });

  const handleImageUpload = (imageUrl: string) => {
    setUploadedImage(imageUrl);
    if (currentPhase === 'upload') {
      setCurrentPhase('frame');
    }
  };

  const handleFrameSelect = (frameId: string) => {
    setSelectedFrame(frameId);
    if (currentPhase === 'frame') {
      setCurrentPhase('effects');
    }
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Exporting card with:', { selectedFrame, uploadedImage, cardData });
  };

  const handlePublish = () => {
    // TODO: Implement publish functionality
    console.log('Publishing card with:', { selectedFrame, uploadedImage, cardData });
  };

  return (
    <ProfessionalLayout>
      {/* Professional Header */}
      <ProfessionalHeader
        title="Enhanced Card Creation Studio"
        subtitle="Create professional-grade trading cards with advanced tools and real-time preview"
        actions={
          <>
            <ProfessionalButton variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
              Settings
            </ProfessionalButton>
            <ProfessionalButton variant="secondary" size="sm" onClick={handleExport}>
              <Download className="w-4 h-4" />
              Export
            </ProfessionalButton>
            <ProfessionalButton variant="primary" size="sm" context="professional" onClick={handlePublish}>
              <Share2 className="w-4 h-4" />
              Publish
            </ProfessionalButton>
          </>
        }
      />

      {/* Main 3-Column Layout */}
      <div className="h-[calc(100vh-88px)]">
        <ThreeColumnLayout
          leftPanel={
            <CardPreviewPanel
              selectedFrame={selectedFrame}
              uploadedImage={uploadedImage}
              onImageUpload={handleImageUpload}
              onFrameSelect={handleFrameSelect}
              rating={cardData.rating}
            />
          }
          centerPanel={
            <DebugInfoPanel
              selectedFrame={selectedFrame}
              uploadedImage={uploadedImage}
              currentPhase={currentPhase}
              cardData={cardData}
            />
          }
          rightPanel={
            <StatsWorkflowPanel
              cardData={cardData}
              currentPhase={currentPhase}
              onPhaseChange={setCurrentPhase}
            />
          }
        />
      </div>
    </ProfessionalLayout>
  );
};
