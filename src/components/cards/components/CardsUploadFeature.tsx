
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, ArrowRight } from 'lucide-react';
import { BulkCardUploader } from '@/components/catalog/BulkCardUploader';

interface CardsUploadFeatureProps {
  onUploadComplete: (count: number) => void;
}

export const CardsUploadFeature: React.FC<CardsUploadFeatureProps> = ({
  onUploadComplete
}) => {
  return (
    <div className="space-y-8">
      {/* Feature Overview */}
      <Card className="bg-editor-dark border-editor-border">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-crd-green/20 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-10 h-10 text-crd-green" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              AI-Powered Card Detection
            </h2>
            <p className="text-crd-lightGray max-w-2xl mx-auto">
              Upload multiple images and let our advanced AI automatically detect, crop, and enhance 
              individual trading cards. Perfect for digitizing entire collections quickly.
            </p>
          </div>

          {/* Process Flow */}
          <div className="flex items-center justify-center mb-8 text-sm text-crd-lightGray">
            <span className="bg-editor-tool px-3 py-1 rounded-full">1. Upload Images</span>
            <ArrowRight className="w-4 h-4 mx-3" />
            <span className="bg-editor-tool px-3 py-1 rounded-full">2. AI Detection</span>
            <ArrowRight className="w-4 h-4 mx-3" />
            <span className="bg-crd-green/20 px-3 py-1 rounded-full text-crd-green">3. Review & Select</span>
            <ArrowRight className="w-4 h-4 mx-3" />
            <span className="bg-editor-tool px-3 py-1 rounded-full">4. Add to Collection</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="w-12 h-12 rounded-full bg-blue-600/20 flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-white font-medium mb-2">Multi-Card Detection</h3>
              <p className="text-crd-lightGray text-sm">
                Automatically detect multiple cards in a single photo with precise boundary detection.
              </p>
            </div>
            
            <div className="text-center p-4">
              <div className="w-12 h-12 rounded-full bg-green-600/20 flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-white font-medium mb-2">Smart Enhancement</h3>
              <p className="text-crd-lightGray text-sm">
                AI-powered perspective correction, background removal, and image enhancement.
              </p>
            </div>
            
            <div className="text-center p-4">
              <div className="w-12 h-12 rounded-full bg-purple-600/20 flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-white font-medium mb-2">Batch Processing</h3>
              <p className="text-crd-lightGray text-sm">
                Process hundreds of images at once with intelligent queuing and progress tracking.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload Component */}
      <BulkCardUploader onUploadComplete={onUploadComplete} />
    </div>
  );
};
