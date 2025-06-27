
import React, { useState, useCallback, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { DimensionalCard3D } from '../core/DimensionalCard3D';
import { SpatialAudioSystem, SpatialAudioSystemRef } from './SpatialAudioSystem';
import { HapticFeedbackSystem, HapticFeedbackSystemRef } from './HapticFeedbackSystem';
import { AdvancedGestureSystem } from './AdvancedGestureSystem';
import { EmotionDetectionSystem } from './EmotionDetectionSystem';
import { VoiceCommandSystem } from './VoiceCommandSystem';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Camera, CameraOff, Mic, MicOff } from 'lucide-react';

interface MultiSensoryCardViewerProps {
  card: any;
  className?: string;
}

export const MultiSensoryCardViewer: React.FC<MultiSensoryCardViewerProps> = ({
  card,
  className = ''
}) => {
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [emotionDetectionEnabled, setEmotionDetectionEnabled] = useState(false);
  const [voiceCommandsEnabled, setVoiceCommandsEnabled] = useState(false);
  const [cardEffects, setCardEffects] = useState<string[]>(['holographic']);
  const [cardPosition, setCardPosition] = useState<[number, number, number]>([0, 0, 0]);
  const [isInteracting, setIsInteracting] = useState(false);
  const [sparkles, setSparkles] = useState<{x: number, y: number, id: string}[]>([]);
  const [emotionIntensity, setEmotionIntensity] = useState(1);

  const audioSystemRef = useRef<SpatialAudioSystemRef>(null);
  const hapticSystemRef = useRef<HapticFeedbackSystemRef>(null);

  const handleGesture = useCallback((gesture: any) => {
    console.log('🤲 Gesture detected:', gesture.type);
    setIsInteracting(true);
    
    // Trigger haptic feedback
    if (hapticSystemRef.current) {
      hapticSystemRef.current.triggerInteractionFeedback(gesture.type);
    }

    // Play corresponding audio
    switch (gesture.type) {
      case 'tap':
        // Trigger card flip sound
        break;
      case 'pinch':
        // Play sparkle sound
        break;
      case 'shake':
        // Play transformation sound
        break;
    }

    setTimeout(() => setIsInteracting(false), 300);
  }, []);

  const handleSparkleAdd = useCallback((position: {x: number, y: number}) => {
    const sparkleId = `sparkle-${Date.now()}`;
    setSparkles(prev => [...prev, { ...position, id: sparkleId }]);
    
    // Play sparkle sound effect
    if (audioSystemRef.current) {
      audioSystemRef.current.playEffectSound('crystal', 0.7);
    }

    // Remove sparkle after animation
    setTimeout(() => {
      setSparkles(prev => prev.filter(s => s.id !== sparkleId));
    }, 2000);
  }, []);

  const handleColorRandomize = useCallback(() => {
    const colors = ['holographic', 'chrome', 'crystal', 'gold'];
    const randomEffect = colors[Math.floor(Math.random() * colors.length)];
    setCardEffects([randomEffect]);
    
    if (audioSystemRef.current) {
      audioSystemRef.current.playEffectSound(randomEffect, 0.8);
    }
  }, []);

  const handleSecretAnimation = useCallback((symbol: string) => {
    console.log('✨ Secret animation triggered:', symbol);
    
    switch (symbol) {
      case 'circle':
        setCardEffects(['holographic', 'crystal']);
        break;
      case 'lightning':
        setCardEffects(['chrome', 'gold']);
        break;
      case 'heart':
        setCardEffects(['crystal', 'holographic']);
        break;
    }

    if (audioSystemRef.current) {
      audioSystemRef.current.playEffectSound('holographic', 1.0);
    }
  }, []);

  const handleEmotionChange = useCallback((emotion: any) => {
    // Adjust card effects based on emotions
    const intensity = (emotion.happiness + emotion.excitement) / 2;
    setEmotionIntensity(intensity);
    
    // Brighten effects when user is happy/excited
    if (intensity > 0.7) {
      setCardEffects(prev => [...new Set([...prev, 'crystal'])]);
    }
  }, []);

  const handleVoiceCommand = useCallback((command: any) => {
    console.log('🎤 Voice command received:', command.action);
    
    switch (command.action) {
      case 'legendary':
        setCardEffects(['holographic', 'gold', 'crystal']);
        break;
      case 'fire':
        setCardEffects(['chrome', 'gold']);
        break;
      case 'sparkle':
        setCardEffects(['crystal', 'holographic']);
        break;
      case 'glow':
        setEmotionIntensity(1.5);
        break;
      case 'chrome':
        setCardEffects(['chrome']);
        break;
      case 'holographic':
        setCardEffects(['holographic']);
        break;
      case 'reset':
        setCardEffects([]);
        setEmotionIntensity(1);
        break;
    }

    if (audioSystemRef.current) {
      audioSystemRef.current.playEffectSound(command.action, 0.8);
    }
  }, []);

  return (
    <div className={`relative w-full h-full bg-black ${className}`}>
      {/* Multi-sensory systems */}
      <SpatialAudioSystem
        ref={audioSystemRef}
        cardEffects={cardEffects}
        cardRarity={card?.rarity || 'common'}
        cardPosition={cardPosition}
        isActive={audioEnabled}
      />
      
      <HapticFeedbackSystem
        ref={hapticSystemRef}
        cardMaterial="holographic"
        cardRarity={card?.rarity || 'common'}
        isInteracting={isInteracting}
      />

      <EmotionDetectionSystem
        onEmotionChange={handleEmotionChange}
        isEnabled={emotionDetectionEnabled}
      />

      <VoiceCommandSystem
        onCommand={handleVoiceCommand}
        isEnabled={voiceCommandsEnabled}
      />

      {/* Control panel */}
      <div className="absolute top-4 left-4 z-50 flex gap-2">
        <Button
          variant={audioEnabled ? "default" : "outline"}
          size="sm"
          onClick={() => setAudioEnabled(!audioEnabled)}
        >
          {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </Button>
        
        <Button
          variant={emotionDetectionEnabled ? "default" : "outline"}
          size="sm"
          onClick={() => setEmotionDetectionEnabled(!emotionDetectionEnabled)}
        >
          {emotionDetectionEnabled ? <Camera className="w-4 h-4" /> : <CameraOff className="w-4 h-4" />}
        </Button>
        
        <Button
          variant={voiceCommandsEnabled ? "default" : "outline"}
          size="sm"
          onClick={() => setVoiceCommandsEnabled(!voiceCommandsEnabled)}
        >
          {voiceCommandsEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
        </Button>
      </div>

      {/* Sparkle effects overlay */}
      {sparkles.map(sparkle => (
        <div
          key={sparkle.id}
          className="absolute pointer-events-none animate-ping"
          style={{
            left: sparkle.x - 10,
            top: sparkle.y - 10,
            width: 20,
            height: 20,
            background: 'radial-gradient(circle, #fff 0%, transparent 70%)',
            borderRadius: '50%'
          }}
        />
      ))}

      {/* 3D Card Viewer with gesture recognition */}
      <AdvancedGestureSystem
        onGesture={handleGesture}
        onSparkleAdd={handleSparkleAdd}
        onColorRandomize={handleColorRandomize}
        onSecretAnimation={handleSecretAnimation}
      >
        <Canvas
          camera={{ position: [0, 0, 5], fov: 50 }}
          style={{ filter: `brightness(${1 + emotionIntensity * 0.3})` }}
        >
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} />
          
          <DimensionalCard3D
            card={card}
            environment="cosmic"
            breatheIntensity={0.02 * emotionIntensity}
          />
          
          <OrbitControls enablePan={false} enableZoom={true} enableRotate={true} />
        </Canvas>
      </AdvancedGestureSystem>

      {/* Instructions overlay */}
      <div className="absolute bottom-4 left-4 right-4 bg-black/80 rounded-lg p-4 text-white text-sm backdrop-blur">
        <h3 className="font-bold mb-2">Multi-Sensory Controls:</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
          <div>
            <strong>Gestures:</strong>
            <br />• Pinch: Add sparkles
            <br />• Shake: Randomize colors
            <br />• Draw circles/hearts: Secret animations
          </div>
          <div>
            <strong>Voice Commands:</strong>
            <br />• "Make it legendary"
            <br />• "Add fire effects"
            <br />• "Add sparkle effects"
          </div>
          <div>
            <strong>Emotion Detection:</strong>
            <br />• Smile: Brighter glow
            <br />• Excitement: Enhanced effects
            <br />• Focus: Stable animations
          </div>
        </div>
      </div>
    </div>
  );
};
