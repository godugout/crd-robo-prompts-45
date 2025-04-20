
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BatchMediaUploader } from '@/components/media/BatchMediaUploader';
import { useUser } from '@/hooks/use-user';
import { useTeams } from '@/hooks/use-teams';
import { MemoryRepository } from '@/repositories/memoryRepository';
import { useTags } from './hooks/useTags';
import { MemoryForm } from './MemoryForm';
import { TagInput } from './TagInput';
import type { MemoryCreatorProps } from './types';
import type { MediaItem } from '@/types/media';

export const MemoryCreator = ({ 
  onCreated, 
  defaultTeamId, 
  defaultGameId,
  defaultVisibility = 'private' 
}: MemoryCreatorProps) => {
  const { user } = useUser();
  const { teams, isLoading: teamsLoading } = useTeams();
  const [memoryId, setMemoryId] = useState<string>();
  const [isCreating, setIsCreating] = useState(false);
  const [showForm, setShowForm] = useState(true);
  
  const { 
    tags, 
    handleTagInput, 
    removeTag,
    hasMaxTags 
  } = useTags([], {
    maxTags: 20,
    validateTag: (tag) => tag.length <= 50 && /^[A-Za-z0-9\s-]+$/.test(tag),
    onTagAdded: (tag) => console.log('Memory tag added:', tag),
    onTagRemoved: (tag) => console.log('Memory tag removed:', tag)
  });

  const handleCreateMemory = async (data: any) => {
    if (!user) return;
    
    setIsCreating(true);
    try {
      const memory = await MemoryRepository.createMemory({
        userId: user.id,
        title: data.title,
        description: data.description,
        teamId: data.teamId,
        gameId: defaultGameId,
        visibility: data.visibility,
        tags,
        metadata: {}
      });

      setMemoryId(memory.id);
      setShowForm(false);
      onCreated?.(memory.id);
    } catch (error) {
      console.error('Failed to create memory:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleMediaUploadComplete = (mediaItems: MediaItem[]) => {
    console.log(`Uploaded ${mediaItems.length} media items`);
  };

  const handleReset = () => {
    setMemoryId(undefined);
    setShowForm(true);
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            You need to be logged in to create memories
          </p>
        </CardContent>
      </Card>
    );
  }

  if (memoryId && !showForm) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Add Media to Your Memory</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <BatchMediaUploader
            memoryId={memoryId}
            userId={user.id}
            onUploadComplete={handleMediaUploadComplete}
            maxFiles={20}
          />
          <Button 
            onClick={handleReset}
            className="w-full mt-4"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Another Memory
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Memory</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <MemoryForm
            teams={teams}
            teamsLoading={teamsLoading}
            defaultTeamId={defaultTeamId}
            defaultVisibility={defaultVisibility}
            onSubmit={handleCreateMemory}
            isCreating={isCreating}
          />
          <TagInput
            tags={tags}
            onTagAdd={handleTagInput}
            onTagRemove={removeTag}
            disabled={hasMaxTags}
          />
        </div>
      </CardContent>
    </Card>
  );
};
