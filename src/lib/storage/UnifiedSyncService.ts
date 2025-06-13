
import { supabase } from '@/lib/supabase-client';
import { localStorageManager, StorageDataType } from './LocalStorageManager';
import { localCardStorage, LocalCard } from '@/lib/localCardStorage';
import { toast } from 'sonner';

export interface SyncResult {
  success: boolean;
  syncedItems: number;
  failedItems: number;
  errors: string[];
}

export interface SyncProgress {
  total: number;
  completed: number;
  current?: string;
  success: number;
  failed: number;
}

export class UnifiedSyncService {
  private static instance: UnifiedSyncService;
  private syncInProgress = false;

  private constructor() {}

  public static getInstance(): UnifiedSyncService {
    if (!UnifiedSyncService.instance) {
      UnifiedSyncService.instance = new UnifiedSyncService();
    }
    return UnifiedSyncService.instance;
  }

  public async syncAllData(
    progressCallback?: (progress: SyncProgress) => void
  ): Promise<SyncResult> {
    if (this.syncInProgress) {
      return { success: false, syncedItems: 0, failedItems: 0, errors: ['Sync already in progress'] };
    }

    const config = localStorageManager.getConfig();
    if (!config.enableSync || config.testingMode) {
      return { success: true, syncedItems: 0, failedItems: 0, errors: [] };
    }

    this.syncInProgress = true;
    const result: SyncResult = { success: true, syncedItems: 0, failedItems: 0, errors: [] };

    try {
      // Get all items that need syncing, ordered by priority
      const pendingItems = localStorageManager.getAllMetadata()
        .filter(item => item.syncStatus === 'pending' || item.syncStatus === 'failed')
        .sort((a, b) => this.getPriorityWeight(a.priority) - this.getPriorityWeight(b.priority));

      const total = pendingItems.length;
      let completed = 0;

      progressCallback?.({
        total,
        completed: 0,
        success: 0,
        failed: 0
      });

      // Sync by data type in priority order
      const dataTypeGroups = this.groupByDataType(pendingItems);
      
      for (const [dataType, items] of dataTypeGroups) {
        for (const item of items) {
          try {
            progressCallback?.({
              total,
              completed,
              current: item.key,
              success: result.syncedItems,
              failed: result.failedItems
            });

            const success = await this.syncItemByType(dataType, item.key);
            
            if (success) {
              result.syncedItems++;
            } else {
              result.failedItems++;
              result.errors.push(`Failed to sync ${item.key}`);
            }
          } catch (error) {
            result.failedItems++;
            result.errors.push(`Error syncing ${item.key}: ${error}`);
          }

          completed++;
          progressCallback?.({
            total,
            completed,
            success: result.syncedItems,
            failed: result.failedItems
          });
        }
      }

      result.success = result.failedItems === 0;
      return result;
    } catch (error) {
      console.error('Sync process failed:', error);
      result.success = false;
      result.errors.push(`Sync process failed: ${error}`);
      return result;
    } finally {
      this.syncInProgress = false;
    }
  }

  private async syncItemByType(dataType: StorageDataType, key: string): Promise<boolean> {
    const data = localStorageManager.getItem(key);
    if (!data) return false;

    try {
      switch (dataType) {
        case 'cards':
          return await this.syncCard(key, data as LocalCard);
        case 'drafts':
          return await this.syncDraft(key, data);
        case 'settings':
          return await this.syncSettings(key, data);
        case 'uploads':
          return await this.syncUpload(key, data);
        case 'memories':
          return await this.syncMemory(key, data);
        default:
          console.warn(`No sync handler for data type: ${dataType}`);
          return false;
      }
    } catch (error) {
      console.error(`Failed to sync ${dataType} item ${key}:`, error);
      return false;
    }
  }

  private async syncCard(key: string, cardData: LocalCard): Promise<boolean> {
    try {
      // Validate that we have a proper LocalCard object
      if (!cardData.id || !cardData.title) {
        console.error('Invalid card data for sync:', cardData);
        return false;
      }

      const { data: existingCard } = await supabase
        .from('cards')
        .select('id')
        .eq('id', cardData.id)
        .single();

      if (existingCard) {
        // Update existing card
        const { error } = await supabase
          .from('cards')
          .update({
            title: cardData.title,
            description: cardData.description,
            design_metadata: cardData.design_metadata,
            image_url: cardData.image_url,
            thumbnail_url: cardData.thumbnail_url,
            rarity: cardData.rarity,
            tags: cardData.tags,
            is_public: cardData.is_public || false,
            creator_attribution: cardData.creator_attribution,
            publishing_options: cardData.publishing_options,
            print_metadata: cardData.print_metadata,
            updated_at: new Date().toISOString(),
          })
          .eq('id', cardData.id);

        if (error) throw error;
      } else {
        // Create new card
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return false;

        const { error } = await supabase
          .from('cards')
          .insert({
            id: cardData.id,
            title: cardData.title,
            description: cardData.description,
            creator_id: user.id,
            design_metadata: cardData.design_metadata,
            image_url: cardData.image_url,
            thumbnail_url: cardData.thumbnail_url,
            rarity: cardData.rarity,
            tags: cardData.tags,
            is_public: cardData.is_public || false,
            creator_attribution: cardData.creator_attribution,
            publishing_options: cardData.publishing_options,
            verification_status: 'pending',
            print_metadata: cardData.print_metadata
          });

        if (error) throw error;
      }

      // Mark as synced in local storage
      localCardStorage.markAsSynced(cardData.id);
      return true;
    } catch (error) {
      console.error('Card sync failed:', error);
      return false;
    }
  }

  private async syncDraft(key: string, draftData: any): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      // TODO: Implement draft sync to crd_drafts table
      console.log('Draft sync not yet implemented:', key);
      return true; // Placeholder
    } catch (error) {
      console.error('Draft sync failed:', error);
      return false;
    }
  }

  private async syncSettings(key: string, settingsData: any): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      // Sync to app_settings table
      const { error } = await supabase
        .from('app_settings')
        .upsert({
          app_id: user.id, // Using user_id as app_id for user settings
          settings: settingsData,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Settings sync failed:', error);
      return false;
    }
  }

  private async syncUpload(key: string, uploadData: any): Promise<boolean> {
    try {
      // TODO: Implement upload session sync
      console.log('Upload sync not yet implemented:', key);
      return true; // Placeholder
    } catch (error) {
      console.error('Upload sync failed:', error);
      return false;
    }
  }

  private async syncMemory(key: string, memoryData: any): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      // Sync to memories table
      const { error } = await supabase
        .from('memories')
        .upsert({
          ...memoryData,
          user_id: user.id,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Memory sync failed:', error);
      return false;
    }
  }

  private getPriorityWeight(priority: string): number {
    switch (priority) {
      case 'critical': return 1;
      case 'high': return 2;
      case 'medium': return 3;
      case 'low': return 4;
      default: return 5;
    }
  }

  private groupByDataType(items: any[]): Map<StorageDataType, any[]> {
    const groups = new Map<StorageDataType, any[]>();
    
    items.forEach(item => {
      if (!groups.has(item.dataType)) {
        groups.set(item.dataType, []);
      }
      groups.get(item.dataType)!.push(item);
    });

    // Return in priority order
    const orderedTypes: StorageDataType[] = ['cards', 'drafts', 'memories', 'settings', 'uploads', 'sessions', 'cache'];
    const orderedGroups = new Map<StorageDataType, any[]>();
    
    orderedTypes.forEach(type => {
      if (groups.has(type)) {
        orderedGroups.set(type, groups.get(type)!);
      }
    });

    return orderedGroups;
  }

  public async forceSyncItem(key: string): Promise<boolean> {
    const metadata = localStorageManager.getMetadata(key);
    if (!metadata) return false;

    return await this.syncItemByType(metadata.dataType, key);
  }

  public isSyncInProgress(): boolean {
    return this.syncInProgress;
  }
}

export const unifiedSyncService = UnifiedSyncService.getInstance();
