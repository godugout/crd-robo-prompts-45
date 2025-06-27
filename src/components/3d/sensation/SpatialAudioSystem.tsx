
import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import * as Tone from 'tone';

interface SpatialAudioSystemProps {
  cardEffects: string[];
  cardRarity: 'common' | 'rare' | 'epic' | 'legendary';
  cardPosition: [number, number, number];
  isActive: boolean;
}

export interface SpatialAudioSystemRef {
  playEffectSound: (effectType: string, intensity?: number) => void;
}

export const SpatialAudioSystem = forwardRef<SpatialAudioSystemRef, SpatialAudioSystemProps>(({
  cardEffects,
  cardRarity,
  cardPosition,
  isActive
}, ref) => {
  const synthsRef = useRef<{ [key: string]: Tone.Synth | Tone.PolySynth | Tone.NoiseSynth }>({});
  const reverbRef = useRef<Tone.Reverb | null>(null);
  const pannerRef = useRef<Tone.Panner3D | null>(null);
  const [audioInitialized, setAudioInitialized] = useState(false);

  useEffect(() => {
    const initializeAudio = async () => {
      if (audioInitialized) return;
      
      try {
        await Tone.start();
        
        // Create spatial audio context
        pannerRef.current = new Tone.Panner3D(cardPosition[0], cardPosition[1], cardPosition[2]);
        reverbRef.current = new Tone.Reverb(2).toDestination();
        
        // Initialize synthesizers for different effects
        synthsRef.current = {
          holographic: new Tone.PolySynth().connect(pannerRef.current),
          chrome: new Tone.Synth({
            oscillator: { type: 'sawtooth' },
            envelope: { attack: 0.1, decay: 0.3, sustain: 0.1, release: 1 }
          }).connect(pannerRef.current),
          crystal: new Tone.Synth({
            oscillator: { type: 'sine' },
            envelope: { attack: 0.01, decay: 0.1, sustain: 0.0, release: 0.3 }
          }).connect(pannerRef.current),
          gold: new Tone.Synth({
            oscillator: { type: 'triangle' },
            envelope: { attack: 0.2, decay: 0.5, sustain: 0.3, release: 1.2 }
          }).connect(pannerRef.current),
          rare_bass: new Tone.Synth({
            oscillator: { type: 'square' },
            envelope: { attack: 0.3, decay: 0.8, sustain: 0.5, release: 2 }
          }).connect(pannerRef.current)
        };

        // Connect panner to reverb
        pannerRef.current.connect(reverbRef.current);
        
        setAudioInitialized(true);
        console.log('🔊 Spatial audio system initialized');
      } catch (error) {
        console.warn('Audio initialization failed:', error);
      }
    };

    if (isActive) {
      initializeAudio();
    }

    return () => {
      // Cleanup audio resources
      Object.values(synthsRef.current).forEach(synth => synth.dispose());
      reverbRef.current?.dispose();
      pannerRef.current?.dispose();
    };
  }, [isActive, audioInitialized]);

  // Update spatial position
  useEffect(() => {
    if (pannerRef.current && audioInitialized) {
      pannerRef.current.positionX.value = cardPosition[0];
      pannerRef.current.positionY.value = cardPosition[1];
      pannerRef.current.positionZ.value = cardPosition[2];
    }
  }, [cardPosition, audioInitialized]);

  const playEffectSound = (effectType: string, intensity: number = 0.5) => {
    if (!audioInitialized || Tone.context.state !== 'running') return;

    const volume = Math.min(intensity * 0.3, 0.5); // Keep volume reasonable

    switch (effectType) {
      case 'holographic':
        // Crystalline chimes with shimmer
        const chimeNotes = ['C6', 'E6', 'G6', 'B6'];
        chimeNotes.forEach((note, index) => {
          synthsRef.current.holographic?.triggerAttackRelease(
            note, 
            '8n', 
            Tone.now() + (index * 0.1),
            volume
          );
        });
        break;

      case 'chrome':
        // Metallic resonance
        synthsRef.current.chrome?.triggerAttackRelease('C3', '2n', undefined, volume);
        break;

      case 'crystal':
        // High-frequency sparkles
        for (let i = 0; i < 5; i++) {
          setTimeout(() => {
            synthsRef.current.crystal?.triggerAttackRelease(
              `C${6 + Math.floor(Math.random() * 2)}`, 
              '16n', 
              undefined, 
              volume * 0.3
            );
          }, i * 50);
        }
        break;

      case 'gold':
        // Warm, rich tones
        synthsRef.current.gold?.triggerAttackRelease('G4', '4n', undefined, volume);
        break;

      case 'rare':
        // Deep bass undertones for rare cards
        synthsRef.current.rare_bass?.triggerAttackRelease('C2', '1n', undefined, volume);
        break;
    }
  };

  // Play rarity-based ambient sound
  useEffect(() => {
    if (!isActive || !audioInitialized) return;

    const playRaritySound = () => {
      switch (cardRarity) {
        case 'legendary':
          playEffectSound('rare', 0.8);
          break;
        case 'epic':
          playEffectSound('gold', 0.6);
          break;
        case 'rare':
          playEffectSound('chrome', 0.4);
          break;
        default:
          // Common cards have subtle crystal sounds
          playEffectSound('crystal', 0.2);
      }
    };

    const interval = setInterval(playRaritySound, 3000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, [cardRarity, isActive, audioInitialized]);

  // Expose play function for external use
  useImperativeHandle(ref, () => ({
    playEffectSound
  }), [audioInitialized]);

  return null;
});

SpatialAudioSystem.displayName = 'SpatialAudioSystem';
