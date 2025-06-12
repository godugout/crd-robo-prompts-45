
export type DraftType = 'studio' | 'simple' | 'oak-creator' | 'template';

export interface DraftMetadata {
  id: string;
  name: string;
  type: DraftType;
  thumbnail?: string;
  lastModified: string;
  createdAt: string;
  editorType: string;
  progress?: number; // 0-100 percentage
}

export interface Draft {
  metadata: DraftMetadata;
  data: Record<string, any>;
}

export interface DraftSummary {
  id: string;
  name: string;
  type: DraftType;
  thumbnail?: string;
  lastModified: string;
  editorType: string;
  progress?: number;
}
