
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCardOperations } from '../useCardOperations';
import { detectCardsInImages } from '@/services/cardDetection';
import type { UploadedImage, CreatedCard } from '../../types';
import { createMockDetectedCard } from './setup';

// Mock the card detection service
vi.mock('@/services/cardDetection', () => ({
  detectCardsInImages: vi.fn(),
}));

// Mock toast
const mockToast = {
  loading: vi.fn(),
  success: vi.fn(),
  error: vi.fn(),
  dismiss: vi.fn(),
};
vi.mock('sonner', () => ({ toast: mockToast }));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(() => '[]'),
  setItem: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('useCardOperations', () => {
  const mockSetPhase = vi.fn();
  const mockSetDetectionResults = vi.fn();
  const mockSetSelectedCards = vi.fn();
  const mockSetCreatedCards = vi.fn();
  const mockClearSession = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('startDetection', () => {
    it('should start detection process successfully', async () => {
      const mockImages: UploadedImage[] = [
        { id: '1', file: new File([], 'test1.jpg'), preview: 'blob:test1' },
        { id: '2', file: new File([], 'test2.jpg'), preview: 'blob:test2' },
      ];

      const mockDetectionResults = [
        {
          sessionId: 'session-123',
          originalImage: mockImages[0].file,
          detectedCards: [createMockDetectedCard('card-1')],
          processingTime: 500,
          totalDetected: 1,
        },
      ];

      (detectCardsInImages as any).mockResolvedValue(mockDetectionResults);

      const { result } = renderHook(() => useCardOperations());

      await act(async () => {
        await result.current.startDetection(
          mockImages,
          mockSetPhase,
          mockSetDetectionResults,
          mockSetSelectedCards
        );
      });

      expect(mockSetPhase).toHaveBeenCalledWith('detecting');
      expect(mockToast.loading).toHaveBeenCalledWith('Detecting cards in images...');
      expect(detectCardsInImages).toHaveBeenCalledWith([mockImages[0].file, mockImages[1].file]);
      expect(mockSetDetectionResults).toHaveBeenCalledWith(mockDetectionResults);
      expect(mockSetSelectedCards).toHaveBeenCalledWith(new Set(['card-1']));
      expect(mockToast.dismiss).toHaveBeenCalled();
      expect(mockToast.success).toHaveBeenCalledWith('Detected 1 cards across 1 images');
      expect(mockSetPhase).toHaveBeenCalledWith('reviewing');
    });

    it('should handle detection failure', async () => {
      const mockImages: UploadedImage[] = [
        { id: '1', file: new File([], 'test.jpg'), preview: 'blob:test' },
      ];

      const error = new Error('Detection failed');
      (detectCardsInImages as any).mockRejectedValue(error);

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const { result } = renderHook(() => useCardOperations());

      await act(async () => {
        await result.current.startDetection(
          mockImages,
          mockSetPhase,
          mockSetDetectionResults,
          mockSetSelectedCards
        );
      });

      expect(mockSetPhase).toHaveBeenCalledWith('detecting');
      expect(consoleSpy).toHaveBeenCalledWith('Detection failed:', error);
      expect(mockToast.dismiss).toHaveBeenCalled();
      expect(mockToast.error).toHaveBeenCalledWith('Card detection failed');
      expect(mockSetPhase).toHaveBeenCalledWith('idle');

      consoleSpy.mockRestore();
    });
  });

  describe('createSelectedCards', () => {
    it('should create selected cards successfully', async () => {
      const mockDetectionResults = [
        {
          sessionId: 'session-123',
          originalImage: new File([], 'test.jpg'),
          detectedCards: [
            {
              ...createMockDetectedCard('card-1'),
              metadata: { 
                detectedAt: new Date('2024-01-01T00:00:00.000Z'),
                processingTime: 500,
                cardType: 'Pokemon' 
              },
            },
            {
              ...createMockDetectedCard('card-2'),
              metadata: { 
                detectedAt: new Date('2024-01-01T00:00:00.000Z'),
                processingTime: 500,
                cardType: 'Magic' 
              },
            },
          ],
          processingTime: 500,
          totalDetected: 2,
        },
      ];

      const selectedCards = new Set(['card-1']);

      const { result } = renderHook(() => useCardOperations());

      await act(async () => {
        await result.current.createSelectedCards(
          mockDetectionResults,
          selectedCards,
          mockSetPhase,
          mockSetCreatedCards,
          mockClearSession
        );
      });

      expect(mockSetPhase).toHaveBeenCalledWith('creating');
      expect(mockToast.loading).toHaveBeenCalledWith('Creating cards...');
      expect(mockSetCreatedCards).toHaveBeenCalledWith(expect.any(Function));
      expect(mockToast.success).toHaveBeenCalledWith('Created 1 cards and saved to collection!');
      expect(mockSetPhase).toHaveBeenCalledWith('complete');
    });

    it('should handle no selected cards', async () => {
      const mockDetectionResults: any[] = [];
      const selectedCards = new Set<string>();

      const { result } = renderHook(() => useCardOperations());

      await act(async () => {
        await result.current.createSelectedCards(
          mockDetectionResults,
          selectedCards,
          mockSetPhase,
          mockSetCreatedCards,
          mockClearSession
        );
      });

      expect(mockToast.error).toHaveBeenCalledWith('Please select at least one card');
      expect(mockSetPhase).not.toHaveBeenCalled();
    });

    it('should handle card creation failure', async () => {
      const mockDetectionResults = [
        {
          sessionId: 'session-123',
          originalImage: new File([], 'test.jpg'),
          detectedCards: [
            {
              ...createMockDetectedCard('card-1'),
              metadata: { 
                detectedAt: new Date('2024-01-01T00:00:00.000Z'),
                processingTime: 500,
                cardType: 'Pokemon' 
              },
            }
          ],
          processingTime: 500,
          totalDetected: 1,
        },
      ];

      const selectedCards = new Set(['card-1']);

      // Mock localStorage to throw an error
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('Storage error');
      });

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const { result } = renderHook(() => useCardOperations());

      await act(async () => {
        await result.current.createSelectedCards(
          mockDetectionResults,
          selectedCards,
          mockSetPhase,
          mockSetCreatedCards,
          mockClearSession
        );
      });

      expect(consoleSpy).toHaveBeenCalledWith('Card creation failed:', expect.any(Error));
      expect(mockToast.error).toHaveBeenCalledWith('Failed to create cards');

      consoleSpy.mockRestore();
    });
  });
});
