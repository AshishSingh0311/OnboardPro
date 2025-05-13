/**
 * The MODMA (Multimodal Open Dataset for Mental health Analysis) dataset structure
 */
export interface ModmaDataset {
  metadata: {
    format_version: string;
    data_quality: {
      completeness: number;
      consistency: number;
    };
  };
  eeg_data: any[];
  audio_data: any[];
  text_data?: any[];
}

/**
 * Processed data structure after initial preprocessing
 */
export interface ProcessedData {
  eeg: any[];
  audio: any[];
  text?: any[];
}

/**
 * Extracted features from the processed data
 */
export interface Features {
  eeg_128: any;  // Full feature set for EEG
  eeg_3: any;    // Simplified 3-band features (alpha, beta, theta)
  audio: any;
}

/**
 * Prediction output from the model
 */
export interface Prediction {
  label: string;
  probability: number;
  severity: number;
  confidence: number;
}

/**
 * Explanation of the model's decision
 */
export interface Explanation {
  feature_importance: Record<string, number>;
  attention_weights: {
    eeg: number;
    audio: number;
    text?: number;
  };
}

/**
 * Result from the data processing pipeline
 */
export interface ProcessingResult {
  error?: string;
  prediction?: Prediction;
  explanation?: Explanation;
  features?: Features;
  fusionType?: string;
  modelPerformance?: ModelPerformanceMetrics;
}

/**
 * Performance metrics for the model
 */
export interface ModelPerformanceMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  specificity: number;
  robustnessIndex: number;
  falsePositiveRate?: number;
  crossValidationVariance?: number;
  noiseSensitivity?: number;
  demographicBias?: number;
  inferenceTime: number;
}