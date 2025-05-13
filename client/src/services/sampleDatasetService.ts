
import { ModmaDataset } from '@/types/dataProcessing';
import * as XLSX from 'xlsx';

// Generate random number between min and max (inclusive)
const randomNumber = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

// Generate random EEG data entry
const generateEEGDataEntry = (channelCount: number = 64, timePoints: number = 100) => {
  return {
    channelData: Array.from({ length: channelCount }, () => 
      Array.from({ length: timePoints }, () => randomNumber(-100, 100))
    ),
    samplingRate: 250,
    channels: Array.from({ length: channelCount }, (_, i) => `Channel_${i+1}`),
    timestamp: Date.now(),
    quality: randomNumber(0.8, 1.0),
    preprocessed: false
  };
};

// Generate random audio data entry
const generateAudioDataEntry = (durationMs: number = 5000) => {
  return {
    mfcc: Array.from({ length: 13 }, () => 
      Array.from({ length: 50 }, () => randomNumber(-100, 100))
    ),
    spectralCentroid: Array.from({ length: 50 }, () => randomNumber(0, 5000)),
    zeroCrossingRate: Array.from({ length: 50 }, () => randomNumber(0, 0.2)),
    rms: Array.from({ length: 50 }, () => randomNumber(0, 1)),
    durationMs,
    samplingRate: 16000,
    timestamp: Date.now(),
    quality: randomNumber(0.8, 1.0),
    preprocessed: false
  };
};

// Generate random text data entry
const generateTextDataEntry = () => {
  const sentences = [
    "I've been feeling really down lately.",
    "Sometimes I worry too much about things that don't matter.",
    "I find it hard to concentrate on tasks these days.",
    "I don't enjoy activities like I used to.",
    "I've been sleeping more than usual.",
    "I feel like I have lots of energy and don't need much sleep.",
    "My thoughts race sometimes and it's hard to focus.",
    "I feel anxious in social situations.",
    "I've been having trouble with my memory.",
    "Sometimes I feel overwhelmed by small things."
  ];
  
  return {
    text: sentences[Math.floor(Math.random() * sentences.length)],
    sentiment: randomNumber(-1, 1),
    emotionScores: {
      joy: randomNumber(0, 1),
      sadness: randomNumber(0, 1),
      anger: randomNumber(0, 1),
      fear: randomNumber(0, 1),
      surprise: randomNumber(0, 1)
    },
    timestamp: Date.now(),
    quality: randomNumber(0.8, 1.0),
    preprocessed: false
  };
};

// Generate a complete MODMA dataset
export const generateSampleDataset = (
  eegSampleCount: number = 5, 
  audioSampleCount: number = 5, 
  textSampleCount: number = 5
): ModmaDataset => {
  return {
    metadata: {
      format_version: "MODMA-1.0",
      data_quality: {
        completeness: randomNumber(0.85, 0.98),
        consistency: randomNumber(0.8, 0.95)
      }
    },
    eeg_data: Array.from({ length: eegSampleCount }, () => generateEEGDataEntry()),
    audio_data: Array.from({ length: audioSampleCount }, () => generateAudioDataEntry()),
    text_data: Array.from({ length: textSampleCount }, () => generateTextDataEntry())
  };
};

// Export the dataset as a downloadable JSON file
export const downloadSampleDataset = () => {
  const dataset = generateSampleDataset();
  const jsonData = JSON.stringify(dataset, null, 2);
  const blob = new Blob([jsonData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = 'modma-sample-dataset.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  return dataset;
};

// Download a sample Excel template that can be filled out
export const downloadExcelTemplate = () => {
  // Create a workbook with sheets for metadata, EEG data, audio data, and text data
  const wb = XLSX.utils.book_new();
  
  // Add metadata sheet
  const metadataWS = XLSX.utils.json_to_sheet([{
    format_version: "MODMA-1.0",
    completeness: 0.95,
    consistency: 0.90
  }]);
  XLSX.utils.book_append_sheet(wb, metadataWS, "Metadata");
  
  // Add EEG data template
  const eegTemplateData = [
    { channel_id: "Channel_1", sampling_rate: 250, timestamp: Date.now(), quality: 0.95, preprocessed: false, data_point_1: 0, data_point_2: 0 },
    { channel_id: "Channel_2", sampling_rate: 250, timestamp: Date.now(), quality: 0.95, preprocessed: false, data_point_1: 0, data_point_2: 0 }
  ];
  const eegWS = XLSX.utils.json_to_sheet(eegTemplateData);
  XLSX.utils.book_append_sheet(wb, eegWS, "EEG_Data");
  
  // Add audio data template
  const audioTemplateData = [
    { mfcc_1: 0, mfcc_2: 0, spectral_centroid: 0, zero_crossing_rate: 0, rms: 0, duration_ms: 5000, sampling_rate: 16000, timestamp: Date.now(), quality: 0.95, preprocessed: false },
  ];
  const audioWS = XLSX.utils.json_to_sheet(audioTemplateData);
  XLSX.utils.book_append_sheet(wb, audioWS, "Audio_Data");
  
  // Add text data template
  const textTemplateData = [
    { text: "Sample text entry", sentiment: 0, joy: 0, sadness: 0, anger: 0, fear: 0, surprise: 0, timestamp: Date.now(), quality: 0.95, preprocessed: false }
  ];
  const textWS = XLSX.utils.json_to_sheet(textTemplateData);
  XLSX.utils.book_append_sheet(wb, textWS, "Text_Data");
  
  // Write the workbook to a buffer
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  
  // Create a blob and generate download link
  const blob = new Blob([new Uint8Array(wbout)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = 'modma-dataset-template.xlsx';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Convert Excel file to MODMA dataset format
export const convertExcelToModma = async (file: File): Promise<ModmaDataset> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Parse metadata
        const metadataSheet = workbook.Sheets[workbook.SheetNames[0]];
        const metadata = XLSX.utils.sheet_to_json(metadataSheet)[0] as any;
        
        // Parse EEG data
        const eegSheet = workbook.Sheets[workbook.SheetNames[1]];
        const eegData = XLSX.utils.sheet_to_json(eegSheet) as any[];
        
        // Parse audio data
        const audioSheet = workbook.Sheets[workbook.SheetNames[2]];
        const audioData = XLSX.utils.sheet_to_json(audioSheet) as any[];
        
        // Parse text data if available
        let textData = [];
        if (workbook.SheetNames.length > 3) {
          const textSheet = workbook.Sheets[workbook.SheetNames[3]];
          textData = XLSX.utils.sheet_to_json(textSheet) as any[];
        }
        
        // Transform the data to match MODMA format
        const transformedEEGData = eegData.map(row => {
          // Extract data points (columns that start with data_point_)
          const dataPoints = Object.keys(row)
            .filter(key => key.startsWith('data_point_'))
            .map(key => Number(row[key]));
          
          return {
            channelData: [dataPoints], // Convert to 2D array
            samplingRate: row.sampling_rate || 250,
            channels: [row.channel_id || 'Unknown'],
            timestamp: row.timestamp || Date.now(),
            quality: row.quality || 0.9,
            preprocessed: Boolean(row.preprocessed) || false
          };
        });
        
        const transformedAudioData = audioData.map(row => {
          // Extract MFCC features
          const mfccFeatures = Object.keys(row)
            .filter(key => key.startsWith('mfcc_'))
            .map(key => Number(row[key]));
            
          return {
            mfcc: [mfccFeatures], // Convert to 2D array
            spectralCentroid: [row.spectral_centroid || 0],
            zeroCrossingRate: [row.zero_crossing_rate || 0],
            rms: [row.rms || 0],
            durationMs: row.duration_ms || 5000,
            samplingRate: row.sampling_rate || 16000,
            timestamp: row.timestamp || Date.now(),
            quality: row.quality || 0.9,
            preprocessed: Boolean(row.preprocessed) || false
          };
        });
        
        const transformedTextData = textData.map(row => {
          return {
            text: row.text || '',
            sentiment: row.sentiment || 0,
            emotionScores: {
              joy: row.joy || 0,
              sadness: row.sadness || 0,
              anger: row.anger || 0,
              fear: row.fear || 0,
              surprise: row.surprise || 0
            },
            timestamp: row.timestamp || Date.now(),
            quality: row.quality || 0.9,
            preprocessed: Boolean(row.preprocessed) || false
          };
        });
        
        // Create MODMA dataset
        const modmaDataset: ModmaDataset = {
          metadata: {
            format_version: metadata.format_version || "MODMA-1.0",
            data_quality: {
              completeness: metadata.completeness || 0.9,
              consistency: metadata.consistency || 0.9
            }
          },
          eeg_data: transformedEEGData,
          audio_data: transformedAudioData,
          text_data: transformedTextData
        };
        
        resolve(modmaDataset);
      } catch (error) {
        console.error('Error converting Excel to MODMA format:', error);
        reject(new Error('Failed to convert Excel file to MODMA format'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading Excel file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};
