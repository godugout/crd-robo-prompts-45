
import React, { useState, useEffect } from 'react';
import { MediaManager, type MediaFile } from '@/lib/storage/MediaManager';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EnhancedImage } from '@/components/media/EnhancedImage';
import { MediaUploadZone } from '@/components/media/MediaUploadZone';
import { Trash2, RefreshCw, Upload, Image, Grid } from 'lucide-react';
import { toast } from 'sonner';

export const MediaGallery: React.FC = () => {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBucket, setSelectedBucket] = useState('media');

  const loadFiles = async () => {
    setLoading(true);
    try {
      const mediaFiles = await MediaManager.getFiles({ bucket: selectedBucket });
      setFiles(mediaFiles);
    } catch (error) {
      console.error('Failed to load files:', error);
      toast.error('Failed to load files');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, [selectedBucket]);

  const handleDelete = async (file: MediaFile) => {
    try {
      const success = await MediaManager.deleteFile(selectedBucket, file.path);
      if (success) {
        setFiles(prev => prev.filter(f => f.id !== file.id));
        toast.success('File deleted successfully');
      } else {
        toast.error('Failed to delete file');
      }
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error('Failed to delete file');
    }
  };

  const handleUploadComplete = (uploadedFiles: MediaFile[]) => {
    setFiles(prev => [...prev, ...uploadedFiles]);
    toast.success(`${uploadedFiles.length} file(s) uploaded successfully`);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Media Gallery</h2>
        <div className="flex gap-2">
          <select
            value={selectedBucket}
            onChange={(e) => setSelectedBucket(e.target.value)}
            className="bg-gray-800 text-white border border-gray-600 rounded px-3 py-1"
          >
            <option value="media">Media</option>
            <option value="static-assets">Static Assets</option>
          </select>
          <Button
            variant="outline"
            size="sm"
            onClick={loadFiles}
            disabled={loading}
            className="border-gray-600 text-gray-300"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Upload Zone */}
      <Card className="p-4 bg-gray-800/50 border-gray-700">
        <MediaUploadZone
          bucket={selectedBucket}
          folder="test-images"
          maxFiles={5}
          onUploadComplete={handleUploadComplete}
        >
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-blue-500/20 rounded-full flex items-center justify-center">
              <Upload className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h3 className="text-white text-lg font-medium mb-2">
                Upload Test Images
              </h3>
              <p className="text-gray-400">
                Drop images here to test the media pipeline
              </p>
            </div>
          </div>
        </MediaUploadZone>
      </Card>

      {/* Files Grid */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Grid className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-semibold text-white">
            Files ({files.length})
          </h3>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <RefreshCw className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-2" />
            <p className="text-gray-400">Loading files...</p>
          </div>
        ) : files.length === 0 ? (
          <Card className="p-8 bg-gray-800/50 border-gray-700">
            <div className="text-center">
              <Image className="w-12 h-12 text-gray-500 mx-auto mb-3" />
              <p className="text-gray-400">No files found in this bucket</p>
              <p className="text-gray-500 text-sm mt-1">Upload some images to get started</p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {files.map((file) => (
              <Card key={file.id} className="bg-gray-800/50 border-gray-700 overflow-hidden">
                <div className="aspect-square bg-gray-900 relative">
                  {file.type.startsWith('image/') ? (
                    <EnhancedImage
                      src={file.metadata.publicUrl}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Image className="w-12 h-12 text-gray-500" />
                    </div>
                  )}
                </div>
                
                <div className="p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-white font-medium text-sm truncate flex-1">
                      {file.name}
                    </h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(file)}
                      className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {file.type}
                    </Badge>
                    <span className="text-xs text-gray-400">
                      {(file.size / 1024).toFixed(1)}KB
                    </span>
                  </div>
                  
                  {file.metadata.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {file.metadata.tags.map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
