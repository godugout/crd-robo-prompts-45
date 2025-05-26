
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { FramesStep } from './sidebar/steps/FramesStep';
import { ElementsStep } from './sidebar/steps/ElementsStep';
import { PreviewStep } from './sidebar/steps/PreviewStep';
import { EffectsStep } from './sidebar/steps/EffectsStep';
import { PhotoStep } from './sidebar/steps/PhotoStep';

interface EditorSidebarProps {
  selectedTemplate: string;
  onSelectTemplate: (templateId: string) => void;
  onAddElement?: (elementType: string, elementId: string) => void;
}

type WorkflowStep = 'frames' | 'elements' | 'preview' | 'effects' | 'photo';

export const EditorSidebar = ({ 
  selectedTemplate, 
  onSelectTemplate, 
  onAddElement 
}: EditorSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('frames');

  const steps = [
    { key: 'frames' as const, label: '1', title: 'Frame', description: 'Choose template' },
    { key: 'elements' as const, label: '2', title: 'Elements', description: 'Add & edit content' },
    { key: 'preview' as const, label: '3', title: 'Preview', description: 'Review design' },
    { key: 'effects' as const, label: '4', title: 'Effects', description: 'Add visual effects' },
    { key: 'photo' as const, label: '5', title: 'Photo', description: 'Replace content' }
  ];

  const handleStepComplete = (nextStep: WorkflowStep) => {
    setCurrentStep(nextStep);
  };

  const currentStepInfo = steps.find(step => step.key === currentStep);

  return (
    <div className="w-80 bg-editor-darker border-r border-editor-border flex flex-col rounded-xl">
      {/* Search Bar */}
      <div className="p-4 border-b border-editor-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-editor-dark border-editor-border text-white rounded-xl"
          />
        </div>
      </div>

      {/* Workflow Progress */}
      <div className="px-4 py-3 border-b border-editor-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-medium text-sm uppercase tracking-wide">Card Creation</h3>
          <span className="text-crd-lightGray text-xs">Step {currentStepInfo?.label} of 5</span>
        </div>
        
        <div className="flex items-center space-x-1 mb-2">
          {steps.map((step, index) => (
            <div key={step.key} className="flex items-center">
              <button
                onClick={() => setCurrentStep(step.key)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  currentStep === step.key 
                    ? 'bg-crd-green text-black' 
                    : 'bg-editor-tool text-gray-400 hover:bg-editor-border'
                }`}
              >
                {step.label}
              </button>
              {index < steps.length - 1 && (
                <div className={`w-4 h-px mx-1 ${
                  steps.findIndex(s => s.key === currentStep) > index 
                    ? 'bg-crd-green' 
                    : 'bg-editor-border'
                }`}></div>
              )}
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <h4 className="text-white font-medium text-sm">{currentStepInfo?.title}</h4>
          <p className="text-crd-lightGray text-xs">{currentStepInfo?.description}</p>
        </div>
      </div>
      
      {/* Step Content */}
      <div className="flex-1 overflow-hidden">
        {currentStep === 'frames' && (
          <FramesStep 
            selectedTemplate={selectedTemplate}
            onSelectTemplate={(templateId) => {
              onSelectTemplate(templateId);
              handleStepComplete('elements');
            }}
            searchQuery={searchQuery}
          />
        )}
        
        {currentStep === 'elements' && (
          <ElementsStep 
            searchQuery={searchQuery} 
            onAddElement={onAddElement}
            onElementsComplete={() => handleStepComplete('preview')}
          />
        )}
        
        {currentStep === 'preview' && (
          <PreviewStep 
            selectedTemplate={selectedTemplate}
            onContinueToEffects={() => handleStepComplete('effects')}
          />
        )}
        
        {currentStep === 'effects' && (
          <EffectsStep 
            searchQuery={searchQuery}
            onEffectsComplete={() => handleStepComplete('photo')}
          />
        )}
        
        {currentStep === 'photo' && (
          <PhotoStep 
            selectedTemplate={selectedTemplate}
            searchQuery={searchQuery}
          />
        )}
      </div>
    </div>
  );
};
