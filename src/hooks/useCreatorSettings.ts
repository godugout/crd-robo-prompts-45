
import { useState, useEffect, useCallback } from 'react';
import { localStorageManager } from '@/lib/storage/LocalStorageManager';
import { toast } from 'sonner';

export interface CreatorPreferences {
  defaultFrame: string;
  defaultEffects: Record<string, any>;
  preferredLayout: 'grid' | 'list';
  autoSave: boolean;
  autoSaveInterval: number;
  showTips: boolean;
  theme: 'dark' | 'light' | 'auto';
}

export interface UIState {
  panelPositions: Record<string, { x: number; y: number; width: number; height: number }>;
  activeTabs: Record<string, string>;
  sidebarCollapsed: boolean;
  viewMode: '2d' | '3d';
  zoomLevel: number;
}

export interface UploadItem {
  url: string;
  timestamp: number;
  name: string;
}

export interface RecentItems {
  frames: string[];
  effects: string[];
  templates: string[];
  uploads: UploadItem[];
}

export interface CreatorSettings {
  preferences: CreatorPreferences;
  uiState: UIState;
  recentItems: RecentItems;
  favorites: {
    frames: string[];
    effects: string[];
    templates: string[];
  };
  lastSaved: number;
}

const defaultSettings: CreatorSettings = {
  preferences: {
    defaultFrame: '',
    defaultEffects: {},
    preferredLayout: 'grid',
    autoSave: true,
    autoSaveInterval: 30000,
    showTips: true,
    theme: 'dark'
  },
  uiState: {
    panelPositions: {},
    activeTabs: {},
    sidebarCollapsed: false,
    viewMode: '3d',
    zoomLevel: 1
  },
  recentItems: {
    frames: [],
    effects: [],
    templates: [],
    uploads: []
  },
  favorites: {
    frames: [],
    effects: [],
    templates: []
  },
  lastSaved: Date.now()
};

export const useCreatorSettings = () => {
  const [settings, setSettings] = useState<CreatorSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings on mount
  useEffect(() => {
    const loadSettings = () => {
      const stored = localStorageManager.getItem<CreatorSettings>('creator-settings');
      if (stored) {
        setSettings({ ...defaultSettings, ...stored });
      }
      setIsLoading(false);
    };

    loadSettings();
  }, []);

  // Save settings to storage
  const saveSettings = useCallback((newSettings: CreatorSettings) => {
    const updatedSettings = {
      ...newSettings,
      lastSaved: Date.now()
    };
    
    localStorageManager.setItem(
      'creator-settings',
      updatedSettings,
      'settings',
      'medium'
    );
    setSettings(updatedSettings);
  }, []);

  // Update preferences
  const updatePreferences = useCallback((updates: Partial<CreatorPreferences>) => {
    const newSettings = {
      ...settings,
      preferences: { ...settings.preferences, ...updates }
    };
    saveSettings(newSettings);
  }, [settings, saveSettings]);

  // Update UI state
  const updateUIState = useCallback((updates: Partial<UIState>) => {
    const newSettings = {
      ...settings,
      uiState: { ...settings.uiState, ...updates }
    };
    saveSettings(newSettings);
  }, [settings, saveSettings]);

  // Add to recent items
  const addToRecent = useCallback((type: keyof RecentItems, item: string | UploadItem) => {
    const newRecent = { ...settings.recentItems };
    
    if (type === 'uploads' && typeof item === 'object') {
      newRecent.uploads = [
        { ...item, timestamp: Date.now() },
        ...newRecent.uploads.filter(u => u.url !== item.url)
      ].slice(0, 10);
    } else if (type !== 'uploads' && typeof item === 'string') {
      const targetArray = newRecent[type] as string[];
      newRecent[type] = [
        item,
        ...targetArray.filter(i => i !== item)
      ].slice(0, 10) as any;
    }

    const newSettings = {
      ...settings,
      recentItems: newRecent
    };
    saveSettings(newSettings);
  }, [settings, saveSettings]);

  // Toggle favorites
  const toggleFavorite = useCallback((type: keyof typeof settings.favorites, item: string) => {
    const favorites = { ...settings.favorites };
    const currentFavorites = favorites[type];
    
    if (currentFavorites.includes(item)) {
      favorites[type] = currentFavorites.filter(f => f !== item);
    } else {
      favorites[type] = [...currentFavorites, item];
    }

    const newSettings = {
      ...settings,
      favorites
    };
    saveSettings(newSettings);
  }, [settings, saveSettings]);

  // Export settings
  const exportSettings = useCallback(() => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `crd-creator-settings-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('Settings exported successfully');
  }, [settings]);

  // Import settings
  const importSettings = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        const mergedSettings = { ...defaultSettings, ...imported };
        saveSettings(mergedSettings);
        toast.success('Settings imported successfully');
      } catch (error) {
        toast.error('Failed to import settings');
      }
    };
    reader.readAsText(file);
  }, [saveSettings]);

  // Reset to defaults
  const resetSettings = useCallback(() => {
    saveSettings(defaultSettings);
    toast.success('Settings reset to defaults');
  }, [saveSettings]);

  return {
    settings,
    isLoading,
    updatePreferences,
    updateUIState,
    addToRecent,
    toggleFavorite,
    exportSettings,
    importSettings,
    resetSettings
  };
};
