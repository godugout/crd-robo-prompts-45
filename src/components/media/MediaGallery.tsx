
import React, { useState, useEffect } from 'react';
import { MediaManager, type MediaFile } from '@/lib/storage/MediaManager';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Download, Eye, Tag, Calendar, HardDrive } from 'lucide-react';
import { toast } from 'sonner';

interface MediaGalleryProps {
  bucket?: string;
  folder?: string;
  userId?: string;
  tags?: string[];
  limit?: number;
  onFileSelect?: (file: MediaFile) => void;
}

export const MediaGallery: React.FC<MediaGalleryProps> = ({
  bucket = 'media',
  folder,
  userId,
  tags = [],
  limit = 50,
  onFileSelect
}) => {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);
  const [filterTags, setFilterTags] = useState<string[]>([]);

  useEffect(() => {
    loadFiles();
  }, [bucket, folder, userId, tags, limit]);

  const loadFiles = async () => {
    setLoading(true);
    try {
      const loadedFiles = await MediaManager.getFiles(bucket);
      
      // Apply client-side filtering since our getFiles method is basic
      let filteredFiles = loadedFiles;
      
      if (folder) {
        filteredFiles = filteredFiles.filter(file => file.path.startsWith(folder));
      }
      
      if (tags.length > 0) {
        filteredFiles = filteredFiles.filter(file => 
          tags.some(tag => file.metadata.tags.includes(tag))
        );
      }
      
      if (limit) {
        filteredFiles = filteredFiles.slice(0, limit);
      }
      
      setFiles(filteredFiles);
      
      // Extract unique tags for filtering
      const allTags = new Set<string>();
      filteredFiles.forEach(file => {
        file.metadata.tags.forEach(tag => allTags.add(tag));
      });
      setFilterTags(Array.from(allTags));
      
    } catch (error) {
      console.error('Failed to load files:', error);
      toast.error('Failed to load media files');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (file: MediaFile) => {
    try {
      const success = await MediaManager.deleteFile(bucket, file.path);
      if (success) {
        setFiles(prev => prev.filter(f => f.id !== file.id));
        toast.success('File deleted successfully');
      } else {
        toast.error('Failed to delete file');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete file');
    }
  };

  const handleDownload = (file: MediaFile) => {
    const link = document.createElement('a');
    link.href = file.metadata.publicUrl;
    link.download = file.name;
    link.click();
  };

  const handleFileClick = (file: MediaFile) => {
    setSelectedFile(file);
    onFileSelect?.(file);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <HardDrive className="w-12 h-12 text-gray-400 mx-auto mb-3 animate-pulse" />
          <p className="text-gray-500">Loading media files...</p>
        </div>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <HardDrive className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No media files found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter Tags */}
      {filterTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-500">Filter by tags:</span>
          {filterTags.map(tag => (
            <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-gray-100">
              <Tag className="w-3 h-3 mr-1" />
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {/* File Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {files.map(file => (
          <Card
            key={file.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedFile?.id === file.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => handleFileClick(file)}
          >
            <div className="p-4 space-y-3">
              {/* File Preview */}
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                {file.type.startsWith('image/') ? (
                  <img
                    src={file.metadata.publicUrl}
                    alt={file.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <HardDrive className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>

              {/* File Info */}
              <div className="space-y-2">
                <h3 className="font-medium text-sm truncate" title={file.name}>
                  {file.name}
                </h3>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{file.type}</span>
                  <span>{formatFileSize(file.size)}</span>
                </div>

                {file.width && file.height && (
                  <div className="text-xs text-gray-500">
                    {file.width} × {file.height}
                  </div>
                )}

                <div className="flex items-center text-xs text-gray-500">
                  <Calendar className="w-3 h-3 mr-1" />
                  {new Date(file.createdAt).toLocaleDateString()}
                </div>

                {/* Tags */}
                {file.metadata.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {file.metadata.tags.slice(0, 3).map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs px-1 py-0">
                        {tag}
                      </Badge>
                    ))}
                    {file.metadata.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs px-1 py-0">
                        +{file.metadata.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 h-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(file);
                  }}
                >
                  <Download className="w-3 h-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 h-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(file.metadata.publicUrl, '_blank');
                  }}
                >
                  <Eye className="w-3 h-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-red-600 hover:text-red-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('Are you sure you want to delete this file?')) {
                      handleDelete(file);
                    }
                  }}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Selected File Details */}
      {selectedFile && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <h4 className="font-medium mb-2">Selected File Details</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Name:</strong> {selectedFile.name}
            </div>
            <div>
              <strong>Size:</strong> {formatFileSize(selectedFile.size)}
            </div>
            <div>
              <strong>Type:</strong> {selectedFile.type}
            </div>
            <div>
              <strong>Created:</strong> {new Date(selectedFile.createdAt).toLocaleString()}
            </div>
            {selectedFile.width && selectedFile.height && (
              <div>
                <strong>Dimensions:</strong> {selectedFile.width} × {selectedFile.height}
              </div>
            )}
            <div>
              <strong>Optimized:</strong> {selectedFile.metadata.optimized ? 'Yes' : 'No'}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
