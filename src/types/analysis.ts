
export interface EEGData {
  alpha: number[];
  beta: number[];
  gamma: number[];
  delta: number[];
  theta: number[];
  timestamp: number[];
}

export interface AudioFeatures {
  mfcc: number[][];
  zeroCrossingRate: number[];
  spectrogram: number[][];
}

export interface TextAnalysis {
  sentiment: number;
  emotions: {
    joy: number;
    sadness: number;
    anger: number;
    fear: number;
    surprise: number;
  };
  embeddings: number[][];
}

export interface VisualFeatures {
  facialLandmarks: number[][];
  expressions: {
    happy: number;
    sad: number;
    angry: number;
    fearful: number;
    surprised: number;
    neutral: number;
  };
}

export interface ModelOutput {
  prediction: {
    label: string;
    probability: number;
  };
  severity: number;
  confidence: number;
  attention: {
    eeg: number;
    audio: number;
    text: number;
    visual: number;
  };
  featureImportance: Record<string, number>;
}

export interface RecommendationOutput {
  therapyRecommendations: {
    type: string;
    confidence: number;
    description: string;
  }[];
  specialistReferrals: {
    type: string;
    urgency: number;
    reason: string;
  }[];
  wellnessTips: {
    title: string;
    content: string;
    relevance: number;
  }[];
}

export interface ModelPerformanceMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  specificity: number;
  robustnessIndex: number;
  gpuUsage: number;
  inferenceTime: number;
  flops: number;
  // Extended metrics for advanced visualizations
  crossValidationVariance?: number;
  noiseSensitivity?: number;
  demographicBias?: number;
  datasetGeneralization?: number;
  confidenceInterval?: number;
  powerConsumption?: number;
  cloudDeploymentReadiness?: number;
  edgeDeviceCompatibility?: number;
  falsePositiveRate?: number;
}

export interface FusionLayerWeights {
  eeg: number;
  audio: number;
  text?: number;
  visual?: number;
}

export interface ModelArchitecture {
  inputLayers: {
    name: string;
    shape: number[];
    type: string;
  }[];
  hiddenLayers: {
    name: string;
    units: number;
    activation: string;
    dropoutRate?: number;
  }[];
  outputLayer: {
    units: number;
    activation: string;
    classes: string[];
  };
}

export interface TrainingMetrics {
  epochs: number;
  batchSize: number;
  learningRate: number;
  optimizer: string;
  finalLoss: number;
  finalAccuracy: number;
  trainingTime: number; // in seconds
  earlyStoppingEpoch?: number;
}

export interface DeepLearningModelConfig {
  architecture: ModelArchitecture;
  trainingMetrics: TrainingMetrics;
  parameterCount: number;
  flops: number;
}

export interface AttentionMechanism {
  type: 'self' | 'cross' | 'multi-head';
  heads?: number;
  keyDimension?: number;
  valueDimension?: number;
  attentionDropout?: number;
  attentionMap?: Record<string, number>;
}

export interface FusionStrategy {
  type: 'Early' | 'Late' | 'Attention' | 'Hybrid';
  weights?: FusionLayerWeights;
  attentionMechanism?: AttentionMechanism;
  modalityContributions?: Record<string, number>;
}
