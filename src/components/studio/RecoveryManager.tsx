
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RotateCcw, X, Clock, Save } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { PersistedStudioState } from '@/hooks/useStudioStatePersistence';

interface RecoveryManagerProps {
  isOpen: boolean;
  onRestore: (state: PersistedStudioState) => void;
  onDiscard: () => void;
  persistedState: PersistedStudioState | null;
}

export const RecoveryManager: React.FC<RecoveryManagerProps> = ({
  isOpen,
  onRestore,
  onDiscard,
  persistedState
}) => {
  if (!persistedState) return null;

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getTimeSince = (timestamp: number) => {
    const minutes = Math.floor((Date.now() - timestamp) / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    return `${days} days ago`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onDiscard()}>
      <DialogContent className="bg-editor-dark border-editor-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center">
            <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2" />
            Recover Your Work
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-crd-lightGray text-sm">
            It looks like your previous session was interrupted. We found some unsaved work that you can recover.
          </div>

          <Card className="bg-editor-tool border-editor-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-sm flex items-center">
                <Save className="w-4 h-4 text-crd-green mr-2" />
                Recovered Session
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-crd-lightGray">Session ID:</span>
                <span className="text-white font-mono">
                  {persistedState.workSession.id.slice(-8)}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-crd-lightGray">Last Activity:</span>
                <span className="text-white flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {getTimeSince(persistedState.workSession.lastActivity)}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-crd-lightGray">Saved At:</span>
                <span className="text-white">
                  {formatTime(persistedState.workSession.lastActivity)}
                </span>
              </div>

              {persistedState.uploadedImages.length > 0 && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-crd-lightGray">Images:</span>
                  <span className="text-crd-green">
                    {persistedState.uploadedImages.length} uploaded
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
            <div className="text-yellow-400 text-xs font-medium mb-1">
              What will be recovered:
            </div>
            <ul className="text-yellow-200 text-xs space-y-1">
              <li>• Your current design and layer settings</li>
              <li>• Applied effects and adjustments</li>
              <li>• Uploaded images and crop settings</li>
              <li>• Tool selections and UI preferences</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => onRestore(persistedState)}
              className="flex-1 bg-crd-green hover:bg-crd-green/90 text-black font-medium"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Restore Session
            </Button>
            
            <Button
              onClick={onDiscard}
              variant="outline"
              className="flex-1 border-editor-border text-white hover:bg-editor-border"
            >
              <X className="w-4 h-4 mr-2" />
              Start Fresh
            </Button>
          </div>

          <div className="text-xs text-crd-lightGray text-center">
            Your work is automatically saved every 30 seconds
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
