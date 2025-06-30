
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { ViewerScene } from './components/ViewerScene';
import { ViewerUI } from './components/ViewerUI';
import { ViewerErrorBoundary } from './components/ViewerErrorBoundary';

export const Professional3DViewer: React.FC = () => {
  return (
    <ViewerErrorBoundary>
      <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative">
        <Canvas
          shadows
          camera={{ position: [0, 0, 5], fov: 50 }}
          style={{ width: '100%', height: '100%' }}
          gl={{ 
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
          }}
        >
          <ViewerScene />
          
          {/* Camera controls */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={3}
            maxDistance={10}
            target={[0, 0, 0]}
            dampingFactor={0.05}
            enableDamping={true}
          />
        </Canvas>
        
        <ViewerUI />
      </div>
    </ViewerErrorBoundary>
  );
};
