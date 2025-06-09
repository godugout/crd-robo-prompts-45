import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Image as ImageIcon, Upload, Sparkles, Crop } from 'lucide-react';
import { toast } from 'sonner';
import { analyzeCardImage } from '@/services/cardAnalyzer';

interface PhotoUploadStepProps {
  selectedPhoto: string;
  onPhotoSelect: (photo: string) => void;
  onAnalysisComplete?: (analysis: any) => void;
}

export const PhotoUploadStep = ({ selectedPhoto, onPhotoSelect, onAnalysisComplete }: PhotoUploadStepProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [imageDetails, setImageDetails] = useState<{
    dimensions: { width: number; height: number };
    aspectRatio: number;
    fileSize: string;
  } | null>(null);

  const processImageForCard = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image(); // Fixed: Use new Image() instead of new HTMLImageElement()
        
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        img.onload = () => {
          try {
            // Store original image dimensions for later editing
            setImageDetails({
              dimensions: { width: img.width, height: img.height },
              aspectRatio: img.width / img.height,
              fileSize: (file.size / 1024 / 1024).toFixed(2) + ' MB'
            });
            
            // For initial upload, just return the original image URL
            // The enhanced editor will handle proper card fitting
            resolve(URL.createObjectURL(file));
          } catch (error) {
            console.error('Error processing image:', error);
            reject(new Error('Failed to process image'));
          }
        };
        
        img.onerror = () => {
          console.error('Error loading image');
          reject(new Error('Failed to load image'));
        };
        
        img.src = URL.createObjectURL(file);
      } catch (error) {
        console.error('Error in processImageForCard:', error);
        reject(new Error('Failed to initialize image processing'));
      }
    });
  };

  const handlePhotoAnalysis = async (originalFile: File) => {
    if (!onAnalysisComplete) return;
    
    setIsAnalyzing(true);
    try {
      toast.info('Analyzing image with AI...', { icon: <Sparkles className="w-4 h-4" /> });
      const analysis = await analyzeCardImage(originalFile);
      onAnalysisComplete(analysis);
      toast.success('Image analyzed! Fields have been pre-filled.');
    } catch (error) {
      console.error('Analysis failed:', error);
      toast.error('Analysis failed, but you can still fill details manually.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image file is too large. Please use an image smaller than 10MB.');
      return;
    }

    setIsProcessing(true);
    try {
      toast.info('Loading image...');
      const imageUrl = await processImageForCard(file);
      onPhotoSelect(imageUrl);
      toast.success('Photo loaded! Ready for card adjustment.');
      
      // Trigger AI analysis with the original file
      await handlePhotoAnalysis(file);
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error('Failed to load image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [onPhotoSelect]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif']
    },
    maxFiles: 1,
    noClick: true,
    noKeyboard: true,
    disabled: isProcessing || isAnalyzing
  });

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-crd-white mb-2">Upload Your Photo</h2>
        <p className="text-crd-lightGray">Choose the image that will be featured on your card</p>
        {(isAnalyzing || isProcessing) && (
          <div className="mt-2 flex items-center justify-center gap-2 text-crd-green">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span className="text-sm">
              {isProcessing ? 'Loading your image...' : 'AI is analyzing your image...'}
            </span>
          </div>
        )}
      </div>
      
      <div 
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
          isDragActive 
            ? 'border-crd-green bg-crd-green/10' 
            : 'border-editor-border hover:border-crd-green/50'
        } ${(isProcessing || isAnalyzing) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <input {...getInputProps()} />
        {selectedPhoto ? (
          <div className="space-y-4">
            {/* Image Preview */}
            <div className="flex justify-center">
              <div className="relative bg-crd-white p-2 rounded-lg shadow-lg" style={{ width: 200, height: 280 }}>
                <img 
                  src={selectedPhoto} 
                  alt="Upload preview" 
                  className="w-full h-full object-cover rounded"
                />
                <div className="absolute top-1 right-1 bg-crd-dark/50 text-crd-white text-xs px-1 rounded">
                  Preview
                </div>
              </div>
            </div>
            
            <p className="text-crd-green font-medium">Photo uploaded successfully!</p>
            
            {imageDetails && (
              <div className="text-xs text-crd-lightGray bg-editor-tool p-3 rounded">
                <div className="grid grid-cols-3 gap-2">
                  <div>Size: {imageDetails.dimensions.width}×{imageDetails.dimensions.height}</div>
                  <div>File: {imageDetails.fileSize}</div>
                  <div>Ratio: {imageDetails.aspectRatio.toFixed(2)}:1</div>
                </div>
              </div>
            )}
            
            <div className="flex gap-2 justify-center">
              <Button
                onClick={open}
                variant="outline"
                className="border-editor-border text-crd-white hover:bg-editor-border"
                disabled={isAnalyzing || isProcessing}
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose Different Photo
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <ImageIcon className="w-16 h-16 text-crd-lightGray mx-auto" />
            <div>
              <p className="text-crd-lightGray mb-2">
                {isDragActive ? 'Drop your photo here' : 'Drag and drop your photo here'}
              </p>
              <p className="text-crd-lightGray/70 text-sm mb-4">
                Upload any image to get started. You'll be able to crop and position it perfectly for your card in the next step.
              </p>
              <Button
                onClick={open}
                className="bg-crd-green hover:bg-crd-green/90 text-crd-dark"
                disabled={isAnalyzing || isProcessing}
              >
                <Upload className="w-4 h-4 mr-2" />
                {isProcessing ? 'Loading...' : 'Select Photo'}
              </Button>
            </div>
          </div>
        )}
      </div>

      {selectedPhoto && !isAnalyzing && !isProcessing && (
        <div className="bg-editor-tool p-4 rounded-lg">
          <div className="flex items-center gap-2 text-crd-green mb-2">
            <Crop className="w-4 h-4" />
            <span className="text-sm font-medium">Ready for Card Adjustment</span>
          </div>
          <p className="text-crd-lightGray text-xs">
            Your image has been uploaded successfully. In the next step, you'll be able to crop, position, and adjust it to fit the perfect 2.5:3.5 trading card format.
          </p>
        </div>
      )}

      {/* Format Info */}
      <div className="bg-editor-darker p-4 rounded-lg">
        <h4 className="text-crd-white font-medium text-sm mb-2">Supported Formats</h4>
        <div className="grid grid-cols-2 gap-4 text-xs text-crd-lightGray">
          <div>
            <div className="font-medium">File Types:</div>
            <div>JPG, PNG, WebP, GIF</div>
          </div>
          <div>
            <div className="font-medium">What's Next:</div>
            <div>Crop & position for perfect cards</div>
          </div>
        </div>
      </div>
    </div>
  );
};
