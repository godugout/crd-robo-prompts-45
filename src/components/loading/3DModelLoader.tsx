
import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Boxes, Loader2 } from 'lucide-react';

interface Model3DLoaderProps {
  onLoadingProgress?: (progress: number) => void;
  children: React.ReactNode;
  modelName?: string;
}

export const Model3DLoader: React.FC<Model3DLoaderProps> = ({
  onLoadingProgress,
  children,
  modelName = 'model'
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<'geometry' | 'materials' | 'textures' | 'complete'>('geometry');

  useEffect(() => {
    // Simulate 3D model loading stages
    const loadingStages = [
      { stage: 'geometry', duration: 800, progress: 25 },
      { stage: 'materials', duration: 600, progress: 60 },
      { stage: 'textures', duration: 1000, progress: 90 },
      { stage: 'complete', duration: 200, progress: 100 }
    ];

    let currentStageIndex = 0;
    
    const loadNextStage = () => {
      if (currentStageIndex >= loadingStages.length) {
        setIsLoading(false);
        return;
      }
      
      const currentStage = loadingStages[currentStageIndex];
      setStage(currentStage.stage as any);
      
      const increment = (currentStage.progress - progress) / (currentStage.duration / 50);
      
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = Math.min(prev + increment, currentStage.progress);
          onLoadingProgress?.(newProgress);
          
          if (newProgress >= currentStage.progress) {
            clearInterval(interval);
            currentStageIndex++;
            setTimeout(loadNextStage, 100);
          }
          
          return newProgress;
        });
      }, 50);
    };
    
    loadNextStage();
    
    // Auto-complete after maximum time
    const timeout = setTimeout(() => {
      setIsLoading(false);
      setProgress(100);
    }, 4000);
    
    return () => clearTimeout(timeout);
  }, [onLoadingProgress, progress]);

  const getStageText = () => {
    switch (stage) {
      case 'geometry': return 'Loading geometry...';
      case 'materials': return 'Applying materials...';
      case 'textures': return 'Loading textures...';
      case 'complete': return 'Finalizing...';
      default: return 'Loading...';
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-crd-darkest to-crd-dark">
        <div className="text-center max-w-sm w-full px-8">
          <div className="mb-6">
            <Boxes className="w-16 h-16 text-crd-green mx-auto mb-4 animate-pulse" />
            <h3 className="text-white text-lg font-semibold mb-2">
              Loading 3D {modelName}
            </h3>
            <p className="text-white/60 text-sm">
              {getStageText()}
            </p>
          </div>
          
          <div className="space-y-3">
            <Progress 
              value={progress} 
              className="w-full h-2 bg-gray-800"
            />
            <div className="flex justify-between text-xs text-white/60">
              <span>{Math.round(progress)}%</span>
              <span className="flex items-center">
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                {stage}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
