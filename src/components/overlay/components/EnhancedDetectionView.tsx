
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface EnhancedDetectionViewProps {
  isProcessing: boolean;
}

export const EnhancedDetectionView: React.FC<EnhancedDetectionViewProps> = ({
  isProcessing
}) => {
  return (
    <Card className="bg-editor-dark border-editor-border">
      <CardContent className="p-8">
        <div className="flex items-center justify-center h-96">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-crd-green border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div className="text-white font-medium">Running Advanced Card Detection</div>
            <div className="text-crd-lightGray text-sm">
              Using edge detection, contour analysis, and perspective correction...
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
