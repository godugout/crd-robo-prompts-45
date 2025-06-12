
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingState } from '@/components/common/LoadingState';
import { useDraftManager } from '@/hooks/useDraftManager';
import { useNavigate } from 'react-router-dom';
import { 
  Play, 
  Copy, 
  Trash2, 
  Edit3, 
  Calendar, 
  Image, 
  FileText,
  Palette,
  Box
} from 'lucide-react';
import { DraftType } from '@/types/draft';
import { toast } from 'sonner';

const getEditorIcon = (type: DraftType) => {
  switch (type) {
    case 'studio': return <Box className="w-4 h-4" />;
    case 'simple': return <Edit3 className="w-4 h-4" />;
    case 'oak-creator': return <Palette className="w-4 h-4" />;
    case 'template': return <FileText className="w-4 h-4" />;
    default: return <Image className="w-4 h-4" />;
  }
};

const getEditorRoute = (type: DraftType, id: string) => {
  switch (type) {
    case 'studio': return `/studio?draft=${id}`;
    case 'simple': return `/editor?draft=${id}`;
    case 'oak-creator': return `/oak-memory-creator?draft=${id}`;
    case 'template': return `/editor?draft=${id}`;
    default: return `/editor?draft=${id}`;
  }
};

export const DraftsGrid: React.FC = () => {
  const navigate = useNavigate();
  const { 
    drafts, 
    isLoading, 
    deleteDraft, 
    duplicateDraft, 
    clearAllDrafts 
  } = useDraftManager();

  const handleContinueEditing = (draft: any) => {
    const route = getEditorRoute(draft.type, draft.id);
    navigate(route);
  };

  const handleDuplicate = async (draft: any) => {
    const newId = duplicateDraft(draft.id);
    if (newId) {
      toast.success('Draft duplicated successfully');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${Math.floor(diffHours)}h ago`;
    if (diffHours < 168) return `${Math.floor(diffHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return <LoadingState message="Loading drafts..." />;
  }

  if (drafts.length === 0) {
    return (
      <div className="text-center py-16">
        <Image className="h-12 w-12 mx-auto text-crd-lightGray mb-4" />
        <h3 className="text-xl font-medium text-crd-white mb-2">No drafts yet</h3>
        <p className="text-crd-lightGray mb-6">
          Start creating cards and your work-in-progress will appear here
        </p>
        <div className="space-y-2">
          <Button asChild>
            <a href="/editor">Simple Editor</a>
          </Button>
          <Button variant="outline" asChild className="ml-2">
            <a href="/oak-memory-creator">Oakland A's Creator</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-crd-white">
          My Drafts ({drafts.length})
        </h2>
        {drafts.length > 0 && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              if (confirm('Are you sure you want to delete all drafts? This cannot be undone.')) {
                clearAllDrafts();
              }
            }}
            className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>

      {/* Drafts grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drafts.map((draft) => (
          <Card 
            key={draft.id} 
            className="bg-crd-dark border-crd-mediumGray hover:border-crd-blue transition-colors group"
          >
            <CardHeader className="pb-3">
              {/* Thumbnail or placeholder */}
              <div className="aspect-[3/4] bg-crd-mediumGray rounded-lg mb-3 relative overflow-hidden">
                {draft.thumbnail ? (
                  <img 
                    src={draft.thumbnail} 
                    alt={draft.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    {getEditorIcon(draft.type)}
                  </div>
                )}
                
                {/* Quick action overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    size="sm"
                    onClick={() => handleContinueEditing(draft)}
                    className="bg-crd-green text-black hover:bg-crd-green/90"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Continue
                  </Button>
                </div>
              </div>

              {/* Draft info */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-crd-white truncate">{draft.name}</h3>
                  <Badge variant="outline" className="text-xs border-crd-mediumGray">
                    {getEditorIcon(draft.type)}
                    <span className="ml-1">{draft.editorType}</span>
                  </Badge>
                </div>
                
                <div className="flex items-center text-xs text-crd-lightGray">
                  <Calendar className="w-3 h-3 mr-1" />
                  {formatDate(draft.lastModified)}
                </div>
                
                {draft.progress !== undefined && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-crd-lightGray">
                      <span>Progress</span>
                      <span>{draft.progress}%</span>
                    </div>
                    <div className="w-full bg-crd-mediumGray rounded-full h-1">
                      <div 
                        className="bg-crd-green h-1 rounded-full transition-all" 
                        style={{ width: `${draft.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleContinueEditing(draft)}
                  className="flex-1 bg-crd-blue hover:bg-crd-blue/90"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Continue
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDuplicate(draft)}
                  className="border-crd-mediumGray hover:border-crd-lightGray"
                >
                  <Copy className="w-4 h-4" />
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this draft?')) {
                      deleteDraft(draft.id);
                    }
                  }}
                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
