
import React from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Loader } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import type { Team } from '@/types/team';
import type { Visibility } from '@/types/common';

interface FormValues {
  title: string;
  description: string;
  teamId: string;
  visibility: Visibility;
}

interface MemoryFormProps {
  teams: Team[];
  teamsLoading: boolean;
  defaultTeamId?: string;
  defaultVisibility?: Visibility;
  onSubmit: (data: FormValues) => Promise<void>;
  isCreating: boolean;
}

export const MemoryForm = ({
  teams,
  teamsLoading,
  defaultTeamId,
  defaultVisibility = 'private',
  onSubmit,
  isCreating
}: MemoryFormProps) => {
  const form = useForm<FormValues>({
    defaultValues: {
      title: '',
      description: '',
      teamId: defaultTeamId || '',
      visibility: defaultVisibility,
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
  );
};
