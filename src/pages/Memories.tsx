
import React, { useState } from 'react';
import { MemoryGrid } from '@/components/memory/MemoryGrid';
import { useMemories } from '@/hooks/useMemories';
import * as socialRepository from '@/repositories/social';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Search, Filter, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { MemoryCreator } from '@/components/memory/MemoryCreator';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

const Memories = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const navigate = useNavigate();
  
  const { 
    memories, 
    loading, 
    error, 
    hasMore, 
    loadMore, 
    refresh,
    total
  } = useMemories({
    visibility: 'public',
    searchTerm: isSearching ? searchTerm : undefined,
    limit: 12
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setIsSearching(false);
  };

  const handleReaction = async (memoryId: string, reactionType: 'heart' | 'thumbs-up' | 'party' | 'baseball') => {
    try {
      await socialRepository.addReaction({
        targetId: memoryId,
        targetType: 'memory',
        type: reactionType
      });

      // Optimistically update UI
      refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add reaction",
        variant: "destructive"
      });
    }
  };

  const handleMemoryCreated = (memoryId: string) => {
    setCreateOpen(false);
    toast({
      title: "Memory created",
      description: "Your memory has been successfully created."
    });
    refresh();
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Memories</h1>
        
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Memory
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] p-0">
            <MemoryCreator onCreated={handleMemoryCreated} />
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <form onSubmit={handleSearch} className="relative flex-1 w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search memories..."
            className="pl-9 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {isSearching && (
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              className="absolute right-1 top-1 h-8" 
              onClick={clearSearch}
            >
              Clear
            </Button>
          )}
        </form>
        
        <div className="flex gap-2 self-end sm:self-auto">
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={refresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {isSearching && (
        <div className="text-sm text-muted-foreground">
          Found {total} results for "{searchTerm}"
        </div>
      )}
      
      {error ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-destructive">Something went wrong</h3>
          <p className="text-muted-foreground mt-2">
            {error.message || "Failed to load memories"}
          </p>
          <Button 
            variant="outline" 
            className="mt-4" 
            onClick={refresh}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try again
          </Button>
        </div>
      ) : (
        <>
          <MemoryGrid 
            memories={memories} 
            loading={loading && memories.length === 0}
            onReaction={handleReaction}
          />
          
          {hasMore && (
            <div className="text-center pt-4">
              <Button
                variant="outline"
                onClick={loadMore}
                disabled={loading}
              >
                {loading ? "Loading..." : "Load More"}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Memories;
