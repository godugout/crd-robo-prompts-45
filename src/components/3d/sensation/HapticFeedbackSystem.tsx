
import React, { useCallback, useEffect, useImperativeHandle, forwardRef } from 'react';

interface HapticPattern {
  pattern: number[];
  intensity?: number;
}

interface HapticFeedbackSystemProps {
  cardMaterial: 'matte' | 'glossy' | 'metallic' | 'holographic';
  cardRarity: 'common' | 'rare' | 'epic' | 'legendary';
  isInteracting: boolean;
}

export interface HapticFeedbackSystemRef {
  triggerMaterialFeedback: () => void;
  triggerRarityFeedback: () => void;
  triggerInteractionFeedback: (type: 'tap' | 'swipe' | 'pinch' | 'shake') => void;
}

export const HapticFeedbackSystem = forwardRef<HapticFeedbackSystemRef, HapticFeedbackSystemProps>(({
  cardMaterial,
  cardRarity,
  isInteracting
}, ref) => {
  const [isSupported, setIsSupported] = React.useState(false);

  useEffect(() => {
    // Check for haptic support
    setIsSupported('vibrate' in navigator || 'hapticFeedback' in navigator);
  }, []);

  const triggerHaptic = useCallback((pattern: HapticPattern) => {
    if (!isSupported) return;

    try {
      if ('vibrate' in navigator) {
        navigator.vibrate(pattern.pattern);
      }
      
      // For devices with advanced haptic feedback (iOS Safari, some Android)
      if ('hapticFeedback' in navigator) {
        const intensity = pattern.intensity || 0.5;
        (navigator as any).hapticFeedback.impact(intensity);
      }
    } catch (error) {
      console.warn('Haptic feedback failed:', error);
    }
  }, [isSupported]);

  const getMaterialHaptic = useCallback((material: string): HapticPattern => {
    switch (material) {
      case 'matte':
        // Rough, textured feel - short bursts
        return { pattern: [30, 20, 30, 20, 30], intensity: 0.8 };
      
      case 'glossy':
        // Smooth, single pulse
        return { pattern: [50], intensity: 0.3 };
      
      case 'metallic':
        // Sharp, metallic resonance
        return { pattern: [40, 30, 60, 30, 40], intensity: 0.7 };
      
      case 'holographic':
        // Shimmering, wave-like pattern
        return { pattern: [20, 10, 30, 10, 40, 10, 30, 10, 20], intensity: 0.6 };
      
      default:
        return { pattern: [30], intensity: 0.4 };
    }
  }, []);

  const getRarityHaptic = useCallback((rarity: string): HapticPattern => {
    switch (rarity) {
      case 'legendary':
        // Powerful, sustained vibration
        return { pattern: [100, 50, 100, 50, 100], intensity: 1.0 };
      
      case 'epic':
        // Strong, rhythmic pattern
        return { pattern: [80, 40, 80, 40, 60], intensity: 0.8 };
      
      case 'rare':
        // Moderate, double pulse
        return { pattern: [60, 30, 60], intensity: 0.6 };
      
      case 'common':
        // Light, single pulse
        return { pattern: [40], intensity: 0.3 };
      
      default:
        return { pattern: [30], intensity: 0.3 };
    }
  }, []);

  const triggerMaterialFeedback = useCallback(() => {
    const haptic = getMaterialHaptic(cardMaterial);
    triggerHaptic(haptic);
  }, [cardMaterial, getMaterialHaptic, triggerHaptic]);

  const triggerRarityFeedback = useCallback(() => {
    const haptic = getRarityHaptic(cardRarity);
    triggerHaptic(haptic);
  }, [cardRarity, getRarityHaptic, triggerHaptic]);

  const triggerInteractionFeedback = useCallback((type: 'tap' | 'swipe' | 'pinch' | 'shake') => {
    let pattern: HapticPattern;
    
    switch (type) {
      case 'tap':
        pattern = { pattern: [30], intensity: 0.4 };
        break;
      case 'swipe':
        pattern = { pattern: [20, 10, 40], intensity: 0.5 };
        break;
      case 'pinch':
        pattern = { pattern: [50, 20, 30], intensity: 0.6 };
        break;
      case 'shake':
        pattern = { pattern: [40, 20, 40, 20, 60], intensity: 0.8 };
        break;
      default:
        pattern = { pattern: [30], intensity: 0.4 };
    }
    
    triggerHaptic(pattern);
  }, [triggerHaptic]);

  // Trigger material feedback when interacting
  useEffect(() => {
    if (isInteracting) {
      triggerMaterialFeedback();
    }
  }, [isInteracting, triggerMaterialFeedback]);

  // Expose methods for external use
  useImperativeHandle(ref, () => ({
    triggerMaterialFeedback,
    triggerRarityFeedback,
    triggerInteractionFeedback
  }), [triggerMaterialFeedback, triggerRarityFeedback, triggerInteractionFeedback]);

  return null;
});

HapticFeedbackSystem.displayName = 'HapticFeedbackSystem';
