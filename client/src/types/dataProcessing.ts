/**
 * Represents a MODMA dataset structure for mental health analysis
 */
export interface ModmaDataset {
  metadata: {
    format_version: string;
    data_quality: {
      completeness: number;
      consistency: number;
    };
    subject?: {
      id: string;
      age?: number;
      gender?: string;
    };
    recording?: {
      date: string;
      duration_seconds: number;
      device_info: {
        eeg: string;
        audio: string;
      };
    };
  };
  eeg_data: any[];
  audio_data: any[];
  text_data?: any[];
}

/**
 * Represents preprocessed data ready for feature extraction
 */
export interface ProcessedData {
  eeg: any[];
  audio: any[];
  text?: any[];
}

/**
 * Represents extracted features from different modalities
 */
export interface Features {
  eeg_128: number[][];
  eeg_3: number[][];
  audio: number[][];
}

/**
 * Represents a model prediction
 */
export interface Prediction {
  label: string;
  probability: number;
  severity: number;
  confidence: number;
}

/**
 * Represents an explanation of the model's prediction
 */
export interface Explanation {
  feature_importance: Record<string, number>;
  attention_weights: {
    eeg: number;
    audio: number;
    text?: number;
    visual?: number;
  };
}

/**
 * Represents the result of processing a dataset
 */
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

/**
 * Represents performance metrics for the model
 */
export interface ModelPerformanceMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  specificity: number;
  robustnessIndex: number;
  inferenceTime: number;
  falsePositiveRate?: number;
  crossValidationVariance?: number;
  noiseSensitivity?: number;
  demographicBias?: number;
  gpuUsage?: number;
  flops?: number;
  powerConsumption?: number;
  cloudDeploymentReadiness?: number;
  edgeDeviceCompatibility?: number;
  datasetGeneralization?: number;
  confidenceInterval?: number;
}