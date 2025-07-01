
export type DraftType = 'studio' | 'simple' | 'oak-creator' | 'template';

export interface DraftSummary {
  id: string;
  name: string;
  type: DraftType;
  thumbnail?: string;
  lastModified: string;
  createdAt?: string;
  editorType: string;
  progress?: number;
}

export interface Draft {
  metadata: DraftSummary;
  data: Record<string, any>;
}
