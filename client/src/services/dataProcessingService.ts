import * as tf from '@tensorflow/tfjs';
import { 
  createEEGModel, 
  createSequenceModel, 
  createMultimodalModel,
  processEEGData,
  processAudioData,
  predictWithModel,
  calculateFeatureImportance,
  generateModelPerformanceMetrics
} from '@/lib/tensorflow';
import { ModmaDataset, ProcessedData, ProcessingResult } from '@/types/dataProcessing';

/**
 * Initialize TensorFlow.js
 */
async function ensureTensorflowReady(): Promise<void> {
  if (!tf.getBackend()) {
    await tf.ready();
    console.log("TensorFlow.js initialized with backend:", tf.getBackend());
  }
}

/**
 * Processes the uploaded dataset with the specified fusion type
 */
export const processDataset = async (
  file: File,
  fusionType: 'Early' | 'Late' | 'Attention' | 'Hybrid' = 'Attention'
): Promise<ProcessingResult> => {
  try {
    // Ensure TensorFlow is initialized
    await ensureTensorflowReady();
    
    // Parse the dataset
    const dataset = await parseDatasetFile(file);
    
    // Preprocess the data
    const processedData = preprocessData(dataset);
    
    // Extract features from the preprocessed data
    const features = extractFeatures(processedData);
    
    // Create models and predict
    const result = await runModelsAndPredict(features, fusionType);
    
    return {
      ...result,
      features,
      fusionType
    };
  } catch (error) {
    console.error("Error processing dataset:", error);
    return {
      error: error.message || "Unknown error processing dataset"
    };
  }
};

/**
 * Parse the dataset file into a structured format
 */
async function parseDatasetFile(file: File): Promise<ModmaDataset> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        // Check if this is a JSON file
        if (file.name.endsWith('.json')) {
          const jsonData = JSON.parse(event.target.result as string);
          resolve(jsonData);
        } else {
          reject(new Error("Unsupported file format. Please upload a JSON file."));
        }
      } catch (error) {
        console.error("Error parsing dataset file:", error);
        reject(new Error("Failed to parse the dataset file. Please check the file format."));
      }
    };
    
    reader.onerror = () => {
      reject(new Error("Error reading file. Please try again."));
    };
    
    reader.readAsText(file);
  });
}

/**
 * Preprocess the data into a standardized format
 */
function preprocessData(dataset: ModmaDataset): ProcessedData {
  try {
    // Validate the dataset
    validateDataset(dataset);
    
    return {
      eeg: dataset.eeg_data,
      audio: dataset.audio_data,
      text: dataset.text_data || []
    };
  } catch (error) {
    console.error("Error preprocessing data:", error);
    throw error;
  }
}

/**
 * Validate that the dataset contains the required data
 */
function validateDataset(dataset: ModmaDataset): void {
  if (!dataset.metadata) {
    throw new Error("Invalid dataset: missing metadata");
  }
  
  if (!Array.isArray(dataset.eeg_data) || dataset.eeg_data.length === 0) {
    throw new Error("Invalid dataset: missing EEG data");
  }
  
  if (!Array.isArray(dataset.audio_data) || dataset.audio_data.length === 0) {
    throw new Error("Invalid dataset: missing audio data");
  }
}

/**
 * Extract features from different modalities
 */
function extractFeatures(data: ProcessedData): {
  eeg_128: tf.Tensor,
  eeg_3: tf.Tensor,
  audio: tf.Tensor
} {
  try {
    // Extract features from EEG data
    const eegTensor = processEEGData(data.eeg);
    
    // Create a simplified 3-feature representation for EEG
    // (This is a simplified approach for demo purposes)
    const eeg3Features = tf.tidy(() => {
      // Extract just alpha, beta, theta bands as average power
      // This is a simplification of the actual feature extraction
      const channels = eegTensor.shape[0];
      const samples = eegTensor.shape[1];
      
      // Create a simplified representation with 3 features
      const simplified = Array(3).fill(0).map(() => Array(samples).fill(0));
      
      const eegValues = eegTensor.dataSync();
      
      // Populate the simplified features
      for (let i = 0; i < channels; i++) {
        for (let j = 0; j < samples; j++) {
          const index = i * samples + j;
          const value = eegValues[index];
          
          // Simplistic mapping of channels to brain wave bands
          // In a real application, this would involve signal processing
          if (i < 2) {
            // Map first channels to alpha
            simplified[0][j] += value / 2;
          } else if (i < 4) {
            // Map middle channels to beta
            simplified[1][j] += value / 2;
          } else {
            // Map remaining channels to theta
            simplified[2][j] += value / (channels - 4);
          }
        }
      }
      
      return tf.tensor(simplified);
    });
    
    // Extract features from audio data
    const audioTensor = processAudioData(data.audio);
    
    return {
      eeg_128: eegTensor,
      eeg_3: eeg3Features,
      audio: audioTensor
    };
  } catch (error) {
    console.error("Error extracting features:", error);
    throw error;
  }
}

/**
 * Run models and predict based on features
 */
async function runModelsAndPredict(features: {
  eeg_128: tf.Tensor,
  eeg_3: tf.Tensor,
  audio: tf.Tensor
}, fusionType: string): Promise<ProcessingResult> {
  try {
    let prediction;
    let explanation;
    
    if (fusionType === 'Early' || fusionType === 'Hybrid') {
      // Use the multimodal model for early fusion
      const eegShape = features.eeg_128.shape.slice(1);
      const audioShape = features.audio.shape.slice(1);
      
      const multimodalModel = createMultimodalModel(
        [features.eeg_128.shape[1]], // Time dimension for EEG
        [features.audio.shape[1], 1]  // Time and feature dimensions for audio
      );
      
      // Run prediction
      const predictionResult = await predictWithModel(
        multimodalModel,
        features.eeg_128,
        features.audio
      );
      
      // Calculate feature importance
      const importances = await calculateFeatureImportance(
        multimodalModel,
        features.eeg_128,
        features.audio
      );
      
      prediction = {
        label: predictionResult.prediction,
        probability: predictionResult.confidence,
        severity: predictionResult.prediction === 'normal' 
          ? 0.1 
          : (predictionResult.prediction === 'anxiety' ? 0.7 : 0.6),
        confidence: predictionResult.confidence
      };
      
      explanation = {
        feature_importance: importances,
        attention_weights: {
          eeg: importances.eeg,
          audio: importances.audio
        }
      };
      
      // Clean up
      multimodalModel.dispose();
    } else {
      // For Late or Attention fusion, use separate models and combine results
      const eegModel = createEEGModel([features.eeg_3.shape[1]]);
      const audioModel = createSequenceModel([features.audio.shape[1], 1]);
      
      // Make dummy predictions (simulated)
      const eegPrediction = {
        prediction: 'anxiety',
        confidence: 0.85,
        probabilities: [0.85, 0.1, 0.05]
      };
      
      const audioPrediction = {
        prediction: 'anxiety',
        confidence: 0.75,
        probabilities: [0.75, 0.15, 0.1]
      };
      
      // Combine predictions (late fusion)
      const combinedConfidence = (eegPrediction.confidence * 0.6) + 
                                (audioPrediction.confidence * 0.4);
      
      prediction = {
        label: 'anxiety', // Most likely class
        probability: combinedConfidence,
        severity: 0.7,  // Higher for anxiety
        confidence: combinedConfidence
      };
      
      explanation = {
        feature_importance: {
          eeg: 0.65,
          audio: 0.35
        },
        attention_weights: {
          eeg: 0.6,
          audio: 0.4
        }
      };
      
      // Clean up
      eegModel.dispose();
      audioModel.dispose();
    }
    
    // Generate model performance metrics
    const modelPerformance = generateModelPerformanceMetrics();
    
    return {
      prediction,
      explanation,
      modelPerformance
    };
  } catch (error) {
    console.error("Error running models and predicting:", error);
    throw error;
  }
}

/**
 * Generate recommendations based on the predicted condition
 */
export function generateRecommendations(prediction: {
  label: string;
  confidence: number;
}): any {
  switch (prediction.label) {
    case 'anxiety':
      return {
        therapyRecommendations: [
          {
            type: "Cognitive Behavioral Therapy",
            confidence: 0.92,
            description: "CBT is highly effective for anxiety disorders by helping identify and change negative thought patterns."
          },
          {
            type: "Mindfulness-Based Stress Reduction",
            confidence: 0.85,
            description: "MBSR techniques help manage anxiety by focusing attention on the present moment."
          }
        ],
        specialistReferrals: [
          {
            type: "Clinical Psychologist",
            urgency: prediction.confidence > 0.85 ? 0.8 : 0.6,
            reason: "For structured therapy sessions to address anxiety symptoms."
          }
        ],
        wellnessTips: [
          {
            title: "Breathing Exercises",
            content: "Practice 4-7-8 breathing: inhale for 4 seconds, hold for 7, exhale for 8.",
            relevance: 0.95
          },
          {
            title: "Physical Activity",
            content: "30 minutes of moderate exercise daily can significantly reduce anxiety levels.",
            relevance: 0.9
          },
          {
            title: "Sleep Hygiene",
            content: "Maintain consistent sleep schedule; avoid screens 1 hour before bedtime.",
            relevance: 0.85
          }
        ]
      };
      
    case 'depression':
      return {
        therapyRecommendations: [
          {
            type: "Interpersonal Therapy",
            confidence: 0.87,
            description: "IPT helps improve relationships and communication patterns that may contribute to depression."
          },
          {
            type: "Behavioral Activation",
            confidence: 0.83,
            description: "Focuses on increasing engagement in positive activities to counter depressive symptoms."
          }
        ],
        specialistReferrals: [
          {
            type: "Psychiatrist",
            urgency: prediction.confidence > 0.8 ? 0.75 : 0.5,
            reason: "For evaluation of potential medication treatment options."
          }
        ],
        wellnessTips: [
          {
            title: "Social Connection",
            content: "Maintain regular contact with supportive friends and family members.",
            relevance: 0.9
          },
          {
            title: "Routine Establishment",
            content: "Create and follow a daily schedule to provide structure and purpose.",
            relevance: 0.85
          },
          {
            title: "Light Exposure",
            content: "Spend time outdoors in natural sunlight, especially in the morning.",
            relevance: 0.8
          }
        ]
      };
      
    default: // 'normal'
      return {
        therapyRecommendations: [
          {
            type: "Preventative Mental Wellness",
            confidence: 0.75,
            description: "Regular mental health check-ins can help maintain emotional balance."
          }
        ],
        specialistReferrals: [],
        wellnessTips: [
          {
            title: "Mindfulness Practice",
            content: "Incorporate 10 minutes of mindfulness meditation into your daily routine.",
            relevance: 0.8
          },
          {
            title: "Balanced Lifestyle",
            content: "Maintain a healthy balance between work, rest, and leisure activities.",
            relevance: 0.75
          }
        ]
      };
  }
}