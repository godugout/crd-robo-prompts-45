
import { beforeAll, vi } from 'vitest';

// Mock React Testing Library
beforeAll(() => {
  // Mock Date.now for consistent timestamps in tests
  const mockDate = new Date('2024-01-01T00:00:00.000Z');
  vi.setSystemTime(mockDate);
});

// Global test utilities
export const createMockFile = (name: string = 'test.jpg', type: string = 'image/jpeg'): File => {
  return new File(['test content'], name, { type });
};

export const createMockUploadedImage = (id: string = '1'): any => ({
  id,
  file: createMockFile(`test${id}.jpg`),
  preview: `blob:test${id}`,
});

export const createMockDetectedCard = (id: string = 'card-1'): any => ({
  id,
  confidence: 0.9,
  originalImageId: '1',
  croppedImageUrl: `blob:cropped${id}`,
  bounds: { x: 0, y: 0, width: 100, height: 140 },
  metadata: { cardType: 'Pokemon' },
});
