
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { ENHANCED_FRAME_TEMPLATES } from '../../studio/frames/EnhancedFrameTemplates';
import { FramePreviewRenderer } from '../../studio/frames/FramePreviewRenderer';
import '../../studio/frames/FrameEffects.css';

interface FramePreviewGridProps {
  selectedFrame?: string;
  onSelectFrame: (frameId: string) => void;
  searchQuery?: string;
  uploadedImage?: string; // Add uploaded image prop
  cardName?: string; // Add card name prop
}

const TEMPLATES_PER_PAGE = 4;

export const FramePreviewGrid: React.FC<FramePreviewGridProps> = ({
  selectedFrame,
  onSelectFrame,
  searchQuery = '',
  uploadedImage,
  cardName
}) => {
  const [currentPage, setCurrentPage] = useState(0);

  const filteredFrames = ENHANCED_FRAME_TEMPLATES.filter(frame =>
    frame.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    frame.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredFrames.length / TEMPLATES_PER_PAGE);
  const startIndex = currentPage * TEMPLATES_PER_PAGE;
  const currentFrames = filteredFrames.slice(startIndex, startIndex + TEMPLATES_PER_PAGE);

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
  };

  return (
    <div className="space-y-4">
      {/* Frame Templates Grid - 2x2 layout */}
      <div className="grid grid-cols-2 gap-3">
        {currentFrames.map((frame) => {
          const isSelected = selectedFrame === frame.id;
          
          return (
            <Card
              key={frame.id}
              className={`cursor-pointer transition-all duration-200 ${
                isSelected 
                  ? 'ring-2 ring-crd-green bg-editor-tool' 
                  : 'bg-editor-dark hover:bg-editor-tool'
              } border-editor-border`}
              onClick={() => onSelectFrame(frame.id)}
            >
              <CardContent className="p-3">
                {/* Frame Preview */}
                <div className="aspect-[3/4] mb-3 relative overflow-hidden rounded-lg">
                  <FramePreviewRenderer
                    template={frame}
                    width={160}
                    height={213}
                    showContent={true}
                    uploadedImage={uploadedImage}
                    cardName={cardName}
                    previewMode="interactive"
                  />
                  
                  {/* Selection indicator */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-crd-green rounded-full flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-crd-dark" />
                    </div>
                  )}
                </div>

                {/* Frame Name and Description */}
                <div className="space-y-1">
                  <h3 className="text-crd-white font-medium text-sm text-center">
                    {frame.name}
                  </h3>
                  <p className="text-crd-lightGray text-xs text-center line-clamp-2">
                    {frame.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            className="text-crd-lightGray hover:text-white disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>
          
          <div className="flex items-center space-x-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === currentPage 
                    ? 'bg-crd-green' 
                    : 'bg-crd-mediumGray hover:bg-crd-lightGray'
                }`}
              />
            ))}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage === totalPages - 1}
            className="text-crd-lightGray hover:text-white disabled:opacity-50"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}
      
      {/* Helpful tip when no image is uploaded */}
      {!uploadedImage && (
        <div className="bg-editor-tool p-3 rounded-lg border border-editor-border">
          <p className="text-crd-lightGray text-sm text-center">
            Upload an image to see how it looks in each frame design
          </p>
        </div>
      )}
    </div>
  );
};
