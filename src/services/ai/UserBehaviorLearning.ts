
import { ImageAnalysis } from './ImageAnalyzer';

export interface UserPreferences {
  preferred_categories: string[];
  favorite_frames: string[];
  color_preferences: string[];
  effect_preferences: {
    holographic: number;
    metallic: number;
    chrome: number;
    particles: boolean;
  };
  creation_patterns: {
    avg_session_time: number;
    common_upload_times: string[];
    preferred_rarities: string[];
  };
}

export interface UserSession {
  id: string;
  start_time: Date;
  actions: Array<{
    type: 'upload' | 'frame_select' | 'effect_adjust' | 'export' | 'undo' | 'redo';
    timestamp: Date;
    data: any;
  }>;
  created_cards: number;
  time_spent: number;
}

class UserBehaviorLearning {
  private preferences: UserPreferences;
  private currentSession: UserSession;
  private dbName = 'cardshow_ai_preferences';
  private storeName = 'user_behavior';

  constructor() {
    this.preferences = this.getDefaultPreferences();
    this.currentSession = this.createNewSession();
    this.initializeDB();
  }

  private getDefaultPreferences(): UserPreferences {
    return {
      preferred_categories: [],
      favorite_frames: [],
      color_preferences: [],
      effect_preferences: {
        holographic: 0,
        metallic: 0,
        chrome: 0,
        particles: false
      },
      creation_patterns: {
        avg_session_time: 0,
        common_upload_times: [],
        preferred_rarities: []
      }
    };
  }

  private createNewSession(): UserSession {
    return {
      id: `session_${Date.now()}`,
      start_time: new Date(),
      actions: [],
      created_cards: 0,
      time_spent: 0
    };
  }

  private async initializeDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'id' });
        }
      };
    });
  }

  async loadPreferences(): Promise<UserPreferences> {
    try {
      const db = await this.openDB();
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get('user_preferences');
      
      return new Promise((resolve) => {
        request.onsuccess = () => {
          const result = request.result;
          this.preferences = result ? result.data : this.getDefaultPreferences();
          resolve(this.preferences);
        };
        request.onerror = () => resolve(this.getDefaultPreferences());
      });
    } catch (error) {
      console.error('Failed to load preferences:', error);
      return this.getDefaultPreferences();
    }
  }

  async savePreferences(): Promise<void> {
    try {
      const db = await this.openDB();
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      
      await store.put({
        id: 'user_preferences',
        data: this.preferences,
        updated_at: new Date()
      });
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  }

  private async openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  trackAction(type: UserSession['actions'][0]['type'], data: any): void {
    this.currentSession.actions.push({
      type,
      timestamp: new Date(),
      data
    });

    // Update session time
    this.currentSession.time_spent = Date.now() - this.currentSession.start_time.getTime();
  }

  learnFromImageAnalysis(analysis: ImageAnalysis, selectedFrame: string): void {
    // Update category preferences
    const categoryIndex = this.preferences.preferred_categories.indexOf(analysis.category);
    if (categoryIndex === -1) {
      this.preferences.preferred_categories.push(analysis.category);
    }

    // Update frame preferences
    const frameIndex = this.preferences.favorite_frames.indexOf(selectedFrame);
    if (frameIndex === -1) {
      this.preferences.favorite_frames.push(selectedFrame);
    } else {
      // Move to front (recently used)
      this.preferences.favorite_frames.splice(frameIndex, 1);
      this.preferences.favorite_frames.unshift(selectedFrame);
    }

    // Update color preferences
    analysis.colorAnalysis.dominant_colors.forEach(color => {
      if (!this.preferences.color_preferences.includes(color)) {
        this.preferences.color_preferences.push(color);
      }
    });

    this.savePreferences();
  }

  learnFromEffectUsage(effects: any): void {
    // Update effect preferences with weighted average
    const weight = 0.3; // Learning rate
    
    this.preferences.effect_preferences.holographic = 
      (1 - weight) * this.preferences.effect_preferences.holographic + weight * effects.holographic;
    
    this.preferences.effect_preferences.metallic = 
      (1 - weight) * this.preferences.effect_preferences.metallic + weight * effects.metallic;
    
    this.preferences.effect_preferences.chrome = 
      (1 - weight) * this.preferences.effect_preferences.chrome + weight * effects.chrome;
    
    if (effects.particles) {
      this.preferences.effect_preferences.particles = true;
    }

    this.savePreferences();
  }

  getPredictiveRecommendations(analysis: ImageAnalysis): {
    suggestedFrame: string;
    suggestedEffects: any;
    confidence: number;
  } {
    // Find best matching frame based on category and past preferences
    const categoryFrames = this.preferences.favorite_frames.filter(frame => 
      this.getFrameCategory(frame) === analysis.category
    );
    
    const suggestedFrame = categoryFrames.length > 0 
      ? categoryFrames[0] 
      : this.getDefaultFrameForCategory(analysis.category);

    // Suggest effects based on learned preferences and image analysis
    const suggestedEffects = {
      holographic: Math.min(1, this.preferences.effect_preferences.holographic + 
        (analysis.colorAnalysis.saturation > 0.7 ? 0.3 : 0)),
      metallic: Math.min(1, this.preferences.effect_preferences.metallic + 
        (analysis.category === 'sports' ? 0.2 : 0)),
      chrome: Math.min(1, this.preferences.effect_preferences.chrome + 
        (analysis.colorAnalysis.contrast > 0.8 ? 0.2 : 0)),
      particles: this.preferences.effect_preferences.particles || 
        analysis.category === 'abstract'
    };

    const confidence = Math.min(0.9, 
      (this.preferences.favorite_frames.length * 0.1) + 
      (this.currentSession.created_cards * 0.05) + 0.4
    );

    return {
      suggestedFrame,
      suggestedEffects,
      confidence
    };
  }

  private getFrameCategory(frameId: string): string {
    const frameCategories: { [key: string]: string } = {
      'classic-sports': 'sports',
      'holographic-modern': 'entertainment',
      'vintage-ornate': 'art',
      'chrome-edition': 'abstract',
      'donruss-special': 'sports',
      'donruss-rookie': 'sports'
    };
    return frameCategories[frameId] || 'art';
  }

  private getDefaultFrameForCategory(category: string): string {
    const defaultFrames: { [key: string]: string } = {
      'sports': 'classic-sports',
      'entertainment': 'holographic-modern',
      'art': 'vintage-ornate',
      'portrait': 'chrome-edition',
      'landscape': 'vintage-ornate',
      'abstract': 'holographic-modern'
    };
    return defaultFrames[category] || 'classic-sports';
  }

  async endSession(): Promise<void> {
    this.currentSession.time_spent = Date.now() - this.currentSession.start_time.getTime();
    
    // Update creation patterns
    this.preferences.creation_patterns.avg_session_time = 
      (this.preferences.creation_patterns.avg_session_time + this.currentSession.time_spent) / 2;
    
    const currentHour = new Date().getHours().toString();
    if (!this.preferences.creation_patterns.common_upload_times.includes(currentHour)) {
      this.preferences.creation_patterns.common_upload_times.push(currentHour);
    }

    await this.savePreferences();
    this.currentSession = this.createNewSession();
  }

  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }
}

export const userBehaviorLearning = new UserBehaviorLearning();
