
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BulkPSDData } from '@/pages/BulkPSDAnalysisPage';
import { processPSD } from '@/services/psdProcessor/psdProcessingService';
import { processEnhancedPSD } from '@/services/psdProcessor/enhancedPsdProcessingService';
import { Upload, FileImage, AlertCircle } from 'lucide-react';

interface BulkPSDUploaderProps {
  onPSDsProcessed: (newPSDs: BulkPSDData[]) => void;
  isUploading: boolean;
  setIsUploading: (uploading: boolean) => void;
}

export const BulkPSDUploader: React.FC<BulkPSDUploaderProps> = ({
  onPSDsProcessed,
  isUploading,
  setIsUploading
}) => {
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [currentFile, setCurrentFile] = React.useState<string>('');
  const [errors, setErrors] = React.useState<string[]>([]);

  const processFiles = async (files: File[]) => {
    setIsUploading(true);
    setUploadProgress(0);
    setErrors([]);
    
    const processedPSDs: BulkPSDData[] = [];
    const newErrors: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setCurrentFile(file.name);
      setUploadProgress((i / files.length) * 100);

      try {
        console.log(`Processing PSD ${i + 1}/${files.length}: ${file.name}`);
        
        // First, process with original system
        const originalProcessedPSD = await processPSD(file);
        
        // Then enhance with real image extraction
        const enhancedProcessedPSD = await processEnhancedPSD(file, originalProcessedPSD);
        
        processedPSDs.push({
          id: `psd_${Date.now()}_${i}`,
          fileName: file.name,
          processedPSD: enhancedProcessedPSD, // For legacy compatibility
          enhancedProcessedPSD: enhancedProcessedPSD, // Explicit enhanced version
          uploadedAt: new Date()
        });

        console.log(`Successfully processed: ${file.name}`);
        
      } catch (error) {
        console.error(`Error processing ${file.name}:`, error);
        newErrors.push(`${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    setUploadProgress(100);
    setCurrentFile('');
    setIsUploading(false);
    setErrors(newErrors);
    
    if (processedPSDs.length > 0) {
      onPSDsProcessed(processedPSDs);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const psdFiles = acceptedFiles.filter(file => 
      file.type === 'image/vnd.adobe.photoshop' || 
      file.name.toLowerCase().endsWith('.psd')
    );
    
    if (psdFiles.length === 0) {
      setErrors(['No valid PSD files found. Please upload .psd files only.']);
      return;
    }

    processFiles(psdFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/vnd.adobe.photoshop': ['.psd']
    },
    disabled: isUploading
  });

  return (
    <div className="space-y-6">
      {/* Enhanced Drop Zone */}
      <Card 
        {...getRootProps()} 
        className={`border-2 border-dashed p-8 text-center cursor-pointer transition-all ${
          isDragActive 
            ? 'border-crd-green bg-crd-green/5' 
            : 'border-slate-600 hover:border-slate-500'
        } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="space-y-4">
          <div className="flex justify-center">
            {isDragActive ? (
              <Upload className="w-16 h-16 text-crd-green" />
            ) : (
              <FileImage className="w-16 h-16 text-slate-400" />
            )}
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {isDragActive ? 'Drop PSD files here...' : 'Upload PSD Files for Analysis'}
            </h3>
            <p className="text-slate-400">
              Drag and drop your PSD files here, or click to browse. 
              Multiple files supported for batch processing.
            </p>
          </div>

          {!isUploading && (
            <Button variant="outline" className="mt-4">
              <Upload className="w-4 h-4 mr-2" />
              Choose PSD Files
            </Button>
          )}
        </div>
      </Card>

      {/* Upload Progress */}
      {isUploading && (
        <Card className="bg-slate-800 border-slate-600 p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-medium text-white">Processing PSD Files</h4>
              <span className="text-sm text-slate-400">{Math.round(uploadProgress)}%</span>
            </div>
            
            <Progress value={uploadProgress} className="w-full" />
            
            {currentFile && (
              <p className="text-sm text-slate-400">
                Currently processing: <span className="text-white">{currentFile}</span>
              </p>
            )}
          </div>
        </Card>
      )}

      {/* Error Display */}
      {errors.length > 0 && (
        <Card className="bg-red-900/20 border-red-500/20 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-red-400 mb-2">Processing Errors</h4>
              <ul className="space-y-1">
                {errors.map((error, index) => (
                  <li key={index} className="text-sm text-red-300">
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
