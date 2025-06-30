
import { localStorageManager } from '@/lib/storage/LocalStorageManager';
import { cardStorageAdapter } from '@/lib/storage/adapters/CardStorageAdapter';
import { v4 as uuidv4 } from 'uuid';

export interface CardDraft {
  id: string;
  uploadedImage?: string;
  selectedFrame?: string;
  effectValues: Record<string, any>;
  cropSettings?: {
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
  };
  metadata: {
    created: number;
    lastModified: number;
    autoSaveCount: number;
    version: number;
  };
  processing: {
    backgroundRemoved: boolean;
    imageValidated: boolean;
    frameApplied: boolean;
  };
}

export interface AutoSaveHistory {
  action: string;
  timestamp: number;
  data: Partial<CardDraft>;
  version: number;
}

export class AutoSaveService {
  private static instance: AutoSaveService;
  private currentDraft: CardDraft | null = null;
  private saveTimeout: NodeJS.Timeout | null = null;
  private history: AutoSaveHistory[] = [];
  private maxHistorySize = 20;
  private draftKey = 'current-card-draft';
  private historyKey = 'draft-history';

  private constructor() {
    this.loadDraft();
    this.loadHistory();
  }

  public static getInstance(): AutoSaveService {
    if (!AutoSaveService.instance) {
      AutoSaveService.instance = new AutoSaveService();
    }
    return AutoSaveService.instance;
  }

  public createDraft(uploadedImage: string): CardDraft {
    console.log('💾 Creating new card draft');
    
    const draft: CardDraft = {
      id: uuidv4(),
      uploadedImage,
      selectedFrame: '',
      effectValues: {},
      metadata: {
        created: Date.now(),
        lastModified: Date.now(),
        autoSaveCount: 0,
        version: 1
      },
      processing: {
        backgroundRemoved: false,
        imageValidated: false,
        frameApplied: false
      }
    };

    this.currentDraft = draft;
    this.addToHistory('create_draft', { uploadedImage });
    this.scheduleSave();
    
    return draft;
  }

  public updateDraft(updates: Partial<CardDraft>, action?: string): void {
    if (!this.currentDraft) {
      console.warn('⚠️ No current draft to update');
      return;
    }

    console.log('💾 Updating draft:', action || 'unknown_action');
    
    this.currentDraft = {
      ...this.currentDraft,
      ...updates,
      metadata: {
        ...this.currentDraft.metadata,
        lastModified: Date.now(),
        autoSaveCount: this.currentDraft.metadata.autoSaveCount + 1,
        version: this.currentDraft.metadata.version + 1
      }
    };

    if (action) {
      this.addToHistory(action, updates);
    }

    this.scheduleSave();
  }

  public getCurrentDraft(): CardDraft | null {
    return this.currentDraft;
  }

  public hasDraft(): boolean {
    return this.currentDraft !== null;
  }

  private scheduleSave(): void {
    // Clear existing timeout
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }

    // Schedule save after 500ms of inactivity
    this.saveTimeout = setTimeout(() => {
      this.saveDraft();
    }, 500);
  }

  private saveDraft(): void {
    if (!this.currentDraft) return;

    try {
      localStorageManager.setItem(
        this.draftKey,
        this.currentDraft,
        'drafts',
        'high'
      );

      // Also save as a card entry
      cardStorageAdapter.saveCard({
        id: this.currentDraft.id,
        title: `Draft Card ${new Date().toLocaleTimeString()}`,
        image_url: this.currentDraft.uploadedImage,
        template_id: this.currentDraft.selectedFrame,
        design_metadata: {
          effects: this.currentDraft.effectValues,
          crop: this.currentDraft.cropSettings,
          processing: this.currentDraft.processing
        },
        rarity: 'common',
        tags: ['draft', 'auto-saved'],
        creator_attribution: { collaboration_type: 'solo' },
        publishing_options: {
          marketplace_listing: false,
          crd_catalog_inclusion: false,
          print_available: false,
          pricing: { currency: 'USD' },
          distribution: { limited_edition: false }
        }
      });

      console.log('💾 Draft auto-saved successfully');
    } catch (error) {
      console.error('❌ Failed to save draft:', error);
    }
  }

  private loadDraft(): void {
    try {
      const savedDraft = localStorageManager.getItem<CardDraft>(this.draftKey);
      if (savedDraft) {
        this.currentDraft = savedDraft;
        console.log('📋 Loaded existing draft:', savedDraft.id);
      }
    } catch (error) {
      console.error('❌ Failed to load draft:', error);
    }
  }

  private addToHistory(action: string, data: Partial<CardDraft>): void {
    const historyEntry: AutoSaveHistory = {
      action,
      timestamp: Date.now(),
      data,
      version: this.currentDraft?.metadata.version || 1
    };

    this.history.unshift(historyEntry);

    // Limit history size
    if (this.history.length > this.maxHistorySize) {
      this.history = this.history.slice(0, this.maxHistorySize);
    }

    this.saveHistory();
  }

  private saveHistory(): void {
    try {
      localStorageManager.setItem(
        this.historyKey,
        this.history,
        'drafts',
        'medium'
      );
    } catch (error) {
      console.error('❌ Failed to save history:', error);
    }
  }

  private loadHistory(): void {
    try {
      const savedHistory = localStorageManager.getItem<AutoSaveHistory[]>(this.historyKey);
      if (savedHistory) {
        this.history = savedHistory;
        console.log('📋 Loaded draft history:', this.history.length, 'entries');
      }
    } catch (error) {
      console.error('❌ Failed to load history:', error);
    }
  }

  public getHistory(): AutoSaveHistory[] {
    return [...this.history];
  }

  public canUndo(): boolean {
    return this.history.length > 1;
  }

  public undo(): boolean {
    if (!this.canUndo() || !this.currentDraft) return false;

    // Find the previous state
    const currentVersion = this.currentDraft.metadata.version;
    const previousEntry = this.history.find(entry => entry.version < currentVersion);

    if (!previousEntry) return false;

    console.log('↶ Undoing to version:', previousEntry.version);
    
    // Apply previous state
    this.updateDraft(previousEntry.data, 'undo');
    return true;
  }

  public clearDraft(): void {
    console.log('🗑️ Clearing current draft');
    
    // Cleanup blob URLs
    if (this.currentDraft?.uploadedImage?.startsWith('blob:')) {
      URL.revokeObjectURL(this.currentDraft.uploadedImage);
    }

    this.currentDraft = null;
    localStorageManager.removeItem(this.draftKey);
    
    // Clear history
    this.history = [];
    localStorageManager.removeItem(this.historyKey);
  }

  public getStats(): { 
    draftAge: number; 
    saveCount: number; 
    historySize: number; 
    lastAction: string | null;
  } {
    if (!this.currentDraft) {
      return { draftAge: 0, saveCount: 0, historySize: 0, lastAction: null };
    }

    return {
      draftAge: Date.now() - this.currentDraft.metadata.created,
      saveCount: this.currentDraft.metadata.autoSaveCount,
      historySize: this.history.length,
      lastAction: this.history[0]?.action || null
    };
  }
}

export const autoSaveService = AutoSaveService.getInstance();
