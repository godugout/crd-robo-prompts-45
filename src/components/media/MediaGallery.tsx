
import React, { useState, useEffect } from 'react';
import { MediaManager, type MediaFile } from '@/lib/storage/MediaManager';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  Eye, 
  Tag,
  Calendar,
  FileText,
  Image as ImageIcon,
  Video
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface MediaGalleryProps {
  bucket?: string;
  userId?: string;
  showUploader?: boolean;
  selectable?: boolean;
  onSelect?: (file: MediaFile) => void;
  className?: string;
}

export const MediaGallery: React.FC<MediaGalleryProps> = ({
  bucket,
  userId,
  showUploader = false,
  selectable = false,
  onSelect,
  className
}) => {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  useEffect(() => {
    loadFiles();
  }, [bucket, userId, selectedTags]);

  const loadFiles = async () => {
    setLoading(true);
    try {
      const files = await MediaManager.getFiles({
        bucket,
        userId,
        tags: selectedTags.length > 0 ? selectedTags : undefined,
        limit: 50
      });
      setFiles(files);
    } catch (error) {
      console.error('Error loading files:', error);
      toast.error('Failed to load media files');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (fileId: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;
    
    const success = await MediaManager.deleteFile(fileId);
    if (success) {
      setFiles(prev => prev.filter(f => f.id !== fileId));
    }
  };

  const handleFileSelect = (file: MediaFile) => {
    if (selectable) {
      setSelectedFile(file.id);
      onSelect?.(file);
    }
  };

  const getPublicUrl = (file: MediaFile) => {
    return file.metadata.publicUrl || '';
  };

  const filteredFiles = files.filter(file => 
    file.file_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const allTags = Array.from(new Set(files.flatMap(f => f.tags)));

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <ImageIcon className="w-4 h-4" />;
    if (mimeType.startsWith('video/')) return <Video className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-crd-lightGray">Loading media files...</div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-crd-lightGray" />
            <Input
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-editor-dark border-editor-border text-white"
            />
          </div>
          <Button variant="outline" size="sm" className="border-editor-border text-white">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>

        {/* Tags Filter */}
        {allTags.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-crd-lightGray">Filter by tags:</h4>
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer",
                    selectedTags.includes(tag) 
                      ? "bg-crd-green text-black" 
                      : "border-editor-border text-crd-lightGray hover:border-crd-green"
                  )}
                  onClick={() => {
                    setSelectedTags(prev => 
                      prev.includes(tag) 
                        ? prev.filter(t => t !== tag)
                        : [...prev, tag]
                    );
                  }}
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Files Grid */}
      {filteredFiles.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-crd-lightGray mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No files found</h3>
          <p className="text-crd-lightGray">
            {searchTerm || selectedTags.length > 0 
              ? 'Try adjusting your search or filters'
              : 'Upload some files to get started'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredFiles.map((file) => (
            <Card
              key={file.id}
              className={cn(
                "p-4 bg-editor-dark border-editor-border cursor-pointer transition-all hover:border-crd-green/50",
                selectable && selectedFile === file.id && "border-crd-green bg-crd-green/10"
              )}
              onClick={() => handleFileSelect(file)}
            >
              {/* File Preview */}
              <div className="aspect-square mb-3 bg-editor-border rounded overflow-hidden">
                {file.mime_type.startsWith('image/') ? (
                  <img
                    src={file.thumbnail_path 
                      ? MediaManager.getPublicUrl(file.bucket_id, file.thumbnail_path)
                      : getPublicUrl(file)
                    }
                    alt={file.file_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    {getFileIcon(file.mime_type)}
                  </div>
                )}
              </div>

              {/* File Info */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-white truncate" title={file.file_name}>
                  {file.file_name}
                </h4>
                
                <div className="flex items-center gap-2 text-xs text-crd-lightGray">
                  {getFileIcon(file.mime_type)}
                  <span>{formatFileSize(file.file_size)}</span>
                  {file.width && file.height && (
                    <span>{file.width}×{file.height}</span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-xs text-crd-lightGray">
                  <Calendar className="w-3 h-3" />
                  {new Date(file.created_at).toLocaleDateString()}
                </div>

                {/* Tags */}
                {file.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {file.tags.slice(0, 2).map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs px-1 py-0 border-editor-border text-crd-lightGray">
                        {tag}
                      </Badge>
                    ))}
                    {file.tags.length > 2 && (
                      <span className="text-xs text-crd-lightGray">+{file.tags.length - 2}</span>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-1 mt-3">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 border-editor-border text-crd-lightGray hover:border-crd-green hover:text-crd-green"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(getPublicUrl(file), '_blank');
                  }}
                >
                  <Eye className="w-3 h-3 mr-1" />
                  View
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-editor-border text-crd-lightGray hover:border-red-500 hover:text-red-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(file.id);
                  }}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
