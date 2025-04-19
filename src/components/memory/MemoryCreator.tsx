
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, X, Loader } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { BatchMediaUploader } from '@/components/media/BatchMediaUploader';
import { useUser } from '@/hooks/use-user';
import { useTeams } from '@/hooks/use-teams';
import { MemoryRepository } from '@/repositories/memoryRepository';
import { useTags } from './hooks/useTags';
import type { MemoryCreatorProps } from './types';
import type { MediaItem } from '@/types/media';

interface FormValues {
  title: string;
  description: string;
  teamId: string;
  visibility: 'public' | 'private' | 'shared';
}

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
  const { tags, handleTagInput, removeTag } = useTags();

  const form = useForm<FormValues>({
    defaultValues: {
      title: '',
      description: '',
      teamId: defaultTeamId || '',
      visibility: defaultVisibility,
    }
  });

  const handleCreateMemory = async (data: FormValues) => {
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
    form.reset();
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleCreateMemory)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter memory title" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your memory..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="teamId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team</FormLabel>
                  <Select
                    disabled={teamsLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select team" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {teams?.map(team => (
                        <SelectItem key={team.id} value={team.id}>
                          {team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="visibility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Visibility</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select visibility" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="shared">Shared</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>Tags</FormLabel>
              <div className="space-y-2">
                <Input
                  placeholder="Add tags (press Enter or comma to add)"
                  onKeyDown={handleTagInput}
                />
                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-sm bg-primary/10 text-primary"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-primary/80"
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove {tag} tag</span>
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </FormItem>

            <Button 
              type="submit"
              className="w-full"
              disabled={isCreating}
            >
              {isCreating ? (
                <Loader className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              Create Memory
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
