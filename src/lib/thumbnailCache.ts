
interface CachedThumbnail {
  url: string;
  blob: Blob;
  timestamp: number;
}

class ThumbnailCache {
  private cache = new Map<string, CachedThumbnail>();
  private readonly maxAge = 1000 * 60 * 60 * 24; // 24 hours
  private readonly maxSize = 100; // Max 100 cached thumbnails

  async getThumbnail(url: string): Promise<string> {
    // Check if we have a cached version
    const cached = this.cache.get(url);
    if (cached && Date.now() - cached.timestamp < this.maxAge) {
      return URL.createObjectURL(cached.blob);
    }

    try {
      // Fetch and cache the thumbnail
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch thumbnail');
      
      const blob = await response.blob();
      
      // Clean old entries if cache is full
      if (this.cache.size >= this.maxSize) {
        const oldestKey = Array.from(this.cache.entries())
          .sort((a, b) => a[1].timestamp - b[1].timestamp)[0][0];
        this.cache.delete(oldestKey);
      }
      
      this.cache.set(url, {
        url,
        blob,
        timestamp: Date.now()
      });
      
      return URL.createObjectURL(blob);
    } catch (error) {
      console.warn('Failed to cache thumbnail:', error);
      return url; // Fallback to original URL
    }
  }

  clearCache() {
    this.cache.clear();
  }

  removeExpired() {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > this.maxAge) {
        this.cache.delete(key);
      }
    }
  }
}

export const thumbnailCache = new ThumbnailCache();

// Clean expired entries every 30 minutes
setInterval(() => {
  thumbnailCache.removeExpired();
}, 30 * 60 * 1000);
