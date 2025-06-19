
import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useDropzone } from 'react-dropzone';
import { Upload, Camera, Crop, X, Wand2, AlertCircle, ArrowLeft, Save, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { InlineCropInterface } from './InlineCropInterface';
import { localStorageManager } from '@/lib/storage/LocalStorageManager';
import { useCreatorSettings } from '@/hooks/useCreatorSettings';

interface UploadPhaseProps {
  uploadedImage?: string;
  onImageUpload: (imageUrl: string) => void;
  onCropImage?: () => void;
}

interface UploadSession {
  id: string;
  originalFile?: {
    name: string;
    size: number;
    type: string;
  };
  imageUrl: string;
  cropSettings?: {
    x: number;
    y: number;
    width: number;
    height: number;
    aspectRatio: number;
  };
  enhancements?: Record<string, any>;
  timestamp: number;
  lastModified: number;
}

export const UploadPhase: React.FC<UploadPhaseProps> = ({
  uploadedImage,
  onImageUpload,
  onCropImage
}) => {
  const { addToRecent } = useCreatorSettings();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [progress, setProgress] = useState(0);
  const [cropMode, setCropMode] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');
  const [blobUrl, setBlobUrl] = useState<string>('');
  const [currentSession, setCurrentSession] = useState<UploadSession | null>(null);

  // Session management
  const sessionKey = 'current-upload-session';

  // Load session on mount
  useEffect(() => {
    const savedSession = localStorageManager.getItem<UploadSession>(sessionKey);
    if (savedSession) {
      // Check if blob URL is still valid
      if (savedSession.imageUrl.startsWith('blob:')) {
        const testImg = new Image();
        testImg.onload = () => {
          setCurrentSession(savedSession);
          setBlobUrl(savedSession.imageUrl);
          if (uploadedImage !== savedSession.imageUrl) {
            onImageUpload(savedSession.imageUrl);
          }
        };
        testImg.onerror = () => {
          // Blob URL is invalid, clear session
          localStorageManager.removeItem(sessionKey);
        };
        testImg.src = savedSession.imageUrl;
      } else {
        setCurrentSession(savedSession);
        setBlobUrl(savedSession.imageUrl);
      }
    }
  }, [onImageUpload, uploadedImage]);

  // Save session
  const saveSession = useCallback((session: UploadSession) => {
    localStorageManager.setItem(
      sessionKey,
      session,
      'uploads',
      'high'
    );
    setCurrentSession(session);
  }, []);

  // Cleanup blob URLs when component unmounts or URL changes
  useEffect(() => {
    return () => {
      if (blobUrl && blobUrl.startsWith('blob:')) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [blobUrl]);

  const onDrop = useCallback(async (acceptedFiles: File[], rejectedFiles: any[]) => {
    console.log('UploadPhase - onDrop called', { acceptedFiles, rejectedFiles });
    
    // Clear previous errors and cleanup old blob URL
    setUploadError('');
    if (blobUrl && blobUrl.startsWith('blob:')) {
      URL.revokeObjectURL(blobUrl);
    }
    
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const error = rejectedFiles[0].errors[0];
      const errorMessage = error.code === 'file-too-large' 
        ? 'File is too large. Maximum size is 50MB.'
        : error.code === 'file-invalid-type'
        ? 'File type not supported. Please use JPG, PNG, WebP, or GIF.'
        : 'File upload failed. Please try again.';
      
      setUploadError(errorMessage);
      toast.error(errorMessage);
      return;
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      console.log('UploadPhase - Processing file:', file.name, file.size, file.type);
      
      setIsProcessing(true);
      setProcessingStep('Uploading image...');
      setProgress(25);

      try {
        // Create image URL from file
        const imageUrl = URL.createObjectURL(file);
        setBlobUrl(imageUrl); // Track for cleanup
        console.log('UploadPhase - Created image URL:', imageUrl);
        
        setProcessingStep('Processing image...');
        setProgress(75);
        
        // Simple validation - just check if it's a valid image file type
        if (!file.type.startsWith('image/')) {
          throw new Error('Invalid file type');
        }
        
        setProgress(100);
        setProcessingStep('Upload complete!');
        
        // Create upload session
        const session: UploadSession = {
          id: `upload-${Date.now()}`,
          originalFile: {
            name: file.name,
            size: file.size,
            type: file.type
          },
          imageUrl,
          timestamp: Date.now(),
          lastModified: Date.now()
        };

        // Save session and add to recent
        saveSession(session);
        addToRecent('uploads', { url: imageUrl, name: file.name, timestamp: Date.now() });
        
        // Call the parent handler
        console.log('UploadPhase - Calling onImageUpload with:', imageUrl);
        onImageUpload(imageUrl);
        
        toast.success('Image uploaded and saved to session!');
        
      } catch (error) {
        console.error('UploadPhase - Upload error:', error);
        const errorMessage = 'Failed to upload image. Please try again.';
        setUploadError(errorMessage);
        toast.error(errorMessage);
        
        // Cleanup blob URL on error
        if (blobUrl && blobUrl.startsWith('blob:')) {
          URL.revokeObjectURL(blobUrl);
          setBlobUrl('');
        }
      } finally {
        setIsProcessing(false);
        setProgress(0);
        setProcessingStep('');
      }
    }
  }, [onImageUpload, blobUrl, saveSession, addToRecent]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif']
    },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024, // 50MB
    multiple: false,
    noClick: false,
    noKeyboard: false
  });

  const handleCropComplete = useCallback((croppedImageUrl: string) => {
    console.log('UploadPhase - Crop completed:', croppedImageUrl);
    
    // Update session with crop data
    if (currentSession) {
      const updatedSession: UploadSession = {
        ...currentSession,
        imageUrl: croppedImageUrl,
        lastModified: Date.now(),
        cropSettings: {
          x: 0, y: 0, width: 100, height: 100, aspectRatio: 2.5/3.5 // Placeholder values
        }
      };
      saveSession(updatedSession);
    }

    // Cleanup old blob URL before setting new one
    if (blobUrl && blobUrl.startsWith('blob:')) {
      URL.revokeObjectURL(blobUrl);
    }
    setBlobUrl(croppedImageUrl);
    onImageUpload(croppedImageUrl);
    setCropMode(false);
    toast.success('Image cropped and saved!');
  }, [onImageUpload, blobUrl, currentSession, saveSession]);

  const handleCropCancel = useCallback(() => {
    setCropMode(false);
  }, []);

  const handleCropImage = () => {
    if (uploadedImage) {
      console.log('UploadPhase - Entering crop mode for:', uploadedImage);
      setCropMode(true);
    } else {
      toast.error('No image to crop');
    }
  };

  const handleRemoveImage = () => {
    console.log('UploadPhase - Removing image');
    // Cleanup blob URL
    if (blobUrl && blobUrl.startsWith('blob:')) {
      URL.revokeObjectURL(blobUrl);
    }
    setBlobUrl('');
    onImageUpload('');
    setCropMode(false);
    setUploadError('');
    
    // Clear session
    localStorageManager.removeItem(sessionKey);
    setCurrentSession(null);
    
    toast.success('Image removed and session cleared');
  };

  const handleReplaceImage = () => {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleSaveSession = () => {
    if (currentSession) {
      const updatedSession = {
        ...currentSession,
        lastModified: Date.now()
      };
      saveSession(updatedSession);
      toast.success('Session saved successfully!');
    }
  };

  // Debug current state
  React.useEffect(() => {
    console.log('UploadPhase - Current state:', { 
      uploadedImage, 
      isProcessing, 
      cropMode,
      uploadError,
      hasSession: !!currentSession
    });
  }, [uploadedImage, isProcessing, cropMode, uploadError, currentSession]);

  if (isProcessing) {
    return (
      <div className="space-y-4">
        <Card className="bg-black/20 border-white/10">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-crd-green/20 to-blue-500/20 flex items-center justify-center">
                <Upload className="w-8 h-8 text-crd-green animate-pulse" />
              </div>
              <div>
                <h3 className="text-white font-medium mb-2">{processingStep}</h3>
                <Progress value={progress} className="w-full mb-2" />
                <p className="text-gray-400 text-sm">{progress}% complete</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show crop interface when in crop mode
  if (cropMode && uploadedImage) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCropCancel}
            className="text-white hover:bg-white/10 p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h3 className="text-white font-semibold">Crop Your Image</h3>
            <p className="text-gray-400 text-sm">Adjust the crop area and apply when ready</p>
          </div>
        </div>
        
        <InlineCropInterface
          imageUrl={uploadedImage}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
          aspectRatio={2.5 / 3.5}
        />
      </div>
    );
  }

  if (uploadedImage) {
    return (
      <div className="space-y-4">
        <div className="text-sm text-gray-300 mb-4 flex items-center justify-between">
          <span>Your image has been uploaded. You can crop, enhance, or replace it.</span>
          {currentSession && (
            <Button
              size="sm"
              variant="ghost"
              onClick={handleSaveSession}
              className="text-crd-green hover:bg-crd-green/10 text-xs"
            >
              <Save className="w-3 h-3 mr-1" />
              Save Session
            </Button>
          )}
        </div>

        {/* Session Info */}
        {currentSession && (
          <Card className="bg-crd-green/10 border-crd-green/30">
            <CardContent className="p-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center text-crd-green">
                  <Clock className="w-3 h-3 mr-1" />
                  Session Active
                </div>
                <div className="text-crd-green">
                  {currentSession.originalFile?.name}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Image Preview */}
        <Card className="bg-black/20 border-white/10">
          <CardContent className="p-4">
            <div className="relative aspect-[2.5/3.5] w-full max-w-xs mx-auto rounded-lg overflow-hidden">
              <img
                src={uploadedImage}
                alt="Uploaded card image"
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error('UploadPhase - Image failed to load:', uploadedImage);
                  setUploadError('Failed to load image. Please try uploading again.');
                }}
                onLoad={() => {
                  console.log('UploadPhase - Image loaded successfully');
                  setUploadError(''); // Clear any previous errors
                }}
              />
              
              {/* Overlay controls */}
              <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  size="sm"
                  onClick={handleCropImage}
                  className="bg-crd-green/90 text-black hover:bg-crd-green"
                >
                  <Crop className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={handleRemoveImage}
                  variant="destructive"
                  className="bg-red-500/80 hover:bg-red-500"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Image Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={handleCropImage}
            className="bg-crd-green hover:bg-crd-green/90 text-black font-medium"
          >
            <Crop className="w-4 h-4 mr-2" />
            Crop Image
          </Button>
          
          <Button
            onClick={handleReplaceImage}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            <Upload className="w-4 h-4 mr-2" />
            Replace
          </Button>
        </div>

        {/* Hidden file input for replace functionality */}
        <div style={{ display: 'none' }}>
          <input {...getInputProps()} />
        </div>

        {/* Image Info */}
        <Card className="bg-black/20 border-white/10">
          <CardContent className="p-4">
            <h4 className="text-white font-medium text-sm mb-2">Image Details</h4>
            <div className="space-y-1 text-xs text-gray-400">
              {currentSession?.originalFile && (
                <>
                  <div>• File: {currentSession.originalFile.name}</div>
                  <div>• Size: {Math.round(currentSession.originalFile.size / 1024)} KB</div>
                  <div>• Type: {currentSession.originalFile.type}</div>
                  <div>• Uploaded: {new Date(currentSession.timestamp).toLocaleTimeString()}</div>
                </>
              )}
              <div>• Format: Detected automatically</div>
              <div>• Quality: High resolution recommended</div>
              <div>• Processing: Enhanced for best results</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Upload interface
  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-300 mb-4">
        Upload your image to get started. Supports JPG, PNG, WebP, and GIF formats.
      </div>

      {/* Error Display */}
      {uploadError && (
        <Card className="bg-red-900/20 border-red-500/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-400">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{uploadError}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Drop Zone */}
      <Card className="bg-black/20 border-white/10">
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
              isDragActive
                ? 'border-crd-green bg-crd-green/10'
                : uploadError
                ? 'border-red-500/50 hover:border-red-400/50'
                : 'border-white/30 hover:border-crd-green/50 hover:bg-white/5'
            }`}
          >
            <input {...getInputProps()} />
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-crd-green/20 to-blue-500/20 flex items-center justify-center">
                <Camera className="w-8 h-8 text-crd-green" />
              </div>
              
              <div>
                <h3 className="text-white text-lg font-medium mb-2">
                  {isDragActive ? 'Drop your image here' : 'Upload Your Image'}
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  {isDragActive
                    ? 'Release to upload your image'
                    : 'Drag and drop an image here, or click to browse'}
                </p>
              </div>

              <Button 
                className="bg-crd-green hover:bg-crd-green/90 text-black font-bold"
                type="button"
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </Button>

              <div className="text-xs text-gray-500 space-y-1">
                <div>Supported: JPG, PNG, WebP, GIF</div>
                <div>Maximum size: 50MB</div>
                <div>Recommended: High resolution images work best</div>
                <div className="text-crd-green">✓ Auto-save enabled</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload Tips */}
      <Card className="bg-black/20 border-white/10">
        <CardContent className="p-4">
          <h4 className="text-white font-medium text-sm mb-2 flex items-center">
            <Wand2 className="w-4 h-4 mr-2 text-crd-green" />
            Pro Tips
          </h4>
          <div className="space-y-1 text-xs text-gray-400">
            <div>• Use high-resolution images for best quality</div>
            <div>• Square or portrait orientation works best</div>
            <div>• Clear, well-lit photos produce better results</div>
            <div>• You can crop and adjust after uploading</div>
            <div>• Your work is automatically saved and recoverable</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
