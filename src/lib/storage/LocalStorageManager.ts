
export interface StorageItem<T = any> {
  data: T;
  timestamp: number;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export class LocalStorageManager {
  private static instance: LocalStorageManager;
  private maxSize = 5 * 1024 * 1024; // 5MB limit for localStorage

  private constructor() {}

  public static getInstance(): LocalStorageManager {
    if (!LocalStorageManager.instance) {
      LocalStorageManager.instance = new LocalStorageManager();
    }
    return LocalStorageManager.instance;
  }

  public setItem<T>(
    key: string, 
    data: T, 
    category: string = 'general', 
    priority: 'low' | 'medium' | 'high' | 'critical' = 'medium'
  ): void {
    try {
      const item: StorageItem<T> = {
        data,
        timestamp: Date.now(),
        category,
        priority
      };

      const serialized = JSON.stringify(item);
      
      // Check if we're approaching storage limits
      if (this.getStorageSize() + serialized.length > this.maxSize) {
        this.cleanup();
      }

      localStorage.setItem(key, serialized);
    } catch (error) {
      console.error('Failed to store item:', error);
      
      // If storage is full, try cleanup and retry once
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        this.cleanup();
        try {
          localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now(), category, priority }));
        } catch (retryError) {
          console.error('Failed to store item after cleanup:', retryError);
        }
      }
    }
  }

  public getItem<T>(key: string): T | null {
    try {
      const stored = localStorage.getItem(key);
      if (!stored) return null;

      const item: StorageItem<T> = JSON.parse(stored);
      return item.data;
    } catch (error) {
      console.error('Failed to retrieve item:', error);
      return null;
    }
  }

  public removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  }

  private getStorageSize(): number {
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length;
      }
    }
    return total;
  }

  private cleanup(): void {
    console.log('🧹 Cleaning up localStorage...');
    
    const items: Array<{ key: string; item: StorageItem; size: number }> = [];
    
    // Collect all items with metadata
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        try {
          const stored = localStorage.getItem(key);
          if (stored) {
            const item: StorageItem = JSON.parse(stored);
            items.push({
              key,
              item,
              size: stored.length
            });
          }
        } catch (error) {
          // Remove corrupted items
          localStorage.removeItem(key);
        }
      }
    }

    // Sort by priority (low priority items first) and age (oldest first)
    items.sort((a, b) => {
      const priorityOrder = { low: 0, medium: 1, high: 2, critical: 3 };
      const priorityDiff = priorityOrder[a.item.priority] - priorityOrder[b.item.priority];
      
      if (priorityDiff !== 0) return priorityDiff;
      return a.item.timestamp - b.item.timestamp;
    });

    // Remove items until we're under 70% capacity
    const targetSize = this.maxSize * 0.7;
    let currentSize = this.getStorageSize();
    
    for (const { key, size } of items) {
      if (currentSize <= targetSize) break;
      
      localStorage.removeItem(key);
      currentSize -= size;
      console.log(`🗑️ Removed ${key} (${size} bytes)`);
    }
  }
}

export const localStorageManager = LocalStorageManager.getInstance();
