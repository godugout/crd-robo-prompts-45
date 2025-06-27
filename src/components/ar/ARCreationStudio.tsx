
import React, { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { createXRStore, XR, ARButton } from '@react-three/xr';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ARCardDesigner } from './ARCardDesigner';
import { GestureController } from './GestureController';
import { EnvironmentalEffectMapper } from './EnvironmentalEffectMapper';
import { CardPortalSystem } from './CardPortalSystem';
import { 
  Smartphone, Hand, Eye, Sparkles, 
  MapPin, CloudRain, Sun, Snowflake 
} from 'lucide-react';

interface ARCreationStudioProps {
  onCardCreate: (cardData: any) => void;
  onPortalActivate: (cardId: string) => void;
}

export const ARCreationStudio: React.FC<ARCreationStudioProps> = ({
  onCardCreate,
  onPortalActivate
}) => {
  const [isARSupported, setIsARSupported] = useState(false);
  const [currentMode, setCurrentMode] = useState<'design' | 'portal' | 'environmental'>('design');
  const [activeGestures, setActiveGestures] = useState<string[]>([]);
  const [environmentalData, setEnvironmentalData] = useState({
    lighting: 'daylight',
    weather: 'clear',
    temperature: 22,
    humidity: 45
  });
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const store = createXRStore();

  useEffect(() => {
    // Check for WebXR support
    if ('xr' in navigator) {
      navigator.xr?.isSessionSupported('immersive-ar').then((supported) => {
        setIsARSupported(supported);
      }).catch(() => {
        setIsARSupported(false);
      });
    }
  }, []);

  const handleGestureRecognized = (gesture: string, data: any) => {
    setActiveGestures(prev => [...prev.slice(-4), gesture]);
    
    switch (gesture) {
      case 'paint':
        // Apply paint effect at gesture position
        console.log('Paint gesture at:', data.position);
        break;
      case 'throw':
        // Activate card portal
        onPortalActivate(data.cardId);
        break;
      case 'scale':
        // Scale card
        console.log('Scale gesture:', data.scale);
        break;
      case 'rotate':
        // Rotate card
        console.log('Rotate gesture:', data.rotation);
        break;
    }
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'design': return <Hand className="w-4 h-4" />;
      case 'portal': return <Smartphone className="w-4 h-4" />;
      case 'environmental': return <Eye className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  const getWeatherIcon = (weather: string) => {
    switch (weather) {
      case 'rain': return <CloudRain className="w-4 h-4 text-blue-400" />;
      case 'snow': return <Snowflake className="w-4 h-4 text-blue-200" />;
      case 'sunny': return <Sun className="w-4 h-4 text-yellow-400" />;
      default: return <Sun className="w-4 h-4 text-gray-400" />;
    }
  };

  if (!isARSupported) {
    return (
      <Card className="p-6 bg-gradient-to-br from-slate-900 to-purple-900 text-white">
        <div className="text-center space-y-4">
          <div className="text-6xl">📱</div>
          <h3 className="text-xl font-bold">AR Not Supported</h3>
          <p className="text-gray-300 max-w-md mx-auto">
            Your device doesn't support WebXR AR features. Try using a modern mobile browser 
            or AR-capable device to experience the full Reality-Augmented Creation Suite.
          </p>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Check Again
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* AR Controls Header */}
      <div className="absolute top-4 left-4 right-4 z-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
            AR Ready
          </Badge>
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">
            {activeGestures.length} Gestures
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          {getWeatherIcon(environmentalData.weather)}
          <span className="text-white text-sm">
            {environmentalData.temperature}°C
          </span>
        </div>
      </div>

      {/* Mode Selection */}
      <div className="absolute top-20 left-4 z-50 space-y-2">
        {['design', 'portal', 'environmental'].map((mode) => (
          <Button
            key={mode}
            variant={currentMode === mode ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCurrentMode(mode as any)}
            className="w-full justify-start text-white"
          >
            {getModeIcon(mode)}
            <span className="ml-2 capitalize">{mode}</span>
          </Button>
        ))}
      </div>

      {/* Active Gestures Display */}
      <div className="absolute bottom-4 left-4 z-50">
        <Card className="p-3 bg-black/50 backdrop-blur">
          <div className="text-white text-sm font-medium mb-2">Recent Gestures:</div>
          <div className="flex gap-2">
            {activeGestures.slice(-3).map((gesture, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {gesture}
              </Badge>
            ))}
          </div>
        </Card>
      </div>

      {/* Main AR Canvas */}
      <Canvas
        ref={canvasRef}
        className="w-full h-full"
        gl={{ alpha: true }}
      >
        <XR store={store}>
          {/* AR Scene Lighting */}
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 5]} intensity={0.8} />

          {/* Core AR Components */}
          <ARCardDesigner 
            mode={currentMode}
            onCardCreate={onCardCreate}
            environmentalData={environmentalData}
          />

          <GestureController 
            onGestureRecognized={handleGestureRecognized}
            enabledGestures={['paint', 'throw', 'scale', 'rotate']}
          />

          <EnvironmentalEffectMapper 
            onEnvironmentUpdate={setEnvironmentalData}
            weatherEffects={true}
            lightingEffects={true}
          />

          <CardPortalSystem 
            active={currentMode === 'portal'}
            onPortalCreate={(portalData) => console.log('Portal created:', portalData)}
          />
        </XR>
      </Canvas>

      {/* AR Entry Button */}
      <div className="absolute bottom-4 right-4 z-50">
        <ARButton
          store={store}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300"
        />
      </div>
    </div>
  );
};
