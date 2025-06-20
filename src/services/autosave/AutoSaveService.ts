
import { toast } from 'sonner';

export interface CardDraft {
  id: string;
  name: string;
  uploadedImage?: string;
  selectedFrame?: string;
  effectValues?: Record<string, any>;
  cardOrientation?: 'portrait' | 'landscape';
  lastModified: string;
  createdAt: string;
}

export interface AutoSaveStats {
  lastSaveTime: string | null;
  totalSaves: number;
  currentDraftId: string | null;
}

class AutoSaveService {
  private currentDraft: CardDraft | null = null;
  private saveCount = 0;
  private readonly STORAGE_KEY = 'crd_studio_draft';
  private readonly STATS_KEY = 'crd_studio_stats';

  getCurrentDraft(): CardDraft | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.currentDraft = JSON.parse(stored);
        return this.currentDraft;
      }
    } catch (error) {
      console.warn('Failed to load draft from localStorage:', error);
    }
    return null;
  }

  createDraft(name: string = 'Untitled Card'): CardDraft {
    const draft: CardDraft = {
      id: `draft_${Date.now()}`,
      name,
      lastModified: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    this.currentDraft = draft;
    this.saveDraft();
    
    console.log('📝 Created new draft:', draft.id);
    return draft;
  }

  updateDraft(updates: Partial<CardDraft>, action: string = 'update'): void {
    if (!this.currentDraft) {
      this.currentDraft = this.createDraft();
    }

    this.currentDraft = {
      ...this.currentDraft,
      ...updates,
      lastModified: new Date().toISOString()
    };

    this.saveDraft();
    this.updateStats();
    
    console.log(`💾 Updated draft (${action}):`, this.currentDraft.id);
  }

  private saveDraft(): void {
    if (!this.currentDraft) return;

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.currentDraft));
    } catch (error) {
      console.error('Failed to save draft to localStorage:', error);
      toast.error('Failed to auto-save your work');
    }
  }

  private updateStats(): void {
    this.saveCount++;
    const stats: AutoSaveStats = {
      lastSaveTime: new Date().toISOString(),
      totalSaves: this.saveCount,
      currentDraftId: this.currentDraft?.id || null
    };

    try {
      localStorage.setItem(this.STATS_KEY, JSON.stringify(stats));
    } catch (error) {
      console.warn('Failed to update auto-save stats:', error);
    }
  }

  getStats(): AutoSaveStats {
    try {
      const stored = localStorage.getItem(this.STATS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load auto-save stats:', error);
    }

    return {
      lastSaveTime: null,
      totalSaves: 0,
      currentDraftId: null
    };
  }

  clearDraft(): void {
    this.currentDraft = null;
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      console.log('🗑️ Cleared current draft');
    } catch (error) {
      console.error('Failed to clear draft:', error);
    }
  }

  exportDraft(): CardDraft | null {
    return this.currentDraft ? { ...this.currentDraft } : null;
  }
}

export const autoSaveService = new AutoSaveService();
