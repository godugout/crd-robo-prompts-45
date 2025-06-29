import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BulkPSDData } from '@/pages/BulkPSDAnalysisPage';
import { UnifiedPSDProcessor } from '@/services/psdProcessor/UnifiedPSDProcessor';
import { EnhancedProcessedPSD, PSDProcessingState } from '@/types/psdTypes';
import { 
  Upload, 
  FileImage, 
  CheckCircle, 
  AlertCircle,
  Loader2
} from 'lucide-react';

interface BulkPSDUploaderProps {
  onPSDsProcessed: (newPSDs: BulkPSDData[]) => void;
}

export const BulkPSDUploader: React.FC<BulkPSDUploaderProps> = ({
  onPSDsProcessed
}) => {
  const [processingState, setProcessingState] = React.useState<PSDProcessingState>({
    isProcessing: false,
    progress: 0,
    stage: '',
    error: null,
    success: false
  });
  const [currentFile, setCurrentFile] = React.useState<string>('');
  const [errors, setErrors] = React.useState<string[]>([]);

  const updateProcessingState = (updates: Partial<PSDProcessingState>) => {
    setProcessingState(prev => ({ ...prev, ...updates }));
  };

  const processFiles = async (files: File[]) => {
    updateProcessingState({ isProcessing: true, progress: 0, error: null, success: false });
    setErrors([]);
    
    const processedPSDs: BulkPSDData[] = [];
    const newErrors: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setCurrentFile(file.name);
      updateProcessingState({ progress: (i / files.length) * 100 });

      try {
        console.log(`Processing PSD ${i + 1}/${files.length}: ${file.name}`);
        
        // Use the static method correctly
        const enhancedProcessedPSD = await UnifiedPSDProcessor.processPSDFile(file);
        
        processedPSDs.push({
          id: `psd_${Date.now()}_${i}`,
          fileName: file.name,
          processedPSD: enhancedProcessedPSD,
          enhancedProcessedPSD: enhancedProcessedPSD,
          uploadedAt: new Date()
        });

        console.log(`Successfully processed: ${file.name}`);
        
      } catch (error) {
        console.error(`Error processing ${file.name}:`, error);
        newErrors.push(`${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    updateProcessingState({ 
      progress: 100, 
      isProcessing: false, 
      success: true,
      stage: 'Complete!'
    });
    setCurrentFile('');
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
    disabled: processingState.isProcessing
  });

  const resetState = () => {
    setProcessingState({
      isProcessing: false,
      progress: 0,
      stage: '',
      error: null,
      success: false
    });
    setErrors([]);
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Drop Zone */}
      <Card 
        {...getRootProps()} 
        className={`border-2 border-dashed p-8 text-center cursor-pointer transition-all ${
          isDragActive 
            ? 'border-crd-green bg-crd-green/5' 
            : 'border-slate-600 hover:border-slate-500'
        } ${processingState.isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
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

          {!processingState.isProcessing && (
            <Button variant="outline" className="mt-4">
              <Upload className="w-4 h-4 mr-2" />
              Choose PSD Files
            </Button>
          )}
        </div>
      </Card>

      {/* Upload Progress */}
      {processingState.isProcessing && (
        <Card className="bg-slate-800 border-slate-600 p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-medium text-white">Processing PSD Files</h4>
              <span className="text-sm text-slate-400">{Math.round(processingState.progress)}%</span>
            </div>
            
            <Progress value={processingState.progress} className="w-full" />
            
            {currentFile && (
              <p className="text-sm text-slate-400">
                Currently processing: <span className="text-white">{currentFile}</span>
              </p>
            )}

            {processingState.stage && (
              <p className="text-sm text-slate-300">{processingState.stage}</p>
            )}
          </div>
        </Card>
      )}

      {/* Success Display */}
      {processingState.success && !processingState.isProcessing && (
        <Card className="bg-green-900/20 border-green-500/20 p-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-green-400 mb-2">Processing Complete</h4>
              <p className="text-sm text-green-300">
                Successfully processed PSD files. Check the analysis results below.
              </p>
            </div>
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
