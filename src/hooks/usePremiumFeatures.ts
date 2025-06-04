
import { useState, useCallback } from 'react';

export interface PremiumFeatures {
  isPremiumUser: boolean;
  hasAdvancedEffects: boolean;
  hasHDREnvironments: boolean;
  hasHighResExport: boolean;
  hasBatchExport: boolean;
  hasAdvancedMaterials: boolean;
  hasStudioLighting: boolean;
  hasCollaboration: boolean;
}

export const usePremiumFeatures = () => {
  // For testing - enable all premium features by default
  const [premiumFeatures] = useState<PremiumFeatures>({
    isPremiumUser: true,
    hasAdvancedEffects: true,
    hasHDREnvironments: true,
    hasHighResExport: true,
    hasBatchExport: true,
    hasAdvancedMaterials: true,
    hasStudioLighting: true,
    hasCollaboration: true
  });

  const checkFeatureAccess = useCallback((feature: keyof PremiumFeatures) => {
    return premiumFeatures[feature];
  }, [premiumFeatures]);

  return {
    ...premiumFeatures,
    checkFeatureAccess
  };
};
