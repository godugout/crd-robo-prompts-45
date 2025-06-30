
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Share, Save, Eye, Clock, History } from 'lucide-react';
import { CardDraft } from '@/services/autosave/AutoSaveService';
import { formatDistanceToNow } from 'date-fns';

interface QuickActionsProps {
  uploadedImage?: string;
  selectedFrame?: string;
  effectValues: Record<string, any>;
  onExport: () => void;
  currentDraft?: CardDraft | null;
  autoSaveStats: {
    draftAge: number;
    saveCount: number;
    historySize: number;
    lastAction: string | null;
  };
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  uploadedImage,
  selectedFrame,
  effectValues,
  onExport,
  currentDraft,
  autoSaveStats
}) => {
  const isReady = uploadedImage && selectedFrame;

  return (
    <div className="p-4 space-y-4">
      {/* Auto-save Status */}
      {currentDraft && (
        <Card className="bg-crd-green/10 border-crd-green/30">
          <CardContent className="p-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center text-crd-green">
                <Clock className="w-3 h-3 mr-1" />
                Auto-saved
              </div>
              <div className="text-crd-green">
                {autoSaveStats.saveCount} saves
              </div>
            </div>
            {autoSaveStats.lastAction && (
              <div className="text-xs text-gray-400 mt-1">
                Last: {autoSaveStats.lastAction}
              </div>
            )}
          </CardContent>
        </Card>
      )}

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
              disabled={!isReady}
              className="w-full border-editor-border text-white hover:bg-editor-border disabled:opacity-50"
            >
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Draft History */}
      {autoSaveStats.historySize > 0 && (
        <Card className="bg-black/20 border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-white text-sm">
              <div className="flex items-center">
                <History className="w-4 h-4 mr-2" />
                History
              </div>
              <span className="text-gray-400">{autoSaveStats.historySize} actions</span>
            </div>
          </CardContent>
        </Card>
      )}
      
      {isReady && (
        <Card className="bg-green-900/20 border-green-500/50">
          <CardContent className="p-4">
            <div className="text-green-400 text-sm">
              <div className="font-semibold mb-2">Card Ready!</div>
              <div className="space-y-1 text-xs">
                <div>✓ Image uploaded</div>
                <div>✓ Frame selected</div>
                <div>✓ Effects: {Object.keys(effectValues).length} applied</div>
                {currentDraft && (
                  <div>✓ Auto-saved as draft</div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
