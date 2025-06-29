
import React, { useState } from 'react';
import { CardPreviewPanel } from './components/CardPreviewPanel';
import { DebugInfoPanel } from './components/DebugInfoPanel';
import { StatsWorkflowPanel } from './components/StatsWorkflowPanel';

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

  return (
    <div className="min-h-screen bg-cardshow-bg-default">
      {/* Header */}
      <div className="border-b border-cardshow-gray-500 bg-cardshow-bg-elevated">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-white">Professional Card Creation Studio</h1>
          <p className="text-cardshow-gray-200 mt-1">Create professional-grade trading cards with advanced tools</p>
        </div>
      </div>

      {/* Main 3-Column Layout */}
      <div className="flex h-[calc(100vh-88px)]">
        {/* Left Panel - Card Preview */}
        <div className="w-1/3 border-r border-cardshow-gray-500 bg-cardshow-bg-elevated">
          <CardPreviewPanel
            selectedFrame={selectedFrame}
            uploadedImage={uploadedImage}
            onImageUpload={handleImageUpload}
            onFrameSelect={handleFrameSelect}
            rating={cardData.rating}
          />
        </div>

        {/* Center Panel - Debug Info */}
        <div className="w-1/3 border-r border-cardshow-gray-500">
          <DebugInfoPanel
            selectedFrame={selectedFrame}
            uploadedImage={uploadedImage}
            currentPhase={currentPhase}
            cardData={cardData}
          />
        </div>

        {/* Right Panel - Stats & Workflow */}
        <div className="w-1/3 bg-cardshow-bg-elevated">
          <StatsWorkflowPanel
            cardData={cardData}
            currentPhase={currentPhase}
            onPhaseChange={setCurrentPhase}
          />
        </div>
      </div>
    </div>
  );
};
