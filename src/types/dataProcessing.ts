
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

export interface ProcessedData {
  eeg: any[];
  audio: any[];
  text?: any[];
}

export interface Features {
  eeg_128: number[][];
  eeg_3: number[][];
  audio: number[][];
}

export interface Prediction {
  label: string;
  probability: number;
  severity: number;
  confidence: number;
}

export interface Explanation {
  feature_importance: Record<string, number>;
  attention_weights: {
    eeg: number;
    audio: number;
    text?: number;
  };
}

export interface ProcessingResult {
  error?: string;
  prediction?: Prediction;
  explanation?: Explanation;
  features?: {
    eeg_128: number[][];
    eeg_3: number[][];
    audio: number[][];
  };
  fusionType?: string;
  modelPerformance?: ModelPerformanceMetrics;
}

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
