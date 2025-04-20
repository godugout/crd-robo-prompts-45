
import { v4 as uuidv4 } from 'uuid';
import localforage from 'localforage';

// Initialize localforage instance for pending uploads
const uploadsStore = localforage.createInstance({
  name: 'cardshowOfflineUploads'
});

// Initialize localforage instance for pending memories
const memoriesStore = localforage.createInstance({
  name: 'cardshowOfflineMemories'
});

// Save a file for offline upload
export const saveForOfflineUpload = async (
  file: File,
  memoryId: string,
  userId: string,
  metadata: Record<string, any> = {},
  isPrivate: boolean = false
): Promise<string> => {
  const id = uuidv4();
  
  const pendingUpload = {
    id,
    file,
    memoryId,
    userId,
    metadata,
    createdAt: Date.now(),
    isPrivate
  };
  
  await uploadsStore.setItem(`pending-upload-${id}`, pendingUpload);
  
  return id;
};

// Get all pending uploads
export const getPendingUploads = async (): Promise<any[]> => {
  const keys = await uploadsStore.keys();
  const pendingUploads: any[] = [];
  
  for (const key of keys) {
    if (key.startsWith('pending-upload-')) {
      const upload = await uploadsStore.getItem(key);
      if (upload) {
        pendingUploads.push(upload);
      }
    }
  }
  
  // Sort by creation date, oldest first
  return pendingUploads.sort((a, b) => a.createdAt - b.createdAt);
};

// Remove a pending upload
export const removePendingUpload = async (id: string): Promise<void> => {
  await uploadsStore.removeItem(`pending-upload-${id}`);
};

// Save memory for offline creation
export const saveMemoryForOffline = async (
  memory: Record<string, any>
): Promise<string> => {
  const id = memory.id || uuidv4();
  memory.id = id;
  memory.pendingSync = true;
  memory.createdAt = memory.createdAt || Date.now();
  
  await memoriesStore.setItem(`pending-memory-${id}`, memory);
  
  return id;
};

// Get all pending memories
export const getPendingMemories = async (): Promise<any[]> => {
  const keys = await memoriesStore.keys();
  const pendingMemories: any[] = [];
  
  for (const key of keys) {
    if (key.startsWith('pending-memory-')) {
      const memory = await memoriesStore.getItem(key);
      if (memory) {
        pendingMemories.push(memory);
      }
    }
  }
  
  // Sort by creation date, newest first
  return pendingMemories.sort((a, b) => b.createdAt - a.createdAt);
};

// Remove a pending memory
export const removePendingMemory = async (id: string): Promise<void> => {
  await memoriesStore.removeItem(`pending-memory-${id}`);
};
