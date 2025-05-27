
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { WorkflowPhase, UploadedImage } from '../hooks/useCardUploadSession';

interface CardsSessionHeaderProps {
  phase: WorkflowPhase;
  uploadedImages: UploadedImage[];
  sessionId: string;
  onClearSession: () => void;
}

export const CardsSessionHeader: React.FC<CardsSessionHeaderProps> = ({
  phase,
  uploadedImages,
  sessionId,
  onClearSession
}) => {
  return (
    <div className="pt-20 pb-6 border-b border-crd-mediumGray/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Card Detection & Upload</h1>
          <p className="text-xl text-crd-lightGray">
            Upload images to automatically detect and crop trading cards
          </p>
          
          {/* Session controls */}
          {(phase !== 'idle' || uploadedImages.length > 0) && (
            <div className="mt-4 flex justify-center gap-3">
              <Button
                variant="outline"
                onClick={onClearSession}
                className="text-red-400 border-red-400 hover:bg-red-400/10"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Session
              </Button>
              <div className="text-sm text-crd-lightGray bg-crd-mediumGray/20 px-3 py-2 rounded">
                Session ID: {sessionId.slice(-8)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
