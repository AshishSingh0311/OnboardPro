// Mock data service for the MindBloom AI application
// This service provides mock data for development and testing

// Model output types
export interface ModelPrediction {
  label: string;
  probability: number;
}

export interface ModelAttention {
  eeg: number;
  audio: number;
  text: number;
  visual: number;
}

export interface ModelOutput {
  prediction: ModelPrediction;
  severity: number;
  confidence: number;
  attention: ModelAttention;
  featureImportance: Record<string, number>;
}

// EEG data structure
export interface EEGData {
  alpha: number[];
  beta: number[];
  gamma: number[];
  delta: number[];
  theta: number[];
  timestamp: number[];
}

// Audio features
export interface AudioFeatures {
  mfcc: number[][];
  zeroCrossingRate: number[];
  spectralCentroid: number[];
  spectralRolloff: number[];
  spectralFlux: number[];
  chroma: number[][];
}

// Text analysis
export interface TextAnalysis {
  sentiment: number;
  emotions: {
    joy: number;
    sadness: number;
    anger: number;
    fear: number;
    surprise: number;
  };
  topics: Record<string, number>;
  keyPhrases: string[];
  bertEmbeddings: number[][];
}

// Visual features
export interface VisualFeatures {
  expressions: {
    happy: number;
    sad: number;
    angry: number;
    fearful: number;
    surprised: number;
    neutral: number;
  };
  eyeMovements: {
    fixations: number;
    saccades: number;
    dwellTime: number;
  };
  facialKeypoints: number[][];
  visualDescriptors: number[][];
}

// Performance metrics
export interface PerformanceMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  specificity: number;
  robustnessIndex: number;
  gpuUsage: number;
  inferenceTime: number;
  flops: number;
}

// Therapy recommendations
export interface TherapyRecommendation {
  type: string;
  description: string;
  confidence: number;
  expectedBenefits?: string[];
}

// Specialist referrals
export interface SpecialistReferral {
  type: string;
  description: string;
  urgency: number;
  rationale: string;
}

// Wellness tips
export interface WellnessTip {
  category: string;
  title: string;
  description: string;
  icon: string;
}

// Recommendations structure
export interface Recommendations {
  therapyRecommendations: TherapyRecommendation[];
  specialistReferrals: SpecialistReferral[];
  wellnessTips: WellnessTip[];
}

// Analysis result containing all data
export interface AnalysisResult {
  modelOutput: ModelOutput;
  eegData: EEGData;
  audioFeatures: AudioFeatures;
  textAnalysis: TextAnalysis;
  visualFeatures: VisualFeatures;
  performanceMetrics: PerformanceMetrics;
  recommendations: Recommendations;
}

// Generate mock EEG data
export function getMockEEGData(): EEGData {
  const timePoints = 100;
  const timestamp = Array.from({ length: timePoints }, (_, i) => i * 10);
  
  // Generate simulated brain waves with realistic patterns
  return {
    alpha: generateBrainWave(timePoints, 0.5, 0.2),
    beta: generateBrainWave(timePoints, 0.8, 0.3),
    gamma: generateBrainWave(timePoints, 0.3, 0.1),
    delta: generateBrainWave(timePoints, 0.9, 0.4),
    theta: generateBrainWave(timePoints, 0.6, 0.2),
    timestamp
  };
}

// Helper to generate brain wave patterns
function generateBrainWave(length: number, baseline: number, variance: number): number[] {
  return Array.from({ length }, () => {
    return baseline + (Math.random() * variance * 2) - variance;
  });
}

// Generate mock audio features
export function getMockAudioFeatures(): AudioFeatures {
  const frames = 50;
  const mfccCoefficients = 13;
  
  // Generate mock MFCC features (13 coefficients x 50 frames)
  const mfcc = Array.from({ length: frames }, () => 
    Array.from({ length: mfccCoefficients }, () => Math.random() * 2 - 1)
  );
  
  return {
    mfcc,
    zeroCrossingRate: Array.from({ length: frames }, () => Math.random() * 0.2),
    spectralCentroid: Array.from({ length: frames }, () => 1000 + Math.random() * 4000),
    spectralRolloff: Array.from({ length: frames }, () => 3000 + Math.random() * 5000),
    spectralFlux: Array.from({ length: frames }, () => Math.random() * 0.5),
    chroma: Array.from({ length: frames }, () => 
      Array.from({ length: 12 }, () => Math.random())
    )
  };
}

// Generate mock text analysis
export function getMockTextAnalysis(): TextAnalysis {
  const sentiment = Math.random() * 2 - 1; // Range: -1 to 1
  
  return {
    sentiment,
    emotions: {
      joy: Math.random() * (sentiment > 0 ? 0.7 : 0.3) + (sentiment > 0 ? 0.3 : 0),
      sadness: Math.random() * (sentiment < 0 ? 0.7 : 0.3) + (sentiment < 0 ? 0.3 : 0),
      anger: Math.random() * (sentiment < -0.5 ? 0.7 : 0.3),
      fear: Math.random() * (sentiment < -0.3 ? 0.7 : 0.3),
      surprise: Math.random() * 0.5
    },
    topics: {
      "anxiety": 0.72,
      "depression": 0.45,
      "stress": 0.68,
      "sleep": 0.35,
      "relationships": 0.29
    },
    keyPhrases: [
      "difficulty sleeping",
      "constant worry",
      "feeling overwhelmed",
      "trouble concentrating",
      "restlessness"
    ],
    bertEmbeddings: Array.from({ length: 5 }, () => 
      Array.from({ length: 768 }, () => Math.random() * 2 - 1)
    )
  };
}

// Generate mock visual features
export function getMockVisualFeatures(): VisualFeatures {
  return {
    expressions: {
      happy: Math.random() * 0.3,
      sad: Math.random() * 0.4 + 0.2,
      angry: Math.random() * 0.2,
      fearful: Math.random() * 0.3,
      surprised: Math.random() * 0.2,
      neutral: Math.random() * 0.5 + 0.3
    },
    eyeMovements: {
      fixations: Math.random() * 30 + 20,
      saccades: Math.random() * 15 + 10,
      dwellTime: Math.random() * 0.5 + 0.2
    },
    facialKeypoints: Array.from({ length: 68 }, () => [
      Math.random() * 640, Math.random() * 480
    ]),
    visualDescriptors: Array.from({ length: 10 }, () => 
      Array.from({ length: 128 }, () => Math.random() * 2 - 1)
    )
  };
}

// Generate mock model output
export function getMockModelOutput(): ModelOutput {
  // Mental health conditions with realistic probabilities
  const conditions = [
    { label: "Generalized Anxiety Disorder", probability: 0.82 },
    { label: "Major Depressive Disorder", probability: 0.78 },
    { label: "Bipolar Disorder", probability: 0.65 },
    { label: "Post-Traumatic Stress Disorder", probability: 0.73 },
    { label: "Social Anxiety Disorder", probability: 0.81 },
    { label: "Obsessive-Compulsive Disorder", probability: 0.67 }
  ];
  
  // Randomly select a condition
  const predictionIndex = Math.floor(Math.random() * conditions.length);
  const prediction = conditions[predictionIndex];
  
  // Generate severity (0-10 scale)
  const severity = Math.random() * 10;
  
  // Generate confidence level (0-1)
  const confidence = 0.7 + Math.random() * 0.25;
  
  // Generate attention weights for each modality
  const attention = {
    eeg: 0.3 + Math.random() * 0.7,
    audio: 0.3 + Math.random() * 0.7,
    text: 0.3 + Math.random() * 0.7,
    visual: 0.3 + Math.random() * 0.7
  };
  
  // Generate feature importance scores
  const featureImportance: Record<string, number> = {
    delta_wave_amplitude: 0.6 + Math.random() * 0.3,
    speech_pause_frequency: 0.5 + Math.random() * 0.3,
    negative_text_sentiment: 0.4 + Math.random() * 0.3,
    eye_movement_patterns: 0.3 + Math.random() * 0.3,
    facial_muscle_tension: 0.4 + Math.random() * 0.3,
    theta_wave_frequency: 0.3 + Math.random() * 0.3,
    speech_rate_variation: 0.2 + Math.random() * 0.3,
    emotional_word_usage: 0.3 + Math.random() * 0.3
  };
  
  return {
    prediction,
    severity,
    confidence,
    attention,
    featureImportance
  };
}

// Generate mock performance metrics
export function getMockPerformanceMetrics(): PerformanceMetrics {
  return {
    accuracy: 0.9 + Math.random() * 0.08,
    precision: 0.88 + Math.random() * 0.1,
    recall: 0.87 + Math.random() * 0.1,
    f1Score: 0.89 + Math.random() * 0.08,
    specificity: 0.91 + Math.random() * 0.07,
    robustnessIndex: 0.75 + Math.random() * 0.2,
    gpuUsage: 20 + Math.random() * 30,
    inferenceTime: 180 + Math.random() * 70,
    flops: 3.5 + Math.random() * 1.5
  };
}

// Generate mock therapy recommendations
export function getMockTherapyRecommendations(modelOutput: ModelOutput): TherapyRecommendation[] {
  const therapies = [
    {
      type: "Cognitive Behavioral Therapy (CBT)",
      description: "A structured, present-oriented psychotherapy directed toward solving current problems and modifying dysfunctional thinking and behavior.",
      expectedBenefits: [
        "Reduction in primary symptom severity",
        "Development of adaptive coping strategies",
        "Improved emotional regulation capacity",
        "Enhanced resilience to stressors"
      ]
    },
    {
      type: "Mindfulness-Based Stress Reduction",
      description: "A program that uses mindfulness meditation to help patients become more aware of their reactions to stressors and develop healthier coping strategies.",
      expectedBenefits: [
        "Decreased rumination and worry",
        "Increased present-moment awareness",
        "Improved emotional regulation",
        "Enhanced stress management skills"
      ]
    },
    {
      type: "Acceptance and Commitment Therapy",
      description: "A therapy that teaches mindfulness skills to help patients accept difficult thoughts and feelings and commit to behavior change aligned with personal values.",
      expectedBenefits: [
        "Greater psychological flexibility",
        "Reduced experiential avoidance",
        "Increased value-aligned behavior",
        "Improved quality of life"
      ]
    },
    {
      type: "Dialectical Behavior Therapy",
      description: "A therapy that combines standard cognitive-behavioral techniques with concepts of mindful awareness, distress tolerance, and acceptance.",
      expectedBenefits: [
        "Enhanced emotional regulation",
        "Improved interpersonal effectiveness",
        "Better distress tolerance",
        "Reduced self-destructive behaviors"
      ]
    }
  ];
  
  // Adjust confidence based on model output
  return therapies.map(therapy => ({
    ...therapy,
    confidence: 0.5 + Math.random() * 0.45
  })).sort((a, b) => b.confidence - a.confidence);
}

// Generate mock specialist referrals
export function getMockSpecialistReferrals(): SpecialistReferral[] {
  return [
    {
      type: "Psychiatrist",
      description: "For medication evaluation and management",
      urgency: 5 + Math.random() * 4,
      rationale: "Symptom severity suggests potential benefit from pharmacological intervention alongside psychotherapy."
    },
    {
      type: "Clinical Psychologist",
      description: "For specialized cognitive-behavioral therapy",
      urgency: 4 + Math.random() * 3,
      rationale: "The pattern of cognitive distortions would benefit from structured cognitive-behavioral approach."
    },
    {
      type: "Neuropsychologist",
      description: "For comprehensive cognitive assessment",
      urgency: 2 + Math.random() * 3,
      rationale: "EEG patterns suggest potential cognitive impacts that warrant detailed neuropsychological evaluation."
    },
    {
      type: "Sleep Specialist",
      description: "For sleep evaluation and treatment",
      urgency: 3 + Math.random() * 3,
      rationale: "Self-reported sleep disturbances and delta/theta wave patterns suggest sleep architecture disruption."
    }
  ];
}

// Generate mock wellness tips
export function getMockWellnessTips(): WellnessTip[] {
  return [
    {
      category: "Meditation",
      title: "Meditation Practice",
      description: "Daily 10-minute guided meditation focused on anxiety reduction and present-moment awareness.",
      icon: "self_improvement"
    },
    {
      category: "Exercise",
      title: "Physical Exercise",
      description: "Moderate aerobic exercise 3-4 times weekly for 30 minutes has been shown to reduce anxiety symptoms.",
      icon: "directions_run"
    },
    {
      category: "Sleep",
      title: "Sleep Hygiene",
      description: "Establish consistent sleep and wake times, avoid screens 1 hour before bed, and create a restful environment.",
      icon: "nightlight"
    },
    {
      category: "Nutrition",
      title: "Anti-Inflammatory Diet",
      description: "Focus on omega-3 rich foods, colorful vegetables, and limiting processed foods to support brain health.",
      icon: "restaurant"
    },
    {
      category: "Social",
      title: "Social Connection",
      description: "Schedule regular social interactions, even brief ones, to combat isolation and provide emotional support.",
      icon: "group"
    }
  ];
}

// Generate mock recommendations
export function getMockRecommendations(modelOutput: ModelOutput): Recommendations {
  return {
    therapyRecommendations: getMockTherapyRecommendations(modelOutput),
    specialistReferrals: getMockSpecialistReferrals(),
    wellnessTips: getMockWellnessTips()
  };
}

// Run a full mock analysis
export async function runFullAnalysis(): Promise<AnalysisResult> {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const modelOutput = getMockModelOutput();
  
  return {
    modelOutput,
    eegData: getMockEEGData(),
    audioFeatures: getMockAudioFeatures(),
    textAnalysis: getMockTextAnalysis(),
    visualFeatures: getMockVisualFeatures(),
    performanceMetrics: getMockPerformanceMetrics(),
    recommendations: getMockRecommendations(modelOutput)
  };
}
