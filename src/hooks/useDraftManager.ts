
import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { Draft, DraftSummary, DraftType } from '@/types/draft';

const DRAFT_STORAGE_KEY = 'crd-drafts';
const LEGACY_KEYS = ['studio-project-', 'card-editor-autosave', 'oak-memory-draft'];

export const useDraftManager = () => {
  const [drafts, setDrafts] = useState<DraftSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load all drafts from localStorage
  const loadDrafts = useCallback(() => {
    try {
      const storedDrafts = localStorage.getItem(DRAFT_STORAGE_KEY);
      const parsedDrafts = storedDrafts ? JSON.parse(storedDrafts) : [];
      
      // Also check for legacy project formats and migrate them
      const legacyDrafts = migrateLegacyDrafts();
      
      const allDrafts = [...parsedDrafts, ...legacyDrafts];
      setDrafts(allDrafts);
    } catch (error) {
      console.error('Error loading drafts:', error);
      setDrafts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Migrate legacy localStorage projects to new format
  const migrateLegacyDrafts = (): DraftSummary[] => {
    const legacyDrafts: DraftSummary[] = [];
    
    // Check all localStorage keys for legacy projects
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      
      try {
        if (key.startsWith('studio-project-')) {
          const data = JSON.parse(localStorage.getItem(key) || '{}');
          legacyDrafts.push({
            id: key,
            name: data.name || 'Studio Project',
            type: 'studio',
            thumbnail: data.currentPhoto,
            lastModified: data.timestamp || new Date().toISOString(),
            editorType: 'Advanced Studio',
            progress: 50
          });
        }
      } catch (error) {
        console.warn(`Failed to migrate legacy draft ${key}:`, error);
      }
    }
    
    return legacyDrafts;
  };

  // Save drafts to localStorage
  const saveDrafts = useCallback((updatedDrafts: DraftSummary[]) => {
    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(updatedDrafts));
      setDrafts(updatedDrafts);
    } catch (error) {
      console.error('Error saving drafts:', error);
      toast.error('Failed to save drafts');
    }
  }, []);

  // Create a new draft
  const createDraft = useCallback((
    name: string, 
    type: DraftType, 
    editorType: string, 
    data: Record<string, any>
  ): string => {
    const id = uuidv4();
    const now = new Date().toISOString();
    
    const newDraft: Draft = {
      metadata: {
        id,
        name,
        type,
        lastModified: now,
        createdAt: now,
        editorType,
        progress: 0
      },
      data
    };
    
    // Save full draft data
    localStorage.setItem(`draft-${id}`, JSON.stringify(newDraft));
    
    // Add to drafts summary
    const updatedDrafts = [...drafts, newDraft.metadata];
    saveDrafts(updatedDrafts);
    
    toast.success('Draft saved successfully');
    return id;
  }, [drafts, saveDrafts]);

  // Update an existing draft
  const updateDraft = useCallback((
    id: string, 
    updates: Partial<Draft['metadata']>, 
    data?: Record<string, any>
  ) => {
    try {
      const existingDraft = localStorage.getItem(`draft-${id}`);
      if (!existingDraft) return false;
      
      const draft: Draft = JSON.parse(existingDraft);
      draft.metadata = { ...draft.metadata, ...updates, lastModified: new Date().toISOString() };
      if (data) draft.data = data;
      
      localStorage.setItem(`draft-${id}`, JSON.stringify(draft));
      
      const updatedDrafts = drafts.map(d => 
        d.id === id ? draft.metadata : d
      );
      saveDrafts(updatedDrafts);
      
      return true;
    } catch (error) {
      console.error('Error updating draft:', error);
      return false;
    }
  }, [drafts, saveDrafts]);

  // Delete a draft
  const deleteDraft = useCallback((id: string) => {
    try {
      localStorage.removeItem(`draft-${id}`);
      const updatedDrafts = drafts.filter(d => d.id !== id);
      saveDrafts(updatedDrafts);
      toast.success('Draft deleted');
    } catch (error) {
      console.error('Error deleting draft:', error);
      toast.error('Failed to delete draft');
    }
  }, [drafts, saveDrafts]);

  // Load full draft data
  const loadDraft = useCallback((id: string): Draft | null => {
    try {
      const draftData = localStorage.getItem(`draft-${id}`);
      return draftData ? JSON.parse(draftData) : null;
    } catch (error) {
      console.error('Error loading draft:', error);
      return null;
    }
  }, []);

  // Duplicate a draft
  const duplicateDraft = useCallback((id: string): string | null => {
    const originalDraft = loadDraft(id);
    if (!originalDraft) return null;
    
    const newId = createDraft(
      `${originalDraft.metadata.name} (Copy)`,
      originalDraft.metadata.type,
      originalDraft.metadata.editorType,
      originalDraft.data
    );
    
    return newId;
  }, [loadDraft, createDraft]);

  // Clear all drafts
  const clearAllDrafts = useCallback(() => {
    try {
      // Remove all draft data
      drafts.forEach(draft => {
        localStorage.removeItem(`draft-${draft.id}`);
      });
      
      // Clear drafts list
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      setDrafts([]);
      
      toast.success('All drafts cleared');
    } catch (error) {
      console.error('Error clearing drafts:', error);
      toast.error('Failed to clear drafts');
    }
  }, [drafts]);

  useEffect(() => {
    loadDrafts();
  }, [loadDrafts]);

  return {
    drafts,
    isLoading,
    createDraft,
    updateDraft,
    deleteDraft,
    loadDraft,
    duplicateDraft,
    clearAllDrafts,
    refreshDrafts: loadDrafts
  };
};
