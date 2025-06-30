
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, ChevronRight } from 'lucide-react';

export interface WorkflowStepConfig {
  id: string;
  label: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  isComplete?: boolean;
  isActive?: boolean;
  isLocked?: boolean;
}

interface WorkflowStepProps {
  step: WorkflowStepConfig;
  index: number;
  onClick: () => void;
}

export const WorkflowStep: React.FC<WorkflowStepProps> = ({ step, index, onClick }) => {
  return (
    <div className="flex items-center">
      <Button
        variant="ghost"
        onClick={onClick}
        disabled={step.isLocked}
        className={`h-auto p-0 flex items-center space-x-3 ${
          step.isActive 
            ? 'text-cyan-400' 
            : step.isComplete 
              ? 'text-green-400'
              : step.isLocked
                ? 'text-gray-600'
                : 'text-gray-400 hover:text-white'
        }`}
      >
        {/* Step Number/Icon */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
          step.isActive 
            ? 'border-cyan-400 bg-cyan-400/20' 
            : step.isComplete 
              ? 'border-green-400 bg-green-400/20'
              : step.isLocked
                ? 'border-gray-600 bg-gray-800'
                : 'border-gray-600 bg-gray-800 hover:border-gray-400'
        }`}>
          {step.isComplete ? (
            <Check className="w-4 h-4" />
          ) : (
            <span className="text-xs font-bold">{index + 1}</span>
          )}
        </div>
        
        {/* Step Info */}
        <div className="text-left">
          <div className="font-medium text-sm">{step.title}</div>
          <div className="text-xs opacity-70">{step.description}</div>
        </div>
      </Button>
      
      {index < 3 && (
        <ChevronRight className="w-4 h-4 text-gray-600 mx-2" />
      )}
    </div>
  );
};
