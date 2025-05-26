
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Image, Upload, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { analyzeCardImage } from '@/services/cardAnalyzer';

interface PhotoUploadStepProps {
  selectedPhoto: string;
  onPhotoSelect: (photo: string) => void;
  onAnalysisComplete?: (analysis: any) => void;
}

export const PhotoUploadStep = ({ selectedPhoto, onPhotoSelect, onAnalysisComplete }: PhotoUploadStepProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handlePhotoAnalysis = async (imageDataUrl: string) => {
    if (!onAnalysisComplete) return;
    
    setIsAnalyzing(true);
    try {
      toast.info('Analyzing image with AI...', { icon: <Sparkles className="w-4 h-4" /> });
      const analysis = await analyzeCardImage(imageDataUrl);
      onAnalysisComplete(analysis);
      toast.success('Image analyzed! Fields have been pre-filled.');
    } catch (error) {
      console.error('Analysis failed:', error);
      toast.error('Analysis failed, but you can still fill details manually.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageDataUrl = e.target?.result as string;
        onPhotoSelect(imageDataUrl);
        toast.success('Photo uploaded!');
        
        // Trigger AI analysis
        await handlePhotoAnalysis(imageDataUrl);
      };
      reader.readAsDataURL(file);
    }
  }, [onPhotoSelect]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    },
    maxFiles: 1,
    noClick: true,
    noKeyboard: true
  });

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageDataUrl = e.target?.result as string;
        onPhotoSelect(imageDataUrl);
        toast.success('Photo uploaded!');
        
        // Trigger AI analysis
        await handlePhotoAnalysis(imageDataUrl);
      };
      reader.readAsDataURL(file);
    }
    event.target.value = '';
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-white mb-2">Upload Your Photo</h2>
        <p className="text-crd-lightGray">Choose the image that will be featured on your card</p>
        {isAnalyzing && (
          <div className="mt-2 flex items-center justify-center gap-2 text-crd-green">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span className="text-sm">AI is analyzing your image...</span>
          </div>
        )}
      </div>
      
      <div 
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
          isDragActive 
            ? 'border-crd-green bg-crd-green/10' 
            : 'border-editor-border hover:border-crd-green/50'
        }`}
      >
        <input {...getInputProps()} />
        {selectedPhoto ? (
          <div className="space-y-4">
            <img src={selectedPhoto} alt="Selected" className="w-48 h-48 object-cover rounded-lg mx-auto" />
            <p className="text-crd-green">Photo selected and analyzed!</p>
            <Button
              onClick={open}
              variant="outline"
              className="border-editor-border text-white hover:bg-editor-border"
              disabled={isAnalyzing}
            >
              Choose Different Photo
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Image className="w-16 h-16 text-gray-400 mx-auto" />
            <div>
              <p className="text-crd-lightGray mb-2">
                {isDragActive ? 'Drop your photo here' : 'Drag and drop your photo here'}
              </p>
              <p className="text-crd-lightGray/70 text-sm mb-4">or</p>
              <Button
                onClick={open}
                className="bg-crd-green hover:bg-crd-green/90 text-black"
                disabled={isAnalyzing}
              >
                <Upload className="w-4 h-4 mr-2" />
                Select Photo
              </Button>
            </div>
          </div>
        )}
        
        {/* Hidden file input for manual selection */}
        <input
          id="photo-input"
          type="file"
          accept="image/*"
          onChange={handlePhotoUpload}
          className="hidden"
        />
      </div>

      {selectedPhoto && !isAnalyzing && (
        <div className="bg-editor-tool p-4 rounded-lg">
          <div className="flex items-center gap-2 text-crd-green mb-2">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">AI Analysis Complete</span>
          </div>
          <p className="text-crd-lightGray text-xs">
            Your card details have been automatically filled based on the image analysis. 
            You can review and adjust them in the next steps.
          </p>
        </div>
      )}
    </div>
  );
};
