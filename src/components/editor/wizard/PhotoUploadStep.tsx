
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Image, Upload, Sparkles, Crop, Camera } from 'lucide-react';
import { toast } from 'sonner';
import { analyzeCardImage } from '@/services/cardAnalyzer';

interface PhotoUploadStepProps {
  selectedPhoto: string;
  onPhotoSelect: (photo: string) => void;
  onAnalysisComplete?: (analysis: any) => void;
}

export const PhotoUploadStep = ({ selectedPhoto, onPhotoSelect, onAnalysisComplete }: PhotoUploadStepProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [imageDetails, setImageDetails] = useState<{
    dimensions: { width: number; height: number };
    aspectRatio: number;
    fileSize: string;
  } | null>(null);

  const processImageForCard = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = document.createElement('img');
      
      img.onload = () => {
        // Standard trading card aspect ratio is 2.5:3.5 (roughly 0.714)
        const targetAspectRatio = 2.5 / 3.5;
        const sourceAspectRatio = img.width / img.height;
        
        // Set canvas to optimal card dimensions (300x420 pixels for good quality)
        canvas.width = 300;
        canvas.height = 420;
        
        // Clear canvas with white background
        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          let drawWidth, drawHeight, offsetX, offsetY;
          
          if (sourceAspectRatio > targetAspectRatio) {
            // Image is wider - fit to height and center horizontally
            drawHeight = canvas.height;
            drawWidth = drawHeight * sourceAspectRatio;
            offsetX = (canvas.width - drawWidth) / 2;
            offsetY = 0;
          } else {
            // Image is taller - fit to width and center vertically
            drawWidth = canvas.width;
            drawHeight = drawWidth / sourceAspectRatio;
            offsetX = 0;
            offsetY = (canvas.height - drawHeight) / 2;
          }
          
          // Draw the image centered and fitted
          ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
          
          // Convert to data URL
          const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
          
          // Store image details
          setImageDetails({
            dimensions: { width: img.width, height: img.height },
            aspectRatio: sourceAspectRatio,
            fileSize: (file.size / 1024 / 1024).toFixed(2) + ' MB'
          });
          
          resolve(dataUrl);
        } else {
          reject(new Error('Failed to get canvas context'));
        }
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  };

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

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      try {
        toast.info('Processing image for card format...');
        const processedImageUrl = await processImageForCard(file);
        onPhotoSelect(processedImageUrl);
        toast.success('Photo processed and ready for card!');
        
        // Trigger AI analysis
        await handlePhotoAnalysis(processedImageUrl);
      } catch (error) {
        console.error('Error processing image:', error);
        toast.error('Failed to process image. Please try again.');
      }
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
      try {
        toast.info('Processing image for card format...');
        const processedImageUrl = await processImageForCard(file);
        onPhotoSelect(processedImageUrl);
        toast.success('Photo processed and ready for card!');
        
        // Trigger AI analysis
        await handlePhotoAnalysis(processedImageUrl);
      } catch (error) {
        console.error('Error processing image:', error);
        toast.error('Failed to process image. Please try again.');
      }
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
            {/* Card Preview */}
            <div className="flex justify-center">
              <div className="relative bg-white p-2 rounded-lg shadow-lg" style={{ width: 200, height: 280 }}>
                <img 
                  src={selectedPhoto} 
                  alt="Card preview" 
                  className="w-full h-full object-cover rounded"
                />
                <div className="absolute top-1 right-1 bg-black/50 text-white text-xs px-1 rounded">
                  Card Preview
                </div>
              </div>
            </div>
            
            <p className="text-crd-green font-medium">Photo optimized for card format!</p>
            
            {imageDetails && (
              <div className="text-xs text-crd-lightGray bg-editor-tool p-3 rounded">
                <div className="grid grid-cols-3 gap-2">
                  <div>Original: {imageDetails.dimensions.width}×{imageDetails.dimensions.height}</div>
                  <div>Size: {imageDetails.fileSize}</div>
                  <div>Ratio: {imageDetails.aspectRatio.toFixed(2)}:1</div>
                </div>
              </div>
            )}
            
            <div className="flex gap-2 justify-center">
              <Button
                onClick={open}
                variant="outline"
                className="border-editor-border text-white hover:bg-editor-border"
                disabled={isAnalyzing}
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose Different Photo
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Image className="w-16 h-16 text-gray-400 mx-auto" />
            <div>
              <p className="text-crd-lightGray mb-2">
                {isDragActive ? 'Drop your photo here' : 'Drag and drop your photo here'}
              </p>
              <p className="text-crd-lightGray/70 text-sm mb-4">
                Images will be automatically optimized for trading card format (2.5:3.5 ratio)
              </p>
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
            <span className="text-sm font-medium">Ready for Card Creation</span>
          </div>
          <p className="text-crd-lightGray text-xs">
            Your image has been processed and optimized for the standard trading card format. 
            You can now choose a template that matches your style.
          </p>
        </div>
      )}

      {/* Format Info */}
      <div className="bg-editor-darker p-4 rounded-lg">
        <h4 className="text-white font-medium text-sm mb-2">Supported Formats</h4>
        <div className="grid grid-cols-2 gap-4 text-xs text-crd-lightGray">
          <div>
            <div className="font-medium">File Types:</div>
            <div>JPG, PNG, WebP, GIF</div>
          </div>
          <div>
            <div className="font-medium">Recommendations:</div>
            <div>High resolution, good lighting</div>
          </div>
        </div>
      </div>
    </div>
  );
};
