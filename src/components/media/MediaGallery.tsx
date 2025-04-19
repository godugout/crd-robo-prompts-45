
import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Share2,
  Trash2,
  X
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';
import type { MediaGalleryProps } from './types';

export const MediaGallery = ({ mediaItems, onDelete }: MediaGalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [isDeleting, setIsDeleting] = useState(false);

  const handlePrevious = () => {
    setSelectedIndex(current => 
      current > 0 ? current - 1 : mediaItems.length - 1
    );
  };

  const handleNext = () => {
    setSelectedIndex(current => 
      current < mediaItems.length - 1 ? current + 1 : 0
    );
  };

  const handleDownload = async () => {
    const media = mediaItems[selectedIndex];
    try {
      const response = await fetch(media.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = media.originalFilename || `download.${media.type}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Could not download the file",
        variant: "destructive"
      });
    }
  };

  const handleShare = async () => {
    const media = mediaItems[selectedIndex];
    try {
      if (navigator.share) {
        await navigator.share({
          title: media.originalFilename || 'Shared media',
          url: media.url
        });
      } else {
        await navigator.clipboard.writeText(media.url);
        toast({
          title: "Link Copied",
          description: "Media URL copied to clipboard"
        });
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        toast({
          title: "Share Failed",
          description: "Could not share the media",
          variant: "destructive"
        });
      }
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    
    const media = mediaItems[selectedIndex];
    setIsDeleting(true);
    
    try {
      await onDelete(media.id);
      toast({
        title: "Media Deleted",
        description: "The media has been removed"
      });
      setSelectedIndex(-1);
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Could not delete the media",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const renderMediaContent = (media: typeof mediaItems[number]) => {
    switch (media.type) {
      case 'image':
        return (
          <img
            src={media.url}
            alt={media.metadata?.alt || 'Image'}
            className="w-full h-full object-contain"
          />
        );
      case 'video':
        return (
          <video
            src={media.url}
            controls
            className="w-full h-full"
          />
        );
      case 'audio':
        return (
          <div className="flex items-center justify-center h-full bg-secondary p-4">
            <audio src={media.url} controls className="w-full max-w-md" />
          </div>
        );
      default:
        return null;
    }
  };

  if (mediaItems.length === 0) {
    return (
      <Alert>
        <AlertDescription>
          No media items to display
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {mediaItems.map((media, index) => (
          <button
            key={media.id}
            onClick={() => setSelectedIndex(index)}
            className="group relative rounded-lg overflow-hidden bg-secondary hover:opacity-90 transition-opacity"
          >
            <AspectRatio ratio={1}>
              {media.type === 'image' ? (
                <img
                  src={media.thumbnailUrl || media.url}
                  alt={media.metadata?.alt || 'Thumbnail'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-secondary">
                  {media.type === 'video' ? (
                    <video
                      src={media.url}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      Audio file
                    </div>
                  )}
                </div>
              )}
            </AspectRatio>
          </button>
        ))}
      </div>

      <Dialog open={selectedIndex !== -1} onOpenChange={() => setSelectedIndex(-1)}>
        <DialogContent className="max-w-4xl w-[90vw] h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-lg">
              {mediaItems[selectedIndex]?.originalFilename || 'Media Viewer'}
            </DialogTitle>
          </DialogHeader>

          <div className="relative flex-1 flex items-center justify-center min-h-0">
            {selectedIndex !== -1 && renderMediaContent(mediaItems[selectedIndex])}
            
            <div className="absolute top-1/2 left-4 -translate-y-1/2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrevious}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>

            <div className="absolute top-1/2 right-4 -translate-y-1/2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNext}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            {onDelete && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
