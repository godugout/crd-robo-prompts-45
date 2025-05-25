
import { env } from '@huggingface/transformers';

// Configure transformers.js with stricter limits
env.allowLocalModels = false;
env.useBrowserCache = true;
env.backends.onnx.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.5.1/dist/';

export const DETECTION_CONFIG = {
  MAX_IMAGE_DIMENSION: 800,
  MAX_PROCESSING_TIME: 15000,
  MAX_REGIONS_TO_PROCESS: 50,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MIN_CARD_AREA_RATIO: 0.02,
  MAX_CARD_AREA_RATIO: 0.25,
  BACKGROUND_REMOVAL_TIMEOUT: 8000,
  FACE_DETECTION_TIMEOUT: 3000,
  TARGET_ASPECT_RATIO: 2.5 / 3.5,
  ASPECT_TOLERANCE: 0.15,
  OVERLAP_THRESHOLD: 0.25,
  MAX_FINAL_RESULTS: 12
};
