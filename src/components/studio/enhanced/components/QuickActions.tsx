
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Share, Save, Eye } from 'lucide-react';

interface QuickActionsProps {
  uploadedImage?: string;
  selectedFrame?: string;
  effectValues: Record<string, any>;
  onExport: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  uploadedImage,
  selectedFrame,
  effectValues,
  onExport
}) => {
  const isReady = uploadedImage && selectedFrame;

  return (
    <div className="p-4 space-y-4">
      <Card className="bg-editor-tool border-editor-border">
        <CardContent className="p-4">
          <h3 className="text-white font-semibold mb-4">Quick Actions</h3>
          
          <div className="space-y-2">
            <Button
              onClick={onExport}
              disabled={!isReady}
              className="w-full bg-crd-green hover:bg-crd-green/90 text-black disabled:opacity-50"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Card
            </Button>
            
            <Button
              variant="outline"
              disabled={!isReady}
              className="w-full border-editor-border text-white hover:bg-editor-border disabled:opacity-50"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            
            <Button
              variant="outline"
              disabled={!uploadedImage}
              className="w-full border-editor-border text-white hover:bg-editor-border disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            
            <Button
              variant="outline"
              disabled={!isReady}
              className="w-full border-editor-border text-white hover:bg-editor-border disabled:opacity-50"
            >
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {isReady && (
        <Card className="bg-green-900/20 border-green-500/50">
          <CardContent className="p-4">
            <div className="text-green-400 text-sm">
              <div className="font-semibold mb-2">Card Ready!</div>
              <div className="space-y-1 text-xs">
                <div>✓ Image uploaded</div>
                <div>✓ Frame selected</div>
                <div>✓ Effects: {Object.keys(effectValues).length} applied</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
