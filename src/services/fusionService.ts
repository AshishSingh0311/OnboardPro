
import { predictWithLSTM, predictWithCNN, predictWithAudioModel } from '@/services/modelPredictionService';
import * as tf from '@tensorflow/tfjs';

/**
 * Performs early fusion by concatenation of feature vectors
 */
export const concatenateFeatures = (
  eeg128Features: number[][],
  eeg3Features: number[][],
  audioFeatures: number[][]
): number[][] => {
  console.log("Performing early fusion by concatenation...");
  
  try {
    // Check that all feature sets have the same length
    if (eeg128Features.length !== eeg3Features.length || 
        eeg128Features.length !== audioFeatures.length) {
      throw new Error("Feature sets must have the same number of samples");
    }
    
    // Concatenate feature vectors for each sample
    return eeg128Features.map((_, i) => {
      // Get features for this sample
      const eeg128 = eeg128Features[i];
      const eeg3 = eeg3Features[i];
      const audio = audioFeatures[i];
      
      // Return concatenated features
      return [...eeg128, ...eeg3, ...audio];
    });
  } catch (error) {
    console.error("Error in early fusion:", error);
    // Return fallback concatenated features
    return eeg128Features.map((_, i) => [
      ...eeg128Features[i],
      ...eeg3Features[i],
      ...audioFeatures[i]
    ]);
  }
};

/**
 * Performs late fusion by weighted aggregation of model predictions
 */
export const aggregatePredictions = async (
  p1: number[][],
  p2: number[][],
  p3: number[][]
): Promise<number[][]> => {
  console.log("Performing late fusion by aggregation...");
  
  try {
    // Convert predictions to tensors
    const p1Tensor = tf.tensor2d(p1);
    const p2Tensor = tf.tensor2d(p2);
    const p3Tensor = tf.tensor2d(p3);
    
    // Define fusion weights for each model
    const w1 = 0.5; // EEG 128 model (LSTM)
    const w2 = 0.3; // EEG 3 model (CNN)
    const w3 = 0.2; // Audio model
    
    // Weight each prediction
    const weighted1 = p1Tensor.mul(tf.scalar(w1));
    const weighted2 = p2Tensor.mul(tf.scalar(w2));
    const weighted3 = p3Tensor.mul(tf.scalar(w3));
    
    // Sum the weighted predictions
    const summed = weighted1.add(weighted2).add(weighted3);
    
    // Normalize (softmax)
    const normalized = tf.softmax(summed);
    
    // Convert back to array and ensure it's a 2D array
    const result = await normalized.array() as number[][];
    
    // Clean up tensors
    p1Tensor.dispose();
    p2Tensor.dispose();
    p3Tensor.dispose();
    weighted1.dispose();
    weighted2.dispose();
    weighted3.dispose();
    summed.dispose();
    normalized.dispose();
    
    return result;
  } catch (error) {
    console.error("Error in late fusion:", error);
    // Fallback to weighted averaging
    return p1.map((_, i) => {
      return p1[i].map((val, j) => (
        val * 0.4 + p2[i][j] * 0.3 + p3[i][j] * 0.3
      ));
    });
  }
};

/**
 * Performs attention-based fusion using a simple attention mechanism
 */
export const attentionBasedFusion = async (
  eeg128Features: number[][],
  eeg3Features: number[][],
  audioFeatures: number[][]
): Promise<number[][]> => {
  console.log("Performing attention-based fusion...");
  
  try {
    // Check that all feature sets have the same length
    if (eeg128Features.length !== eeg3Features.length || 
        eeg128Features.length !== audioFeatures.length) {
      throw new Error("Feature sets must have the same number of samples");
    }
    
    // Process each sample separately
    const results: number[][] = [];
    
    for (let i = 0; i < eeg128Features.length; i++) {
      // Convert feature vectors to tensors
      const eeg128 = tf.tensor1d(eeg128Features[i]);
      const eeg3 = tf.tensor1d(eeg3Features[i]);
      const audio = tf.tensor1d(audioFeatures[i]);
      
      // Calculate attention scores
      // In a real implementation, these would be learned weights
      // Here we're using simple magnitude-based attention
      
      // Calculate magnitudes (L2 norms)
      const eeg128Mag = eeg128.norm();
      const eeg3Mag = eeg3.norm();
      const audioMag = audio.norm();
      
      // Convert to scalar values
      const eeg128MagVal = (await eeg128Mag.array()) as number;
      const eeg3MagVal = (await eeg3Mag.array()) as number;
      const audioMagVal = (await audioMag.array()) as number;
      
      // Calculate attention weights
      const total = eeg128MagVal + eeg3MagVal + audioMagVal;
      const attEEG128 = eeg128MagVal / total;
      const attEEG3 = eeg3MagVal / total;
      const attAudio = audioMagVal / total;
      
      // Calculate dimension weights based on vector density
      const dimWeights = {
        eeg128: 1.0 / eeg128Features[i].length,
        eeg3: 1.0 / eeg3Features[i].length,
        audio: 1.0 / audioFeatures[i].length
      };
      
      // Project each feature vector to common size (20) for fair comparison
      const projectionSize = 20;
      
      // Create projection matrices (simulated)
      const projEEG128 = tf.tensor2d(
        Array(projectionSize).fill(0).map(() => 
          Array(eeg128Features[i].length).fill(0).map(() => Math.random() * 0.01)
        )
      );
      
      const projEEG3 = tf.tensor2d(
        Array(projectionSize).fill(0).map(() => 
          Array(eeg3Features[i].length).fill(0).map(() => Math.random() * 0.01)
        )
      );
      
      const projAudio = tf.tensor2d(
        Array(projectionSize).fill(0).map(() => 
          Array(audioFeatures[i].length).fill(0).map(() => Math.random() * 0.01)
        )
      );
      
      // Project features to common space
      const projectedEEG128 = tf.matMul(projEEG128, eeg128.expandDims(1)).squeeze();
      const projectedEEG3 = tf.matMul(projEEG3, eeg3.expandDims(1)).squeeze();
      const projectedAudio = tf.matMul(projAudio, audio.expandDims(1)).squeeze();
      
      // Apply attention weights
      const attWeightedEEG128 = projectedEEG128.mul(tf.scalar(attEEG128 * dimWeights.eeg128));
      const attWeightedEEG3 = projectedEEG3.mul(tf.scalar(attEEG3 * dimWeights.eeg3));
      const attWeightedAudio = projectedAudio.mul(tf.scalar(attAudio * dimWeights.audio));
      
      // Sum the weighted projections
      const summed = attWeightedEEG128.add(attWeightedEEG3).add(attWeightedAudio);
      
      // Apply nonlinearity (tanh)
      const activated = summed.tanh();
      
      // Project back to higher dimension for more expressive features
      const finalLayer = tf.tensor2d(
        Array(100).fill(0).map(() => 
          Array(projectionSize).fill(0).map(() => Math.random() * 0.01)
        )
      );
      
      const output = tf.matMul(finalLayer, activated.expandDims(1)).squeeze();
      
      // Convert to array and store as 1D array (vector)
      const outputArray = await output.array();
      
      // We need to ensure this is a 1D array (vector) for results
      if (Array.isArray(outputArray)) {
        results.push(outputArray as number[]);
      } else {
        // Handle case where output is a scalar (shouldn't happen but just in case)
        results.push([outputArray as number]);
      }
      
      // Clean up tensors
      eeg128.dispose();
      eeg3.dispose();
      audio.dispose();
      eeg128Mag.dispose();
      eeg3Mag.dispose();
      audioMag.dispose();
      projEEG128.dispose();
      projEEG3.dispose();
      projAudio.dispose();
      projectedEEG128.dispose();
      projectedEEG3.dispose();
      projectedAudio.dispose();
      attWeightedEEG128.dispose();
      attWeightedEEG3.dispose();
      attWeightedAudio.dispose();
      summed.dispose();
      activated.dispose();
      finalLayer.dispose();
      output.dispose();
    }
    
    return results;
  } catch (error) {
    console.error("Error in attention-based fusion:", error);
    // Fallback to simpler attention mechanism
    return eeg128Features.map((_, i) => {
      // Create a mixed feature vector using attention weights
      const attentionWeights = {
        eeg128: 0.5,
        eeg3: 0.2,
        audio: 0.3
      };
      
      const combinedLength = Math.max(eeg128Features[i].length, eeg3Features[i].length, audioFeatures[i].length);
      const combined = Array(combinedLength).fill(0);
      
      for (let j = 0; j < combined.length; j++) {
        if (j < eeg128Features[i].length) {
          combined[j] += eeg128Features[i][j] * attentionWeights.eeg128;
        }
        if (j < eeg3Features[i].length) {
          combined[j] += eeg3Features[i][j] * attentionWeights.eeg3;
        }
        if (j < audioFeatures[i].length) {
          combined[j] += audioFeatures[i][j] * attentionWeights.audio;
        }
      }
      
      return combined;
    });
  }
};

/**
 * Applies specified fusion strategy
 */
export const applyFusionStrategy = async (
  fusionType: 'Early' | 'Late' | 'Attention',
  eeg128Features: number[][],
  eeg3Features: number[][],
  audioFeatures: number[][]
): Promise<number[][]> => {
  if (fusionType === 'Early') {
    return concatenateFeatures(eeg128Features, eeg3Features, audioFeatures);
  } else if (fusionType === 'Late') {
    const pEEG128 = await predictWithLSTM(eeg128Features);
    const pEEG3 = await predictWithCNN(eeg3Features);
    const pAudio = await predictWithAudioModel(audioFeatures);
    return await aggregatePredictions(pEEG128, pEEG3, pAudio);
  } else {
    return await attentionBasedFusion(eeg128Features, eeg3Features, audioFeatures);
  }
};
