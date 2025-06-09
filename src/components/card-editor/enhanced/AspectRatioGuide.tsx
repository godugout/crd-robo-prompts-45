
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface AspectRatioGuideProps {
  currentAspectRatio: number;
  targetAspectRatio: number;
}

export const AspectRatioGuide: React.FC<AspectRatioGuideProps> = ({
  currentAspectRatio,
  targetAspectRatio
}) => {
  const deviation = Math.abs(currentAspectRatio - targetAspectRatio);
  const deviationPercent = (deviation / targetAspectRatio) * 100;
  
  const getStatus = () => {
    if (deviationPercent < 2) return { type: 'perfect', icon: CheckCircle, color: 'text-green-400', message: 'Perfect aspect ratio!' };
    if (deviationPercent < 5) return { type: 'good', icon: CheckCircle, color: 'text-green-400', message: 'Good aspect ratio' };
    if (deviationPercent < 15) return { type: 'fair', icon: Info, color: 'text-yellow-400', message: 'Minor adjustment needed' };
    return { type: 'poor', icon: AlertTriangle, color: 'text-red-400', message: 'Significant adjustment needed' };
  };

  const status = getStatus();
  const StatusIcon = status.icon;

  return (
    <Card className="bg-editor-tool border-editor-border">
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StatusIcon className={`w-4 h-4 ${status.color}`} />
            <span className="text-sm font-medium text-white">Aspect Ratio Guide</span>
          </div>
          <span className={`text-xs ${status.color}`}>{status.message}</span>
        </div>
        
        <div className="mt-2 grid grid-cols-3 gap-4 text-xs">
          <div>
            <div className="text-crd-lightGray">Current</div>
            <div className="text-white font-mono">{currentAspectRatio.toFixed(3)}</div>
          </div>
          <div>
            <div className="text-crd-lightGray">Target</div>
            <div className="text-white font-mono">{targetAspectRatio.toFixed(3)}</div>
          </div>
          <div>
            <div className="text-crd-lightGray">Deviation</div>
            <div className={`font-mono ${status.color}`}>{deviationPercent.toFixed(1)}%</div>
          </div>
        </div>
        
        {/* Visual aspect ratio bar */}
        <div className="mt-3">
          <div className="flex items-center gap-2 text-xs text-crd-lightGray mb-1">
            <span>Landscape</span>
            <div className="flex-1 h-2 bg-editor-dark rounded-full relative">
              <div 
                className="absolute top-0 h-full w-1 bg-crd-green rounded-full"
                style={{ left: `${Math.min(100, (targetAspectRatio / 2) * 100)}%` }}
              />
              <div 
                className="absolute top-0 h-full w-1 bg-blue-400 rounded-full"
                style={{ left: `${Math.min(100, (currentAspectRatio / 2) * 100)}%` }}
              />
            </div>
            <span>Portrait</span>
          </div>
          <div className="flex justify-between text-xs text-crd-lightGray">
            <span>Green: Target</span>
            <span>Blue: Current</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
