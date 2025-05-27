
// Simplified Web Worker for card detection
self.onmessage = async function(e) {
  const { type, data } = e.data;
  
  switch (type) {
    case 'PROCESS_BATCH':
      await processBatch(data);
      break;
    case 'CANCEL_PROCESSING':
      self.postMessage({ type: 'PROCESSING_CANCELLED' });
      break;
  }
};

async function processBatch({ files, batchId, sessionId }: {
  files: File[];
  batchId: string;
  sessionId: string;
}) {
  const results = [];
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    try {
      // Post progress update
      self.postMessage({
        type: 'BATCH_PROGRESS',
        data: {
          batchId,
          current: i + 1,
          total: files.length,
          fileName: file.name
        }
      });
      
      // Simplified card detection for now
      const detectionResult = await performSimpleCardDetection(file, sessionId);
      results.push(detectionResult);
      
      // Small delay to prevent overwhelming
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.error('Card detection error:', error);
      self.postMessage({
        type: 'BATCH_ERROR',
        data: {
          batchId,
          fileName: file.name,
          error: error.message || 'Detection failed'
        }
      });
    }
  }
  
  // Post batch completion
  self.postMessage({
    type: 'BATCH_COMPLETE',
    data: {
      batchId,
      results
    }
  });
}

async function performSimpleCardDetection(file: File, sessionId: string) {
  try {
    // Create a simple mock detection result for now
    // This ensures the workflow works while we debug the actual detection
    const mockDetectedCards = [
      {
        id: `${sessionId}_${file.name}_0_${Date.now()}`,
        confidence: 0.85,
        originalImageId: file.name,
        originalImageUrl: URL.createObjectURL(file),
        croppedImageUrl: URL.createObjectURL(file), // Use original as fallback
        bounds: {
          x: 0,
          y: 0,
          width: 350,
          height: 490
        },
        metadata: {
          detectedAt: new Date(),
          processingTime: Date.now(),
          cardType: 'Trading Card'
        }
      }
    ];

    return {
      sessionId,
      originalImage: file,
      detectedCards: mockDetectedCards,
      processingTime: Date.now(),
      totalDetected: mockDetectedCards.length
    };
  } catch (error) {
    console.error('Detection failed for file:', file.name, error);
    
    return {
      sessionId,
      originalImage: file,
      detectedCards: [],
      processingTime: Date.now(),
      totalDetected: 0
    };
  }
}
