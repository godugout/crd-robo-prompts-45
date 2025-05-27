
export interface FilterOptions {
  status: 'all' | 'detected' | 'processing' | 'enhanced' | 'error';
  confidence: { min: number; max: number };
  dateRange: { start: Date | null; end: Date | null };
  searchTerm: string;
}

export interface SortOption {
  field: 'confidence' | 'date' | 'name' | 'status';
  direction: 'asc' | 'desc';
}

export interface ProcessingStatus {
  total: number;
  completed: number;
  failed: number;
  inProgress: string[];
}

export interface CatalogState {
  currentSession: any | null; // UploadSession from CardDetectionService
  uploadQueue: File[];
  detectedCards: Map<string, any>; // DetectedCard from CardDetectionService
  selectedCards: Set<string>;
  processingStatus: ProcessingStatus;
  filters: FilterOptions;
  sortBy: SortOption;
  viewMode: 'grid' | 'list';
  isProcessing: boolean;
  showReview: boolean;
}
