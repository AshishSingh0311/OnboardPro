import * as tf from '@tensorflow/tfjs';

// Initialize TensorFlow.js
export async function initTensorFlow() {
  try {
    await tf.ready();
    console.log('TensorFlow.js initialized successfully');
    // Log device info
    const backend = tf.getBackend();
    console.log(`Using backend: ${backend}`);
    return { success: true, backend };
  } catch (err) {
    console.error('Failed to initialize TensorFlow.js:', err);
    return { success: false, error: err };
  }
}

// Function to load a pre-trained model
export async function loadModel(modelUrl: string) {
  try {
    const model = await tf.loadLayersModel(modelUrl);
    console.log('Model loaded successfully');
    return { success: true, model };
  } catch (err) {
    console.error('Failed to load model:', err);
    return { success: false, error: err };
  }
}

// Process EEG data - normalize and prepare for model input
export function processEEGData(data: number[][]) {
  try {
    // Convert to tensor and normalize
    const tensor = tf.tensor2d(data);
    const mean = tensor.mean(0);
    const std = tensor.sub(mean).square().mean(0).sqrt();
    const normalized = tensor.sub(mean).div(std);
    return { success: true, tensor: normalized };
  } catch (err) {
    console.error('Failed to process EEG data:', err);
    return { success: false, error: err };
  }
}

// Process audio features 
export function processAudioFeatures(features: number[][]) {
  try {
    // Convert to tensor and normalize
    const tensor = tf.tensor2d(features);
    const normalized = tf.div(
      tf.sub(tensor, tensor.min()),
      tf.sub(tensor.max(), tensor.min())
    );
    return { success: true, tensor: normalized };
  } catch (err) {
    console.error('Failed to process audio features:', err);
    return { success: false, error: err };
  }
}

// Process text embeddings
export function processTextEmbeddings(embeddings: number[][]) {
  try {
    const tensor = tf.tensor2d(embeddings);
    return { success: true, tensor };
  } catch (err) {
    console.error('Failed to process text embeddings:', err);
    return { success: false, error: err };
  }
}

// Process visual features
export function processVisualFeatures(features: number[][]) {
  try {
    const tensor = tf.tensor2d(features);
    return { success: true, tensor };
  } catch (err) {
    console.error('Failed to process visual features:', err);
    return { success: false, error: err };
  }
}

// Run inference with multimodal data
export async function runMultimodalInference(
  model: tf.LayersModel,
  eegTensor: tf.Tensor,
  audioTensor: tf.Tensor,
  textTensor: tf.Tensor,
  visualTensor: tf.Tensor
) {
  try {
    const startTime = performance.now();
    
    // Run prediction - this is a simplified example
    // In a real application, you'd need to handle the specific input structure of your model
    const prediction = model.predict([eegTensor, audioTensor, textTensor, visualTensor]) as tf.Tensor;
    
    const endTime = performance.now();
    const inferenceTime = endTime - startTime;
    
    // Get results
    const values = await prediction.data();
    prediction.dispose(); // Clean up
    
    return { 
      success: true, 
      prediction: Array.from(values),
      inferenceTime 
    };
  } catch (err) {
    console.error('Inference failed:', err);
    return { success: false, error: err };
  }
}

// Clean up TensorFlow.js tensors to prevent memory leaks
export function cleanupTensors(...tensors: tf.Tensor[]) {
  tensors.forEach(tensor => {
    if (tensor && !tensor.isDisposed) {
      tensor.dispose();
    }
  });
}

// Get model memory info
export function getModelMemoryInfo() {
  return tf.memory();
}
