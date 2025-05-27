
// Web Worker for card detection to prevent UI blocking
self.onmessage = async function(e) {
  const { type, data } = e.data;
  
  switch (type) {
    case 'PROCESS_BATCH':
      await processBatch(data);
      break;
    case 'CANCEL_PROCESSING':
      // Handle cancellation
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
      
      // Simulate card detection (replace with actual detection logic)
      const detectionResult = await simulateCardDetection(file, sessionId);
      results.push(detectionResult);
      
      // Small delay to prevent overwhelming the main thread
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      self.postMessage({
        type: 'BATCH_ERROR',
        data: {
          batchId,
          fileName: file.name,
          error: error.message
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

async function simulateCardDetection(file: File, sessionId: string) {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));
  
  // Mock detection result
  return {
    sessionId,
    originalImage: file,
    detectedCards: [
      {
        id: `${sessionId}_${file.name}_${Date.now()}`,
        confidence: 0.8 + Math.random() * 0.2,
        originalImageId: file.name,
        originalImageUrl: URL.createObjectURL(file),
        croppedImageUrl: URL.createObjectURL(file),
        bounds: { x: 50, y: 50, width: 200, height: 280 },
        metadata: {
          detectedAt: new Date(),
          processingTime: Math.random() * 2000 + 1000,
          cardType: ['Pokemon', 'Magic', 'Yu-Gi-Oh'][Math.floor(Math.random() * 3)]
        }
      }
    ],
    processingTime: Math.random() * 2000 + 1000,
    totalDetected: 1
  };
}
