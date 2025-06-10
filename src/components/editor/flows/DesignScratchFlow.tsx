import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Sparkles, Search, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FrameTemplatePreview, type FrameTemplate } from './FrameTemplate';
import { CanvasEditor } from './CanvasEditor';
import { FRAME_TEMPLATES, FRAME_CATEGORIES } from './FrameTemplatesData';
import { toast } from 'sonner';
import { TemplatePreviewWithImage } from './TemplatePreviewWithImage';

export const DesignScratchFlow = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<'frames' | 'customize' | 'finalize'>('frames');
  const [selectedFrame, setSelectedFrame] = useState<FrameTemplate | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [canvasData, setCanvasData] = useState<string>('');
  const [cardTitle, setCardTitle] = useState('');
  const [cardDescription, setCardDescription] = useState('');
  const [currentImageUrl, setCurrentImageUrl] = useState<string>('');

  // Filter frames based on category and search
  const filteredFrames = FRAME_TEMPLATES.filter(frame => {
    const matchesCategory = selectedCategory === 'All' || frame.category === selectedCategory;
    const matchesSearch = !searchTerm || 
      frame.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      frame.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      frame.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const handleFrameSelect = (frame: FrameTemplate) => {
    setSelectedFrame(frame);
    setCurrentStep('customize');
    toast.success(`${frame.name} frame selected!`);
  };

  const handleSaveDesign = (data: string) => {
    setCanvasData(data);
    toast.success('Design saved successfully');
  };

  const handleExportDesign = (imageData: string) => {
    // Create download link
    const link = document.createElement('a');
    link.download = `${cardTitle || 'card-design'}.png`;
    link.href = imageData;
    link.click();
    
    toast.success('Card exported successfully!');
  };

  const handleFinalize = () => {
    if (!cardTitle.trim()) {
      toast.error('Please enter a card title');
      return;
    }
    
    setCurrentStep('finalize');
  };

  const handleCreateCard = () => {
    // Here you would typically save to database
    toast.success('Card created successfully!');
    navigate('/profile', { 
      state: { 
        message: 'Your custom card has been created!',
        cardData: { title: cardTitle, description: cardDescription, canvasData }
      } 
    });
  };

  // Check if user can proceed to next step
  const canProceedFromCustomize = cardTitle.trim().length >= 3;

  const renderStepContent = () => {
    switch (currentStep) {
      case 'frames':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Choose Your Frame</h2>
              <p className="text-crd-lightGray">Select a frame template to start designing your card</p>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-crd-lightGray" />
                <Input
                  placeholder="Search frames..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-editor-tool border-editor-border text-crd-white"
                />
              </div>
              
              <div className="flex gap-2 overflow-x-auto">
                {FRAME_CATEGORIES.map((category) => (
                  <Button
                    key={category}
                    size="sm"
                    variant={selectedCategory === category ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category)}
                    className={
                      selectedCategory === category
                        ? "bg-crd-green text-crd-dark whitespace-nowrap"
                        : "border-editor-border text-crd-lightGray hover:text-white whitespace-nowrap"
                    }
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Results Count */}
            <p className="text-crd-lightGray text-sm">
              Showing {filteredFrames.length} of {FRAME_TEMPLATES.length} frames
            </p>

            {/* Enhanced Frame Grid with Image Previews */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredFrames.map((frame) => (
                <TemplatePreviewWithImage
                  key={frame.id}
                  templateId={frame.id}
                  templateName={frame.name}
                  currentImageUrl={currentImageUrl}
                  isSelected={selectedFrame?.id === frame.id}
                  onSelect={() => handleFrameSelect(frame)}
                />
              ))}
            </div>

            {filteredFrames.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-editor-border rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Search className="w-8 h-8 text-crd-lightGray" />
                </div>
                <h3 className="text-crd-white font-medium mb-2">No frames found</h3>
                <p className="text-crd-lightGray text-sm">Try adjusting your search or filter</p>
              </div>
            )}
          </div>
        );

      case 'customize':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Customize Your Design</h2>
                <p className="text-crd-lightGray">Frame: {selectedFrame?.name}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep('frames')}
                  className="border-editor-border text-crd-lightGray hover:text-white"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Change Frame
                </Button>
              </div>
            </div>

            {/* Card Details Section - Enhanced UI */}
            <Card className="bg-editor-tool border-editor-border">
              <CardContent className="p-6">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  Card Details
                  {canProceedFromCustomize ? (
                    <CheckCircle className="w-5 h-5 text-crd-green" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                  )}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-white text-sm font-medium block mb-2">
                      Card Title * 
                      <span className="ml-2 text-xs text-crd-lightGray">({cardTitle.length}/50)</span>
                    </label>
                    <Input
                      value={cardTitle}
                      onChange={(e) => setCardTitle(e.target.value)}
                      placeholder="Enter your card title..."
                      maxLength={50}
                      className={`bg-editor-dark border-editor-border text-white placeholder-crd-lightGray ${
                        cardTitle.trim().length >= 3 
                          ? 'focus:border-crd-green border-crd-green/30' 
                          : 'focus:border-yellow-500'
                      }`}
                    />
                    {cardTitle.trim().length > 0 && cardTitle.trim().length < 3 && (
                      <p className="text-yellow-500 text-xs mt-1">Title must be at least 3 characters</p>
                    )}
                    {cardTitle.trim().length >= 3 && (
                      <p className="text-crd-green text-xs mt-1">✓ Title looks good!</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="text-white text-sm font-medium block mb-2">
                      Description (Optional)
                      <span className="ml-2 text-xs text-crd-lightGray">({cardDescription.length}/200)</span>
                    </label>
                    <textarea
                      value={cardDescription}
                      onChange={(e) => setCardDescription(e.target.value)}
                      placeholder="Describe your card..."
                      maxLength={200}
                      rows={3}
                      className="w-full p-3 bg-editor-dark border border-editor-border rounded-lg text-white placeholder-crd-lightGray focus:border-crd-green focus:outline-none"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Canvas Editor */}
            {selectedFrame && (
              <CanvasEditor
                selectedFrame={selectedFrame}
                onSave={handleSaveDesign}
                onExport={handleExportDesign}
                onImageChange={setCurrentImageUrl}
              />
            )}

            {/* Enhanced Finalize Button */}
            <div className="flex justify-center pt-6">
              <div className="bg-editor-tool p-6 rounded-xl border border-editor-border w-full max-w-md">
                <div className="text-center mb-4">
                  <h3 className="text-white font-medium mb-2">Ready to Continue?</h3>
                  <p className="text-crd-lightGray text-sm">
                    {canProceedFromCustomize 
                      ? 'Your card details look good! Ready to finalize.' 
                      : 'Please complete the card title to continue.'
                    }
                  </p>
                </div>
                <Button
                  onClick={handleFinalize}
                  disabled={!canProceedFromCustomize}
                  className={`w-full px-8 py-3 text-lg font-medium ${
                    canProceedFromCustomize
                      ? 'bg-crd-green hover:bg-crd-green/90 text-black'
                      : 'bg-gray-600 text-gray-300 cursor-not-allowed'
                  }`}
                >
                  {canProceedFromCustomize ? (
                    <>
                      Finalize Card
                      <Sparkles className="w-5 h-5 ml-2" />
                    </>
                  ) : (
                    'Enter card title to continue'
                  )}
                </Button>
              </div>
            </div>
          </div>
        );

      case 'finalize':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Ready to Create!</h2>
                <p className="text-crd-lightGray">Review your card and publish it</p>
              </div>
              <Button
                variant="outline"
                onClick={() => setCurrentStep('customize')}
                className="border-editor-border text-crd-lightGray hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Editor
              </Button>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Card Summary */}
              <Card className="bg-editor-dark border-editor-border">
                <CardContent className="p-6">
                  <h3 className="text-white font-semibold mb-4">Card Summary</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-editor-tool rounded-lg">
                      <h4 className="text-white font-medium text-lg">{cardTitle}</h4>
                      {cardDescription && (
                        <p className="text-crd-lightGray text-sm mt-2">{cardDescription}</p>
                      )}
                      {currentImageUrl && (
                        <div className="mt-3">
                          <img 
                            src={currentImageUrl} 
                            alt="Card preview" 
                            className="w-full max-w-48 h-auto rounded border border-editor-border"
                          />
                        </div>
                      )}
                    </div>
                    
                    <Button
                      onClick={handleCreateCard}
                      className="w-full bg-crd-green hover:bg-crd-green/90 text-black font-medium py-3"
                    >
                      Create Card
                      <Sparkles className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Design Summary */}
              <Card className="bg-editor-dark border-editor-border">
                <CardContent className="p-6">
                  <h3 className="text-white font-semibold mb-4">Design Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-crd-lightGray">Frame:</span>
                      <span className="text-white">{selectedFrame?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-crd-lightGray">Category:</span>
                      <span className="text-white">{selectedFrame?.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-crd-lightGray">Elements:</span>
                      <span className="text-white">{selectedFrame?.cutout_areas.length} areas</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-crd-lightGray">Effects:</span>
                      <span className="text-white">{selectedFrame?.effects?.length || 0} applied</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-crd-lightGray">Image:</span>
                      <span className="text-white">{currentImageUrl ? 'Added' : 'None'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
        {/* Header with Enhanced Progress */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/cards')}
            className="text-crd-lightGray hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">Design from Scratch</h1>
            <p className="text-crd-lightGray">Create a custom card with full design control</p>
          </div>
          
          {/* Enhanced Progress Indicator */}
          <div className="flex items-center gap-3 text-sm">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
              currentStep === 'frames' ? 'bg-crd-green text-black scale-105' : 
              selectedFrame ? 'bg-editor-border text-crd-lightGray' : 'bg-gray-800 text-gray-500'
            }`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                currentStep === 'frames' ? 'bg-black text-crd-green' : 'bg-gray-600 text-white'
              }`}>1</span>
              <span>Choose Frame</span>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
              currentStep === 'customize' ? 'bg-crd-green text-black scale-105' : 
              selectedFrame ? 'bg-editor-border text-crd-lightGray' : 'bg-gray-800 text-gray-500'
            }`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                currentStep === 'customize' ? 'bg-black text-crd-green' : 'bg-gray-600 text-white'
              }`}>2</span>
              <span>Customize</span>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
              currentStep === 'finalize' ? 'bg-crd-green text-black scale-105' : 
              canProceedFromCustomize ? 'bg-editor-border text-crd-lightGray' : 'bg-gray-800 text-gray-500'
            }`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                currentStep === 'finalize' ? 'bg-black text-crd-green' : 'bg-gray-600 text-white'
              }`}>3</span>
              <span>Finalize</span>
            </div>
          </div>
        </div>

        {renderStepContent()}
      </div>
    </div>
  );
};
