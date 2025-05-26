
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Upload, Image } from 'lucide-react';
import { toast } from 'sonner';

interface SimpleCardWizardProps {
  onComplete: (data: { photo: string; templateId: string }) => void;
}

export const SimpleCardWizard = ({ onComplete }: SimpleCardWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPhoto, setSelectedPhoto] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  const templates = [
    { id: 'classic', name: 'Classic', preview: 'from-blue-500 to-purple-500' },
    { id: 'vintage', name: 'Vintage', preview: 'from-amber-500 to-orange-500' },
    { id: 'modern', name: 'Modern', preview: 'from-green-500 to-teal-500' },
    { id: 'neon', name: 'Neon', preview: 'from-pink-500 to-purple-500' }
  ];

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedPhoto(e.target?.result as string);
        toast.success('Photo uploaded!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleComplete = () => {
    if (selectedPhoto && selectedTemplate) {
      onComplete({ photo: selectedPhoto, templateId: selectedTemplate });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-editor-darker">
      <div className="bg-editor-dark rounded-2xl p-8 max-w-2xl w-full mx-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Create Your Card</h1>
          <p className="text-crd-lightGray">Just 2 simple steps to get started</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              currentStep >= 1 ? 'bg-crd-green text-black' : 'bg-editor-border text-gray-400'
            }`}>
              1
            </div>
            <div className={`w-12 h-px ${currentStep >= 2 ? 'bg-crd-green' : 'bg-editor-border'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              currentStep >= 2 ? 'bg-crd-green text-black' : 'bg-editor-border text-gray-400'
            }`}>
              2
            </div>
          </div>
        </div>

        {/* Step 1: Photo Upload */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white text-center">Upload Your Photo</h2>
            
            <div className="border-2 border-dashed border-editor-border rounded-xl p-8 text-center">
              {selectedPhoto ? (
                <div className="space-y-4">
                  <img src={selectedPhoto} alt="Selected" className="w-32 h-32 object-cover rounded-lg mx-auto" />
                  <p className="text-crd-green">Photo selected!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <Image className="w-16 h-16 text-gray-400 mx-auto" />
                  <p className="text-crd-lightGray">Click to upload your photo</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>

            <Button 
              onClick={() => setCurrentStep(2)}
              disabled={!selectedPhoto}
              className="w-full bg-crd-green hover:bg-crd-green/90 text-black"
            >
              Continue to Frame Selection
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {/* Step 2: Template Selection */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white text-center">Choose a Frame Style</h2>
            
            <div className="grid grid-cols-2 gap-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`p-4 rounded-xl cursor-pointer transition-all ${
                    selectedTemplate === template.id
                      ? 'ring-2 ring-crd-green bg-editor-tool'
                      : 'bg-editor-tool hover:bg-editor-border'
                  }`}
                >
                  <div className={`h-24 rounded-lg bg-gradient-to-br ${template.preview} mb-3`}></div>
                  <p className="text-white text-center font-medium">{template.name}</p>
                </div>
              ))}
            </div>

            <div className="flex space-x-3">
              <Button 
                onClick={() => setCurrentStep(1)}
                variant="outline"
                className="flex-1 border-editor-border text-white"
              >
                Back
              </Button>
              <Button 
                onClick={handleComplete}
                disabled={!selectedTemplate}
                className="flex-1 bg-crd-green hover:bg-crd-green/90 text-black"
              >
                Create Card
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
