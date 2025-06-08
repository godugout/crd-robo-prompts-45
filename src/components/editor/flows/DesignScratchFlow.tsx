
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Palette, Layers, Type, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FrameTemplate {
  id: string;
  name: string;
  category: string;
  preview: string;
  cutoutAreas: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
    type: 'photo' | 'text' | 'logo';
  }>;
}

const FRAME_TEMPLATES: FrameTemplate[] = [
  {
    id: 'classic-border',
    name: 'Classic Border',
    category: 'Traditional',
    preview: '/placeholder.svg',
    cutoutAreas: [
      { x: 10, y: 50, width: 280, height: 200, type: 'photo' },
      { x: 10, y: 260, width: 280, height: 40, type: 'text' }
    ]
  },
  {
    id: 'modern-split',
    name: 'Modern Split',
    category: 'Contemporary',
    preview: '/placeholder.svg',
    cutoutAreas: [
      { x: 150, y: 10, width: 140, height: 250, type: 'photo' },
      { x: 10, y: 10, width: 130, height: 100, type: 'text' }
    ]
  },
  {
    id: 'circular-window',
    name: 'Circular Window',
    category: 'Creative',
    preview: '/placeholder.svg',
    cutoutAreas: [
      { x: 75, y: 75, width: 150, height: 150, type: 'photo' },
      { x: 10, y: 240, width: 280, height: 30, type: 'text' }
    ]
  }
];

export const DesignScratchFlow = () => {
  const navigate = useNavigate();
  const [selectedFrame, setSelectedFrame] = useState<FrameTemplate | null>(null);
  const [currentStep, setCurrentStep] = useState<'frame' | 'customize' | 'preview'>('frame');

  const handleFrameSelect = (frame: FrameTemplate) => {
    setSelectedFrame(frame);
    setCurrentStep('customize');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'frame':
        return (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Choose Your Frame</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {FRAME_TEMPLATES.map((frame) => (
                <Card
                  key={frame.id}
                  className="bg-editor-dark border-editor-border hover:border-crd-green/50 cursor-pointer transition-all"
                  onClick={() => handleFrameSelect(frame)}
                >
                  <CardContent className="p-4">
                    <div className="aspect-[3/4] bg-editor-border rounded-lg mb-4 flex items-center justify-center">
                      <Palette className="w-12 h-12 text-crd-lightGray" />
                    </div>
                    <h3 className="text-white font-semibold mb-1">{frame.name}</h3>
                    <p className="text-crd-lightGray text-sm">{frame.category}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'customize':
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Customize Your Design</h2>
                <p className="text-crd-lightGray">Frame: {selectedFrame?.name}</p>
              </div>
              <Button
                variant="outline"
                onClick={() => setCurrentStep('frame')}
                className="border-editor-border text-crd-lightGray hover:text-white"
              >
                Change Frame
              </Button>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Tools Sidebar */}
              <div className="space-y-4">
                <Card className="bg-editor-dark border-editor-border">
                  <CardContent className="p-4">
                    <h3 className="text-white font-semibold mb-3 flex items-center">
                      <Layers className="w-4 h-4 mr-2" />
                      Elements
                    </h3>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        Add Photo
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <Type className="w-4 h-4 mr-2" />
                        Add Text
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        Add Shape
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        Add Sticker
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-editor-dark border-editor-border">
                  <CardContent className="p-4">
                    <h3 className="text-white font-semibold mb-3">Effects</h3>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        Shadow
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        Glow
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        Gradient
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Canvas Area */}
              <div className="lg:col-span-2">
                <Card className="bg-editor-dark border-editor-border">
                  <CardContent className="p-6">
                    <div className="aspect-[3/4] bg-editor-border rounded-lg flex items-center justify-center relative">
                      <div className="text-center">
                        <Palette className="w-16 h-16 text-crd-lightGray mx-auto mb-4" />
                        <p className="text-crd-lightGray">Canvas Area</p>
                        <p className="text-crd-lightGray text-sm">Frame: {selectedFrame?.name}</p>
                      </div>
                    </div>

                    <div className="flex justify-between mt-6">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentStep('frame')}
                        className="border-editor-border text-crd-lightGray hover:text-white"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Frames
                      </Button>
                      
                      <Button
                        onClick={() => setCurrentStep('preview')}
                        className="bg-crd-green hover:bg-crd-green/90 text-black"
                      >
                        Preview Card
                        <Sparkles className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );

      case 'preview':
        return (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Preview & Finalize</h2>
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="bg-editor-dark border-editor-border">
                <CardContent className="p-6">
                  <h3 className="text-white font-semibold mb-4">Card Preview</h3>
                  <div className="aspect-[3/4] bg-editor-border rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Sparkles className="w-16 h-16 text-crd-lightGray mx-auto mb-4" />
                      <p className="text-crd-lightGray">Final Preview</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="bg-editor-dark border-editor-border">
                  <CardContent className="p-6">
                    <h3 className="text-white font-semibold mb-4">Card Details</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-crd-lightGray text-sm block mb-2">Title</label>
                        <input
                          type="text"
                          placeholder="Enter card title..."
                          className="w-full p-3 bg-editor-border border border-editor-border rounded-lg text-white placeholder-crd-lightGray focus:border-crd-green focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-crd-lightGray text-sm block mb-2">Description</label>
                        <textarea
                          placeholder="Enter description..."
                          rows={3}
                          className="w-full p-3 bg-editor-border border border-editor-border rounded-lg text-white placeholder-crd-lightGray focus:border-crd-green focus:outline-none"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep('customize')}
                    className="flex-1 border-editor-border text-crd-lightGray hover:text-white"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Edit
                  </Button>
                  
                  <Button
                    className="flex-1 bg-crd-green hover:bg-crd-green/90 text-black"
                  >
                    Create Card
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-crd-darkest">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/cards')}
            className="text-crd-lightGray hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">Design from Scratch</h1>
            <p className="text-crd-lightGray">Create a custom card with full design control</p>
          </div>
        </div>

        {renderStepContent()}
      </div>
    </div>
  );
};
