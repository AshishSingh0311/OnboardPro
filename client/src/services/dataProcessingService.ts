import * as tf from '@tensorflow/tfjs';
import {
  readEEGFile,
  readAudioFile,
  readTextFile,
  readImageFile,
  imageToTensor,
  FileUploadState
} from './fileUploadService';
import {
  processEEGData,
  processAudioFeatures,
  processTextEmbeddings,
  processVisualFeatures,
  cleanupTensors
} from '@/lib/tensorflow';

// Data processing state
export interface ProcessingState {
  status: 'idle' | 'processing' | 'complete' | 'error';
  progress: number;
  error?: string;
}

// Processed data from files
export interface ProcessedData {
  eegData?: tf.Tensor;
  audioData?: tf.Tensor;
  textData?: tf.Tensor;
  visualData?: tf.Tensor;
}

// Extract features from uploaded EEG file
export async function extractEEGFeatures(file: File): Promise<tf.Tensor | null> {
  try {
    const eegData = await readEEGFile(file);
    if (!eegData) return null;
    
    const result = processEEGData(eegData);
    if (!result.success) {
      console.error('Failed to process EEG data:', result.error);
      return null;
    }
    
    return result.tensor;
  } catch (error) {
    console.error('Error extracting EEG features:', error);
    return null;
  }
}

// Extract features from uploaded audio file
export async function extractAudioFeatures(file: File): Promise<tf.Tensor | null> {
  try {
    const audioData = await readAudioFile(file);
    if (!audioData) return null;
    
    // Convert audio data to MFCC features (simplified)
    // In a real app, you'd use a proper audio processing library
    const frameSize = 512;
    const frames = [];
    
    for (let i = 0; i < audioData.length; i += frameSize) {
      if (i + frameSize <= audioData.length) {
        const frame = audioData.slice(i, i + frameSize);
        frames.push(Array.from(frame));
      }
    }
    
    // Take max 100 frames to keep tensor size manageable
    const limitedFrames = frames.slice(0, 100);
    
    const result = processAudioFeatures(limitedFrames);
    if (!result.success) {
      console.error('Failed to process audio features:', result.error);
      return null;
    }
    
    return result.tensor;
  } catch (error) {
    console.error('Error extracting audio features:', error);
    return null;
  }
}

// Extract features from uploaded text file
export async function extractTextFeatures(file: File): Promise<tf.Tensor | null> {
  try {
    const text = await readTextFile(file);
    if (!text) return null;
    
    // Create simple word embeddings (simplified)
    // In a real app, you'd use a proper NLP library or pre-trained model
    const words = text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);
    const embeddings = words.slice(0, 100).map(word => {
      // Create simple "hash" based embedding
      const charCodes = Array.from(word).map(c => c.charCodeAt(0) / 255);
      // Pad to fixed length
      const paddedCodes = charCodes.concat(Array(10 - charCodes.length).fill(0)).slice(0, 10);
      return paddedCodes;
    });
    
    const result = processTextEmbeddings(embeddings);
    if (!result.success) {
      console.error('Failed to process text embeddings:', result.error);
      return null;
    }
    
    return result.tensor;
  } catch (error) {
    console.error('Error extracting text features:', error);
    return null;
  }
}

// Extract features from uploaded image file
export async function extractVisualFeatures(file: File): Promise<tf.Tensor | null> {
  try {
    const image = await readImageFile(file);
    if (!image) return null;
    
    const tensor = await imageToTensor(image);
    if (!tensor) return null;
    
    // Normalize pixel values to -1 to 1
    const normalized = tensor.div(tf.scalar(127.5)).sub(tf.scalar(1));
    
    // In a real app, you'd run the image through a pre-trained model
    // For this simplified version, we'll create random "features"
    const features = Array.from({ length: 10 }, () => 
      Array.from({ length: 128 }, () => Math.random() * 2 - 1)
    );
    
    // Clean up the temporary tensors
    tensor.dispose();
    normalized.dispose();
    
    const result = processVisualFeatures(features);
    if (!result.success) {
      console.error('Failed to process visual features:', result.error);
      return null;
    }
    
    return result.tensor;
  } catch (error) {
    console.error('Error extracting visual features:', error);
    return null;
  }
}

// Process all uploaded files
export async function processUploadedFiles(
  files: FileUploadState[],
  setProgress: (progress: number) => void
): Promise<ProcessedData> {
  const result: ProcessedData = {};
  
  try {
    setProgress(0);
    
    // Group files by category
    const eegFiles = files.filter(f => f.category === 'eeg');
    const audioFiles = files.filter(f => f.category === 'audio');
    const textFiles = files.filter(f => f.category === 'text');
    const visualFiles = files.filter(f => f.category === 'visual');
    
    // Process EEG files
    if (eegFiles.length > 0) {
      setProgress(10);
      result.eegData = await extractEEGFeatures(eegFiles[0].file);
    }
    
    // Process audio files
    if (audioFiles.length > 0) {
      setProgress(30);
      result.audioData = await extractAudioFeatures(audioFiles[0].file);
    }
    
    // Process text files
    if (textFiles.length > 0) {
      setProgress(50);
      result.textData = await extractTextFeatures(textFiles[0].file);
    }
    
    // Process visual files
    if (visualFiles.length > 0) {
      setProgress(70);
      result.visualData = await extractVisualFeatures(visualFiles[0].file);
    }
    
    setProgress(100);
    return result;
  } catch (error) {
    console.error('Error processing files:', error);
    // Clean up tensors to prevent memory leaks
    if (result.eegData) result.eegData.dispose();
    if (result.audioData) result.audioData.dispose();
    if (result.textData) result.textData.dispose();
    if (result.visualData) result.visualData.dispose();
    
    throw error;
  }
}

// Run model inference with processed data
export async function runInference(
  processedData: ProcessedData
): Promise<any> {
  try {
    // For now, return mock results
    // In a real app, you'd load a TensorFlow.js model and run inference
    
    // Clean up tensors after inference
    cleanupTensors(
      processedData.eegData!, 
      processedData.audioData!, 
      processedData.textData!, 
      processedData.visualData!
    );
    
    // Return mock result from mockDataService
    const mockResult = {
      prediction: {
        label: "Generalized Anxiety Disorder",
        probability: 0.87
      },
      confidence: 0.87,
      severity: 6.2
    };
    
    return mockResult;
  } catch (error) {
    console.error('Error running inference:', error);
    throw error;
  }
}
