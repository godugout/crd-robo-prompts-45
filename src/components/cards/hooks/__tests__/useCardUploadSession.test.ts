
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCardUploadSession } from '../useCardUploadSession';
import type { SessionState } from '../../types';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('useCardUploadSession', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize with default state when no saved session exists', () => {
    const { result } = renderHook(() => useCardUploadSession());

    expect(result.current.phase).toBe('idle');
    expect(result.current.uploadedImages).toEqual([]);
    expect(result.current.detectionResults).toEqual([]);
    expect(result.current.selectedCards).toEqual(new Set());
    expect(result.current.createdCards).toEqual([]);
    expect(result.current.sessionId).toMatch(/^session-\d+$/);
  });

  it('should restore session state from localStorage', () => {
    const savedSession: SessionState = {
      phase: 'reviewing',
      uploadedImages: [],
      detectionResults: [],
      selectedCards: ['card-1', 'card-2'],
      createdCards: [],
      sessionId: 'session-123',
    };

    localStorageMock.getItem.mockReturnValue(JSON.stringify(savedSession));

    const { result } = renderHook(() => useCardUploadSession());

    expect(result.current.phase).toBe('reviewing');
    expect(result.current.selectedCards).toEqual(new Set(['card-1', 'card-2']));
    expect(result.current.sessionId).toBe('session-123');
  });

  it('should save session state to localStorage when state changes', () => {
    const { result } = renderHook(() => useCardUploadSession());

    act(() => {
      result.current.setPhase('uploading');
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'cardshow_upload_session',
      expect.stringContaining('"phase":"uploading"')
    );
  });

  it('should clear session and reset to initial state', () => {
    const { result } = renderHook(() => useCardUploadSession());

    // Set some state first
    act(() => {
      result.current.setPhase('reviewing');
      result.current.setUploadedImages([{ id: '1', file: new File([], 'test.jpg'), preview: 'blob:test' }]);
    });

    // Clear session
    act(() => {
      result.current.clearSession();
    });

    expect(result.current.phase).toBe('idle');
    expect(result.current.uploadedImages).toEqual([]);
    expect(result.current.detectionResults).toEqual([]);
    expect(result.current.selectedCards).toEqual(new Set());
    expect(result.current.createdCards).toEqual([]);
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('cardshow_upload_session');
  });

  it('should handle corrupted localStorage data gracefully', () => {
    localStorageMock.getItem.mockReturnValue('invalid-json');
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() => useCardUploadSession());

    expect(result.current.phase).toBe('idle');
    expect(consoleSpy).toHaveBeenCalledWith('Failed to restore session:', expect.any(Error));
    
    consoleSpy.mockRestore();
  });

  it('should update selectedCards Set correctly', () => {
    const { result } = renderHook(() => useCardUploadSession());

    act(() => {
      result.current.setSelectedCards(new Set(['card-1', 'card-2']));
    });

    expect(result.current.selectedCards).toEqual(new Set(['card-1', 'card-2']));
    expect(localStorageMock.setItem).toHaveBeenCalled();
  });

  it('should generate unique session IDs', () => {
    const { result: result1 } = renderHook(() => useCardUploadSession());
    const { result: result2 } = renderHook(() => useCardUploadSession());

    expect(result1.current.sessionId).not.toBe(result2.current.sessionId);
    expect(result1.current.sessionId).toMatch(/^session-\d+$/);
    expect(result2.current.sessionId).toMatch(/^session-\d+$/);
  });
});
