
import React, { useEffect, useState } from 'react';
import { useStudioStatePersistence } from '@/hooks/useStudioStatePersistence';
import { useCreatorSettings } from '@/hooks/useCreatorSettings';
import { RecoveryManager } from './RecoveryManager';
import { SettingsPanel } from './SettingsPanel';
import { Button } from '@/components/ui/button';
import { Settings, Save, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

interface CreatorStatePersistenceProps {
  children: React.ReactNode;
  sessionId?: string;
}

export const CreatorStatePersistence: React.FC<CreatorStatePersistenceProps> = ({
  children,
  sessionId
}) => {
  const { settings } = useCreatorSettings();
  const {
    persistedState,
    isRecovering,
    hasUnsavedChanges,
    saveCurrentState,
    restoreState,
    discardRecovery,
    setupAutoSave
  } = useStudioStatePersistence(sessionId);

  const [showSettings, setShowSettings] = useState(false);

  // Set up auto-save based on user preferences
  useEffect(() => {
    if (settings.preferences.autoSave) {
      setupAutoSave(settings.preferences.autoSaveInterval);
    }
  }, [settings.preferences.autoSave, settings.preferences.autoSaveInterval, setupAutoSave]);

  // Auto-save status indicator
  const AutoSaveIndicator = () => {
    if (!settings.preferences.autoSave) return null;

    return (
      <div className="fixed bottom-4 right-4 z-40">
        <div className={`px-3 py-2 rounded-lg text-xs transition-all ${
          hasUnsavedChanges 
            ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' 
            : 'bg-crd-green/20 text-crd-green border border-crd-green/30'
        }`}>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              hasUnsavedChanges ? 'bg-yellow-400 animate-pulse' : 'bg-crd-green'
            }`} />
            {hasUnsavedChanges ? 'Auto-saving...' : 'All changes saved'}
          </div>
        </div>
      </div>
    );
  };

  // Persistence controls
  const PersistenceControls = () => (
    <div className="fixed top-4 right-4 z-40 flex gap-2">
      <Button
        size="sm"
        variant="ghost"
        onClick={() => saveCurrentState(false)}
        className="bg-black/20 backdrop-blur text-white hover:bg-black/30"
        disabled={!hasUnsavedChanges}
      >
        <Save className="w-4 h-4 mr-2" />
        Save Now
      </Button>
      
      <Button
        size="sm"
        variant="ghost"
        onClick={() => setShowSettings(true)}
        className="bg-black/20 backdrop-blur text-white hover:bg-black/30"
      >
        <Settings className="w-4 h-4" />
      </Button>
    </div>
  );

  return (
    <>
      {children}
      
      {/* Recovery Dialog */}
      <RecoveryManager
        isOpen={isRecovering}
        onRestore={restoreState}
        onDiscard={discardRecovery}
        persistedState={persistedState}
      />

      {/* Settings Panel */}
      <SettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />

      {/* Auto-save Indicator */}
      <AutoSaveIndicator />

      {/* Persistence Controls */}
      <PersistenceControls />
    </>
  );
};
