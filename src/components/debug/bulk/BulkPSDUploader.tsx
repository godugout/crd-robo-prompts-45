
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Upload, FileImage, X, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { psdProcessingService } from '@/services/psdProcessor/psdProcessingService';
import { BulkPSDData } from '@/pages/BulkPSDAnalysisPage';
import { toast } from 'sonner';

interface UploadFile {
  id: string;
  file: File;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  error?: string;
  processedPSD?: any;
}

interface BulkPSDUploaderProps {
  onPSDsProcessed: (psds: BulkPSDData[]) => void;
  isUploading: boolean;
  setIsUploading: (uploading: boolean) => void;
}

export const BulkPSDUploader: React.FC<BulkPSDUploaderProps> = ({
  onPSDsProcessed,
  isUploading,
  setIsUploading
}) => {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const psdFiles = acceptedFiles.filter(file => 
      file.name.toLowerCase().endsWith('.psd')
    );

    if (psdFiles.length !== acceptedFiles.length) {
      toast.warning('Only PSD files are supported');
    }

    const newFiles: UploadFile[] = psdFiles.map(file => ({
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      file,
      status: 'pending',
      progress: 0
    }));

    setUploadFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/octet-stream': ['.psd']
    },
    multiple: true,
    disabled: isUploading
  });

  const removeFile = (id: string) => {
    setUploadFiles(prev => prev.filter(file => file.id !== id));
  };

  const processFiles = async () => {
    if (uploadFiles.length === 0) return;

    setIsUploading(true);
    const completedPSDs: BulkPSDData[] = [];

    for (const uploadFile of uploadFiles) {
      if (uploadFile.status !== 'pending') continue;

      // Update status to processing
      setUploadFiles(prev => prev.map(f => 
        f.id === uploadFile.id 
          ? { ...f, status: 'processing', progress: 0 }
          : f
      ));

      try {
        // Simulate progress updates
        const progressInterval = setInterval(() => {
          setUploadFiles(prev => prev.map(f => 
            f.id === uploadFile.id 
              ? { ...f, progress: Math.min(f.progress + 10, 90) }
              : f
          ));
        }, 200);

        const processedPSD = await psdProcessingService.processPSDFile(uploadFile.file);
        
        clearInterval(progressInterval);

        // Complete processing
        setUploadFiles(prev => prev.map(f => 
          f.id === uploadFile.id 
            ? { ...f, status: 'completed', progress: 100, processedPSD }
            : f
        ));

        completedPSDs.push({
          id: uploadFile.id,
          fileName: uploadFile.file.name,
          processedPSD,
          uploadedAt: new Date()
        });

      } catch (error) {
        setUploadFiles(prev => prev.map(f => 
          f.id === uploadFile.id 
            ? { ...f, status: 'error', error: error instanceof Error ? error.message : 'Processing failed' }
            : f
        ));
        
        console.error(`Failed to process ${uploadFile.file.name}:`, error);
      }
    }

    setIsUploading(false);
    
    if (completedPSDs.length > 0) {
      onPSDsProcessed(completedPSDs);
      toast.success(`Successfully processed ${completedPSDs.length} PSD file(s)`);
    }
  };

  const clearCompleted = () => {
    setUploadFiles(prev => prev.filter(file => file.status !== 'completed'));
  };

  const clearAll = () => {
    setUploadFiles([]);
  };

  const getStatusIcon = (status: UploadFile['status']) => {
    switch (status) {
      case 'pending':
        return <FileImage className="w-4 h-4 text-slate-400" />;
      case 'processing':
        return <Loader className="w-4 h-4 text-blue-400 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
    }
  };

  const getStatusColor = (status: UploadFile['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-slate-500/20 text-slate-400';
      case 'processing':
        return 'bg-blue-500/20 text-blue-400';
      case 'completed':
        return 'bg-green-500/20 text-green-400';
      case 'error':
        return 'bg-red-500/20 text-red-400';
    }
  };

  const pendingFiles = uploadFiles.filter(f => f.status === 'pending').length;
  const completedFiles = uploadFiles.filter(f => f.status === 'completed').length;

  return (
    <Card className="bg-[#0a0f1b] border-slate-800">
      <div className="p-6">
        {/* Drop Zone */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
            isDragActive
              ? 'border-crd-green bg-crd-green/10'
              : 'border-slate-600 hover:border-crd-green/50 hover:bg-slate-800/50'
          } ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
        >
          <input {...getInputProps()} />
          <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">
            {isDragActive ? 'Drop PSD files here' : 'Upload Multiple PSD Files'}
          </h3>
          <p className="text-slate-400 text-sm">
            Drag and drop PSD files here, or click to select files
          </p>
        </div>

        {/* File List */}
        {uploadFiles.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-white font-medium">Upload Queue ({uploadFiles.length})</h4>
              <div className="flex gap-2">
                {completedFiles > 0 && (
                  <Button variant="outline" size="sm" onClick={clearCompleted}>
                    Clear Completed
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={clearAll}>
                  Clear All
                </Button>
              </div>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {uploadFiles.map((uploadFile) => (
                <div
                  key={uploadFile.id}
                  className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg"
                >
                  {getStatusIcon(uploadFile.status)}
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm truncate">{uploadFile.file.name}</p>
                    <p className="text-slate-400 text-xs">
                      {(uploadFile.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>

                  <Badge variant="outline" className={getStatusColor(uploadFile.status)}>
                    {uploadFile.status}
                  </Badge>

                  {uploadFile.status === 'processing' && (
                    <div className="w-20">
                      <Progress value={uploadFile.progress} className="h-2" />
                    </div>
                  )}

                  {uploadFile.status === 'error' && uploadFile.error && (
                    <div className="text-red-400 text-xs max-w-40 truncate" title={uploadFile.error}>
                      {uploadFile.error}
                    </div>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(uploadFile.id)}
                    disabled={uploadFile.status === 'processing'}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Process Button */}
            {pendingFiles > 0 && (
              <div className="mt-4 flex justify-center">
                <Button
                  onClick={processFiles}
                  disabled={isUploading}
                  className="bg-crd-green hover:bg-crd-green/80 text-black font-medium"
                >
                  {isUploading ? (
                    <>
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Process {pendingFiles} File{pendingFiles !== 1 ? 's' : ''}
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};
