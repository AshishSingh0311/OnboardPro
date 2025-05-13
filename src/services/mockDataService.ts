import { 
  EEGData, 
  AudioFeatures, 
  TextAnalysis, 
  VisualFeatures, 
  ModelOutput, 
  RecommendationOutput,
  ModelPerformanceMetrics
} from '@/types/analysis';

// Generate random number between min and max (inclusive)
const randomNumber = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

// Generate array of random numbers
const randomArray = (length: number, min: number, max: number): number[] => {
  return Array.from({ length }, () => randomNumber(min, max));
};

// Generate 2D array of random numbers
const random2DArray = (rows: number, cols: number, min: number, max: number): number[][] => {
  return Array.from({ length: rows }, () => randomArray(cols, min, max));
};

// Generate mock EEG data
export const getMockEEGData = (): EEGData => {
  const dataLength = 100;
  return {
    alpha: randomArray(dataLength, 0, 1),
    beta: randomArray(dataLength, 0, 1),
    gamma: randomArray(dataLength, 0, 1),
    delta: randomArray(dataLength, 0, 1),
    theta: randomArray(dataLength, 0, 1),
    timestamp: Array.from({ length: dataLength }, (_, i) => i),
  };
};

// Generate mock audio features
export const getMockAudioFeatures = (): AudioFeatures => {
  return {
    mfcc: random2DArray(13, 50, -100, 100),
    zeroCrossingRate: randomArray(100, 0, 0.2),
    spectrogram: random2DArray(128, 50, 0, 255),
  };
};

// Generate mock text analysis
export const getMockTextAnalysis = (): TextAnalysis => {
  return {
    sentiment: randomNumber(-1, 1),
    emotions: {
      joy: randomNumber(0, 1),
      sadness: randomNumber(0, 1),
      anger: randomNumber(0, 1),
      fear: randomNumber(0, 1),
      surprise: randomNumber(0, 1),
    },
    embeddings: random2DArray(5, 768, -1, 1),
  };
};

// Generate mock visual features
export const getMockVisualFeatures = (): VisualFeatures => {
  return {
    facialLandmarks: random2DArray(68, 2, 0, 1),
    expressions: {
      happy: randomNumber(0, 1),
      sad: randomNumber(0, 1),
      angry: randomNumber(0, 1),
      fearful: randomNumber(0, 1),
      surprised: randomNumber(0, 1),
      neutral: randomNumber(0, 1),
    },
  };
};

// Generate mock model output
export const getMockModelOutput = (): ModelOutput => {
  const conditions = [
    "Major Depressive Disorder",
    "Generalized Anxiety Disorder",
    "Bipolar Disorder",
    "Social Anxiety Disorder",
    "Post-Traumatic Stress Disorder",
    "No Significant Condition"
  ];
  
  const randomIndex = Math.floor(Math.random() * conditions.length);
  
  return {
    prediction: {
      label: conditions[randomIndex],
      probability: randomNumber(0.6, 0.95),
    },
    severity: randomNumber(1, 10),
    confidence: randomNumber(0.7, 0.99),
    attention: {
      eeg: randomNumber(0, 1),
      audio: randomNumber(0, 1),
      text: randomNumber(0, 1),
      visual: randomNumber(0, 1),
    },
    featureImportance: {
      'alpha_power_frontal': randomNumber(0, 1),
      'speech_rate': randomNumber(0, 1),
      'negative_sentiment': randomNumber(0, 1),
      'facial_expressions_sad': randomNumber(0, 1),
      'theta_power_temporal': randomNumber(0, 1),
      'voice_energy': randomNumber(0, 1),
      'text_anxiety_markers': randomNumber(0, 1),
      'eye_movement_patterns': randomNumber(0, 1),
    },
  };
};

// Generate mock recommendations
export const getMockRecommendations = (modelOutput: ModelOutput): RecommendationOutput => {
  const therapyTypes = [
    { type: "Cognitive Behavioral Therapy", description: "Focuses on identifying and challenging negative thought patterns." },
    { type: "Mindfulness-Based Therapy", description: "Combines mindfulness practices with traditional therapeutic approaches." },
    { type: "Interpersonal Therapy", description: "Addresses interpersonal issues and communication patterns." },
    { type: "Dialectical Behavior Therapy", description: "Combines cognitive strategies with mindfulness practices." },
  ];
  
  const specialistTypes = [
    { type: "Psychiatrist", reason: "May benefit from medication evaluation." },
    { type: "Clinical Psychologist", reason: "For advanced psychological assessment." },
    { type: "Neuropsychologist", reason: "For cognitive function evaluation." },
    { type: "Social Worker", reason: "For community resource support and counseling." },
  ];
  
  const wellnessTips = [
    { title: "Daily Mindfulness", content: "Practice 5-minute mindfulness meditation daily." },
    { title: "Sleep Hygiene", content: "Maintain consistent sleep schedule and create a relaxing bedtime routine." },
    { title: "Physical Activity", content: "Engage in moderate exercise for at least 30 minutes daily." },
    { title: "Social Connection", content: "Reach out to supportive friends or family members regularly." },
    { title: "Nature Exposure", content: "Spend time outdoors in natural settings when possible." },
  ];
  
  // Select random therapy recommendations
  const numTherapies = Math.floor(randomNumber(1, 3));
  const shuffledTherapies = [...therapyTypes].sort(() => 0.5 - Math.random());
  const selectedTherapies = shuffledTherapies.slice(0, numTherapies).map(therapy => ({
    ...therapy,
    confidence: randomNumber(0.7, 0.95)
  }));
  
  // Select random specialist referrals
  const numSpecialists = Math.floor(randomNumber(1, 3));
  const shuffledSpecialists = [...specialistTypes].sort(() => 0.5 - Math.random());
  const selectedSpecialists = shuffledSpecialists.slice(0, numSpecialists).map(specialist => ({
    ...specialist,
    urgency: randomNumber(1, 10)
  }));
  
  // Select random wellness tips
  const numTips = Math.floor(randomNumber(2, 4));
  const shuffledTips = [...wellnessTips].sort(() => 0.5 - Math.random());
  const selectedTips = shuffledTips.slice(0, numTips).map(tip => ({
    ...tip,
    relevance: randomNumber(0.6, 1.0)
  }));
  
  return {
    therapyRecommendations: selectedTherapies,
    specialistReferrals: selectedSpecialists,
    wellnessTips: selectedTips
  };
};

// Generate mock model performance metrics
export const getMockModelPerformanceMetrics = (): ModelPerformanceMetrics => {
  return {
    accuracy: randomNumber(0.91, 0.95),
    precision: randomNumber(0.89, 0.94),
    recall: randomNumber(0.92, 0.95),
    f1Score: randomNumber(0.90, 0.94),
    specificity: randomNumber(0.94, 0.97),
    robustnessIndex: randomNumber(0.92, 0.96),
    gpuUsage: randomNumber(30, 32), // percentage
    inferenceTime: randomNumber(30, 45), // milliseconds
    flops: randomNumber(1, 5) * 1e9, // GFLOPs
    // Extended metrics for advanced visualizations
    crossValidationVariance: randomNumber(0.012, 0.018),
    noiseSensitivity: randomNumber(0.03, 0.045),
    demographicBias: randomNumber(0.008, 0.013),
    datasetGeneralization: randomNumber(0.02, 0.029),
    confidenceInterval: randomNumber(0.009, 0.012),
    powerConsumption: randomNumber(4.8, 5.2),
    cloudDeploymentReadiness: randomNumber(0.981, 0.995),
    edgeDeviceCompatibility: randomNumber(0.925, 0.96),
    falsePositiveRate: randomNumber(0.035, 0.055)
  };
};

// Simulates the full prediction pipeline
export const runFullAnalysis = async () => {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const eegData = getMockEEGData();
  const audioFeatures = getMockAudioFeatures();
  const textAnalysis = getMockTextAnalysis();
  const visualFeatures = getMockVisualFeatures();
  const modelOutput = getMockModelOutput();
  const recommendations = getMockRecommendations(modelOutput);
  const performanceMetrics = getMockModelPerformanceMetrics();
  
  return {
    eegData,
    audioFeatures,
    textAnalysis,
    visualFeatures,
    modelOutput,
    recommendations,
    performanceMetrics
  };
};
