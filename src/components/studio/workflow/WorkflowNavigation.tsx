
import React from 'react';
import { WorkflowStep, WorkflowStepConfig } from './WorkflowStep';
import { Square, Layers, Eye, Sparkles } from 'lucide-react';

interface WorkflowNavigationProps {
  currentStep: number;
  completedSteps: Set<number>;
  onStepChange: (stepIndex: number) => void;
}

export const WorkflowNavigation: React.FC<WorkflowNavigationProps> = ({
  currentStep,
  completedSteps,
  onStepChange
}) => {
  const steps: WorkflowStepConfig[] = [
    {
      id: 'frames',
      label: '1',
      title: 'Choose Frame',
      description: 'Select card template',
      icon: Square,
      isComplete: completedSteps.has(0),
      isActive: currentStep === 0,
      isLocked: false
    },
    {
      id: 'elements',
      label: '2', 
      title: 'Add Elements',
      description: 'Customize content',
      icon: Layers,
      isComplete: completedSteps.has(1),
      isActive: currentStep === 1,
      isLocked: !completedSteps.has(0)
    },
    {
      id: 'preview',
      label: '3',
      title: 'Preview',
      description: 'Review design',
      icon: Eye,
      isComplete: completedSteps.has(2),
      isActive: currentStep === 2,
      isLocked: !completedSteps.has(1)
    },
    {
      id: 'effects',
      label: '4',
      title: 'Effects',
      description: 'Add finishing touches',
      icon: Sparkles,
      isComplete: completedSteps.has(3),
      isActive: currentStep === 3,
      isLocked: !completedSteps.has(2)
    }
  ];

  return (
    <div className="flex items-center justify-between p-4 bg-black/30 backdrop-blur-xl border-b border-white/10">
      <div className="flex items-center space-x-1">
        {steps.map((step, index) => (
          <WorkflowStep
            key={step.id}
            step={step}
            index={index}
            onClick={() => !step.isLocked && onStepChange(index)}
          />
        ))}
      </div>
      
      <div className="text-sm text-gray-400">
        Step {currentStep + 1} of {steps.length}
      </div>
    </div>
  );
};
