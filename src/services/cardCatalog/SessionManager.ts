
import { UploadSession } from './types';

export class SessionManager {
  private sessions: Map<string, UploadSession> = new Map();

  createSession(files: File[]): string {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const session: UploadSession = {
      id: sessionId,
      startTime: new Date(),
      files,
      totalCards: 0,
      processedCards: 0,
      failedCards: 0,
      status: 'uploading'
    };

    this.sessions.set(sessionId, session);
    return sessionId;
  }

  getSession(sessionId: string): UploadSession | undefined {
    return this.sessions.get(sessionId);
  }

  updateSession(sessionId: string, updates: Partial<UploadSession>): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      this.sessions.set(sessionId, { ...session, ...updates });
    }
  }

  getProcessingStatus(sessionId: string): {
    total: number;
    completed: number;
    failed: number;
    inProgress: string[];
  } {
    const session = this.sessions.get(sessionId);
    
    return {
      total: session?.files.length || 0,
      completed: session?.processedCards || 0,
      failed: session?.failedCards || 0,
      inProgress: []
    };
  }
}
