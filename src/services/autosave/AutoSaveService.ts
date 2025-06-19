
import { v4 as uuidv4 } from 'uuid';

export interface CardDraft {
  id: string;
  uploadedImage?: string;
  selectedFrame?: string;
  effectValues?: Record<string, any>;
  processing?: {
    imageValidated?: boolean;
    backgroundRemoved?: boolean;
    frameApplied?: boolean;
  };
  created_at: string;
  updated_at: string;
}

export interface AutoSaveStats {
  saveCount: number;
  lastAction: string;
  lastSaveTime: string;
  draftAge: number;
  historySize: number;
}

class AutoSaveService {
  private static instance: AutoSaveService;
  private currentDraft: CardDraft | null = null;
  private history: CardDraft[] = [];
  private maxHistorySize = 10;
  private saveKey = 'crd-autosave-draft';
  private historyKey = 'crd-autosave-history';
  private statsKey = 'crd-autosave-stats';

  private constructor() {
    this.loadFromStorage();
  }

  public static getInstance(): AutoSaveService {
    if (!AutoSaveService.instance) {
      AutoSaveService.instance = new AutoSaveService();
    }
    return AutoSaveService.instance;
  }

  private loadFromStorage(): void {
    try {
      const savedDraft = localStorage.getItem(this.saveKey);
      if (savedDraft) {
        this.currentDraft = JSON.parse(savedDraft);
      }

      const savedHistory = localStorage.getItem(this.historyKey);
      if (savedHistory) {
        this.history = JSON.parse(savedHistory);
      }
    } catch (error) {
      console.warn('Failed to load auto-save data:', error);
    }
  }

  private saveToStorage(): void {
    try {
      if (this.currentDraft) {
        localStorage.setItem(this.saveKey, JSON.stringify(this.currentDraft));
      }
      localStorage.setItem(this.historyKey, JSON.stringify(this.history));
    } catch (error) {
      console.warn('Failed to save auto-save data:', error);
    }
  }

  private updateStats(action: string): void {
    try {
      const stats = this.getStats();
      const newStats: AutoSaveStats = {
        saveCount: stats.saveCount + 1,
        lastAction: action,
        lastSaveTime: new Date().toISOString(),
        draftAge: this.currentDraft ? Date.now() - new Date(this.currentDraft.created_at).getTime() : 0,
        historySize: this.history.length
      };
      localStorage.setItem(this.statsKey, JSON.stringify(newStats));
    } catch (error) {
      console.warn('Failed to update auto-save stats:', error);
    }
  }

  public createDraft(uploadedImage?: string): CardDraft {
    const draft: CardDraft = {
      id: uuidv4(),
      uploadedImage,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.currentDraft = draft;
    this.addToHistory(draft);
    this.saveToStorage();
    this.updateStats('create_draft');

    return draft;
  }

  public updateDraft(updates: Partial<CardDraft>, action: string = 'update'): void {
    if (!this.currentDraft) {
      this.createDraft();
    }

    if (this.currentDraft) {
      this.currentDraft = {
        ...this.currentDraft,
        ...updates,
        updated_at: new Date().toISOString()
      };

      this.addToHistory(this.currentDraft);
      this.saveToStorage();
      this.updateStats(action);
    }
  }

  public getCurrentDraft(): CardDraft | null {
    return this.currentDraft;
  }

  private addToHistory(draft: CardDraft): void {
    // Create a deep copy of the draft
    const draftCopy = JSON.parse(JSON.stringify(draft));
    
    // Add to history
    this.history.unshift(draftCopy);
    
    // Limit history size
    if (this.history.length > this.maxHistorySize) {
      this.history = this.history.slice(0, this.maxHistorySize);
    }
  }

  public canUndo(): boolean {
    return this.history.length > 1;
  }

  public undo(): boolean {
    if (this.history.length > 1) {
      // Remove current state and restore previous
      this.history.shift();
      const previousDraft = this.history[0];
      
      if (previousDraft) {
        this.currentDraft = JSON.parse(JSON.stringify(previousDraft));
        this.saveToStorage();
        this.updateStats('undo');
        return true;
      }
    }
    return false;
  }

  public clearDraft(): void {
    this.currentDraft = null;
    this.history = [];
    
    try {
      localStorage.removeItem(this.saveKey);
      localStorage.removeItem(this.historyKey);
    } catch (error) {
      console.warn('Failed to clear auto-save data:', error);
    }
    
    this.updateStats('clear_draft');
  }

  public getStats(): AutoSaveStats {
    try {
      const saved = localStorage.getItem(this.statsKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.warn('Failed to load auto-save stats:', error);
    }
    
    return {
      saveCount: 0,
      lastAction: '',
      lastSaveTime: '',
      draftAge: 0,
      historySize: 0
    };
  }

  public getHistory(): CardDraft[] {
    return [...this.history];
  }

  public hasDraft(): boolean {
    return this.currentDraft !== null;
  }
}

export const autoSaveService = AutoSaveService.getInstance();
