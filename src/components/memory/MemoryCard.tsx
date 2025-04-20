
import React from 'react';
import type { Memory } from '@/types/memory';

interface MemoryCardProps {
  memory: Memory;
  onReaction?: (memoryId: string, reactionType: string) => void;
}

export const MemoryCard: React.FC<MemoryCardProps> = ({ memory, onReaction }) => {
  return (
    <div className="border rounded-lg p-4">
      <h3>{memory.title}</h3>
      {/* Implement full memory card UI here */}
    </div>
  );
};
