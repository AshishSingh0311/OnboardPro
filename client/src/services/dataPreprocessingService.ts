import { ModmaDataset, ProcessedData } from '@/types/dataProcessing';

/**
 * Preprocesses MODMA format data for feature extraction
 * @param data The MODMA format dataset
 * @returns Preprocessed data ready for feature extraction
 */
export const preprocessMODMA = (data: any): ProcessedData => {
  try {
    // Create a deep copy to avoid modifying the original data
    const processedData: ProcessedData = {
      eeg: [],
      audio: [],
      text: data.text_data ? [] : undefined
    };

    // Preprocess EEG data
    console.log("Preprocessing EEG data...");
    processedData.eeg = preprocessEEGData(data.eeg_data);

    // Preprocess audio data
    console.log("Preprocessing audio data...");
    processedData.audio = preprocessAudioData(data.audio_data);

    // Preprocess text data if available
    if (data.text_data && Array.isArray(data.text_data)) {
      console.log("Preprocessing text data...");
      processedData.text = preprocessTextData(data.text_data);
    }

    return processedData;
  } catch (error) {
    console.error('Error during data preprocessing:', error);
    throw new Error(`Data preprocessing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Preprocesses EEG data
 * @param eegData Raw EEG data
 * @returns Preprocessed EEG data
 */
const preprocessEEGData = (eegData: any[]): any[] => {
  // Apply filtering, artifact removal, and normalization
  
  // 1. Filter outliers and missing values
  const filtered = eegData.filter(sample => {
    if (!sample || typeof sample !== 'object') return false;
    
    // Check if sample has expected properties
    return true;
  });
  
  // 2. Normalize the data
  const normalized = filtered.map(sample => {
    // Implement normalization logic here
    // For demonstration, we're just returning the sample as is
    return sample;
  });
  
  // 3. Segment the data (if needed)
  // This would divide the data into epochs or segments
  
  // 4. Apply bandpass filtering
  // This would filter the data to focus on relevant frequency bands
  
  return normalized;
};

/**
 * Preprocesses audio data
 * @param audioData Raw audio data
 * @returns Preprocessed audio data
 */
const preprocessAudioData = (audioData: any[]): any[] => {
  // Apply filtering, noise reduction, and normalization
  
  // 1. Filter noise and missing values
  const filtered = audioData.filter(sample => {
    return sample !== undefined && sample !== null;
  });
  
  // 2. Apply normalization
  let max = Math.max(...filtered.map(Math.abs));
  if (max === 0) max = 1; // Prevent division by zero
  
  const normalized = filtered.map(sample => sample / max);
  
  // 3. Apply noise reduction techniques
  // This would reduce background noise
  
  return normalized;
};

/**
 * Preprocesses text data
 * @param textData Raw text data
 * @returns Preprocessed text data
 */
const preprocessTextData = (textData: any[]): any[] => {
  // Apply text normalization, tokenization, etc.
  
  // 1. Filter invalid entries
  const filtered = textData.filter(entry => {
    return entry && 
           typeof entry === 'object' && 
           typeof entry.content === 'string' && 
           entry.content.trim().length > 0;
  });
  
  // 2. Normalize text
  const normalized = filtered.map(entry => {
    // Text normalization: lowercase, remove extra spaces, etc.
    const normalizedContent = entry.content
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ' ');
    
    return {
      ...entry,
      content: normalizedContent
    };
  });
  
  return normalized;
};