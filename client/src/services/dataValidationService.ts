import { ModmaDataset } from '@/types/dataProcessing';

/**
 * Validates the format of the uploaded dataset
 * @param data The dataset to validate
 * @returns boolean indicating if the data format is correct
 */
export const checkDataFormat = (data: any): boolean => {
  try {
    // Check if the data structure follows MODMA format
    if (!data || typeof data !== 'object') {
      console.error('Invalid data: not an object');
      return false;
    }

    // Check for required metadata
    if (!data.metadata || typeof data.metadata !== 'object') {
      console.error('Invalid data: missing metadata');
      return false;
    }

    // Check for required data fields (at minimum we need EEG and audio data)
    if (!Array.isArray(data.eeg_data) || data.eeg_data.length === 0) {
      console.error('Invalid data: missing or empty EEG data');
      return false;
    }

    if (!Array.isArray(data.audio_data) || data.audio_data.length === 0) {
      console.error('Invalid data: missing or empty audio data');
      return false;
    }

    // Check format version
    if (!data.metadata.format_version) {
      console.error('Invalid data: missing format version in metadata');
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error checking data format:', error);
    return false;
  }
};

/**
 * Checks the quality of the uploaded dataset
 * @param data The dataset to check
 * @returns boolean indicating if the data quality is sufficient
 */
export const checkDataQuality = (data: any): boolean => {
  try {
    // Data completeness check
    if (!data.metadata.data_quality || 
        typeof data.metadata.data_quality.completeness !== 'number' || 
        data.metadata.data_quality.completeness < 0.7) {
      console.warn('Data quality issue: low completeness score');
      // We continue despite the warning
    }

    // Check consistency if available
    if (!data.metadata.data_quality.consistency || 
        typeof data.metadata.data_quality.consistency !== 'number' || 
        data.metadata.data_quality.consistency < 0.7) {
      console.warn('Data quality issue: low consistency score');
      // We continue despite the warning
    }

    // Check EEG data quality
    const eegValid = checkEEGDataQuality(data.eeg_data);
    if (!eegValid) {
      console.error('Data quality issue: EEG data failed quality checks');
      return false;
    }

    // Check audio data quality
    const audioValid = checkAudioDataQuality(data.audio_data);
    if (!audioValid) {
      console.error('Data quality issue: Audio data failed quality checks');
      return false;
    }

    // Text data is optional, check only if present
    if (data.text_data && Array.isArray(data.text_data) && data.text_data.length > 0) {
      const textValid = checkTextDataQuality(data.text_data);
      if (!textValid) {
        console.warn('Data quality issue: Text data failed quality checks');
        // Continue despite text issues since it's optional
      }
    }

    return true;
  } catch (error) {
    console.error('Error checking data quality:', error);
    return false;
  }
};

/**
 * Checks the quality of EEG data
 */
const checkEEGDataQuality = (eegData: any[]): boolean => {
  // At least 5 seconds of EEG data is required (assuming 250Hz sampling rate)
  if (eegData.length < 1250) {
    console.error('EEG data quality issue: insufficient data length');
    return false;
  }

  // Check for signal integrity
  let validSamples = 0;
  const sampleSize = Math.min(100, eegData.length); // Check first 100 samples or fewer if less data
  
  for (let i = 0; i < sampleSize; i++) {
    const sample = eegData[i];
    if (sample && typeof sample === 'object' && !Array.isArray(sample)) {
      validSamples++;
    }
  }
  
  const qualityRatio = validSamples / sampleSize;
  if (qualityRatio < 0.8) {
    console.error(`EEG data quality issue: only ${qualityRatio * 100}% of checked samples are valid`);
    return false;
  }

  return true;
};

/**
 * Checks the quality of audio data
 */
const checkAudioDataQuality = (audioData: any[]): boolean => {
  // At least 3 seconds of audio data is required (assuming typical sampling rate)
  if (audioData.length < 48000) {
    console.warn('Audio data quality issue: short duration');
    // We continue despite the warning
  }

  // Check for signal integrity
  let validSamples = 0;
  const sampleSize = Math.min(100, audioData.length);
  
  for (let i = 0; i < sampleSize; i++) {
    const sample = audioData[i];
    if (sample !== undefined && sample !== null) {
      validSamples++;
    }
  }
  
  const qualityRatio = validSamples / sampleSize;
  if (qualityRatio < 0.8) {
    console.error(`Audio data quality issue: only ${qualityRatio * 100}% of checked samples are valid`);
    return false;
  }

  return true;
};

/**
 * Checks the quality of text data
 */
const checkTextDataQuality = (textData: any[]): boolean => {
  // Check if there's at least one valid text entry
  if (textData.length === 0) {
    console.warn('Text data quality issue: empty text data array');
    return false;
  }

  // Check for valid text content
  let validEntries = 0;
  
  for (const entry of textData) {
    if (entry && typeof entry === 'object' && typeof entry.content === 'string' && entry.content.trim().length > 0) {
      validEntries++;
    }
  }
  
  if (validEntries === 0) {
    console.error('Text data quality issue: no valid text entries found');
    return false;
  }

  return true;
};