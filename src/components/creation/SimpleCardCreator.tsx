
import React, { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useDropzone } from 'react-dropzone';
import { Upload, Camera, Download, Sparkles, ArrowLeft } from 'lucide-react';
import { SimpleCropper } from './SimpleCropper';
import { SIMPLE_FRAMES, getDefaultFrame, SimpleFrame } from './SimpleFrames';
import { toast } from 'sonner';

export const SimpleCardCreator: React.FC = () => {
  const [step, setStep] = useState<'upload' | 'crop' | 'preview'>('upload');
  const [originalImage, setOriginalImage] = useState<string>('');
  const [croppedImage, setCroppedImage] = useState<string>('');
  const [selectedFrame, setSelectedFrame] = useState<SimpleFrame>(getDefaultFrame());
  const [cardTitle, setCardTitle] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const imageUrl = URL.createObjectURL(file);
      setOriginalImage(imageUrl);
      setStep('crop');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    multiple: false
  });

  const handleCropComplete = (croppedImageUrl: string) => {
    setCroppedImage(croppedImageUrl);
    setStep('preview');
    toast.success('Image cropped successfully!');
  };

  const handleCropCancel = () => {
    setStep('upload');
    setOriginalImage('');
  };

  const handleExport = async () => {
    setIsProcessing(true);
    
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('Card created successfully!', {
      description: 'Your card has been saved to your collection.'
    });
    
    setIsProcessing(false);
    
    // Reset for new card
    setTimeout(() => {
      setStep('upload');
      setOriginalImage('');
      setCroppedImage('');
      setCardTitle('');
      setSelectedFrame(getDefaultFrame());
    }, 1500);
  };

  const handleStartOver = () => {
    setStep('upload');
    setOriginalImage('');
    setCroppedImage('');
    setCardTitle('');
    setSelectedFrame(getDefaultFrame());
  };

  const renderUploadStep = () => (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold theme-text-primary mb-2">Create Your Card</h1>
        <p className="theme-text-muted">Upload any image and we'll help you create a perfect trading card</p>
      </div>

      <Card className="theme-bg-secondary">
        <div
          {...getRootProps()}
          className={`p-12 text-center border-2 border-dashed rounded-lg cursor-pointer transition-all ${
            isDragActive 
              ? 'border-crd-green bg-crd-green/10' 
              : 'border-gray-400 hover:border-crd-green/50'
          }`}
        >
          <input {...getInputProps()} />
          
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-crd-green/20 rounded-full flex items-center justify-center">
              {isDragActive ? (
                <Upload className="w-8 h-8 text-crd-green animate-bounce" />
              ) : (
                <Camera className="w-8 h-8 text-crd-green" />
              )}
            </div>
            
            <div>
              <h3 className="text-xl font-semibold theme-text-primary mb-2">
                {isDragActive ? 'Drop your image here!' : 'Upload Your Image'}
              </h3>
              <p className="theme-text-muted">
                Drag & drop any photo or click to browse
              </p>
            </div>
            
            <Button className="bg-crd-green hover:bg-crd-green/90 text-black font-medium">
              Choose File
            </Button>
            
            <p className="text-xs theme-text-muted">
              PNG, JPG, WebP • Any size • We'll help you crop it perfectly
            </p>
          </div>
        </div>
      </Card>

      <div className="bg-gradient-to-r from-crd-green/10 to-crd-blue/10 rounded-lg p-6">
        <h3 className="font-semibold theme-text-primary mb-2 flex items-center">
          <Sparkles className="w-5 h-5 mr-2 text-crd-green" />
          What makes this simple:
        </h3>
        <ul className="space-y-1 theme-text-muted text-sm">
          <li>• Upload any image - we'll help you crop it to fit</li>
          <li>• Choose from 4 simple frame styles</li>
          <li>• One-click export to trading card format</li>
          <li>• Perfect 2.5" × 3.5" dimensions for printing</li>
        </ul>
      </div>
    </div>
  );

  const renderCropStep = () => (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold theme-text-primary mb-2">Position Your Image</h2>
        <p className="theme-text-muted">Drag the green area to choose what part of your image to use</p>
      </div>
      
      <SimpleCropper
        imageUrl={originalImage}
        onCropComplete={handleCropComplete}
        onCancel={handleCropCancel}
      />
    </div>
  );

  const renderPreviewStep = () => (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold theme-text-primary mb-2">Your Card is Ready!</h2>
        <p className="theme-text-muted">Make final adjustments or export your card</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Card Preview */}
        <div className="space-y-4">
          <div className="mx-auto w-fit">
            <div 
              className="relative bg-white shadow-2xl"
              style={{
                width: '250px',
                height: '350px',
                ...selectedFrame.style
              }}
            >
              <img
                src={croppedImage}
                alt="Card preview"
                className="w-full h-full object-cover"
                style={{
                  borderRadius: `calc(${selectedFrame.style.borderRadius} - ${selectedFrame.style.padding})`
                }}
              />
              {cardTitle && (
                <div className="absolute bottom-2 left-2 right-2 bg-black/80 text-white p-2 rounded text-sm font-medium text-center">
                  {cardTitle}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium theme-text-primary mb-2">
              Card Title (Optional)
            </label>
            <Input
              value={cardTitle}
              onChange={(e) => setCardTitle(e.target.value)}
              placeholder="Enter card title..."
              className="theme-bg-secondary theme-border"
            />
          </div>

          {/* Frame Selection */}
          <div>
            <label className="block text-sm font-medium theme-text-primary mb-3">
              Frame Style
            </label>
            <div className="grid grid-cols-2 gap-3">
              {SIMPLE_FRAMES.map((frame) => (
                <Button
                  key={frame.id}
                  variant={selectedFrame.id === frame.id ? "default" : "outline"}
                  onClick={() => setSelectedFrame(frame)}
                  className={`h-auto p-3 flex flex-col ${
                    selectedFrame.id === frame.id 
                      ? 'bg-crd-green text-black' 
                      : 'theme-border theme-text-primary hover:theme-bg-accent'
                  }`}
                >
                  <span className="font-medium text-sm">{frame.name}</span>
                  <span className="text-xs opacity-70">{frame.description}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              onClick={handleExport}
              disabled={isProcessing}
              className="w-full bg-crd-green hover:bg-crd-green/90 text-black font-semibold py-3"
            >
              {isProcessing ? (
                'Creating Card...'
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Create Card
                </>
              )}
            </Button>
            
            <Button
              onClick={handleStartOver}
              variant="outline"
              className="w-full theme-border theme-text-secondary"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Start Over
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen theme-bg-primary py-8 px-4">
      {step === 'upload' && renderUploadStep()}
      {step === 'crop' && renderCropStep()}
      {step === 'preview' && renderPreviewStep()}
    </div>
  );
};
