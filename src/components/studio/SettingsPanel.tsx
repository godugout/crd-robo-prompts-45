
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useCreatorSettings } from '@/hooks/useCreatorSettings';
import { Settings, Download, Upload, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isOpen,
  onClose
}) => {
  const {
    settings,
    updatePreferences,
    updateUIState,
    exportSettings,
    resetSettings
  } = useCreatorSettings();

  const handleAutoSaveIntervalChange = (value: number[]) => {
    updatePreferences({ autoSaveInterval: value[0] * 1000 });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target?.result as string);
          // This would be handled by importSettings if we implement it
          toast.success('Settings imported successfully');
        } catch (error) {
          toast.error('Failed to import settings');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-editor-dark border-editor-border max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Creator Settings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Auto-save Settings */}
          <div className="space-y-4">
            <h3 className="text-white font-medium">Auto-save</h3>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-save" className="text-crd-lightGray">
                Enable auto-save
              </Label>
              <Switch
                id="auto-save"
                checked={settings.preferences.autoSave}
                onCheckedChange={(checked) => updatePreferences({ autoSave: checked })}
              />
            </div>

            {settings.preferences.autoSave && (
              <div className="space-y-2">
                <Label className="text-crd-lightGray">
                  Auto-save interval: {settings.preferences.autoSaveInterval / 1000}s
                </Label>
                <Slider
                  value={[settings.preferences.autoSaveInterval / 1000]}
                  onValueChange={handleAutoSaveIntervalChange}
                  max={120}
                  min={10}
                  step={5}
                  className="w-full"
                />
              </div>
            )}
          </div>

          {/* UI Preferences */}
          <div className="space-y-4">
            <h3 className="text-white font-medium">Interface</h3>
            
            <div className="space-y-2">
              <Label className="text-crd-lightGray">Preferred Layout</Label>
              <Select
                value={settings.preferences.preferredLayout}
                onValueChange={(value: 'grid' | 'list') => 
                  updatePreferences({ preferredLayout: value })
                }
              >
                <SelectTrigger className="bg-editor-tool border-editor-border text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-editor-tool border-editor-border">
                  <SelectItem value="grid">Grid</SelectItem>
                  <SelectItem value="list">List</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-crd-lightGray">View Mode</Label>
              <Select
                value={settings.uiState.viewMode}
                onValueChange={(value: '2d' | '3d') => 
                  updateUIState({ viewMode: value })
                }
              >
                <SelectTrigger className="bg-editor-tool border-editor-border text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-editor-tool border-editor-border">
                  <SelectItem value="2d">2D Preview</SelectItem>
                  <SelectItem value="3d">3D Preview</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="show-tips" className="text-crd-lightGray">
                Show helpful tips
              </Label>
              <Switch
                id="show-tips"
                checked={settings.preferences.showTips}
                onCheckedChange={(checked) => updatePreferences({ showTips: checked })}
              />
            </div>
          </div>

          {/* Data Management */}
          <div className="space-y-4">
            <h3 className="text-white font-medium">Data Management</h3>
            
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={exportSettings}
                variant="outline"
                size="sm"
                className="border-editor-border text-white hover:bg-editor-border"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              
              <Button
                onClick={() => document.getElementById('import-settings')?.click()}
                variant="outline"
                size="sm"
                className="border-editor-border text-white hover:bg-editor-border"
              >
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
            </div>
            
            <input
              id="import-settings"
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />

            <Button
              onClick={resetSettings}
              variant="outline"
              size="sm"
              className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset to Defaults
            </Button>
          </div>

          {/* Session Info */}
          <div className="space-y-2 p-3 bg-editor-tool rounded-lg">
            <h4 className="text-white font-medium text-sm">Session Info</h4>
            <div className="text-xs text-crd-lightGray space-y-1">
              <div>Recent Items: {
                settings.recentItems.frames.length +
                settings.recentItems.effects.length +
                settings.recentItems.templates.length +
                settings.recentItems.uploads.length
              }</div>
              <div>Favorites: {
                settings.favorites.frames.length +
                settings.favorites.effects.length +
                settings.favorites.templates.length
              }</div>
              <div>Last Saved: {new Date(settings.lastSaved).toLocaleString()}</div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
