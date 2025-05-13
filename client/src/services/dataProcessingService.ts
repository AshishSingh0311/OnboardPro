import { ProcessingResult } from '@/types/dataProcessing';
import { checkDataFormat, checkDataQuality } from '@/services/dataValidationService';
import { preprocessMODMA } from '@/services/dataPreprocessingService';
import { extractEEG128Features, extractEEG3Features, extractAudioFeatures } from '@/services/featureExtractionService';
import { applyFusionStrategy } from '@/services/fusionService';
import { predictWithHybridModel, explainWithSHAP, generateModelPerformanceMetrics } from '@/services/modelPredictionService';
import * as tf from '@tensorflow/tfjs';

/**
 * Initialize TensorFlow.js
 */
const initTensorFlow = async () => {
  try {
    // Try to use WebGL backend for better performance
    await tf.setBackend('webgl');
    console.log("Using TensorFlow.js backend:", tf.getBackend());

    // Enable debug mode in development
    if (process.env.NODE_ENV !== 'production') {
      tf.enableDebugMode();
    }

    // Print version info
    console.log("TensorFlow.js version:", tf.version.tfjs);
  } catch (error) {
    console.warn("Could not initialize WebGL backend, falling back to CPU", error);
    await tf.setBackend('cpu');
  }
};

/**
 * Processes the uploaded dataset with the specified fusion type
 */
export const processDataset = async (
  file: File,
  fusionType: 'Early' | 'Late' | 'Attention'
): Promise<ProcessingResult> => {
  try {
    // Initialize TensorFlow.js with memory cleanup
    await initTensorFlow();
    tf.tidy(() => {
      // Clean up any unused tensors
      tf.disposeVariables();
    });

    return new Promise((resolve, reject) => {
      // Start processing
      console.log(`Starting dataset processing with ${fusionType} fusion strategy...`);
      console.time('processing-time');

      // Remove artificial delay and process immediately
      (async () => {
        const reader = new FileReader();

        reader.onload = async (event) => {
          if (!event.target?.result) {
            reject(new Error("Failed to read file"));
            return;
          }
          try {
            let data;

            // Parse the uploaded file
            try {
              data = JSON.parse(event.target?.result as string);
            } catch (error) {
              console.error("Failed to parse JSON data", error);
              resolve({ error: "Incorrect Data Format" });
              return;
            }

            // Step 1-2: Data format and quality checks
            console.log("Validating data format...");
            if (!checkDataFormat(data)) {
              resolve({ error: "Incorrect Data Format" });
              return;
            }

            console.log("Checking data quality...");
            if (!checkDataQuality(data)) {
              resolve({ error: "Data is not compliant" });
              return;
            }

            // Step 3: Preprocess data
            console.log("Preprocessing data...");
            const preprocessedData = preprocessMODMA(data);

            // Steps 4-6: Extract features with batching
            console.log("Extracting features...");
            const batchSize = 1000; // Process data in smaller chunks
            
            const eeg128Features = await tf.tidy(() => extractEEG128Features(preprocessedData));
            tf.dispose(preprocessedData.eeg_data); // Clean up original data
            
            const eeg3Features = await tf.tidy(() => extractEEG3Features(preprocessedData));
            const audioFeatures = await tf.tidy(() => extractAudioFeatures(preprocessedData));
            
            // Force garbage collection after feature extraction
            tf.dispose([preprocessedData]);

            // Steps 7-9: Apply fusion strategy
            console.log(`Applying ${fusionType} fusion strategy...`);
            const fusedFeatures = await applyFusionStrategy(
              fusionType,
              eeg128Features,
              eeg3Features,
              audioFeatures
            );

            // Step 10: Make prediction
            console.log("Making predictions with hybrid model...");
            const prediction = await predictWithHybridModel(fusedFeatures);

            // Step 11: Generate explanation
            console.log("Generating explanations...");
            const explanation = explainWithSHAP(prediction);

            // Step 12: Generate model performance metrics
            console.log("Generating model performance metrics...");
            const modelPerformance = generateModelPerformanceMetrics();

            // Step 13: Store and return results
            console.log("Finalizing results...");
            const results = {
              prediction,
              explanation,
              features: {
                eeg_128: eeg128Features,
                eeg_3: eeg3Features,
                audio: audioFeatures
              },
              fusionType,
              modelPerformance
            };

            console.timeEnd('processing-time');
            resolve(results);
          } catch (error) {
            console.error('Error processing dataset:', error);
            resolve({ error: "Error processing dataset" });
          }
        };

        reader.onerror = () => {
          resolve({ error: "Error reading file" });
        };

        reader.readAsText(file);
      }, 1000); // Ensure minimum processing time for better UX
    });
  } catch (error) {
    console.error('TensorFlow initialization error:', error);
    return { error: 'Failed to initialize TensorFlow' };
  }
};