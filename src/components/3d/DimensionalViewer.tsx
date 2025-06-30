
import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkles, Zap, Camera, Home, Atom } from 'lucide-react';
import { DimensionalCard3D } from './core/DimensionalCard3D';
import { EnvironmentSystem } from './environments/EnvironmentSystem';
import { CardFusionSystem } from './fusion/CardFusionSystem';

interface DimensionalViewerProps {
  card: any;
  fusionCard?: any;
  onEnvironmentChange?: (env: string) => void;
  onFusionToggle?: () => void;
}

export const DimensionalViewer: React.FC<DimensionalViewerProps> = ({
  card,
  fusionCard,
  onEnvironmentChange,
  onFusionToggle
}) => {
  const [environment, setEnvironment] = useState<'cosmic' | 'studio' | 'bedroom' | 'mathematical'>('cosmic');
  const [isAssembling, setIsAssembling] = useState(true);
  const [fusionMode, setFusionMode] = useState(false);
  const [fusionProgress, setFusionProgress] = useState(0);

  const environments = [
    { id: 'cosmic', name: 'Cosmic Void', icon: Sparkles, color: 'from-purple-500 to-blue-500' },
    { id: 'studio', name: 'Photo Studio', icon: Camera, color: 'from-gray-400 to-gray-600' },
    { id: 'bedroom', name: 'Nostalgic Room', icon: Home, color: 'from-orange-400 to-red-500' },
    { id: 'mathematical', name: 'Math Space', icon: Atom, color: 'from-green-400 to-cyan-500' }
  ] as const;

  const handleEnvironmentChange = (env: typeof environment) => {
    setEnvironment(env);
    onEnvironmentChange?.(env);
  };

  const handleFusionToggle = () => {
    if (!fusionMode && fusionCard) {
      setFusionMode(true);
      setFusionProgress(0);
      // Animate fusion progress
      const interval = setInterval(() => {
        setFusionProgress(prev => {
          if (prev >= 1) {
            clearInterval(interval);
            return 1;
          }
          return prev + 0.02;
        });
      }, 50);
    } else {
      setFusionMode(false);
      setFusionProgress(0);
    }
    onFusionToggle?.();
  };

  return (
    <div className="w-full h-full relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Canvas
        shadows
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance"
        }}
        style={{ width: '100%', height: '100%' }}
      >
        <Suspense fallback={null}>
          <EnvironmentSystem environment={environment} intensity={1.0} />
          
          {fusionMode && fusionCard ? (
            <CardFusionSystem
              card1={card}
              card2={fusionCard}
              fusionProgress={fusionProgress}
              onFusionComplete={(fusedCard) => {
                console.log('Fusion complete:', fusedCard);
              }}
            />
          ) : (
            <DimensionalCard3D
              card={card}
              environment={environment}
              isAssembling={isAssembling}
              breatheIntensity={0.02}
              onAssemblyComplete={() => setIsAssembling(false)}
            />
          )}
          
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            enableRotate={true}
            minDistance={4}
            maxDistance={12}
            autoRotate={false}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI - Math.PI / 6}
          />
        </Suspense>
      </Canvas>

      {/* Environment Controls */}
      <div className="absolute top-4 left-4 space-y-2">
        <div className="bg-black/80 backdrop-blur-md rounded-xl p-3 border border-white/20">
          <h3 className="text-white font-medium mb-2 text-sm">Reality Dimensions</h3>
          <div className="grid grid-cols-2 gap-2">
            {environments.map((env) => {
              const IconComponent = env.icon;
              return (
                <Button
                  key={env.id}
                  onClick={() => handleEnvironmentChange(env.id)}
                  size="sm"
                  variant={environment === env.id ? "default" : "outline"}
                  className={`
                    relative overflow-hidden border-0 text-xs h-8
                    ${environment === env.id 
                      ? `bg-gradient-to-r ${env.color} text-white` 
                      : 'bg-white/10 text-white hover:bg-white/20'
                    }
                  `}
                >
                  <IconComponent className="w-3 h-3 mr-1" />
                  {env.name}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Fusion Controls */}
        {fusionCard && (
          <div className="bg-black/80 backdrop-blur-md rounded-xl p-3 border border-white/20">
            <Button
              onClick={handleFusionToggle}
              className={`
                w-full text-xs h-8 bg-gradient-to-r from-yellow-500 to-orange-500 
                hover:from-yellow-600 hover:to-orange-600 text-black font-semibold
                ${fusionMode ? 'animate-pulse' : ''}
              `}
              disabled={fusionMode && fusionProgress > 0 && fusionProgress < 1}
            >
              <Zap className="w-3 h-3 mr-1" />
              {fusionMode ? `Fusing... ${Math.round(fusionProgress * 100)}%` : 'Quantum Fusion'}
            </Button>
          </div>
        )}
      </div>

      {/* Performance Info */}
      <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md rounded-xl p-3 border border-white/20">
        <div className="text-white text-xs space-y-1">
          <div className="font-semibold text-crd-green">Dimensional Status</div>
          <div>Environment: {environments.find(e => e.id === environment)?.name}</div>
          <div>Physics: {fusionMode ? 'Quantum Fusion Active' : 'Reality Stable'}</div>
          <div className="text-gray-400">🎮 Drag to explore • 🔍 Scroll to zoom</div>
        </div>
      </div>
    </div>
  );
};
