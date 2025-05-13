
import { ModmaDataset } from '@/types/dataProcessing';

/**
 * Checks if the data has the expected MODMA dataset format
 */
export const checkDataFormat = (data: any): boolean => {
  try {
    // Check if the data has the expected structure
    return (
      data &&
      data.metadata &&
      data.metadata.format_version &&
      data.eeg_data &&
      Array.isArray(data.eeg_data) &&
      data.audio_data &&
      Array.isArray(data.audio_data)
    );
  } catch (error) {
    return false;
  }
};

/**
 * Checks if the data meets quality standards
 */
export const checkDataQuality = (data: ModmaDataset): boolean => {
  try {
    // Check completeness and consistency scores
    const { completeness, consistency } = data.metadata.data_quality;
    
    // For Excel-converted files, make additional checks on data structures
    const hasValidEEG = data.eeg_data.length > 0 && 
                       data.eeg_data[0].channelData && 
                       Array.isArray(data.eeg_data[0].channelData);
                       
    const hasValidAudio = data.audio_data.length > 0 && 
                         (data.audio_data[0].mfcc || 
                          data.audio_data[0].spectralCentroid || 
                          data.audio_data[0].zeroCrossingRate);
    
    return completeness > 0.8 && consistency > 0.75 && hasValidEEG && hasValidAudio;
  } catch (error) {
    return false;
  }
};

/**
 * Validate data against performance requirements
 */
export const validatePerformanceMetrics = (metrics: any): boolean => {
  try {
    // Check if metrics meet our minimum required performance criteria
    const meetsAccuracy = metrics.accuracy >= 0.90;
    const meetsPrecision = metrics.precision >= 0.85;
    const meetsRecall = metrics.recall >= 0.90;
    const meetsSpecificity = metrics.specificity >= 0.92;
    const meetsF1Score = metrics.f1Score >= 0.875;
    
    return meetsAccuracy && meetsPrecision && meetsRecall && meetsSpecificity && meetsF1Score;
  } catch (error) {
    return false;
  }
};

/**
 * Validate robustness metrics
 */
export const validateRobustnessMetrics = (metrics: any): boolean => {
  try {
    // Check if robustness metrics meet our criteria
    const meetsCrossValidationVariance = metrics.crossValidationVariance <= 0.02;
    const meetsNoiseSensitivity = metrics.noiseSensitivity <= 0.045;
    const meetsDemographicBias = metrics.demographicBias <= 0.013;
    const meetsRobustnessIndex = metrics.robustnessIndex >= 0.90;
    
    return meetsCrossValidationVariance && meetsNoiseSensitivity && 
           meetsDemographicBias && meetsRobustnessIndex;
  } catch (error) {
    return false;
  }
};

/**
 * Validate efficiency metrics
 */
export const validateEfficiencyMetrics = (metrics: any): boolean => {
  try {
    // Check if computational efficiency metrics meet our criteria
    const meetsInferenceTime = metrics.inferenceTime <= 50;
    const meetsGpuUsage = metrics.gpuUsage <= 40; // Assuming in units of 0.1GB, so 40 = 4.0GB
    const meetsCloudDeployment = metrics.cloudDeploymentReadiness >= 0.95;
    const meetsEdgeCompatibility = metrics.edgeDeviceCompatibility >= 0.90;
    
    return meetsInferenceTime && meetsGpuUsage && meetsCloudDeployment && meetsEdgeCompatibility;
  } catch (error) {
    return false;
  }
};
