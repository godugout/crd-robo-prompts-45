
import React from 'react';
import { Upload, Image, Check } from 'lucide-react';
import { WorkflowPhase } from '../hooks/useCardUploadSession';

interface CardsPhaseIndicatorProps {
  phase: WorkflowPhase;
}

export const CardsPhaseIndicator: React.FC<CardsPhaseIndicatorProps> = ({ phase }) => {
  const phases = [
    { key: 'idle', label: 'Upload', icon: Upload },
    { key: 'detecting', label: 'Detect', icon: Image },
    { key: 'reviewing', label: 'Review', icon: Check },
    { key: 'complete', label: 'Complete', icon: Check }
  ];

  const getCurrentPhaseIndex = () => {
    if (phase === 'idle' || phase === 'uploading') return 0;
    if (phase === 'detecting') return 1;
    if (phase === 'reviewing' || phase === 'creating') return 2;
    return 3;
  };

  const currentIndex = getCurrentPhaseIndex();

  return (
    <div className="flex items-center justify-center mb-8">
      {phases.map((phaseItem, index) => {
        const Icon = phaseItem.icon;
        const isActive = index === currentIndex;
        const isCompleted = index < currentIndex;
        
        return (
          <div key={phaseItem.key} className="flex items-center">
            <div className={`flex items-center ${
              isActive ? 'text-crd-green' : isCompleted ? 'text-white' : 'text-crd-lightGray'
            }`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                isActive ? 'border-crd-green bg-crd-green text-black' :
                isCompleted ? 'border-white bg-white text-black' : 'border-crd-mediumGray'
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="ml-2 font-medium">{phaseItem.label}</span>
            </div>
            
            {index < phases.length - 1 && (
              <div className={`h-0.5 w-16 mx-4 ${
                index < currentIndex ? 'bg-crd-green' : 'bg-crd-mediumGray'
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
};
