
import { useState, useEffect } from 'react';
import { useAppSettings } from './useAppSettings';

export interface FeatureFlags {
  OAK_FEATURES: boolean;
  // Add more feature flags here as needed
}

const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  OAK_FEATURES: false, // Disabled by default for testing
};

export const useFeatureFlags = () => {
  const { settings, saveSettings, isLoading } = useAppSettings();
  const [featureFlags, setFeatureFlags] = useState<FeatureFlags>(DEFAULT_FEATURE_FLAGS);

  useEffect(() => {
    if (settings?.features) {
      setFeatureFlags({
        ...DEFAULT_FEATURE_FLAGS,
        ...settings.features
      });
    }
  }, [settings]);

  const updateFeatureFlag = (flag: keyof FeatureFlags, enabled: boolean) => {
    const updatedFlags = { ...featureFlags, [flag]: enabled };
    setFeatureFlags(updatedFlags);
    
    saveSettings({
      ...settings,
      features: updatedFlags
    });
  };

  const isFeatureEnabled = (flag: keyof FeatureFlags): boolean => {
    return featureFlags[flag] ?? DEFAULT_FEATURE_FLAGS[flag];
  };

  return {
    featureFlags,
    updateFeatureFlag,
    isFeatureEnabled,
    isLoading
  };
};
