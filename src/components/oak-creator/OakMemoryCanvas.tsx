
import React from 'react';
import { ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OakTemplate } from '@/types/oakTemplates';

interface OakMemoryCanvasProps {
  selectedTemplate: OakTemplate | null;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export const OakMemoryCanvas: React.FC<OakMemoryCanvasProps> = ({
  selectedTemplate,
  zoom,
  onZoomIn,
  onZoomOut
}) => {
  return (
    <main className="flex-1 bg-gray-100 flex flex-col relative">
      {/* Canvas Container */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        {/* Zoom Controls */}
        <div className="absolute top-4 right-4 flex items-center gap-2 bg-white rounded-lg shadow-lg p-2 z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={onZoomOut}
            className="hover:bg-gray-100"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium min-w-[3rem] text-center">
            {zoom}%
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onZoomIn}
            className="hover:bg-gray-100"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <div className="w-px h-4 bg-gray-300 mx-1" />
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-gray-100"
          >
            <Maximize className="w-4 h-4" />
          </Button>
        </div>

        {/* Canvas */}
        <div 
          className="bg-white rounded-lg shadow-2xl border-2 border-dashed border-gray-300 flex items-center justify-center canvas-zoom"
          style={{
            width: `${(400 * zoom) / 100}px`,
            height: `${(600 * zoom) / 100}px`,
            maxWidth: '90%',
            maxHeight: '80%',
          }}
        >
          {selectedTemplate ? (
            <div className="relative w-full h-full overflow-hidden rounded-lg">
              <img
                src={selectedTemplate.thumbnail}
                alt={selectedTemplate.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                <div className="text-center text-white">
                  <h3 className="text-lg font-bold mb-2">{selectedTemplate.name}</h3>
                  <p className="text-sm opacity-90">Template loaded - ready to customize</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[#0f4c3a] flex items-center justify-center mx-auto mb-4">
                <span className="text-[#ffd700] font-bold text-2xl">A</span>
              </div>
              <p className="text-gray-500 text-lg font-medium">
                Select a template to begin
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Choose from Oakland A's themed designs
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
