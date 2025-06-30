
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Square, Image, Sparkles, Eye } from 'lucide-react';

interface WorkflowNavigationProps {
  currentStep: number;
  completedSteps: Set<number>;
  onStepChange: (step: number) => void;
}

const STEPS = [
  { id: 0, name: 'Frame', icon: Square, color: 'from-blue-500 to-cyan-500' },
  { id: 1, name: 'Elements', icon: Image, color: 'from-purple-500 to-pink-500' },
  { id: 2, name: 'Preview', icon: Eye, color: 'from-green-500 to-emerald-500' },
  { id: 3, name: 'Effects', icon: Sparkles, color: 'from-orange-500 to-red-500' },
];

export const WorkflowNavigation: React.FC<WorkflowNavigationProps> = ({
  currentStep,
  completedSteps,
  onStepChange
}) => {
  return (
    <div className="bg-black/10 backdrop-blur-md border-b border-white/10 px-6 py-3">
      <div className="flex items-center justify-center space-x-4">
        {STEPS.map((step, index) => {
          const isActive = currentStep === step.id;
          const isCompleted = completedSteps.has(step.id);
          const canAccess = index === 0 || completedSteps.has(index - 1);
          const StepIcon = step.icon;

          return (
            <div key={step.id} className="flex items-center">
              <Button
                variant={isActive ? "default" : "ghost"}
                size="sm"
                onClick={() => canAccess && onStepChange(step.id)}
                disabled={!canAccess}
                className={`
                  relative flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200
                  ${isActive 
                    ? 'bg-gradient-to-r ' + step.color + ' text-white shadow-lg' 
                    : isCompleted
                      ? 'bg-white/10 text-white border border-white/20'
                      : canAccess
                        ? 'text-white/70 hover:bg-white/5 hover:text-white'
                        : 'text-white/30 cursor-not-allowed'
                  }
                `}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <StepIcon className="w-4 h-4" />
                )}
                <span className="font-medium">{step.name}</span>
                
                {isActive && (
                  <Badge className="bg-white/20 text-white text-xs">
                    Active
                  </Badge>
                )}
              </Button>
              
              {index < STEPS.length - 1 && (
                <div className="w-8 h-px bg-white/20 mx-2" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
