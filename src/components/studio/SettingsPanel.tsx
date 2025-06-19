
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  Download, 
  Upload, 
  RotateCcw, 
  Save, 
  Clock,
  Palette,
  Monitor,
  Smartphone,
  HardDrive
} from 'lucide-react';
import { useCreatorSettings } from '@/hooks/useCreatorSettings';
import { localStorageManager } from '@/lib/storage/LocalStorageManager';

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
    importSettings,
    resetSettings
  } = useCreatorSettings();
  
  const [importFile, setImportFile] = useState<File | null>(null);
  const debugInfo = localStorageManager.getDebugInfo();

  if (!isOpen) return null;

  const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImportFile(file);
      importSettings(file);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="bg-editor-dark border-editor-border w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <CardHeader className="border-b border-editor-border">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Creator Settings
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-editor-border"
            >
              ✕
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0 overflow-y-auto max-h-[calc(90vh-80px)]">
          <Tabs defaultValue="preferences" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-editor-tool">
              <TabsTrigger value="preferences" className="data-[state=active]:bg-crd-green data-[state=active]:text-black">
                <Palette className="w-4 h-4 mr-2" />
                Preferences
              </TabsTrigger>
              <TabsTrigger value="ui" className="data-[state=active]:bg-crd-green data-[state=active]:text-black">
                <Monitor className="w-4 h-4 mr-2" />
                Interface
              </TabsTrigger>
              <TabsTrigger value="storage" className="data-[state=active]:bg-crd-green data-[state=active]:text-black">
                <HardDrive className="w-4 h-4 mr-2" />
                Storage
              </TabsTrigger>
              <TabsTrigger value="backup" className="data-[state=active]:bg-crd-green data-[state=active]:text-black">
                <Save className="w-4 h-4 mr-2" />
                Backup
              </TabsTrigger>
            </TabsList>

            <TabsContent value="preferences" className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Auto-save</Label>
                    <p className="text-crd-lightGray text-sm">Automatically save your work</p>
                  </div>
                  <Switch
                    checked={settings.preferences.autoSave}
                    onCheckedChange={(checked) => updatePreferences({ autoSave: checked })}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Auto-save Interval (seconds)</Label>
                  <Slider
                    value={[settings.preferences.autoSaveInterval / 1000]}
                    onValueChange={(value) => updatePreferences({ autoSaveInterval: value[0] * 1000 })}
                    min={10}
                    max={300}
                    step={10}
                    className="w-full"
                  />
                  <div className="text-crd-lightGray text-sm">
                    {settings.preferences.autoSaveInterval / 1000} seconds
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Show Tips</Label>
                    <p className="text-crd-lightGray text-sm">Display helpful tips and tutorials</p>
                  </div>
                  <Switch
                    checked={settings.preferences.showTips}
                    onCheckedChange={(checked) => updatePreferences({ showTips: checked })}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Default Layout</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={settings.preferences.preferredLayout === 'grid' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updatePreferences({ preferredLayout: 'grid' })}
                      className={settings.preferences.preferredLayout === 'grid' ? 'bg-crd-green text-black' : ''}
                    >
                      Grid
                    </Button>
                    <Button
                      variant={settings.preferences.preferredLayout === 'list' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updatePreferences({ preferredLayout: 'list' })}
                      className={settings.preferences.preferredLayout === 'list' ? 'bg-crd-green text-black' : ''}
                    >
                      List
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="ui" className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Collapse Sidebar</Label>
                    <p className="text-crd-lightGray text-sm">Start with sidebar collapsed</p>
                  </div>
                  <Switch
                    checked={settings.uiState.sidebarCollapsed}
                    onCheckedChange={(checked) => updateUIState({ sidebarCollapsed: checked })}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Default View Mode</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={settings.uiState.viewMode === '2d' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateUIState({ viewMode: '2d' })}
                      className={settings.uiState.viewMode === '2d' ? 'bg-crd-green text-black' : ''}
                    >
                      <Smartphone className="w-4 h-4 mr-2" />
                      2D
                    </Button>
                    <Button
                      variant={settings.uiState.viewMode === '3d' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateUIState({ viewMode: '3d' })}
                      className={settings.uiState.viewMode === '3d' ? 'bg-crd-green text-black' : ''}
                    >
                      <Monitor className="w-4 h-4 mr-2" />
                      3D
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Default Zoom Level</Label>
                  <Slider
                    value={[settings.uiState.zoomLevel]}
                    onValueChange={(value) => updateUIState({ zoomLevel: value[0] })}
                    min={0.5}
                    max={3}
                    step={0.1}
                    className="w-full"
                  />
                  <div className="text-crd-lightGray text-sm">
                    {Math.round(settings.uiState.zoomLevel * 100)}%
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="storage" className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="bg-editor-tool rounded-lg p-4">
                  <h3 className="text-white font-medium mb-3">Storage Overview</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-crd-lightGray">Total Items</div>
                      <div className="text-white font-medium">{debugInfo.totalItems}</div>
                    </div>
                    <div>
                      <div className="text-crd-lightGray">Pending Sync</div>
                      <div className="text-white font-medium">{debugInfo.pendingSync}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-editor-tool rounded-lg p-4">
                  <h3 className="text-white font-medium mb-3">Recent Items</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-crd-lightGray">Recent Frames</span>
                      <span className="text-white">{settings.recentItems.frames.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-crd-lightGray">Recent Effects</span>
                      <span className="text-white">{settings.recentItems.effects.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-crd-lightGray">Recent Uploads</span>
                      <span className="text-white">{settings.recentItems.uploads.length}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-editor-tool rounded-lg p-4">
                  <h3 className="text-white font-medium mb-3">Favorites</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-crd-lightGray">Favorite Frames</span>
                      <span className="text-white">{settings.favorites.frames.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-crd-lightGray">Favorite Effects</span>
                      <span className="text-white">{settings.favorites.effects.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-crd-lightGray">Favorite Templates</span>
                      <span className="text-white">{settings.favorites.templates.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="backup" className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="bg-editor-tool rounded-lg p-4">
                  <h3 className="text-white font-medium mb-3 flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Last Saved
                  </h3>
                  <div className="text-crd-lightGray text-sm">
                    {new Date(settings.lastSaved).toLocaleString()}
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={exportSettings}
                    className="w-full bg-crd-green hover:bg-crd-green/90 text-black"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Settings
                  </Button>

                  <div className="space-y-2">
                    <Label className="text-white">Import Settings</Label>
                    <Input
                      type="file"
                      accept=".json"
                      onChange={handleImportFile}
                      className="bg-editor-tool border-editor-border text-white file:bg-crd-green file:text-black file:border-none file:rounded file:px-3 file:py-1"
                    />
                  </div>

                  <Button
                    onClick={resetSettings}
                    variant="outline"
                    className="w-full border-red-500 text-red-400 hover:bg-red-500/10"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset to Defaults
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
