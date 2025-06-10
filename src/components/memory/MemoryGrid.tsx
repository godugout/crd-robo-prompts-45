
import React from 'react';
import { MemoryCard } from './MemoryCard';
import type { Memory } from '@/types/memory';
import { Skeleton } from '@/components/ui/skeleton';

interface MemoryGridProps {
  memories: Memory[];
  loading?: boolean;
  onReaction?: (memoryId: string, reactionType: 'heart' | 'thumbs-up' | 'party' | 'baseball') => void;
  onView?: (memory: Memory) => void;
}

export const MemoryGrid: React.FC<MemoryGridProps> = ({ 
  memories, 
  loading = false,
  onReaction,
  onView
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col space-y-3">
            <Skeleton className="h-[300px] w-full rounded-md" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (memories.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">No memories found</h3>
        <p className="text-muted-foreground mt-2">
          Try adjusting your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {memories.map(memory => (
        <MemoryCard 
          key={memory.id} 
          memory={memory} 
          onReaction={onReaction}
          onClick={onView ? () => onView(memory) : undefined}
        />
      ))}
    </div>
  );
};
