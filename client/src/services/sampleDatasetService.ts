import { ModmaDataset } from '@/types/dataProcessing';
import * as XLSX from 'xlsx';

/**
 * Generates a sample MODMA dataset for demonstration purposes
 * @param numEEGSamples Number of EEG samples to generate
 * @param numAudioSamples Number of audio samples to generate
 * @param includeText Whether to include text data
 * @returns A sample MODMA dataset
 */
export const generateSampleDataset = (
  numEEGSamples: number = 5000,
  numAudioSamples: number = 48000,
  includeText: boolean = true
): ModmaDataset => {
  // Create metadata
  const metadata = {
    format_version: "1.0.0",
    data_quality: {
      completeness: 0.95,
      consistency: 0.92
    },
    subject: {
      id: "sample-001",
      age: 35,
      gender: "not_specified"
    },
    recording: {
      date: new Date().toISOString(),
      duration_seconds: 120,
      device_info: {
        eeg: "Sample EEG Device",
        audio: "Sample Audio Recorder"
      }
    }
  };
  
  // Generate EEG data (simulated)
  const eegData = [];
  for (let i = 0; i < numEEGSamples; i++) {
    // Simulate 128-channel EEG data
    const eegSample: Record<string, number> = {};
    
    // Add timestamp
    eegSample.timestamp = i / 250; // Assuming 250Hz sampling rate
    
    // Add channels
    for (let c = 1; c <= 128; c++) {
      const channelName = c <= 64 ? `channel_${c}` : `derived_${c-64}`;
      // Generate plausible EEG values (typically small amplitude values)
      eegSample[channelName] = (Math.sin(i * 0.01 + c * 0.1) + Math.random() * 0.5) * 5;
    }
    
    // Add standard frequency bands
    eegSample.alpha = Math.abs(Math.sin(i * 0.05)) * 3 + Math.random();
    eegSample.beta = Math.abs(Math.cos(i * 0.03)) * 2 + Math.random();
    eegSample.gamma = Math.abs(Math.sin(i * 0.08)) * 1 + Math.random() * 0.5;
    eegSample.delta = Math.abs(Math.cos(i * 0.01)) * 4 + Math.random() * 2;
    eegSample.theta = Math.abs(Math.sin(i * 0.02)) * 3.5 + Math.random() * 1.5;
    
    eegData.push(eegSample);
  }
  
  // Generate audio data (simulated)
  const audioData = [];
  for (let i = 0; i < numAudioSamples; i++) {
    // Simple audio waveform simulation
    const sample = Math.sin(i * 0.01) * 0.5 + // Base frequency
                  Math.sin(i * 0.05) * 0.3 + // Higher frequency component
                  Math.sin(i * 0.001) * 0.2 + // Low frequency modulation
                  (Math.random() - 0.5) * 0.1; // Noise
    
    audioData.push(sample);
  }
  
  // Generate text data if requested
  const textData = includeText ? [
    {
      timestamp: 5.0,
      content: "I've been feeling a bit down lately, but trying to stay positive.",
      metadata: {
        speech_rate: 145, // words per minute
        pause_duration: 0.5, // seconds
        sentiment_score: -0.2 // slightly negative
      }
    },
    {
      timestamp: 15.0,
      content: "Work has been stressful these past few weeks. I can't seem to focus well.",
      metadata: {
        speech_rate: 160,
        pause_duration: 0.3,
        sentiment_score: -0.4
      }
    },
    {
      timestamp: 30.0,
      content: "I've started meditating in the mornings, which seems to help a little bit.",
      metadata: {
        speech_rate: 138,
        pause_duration: 0.6,
        sentiment_score: 0.3
      }
    },
    {
      timestamp: 45.0,
      content: "My sleep hasn't been good though. I keep waking up during the night.",
      metadata: {
        speech_rate: 135,
        pause_duration: 0.8,
        sentiment_score: -0.5
      }
    },
    {
      timestamp: 60.0,
      content: "I'm looking forward to the weekend. I might go hiking if the weather is nice.",
      metadata: {
        speech_rate: 150,
        pause_duration: 0.4,
        sentiment_score: 0.6
      }
    }
  ] : undefined;
  
  // Assemble the MODMA dataset
  const dataset: ModmaDataset = {
    metadata,
    eeg_data: eegData,
    audio_data: audioData
  };
  
  if (textData) {
    dataset.text_data = textData;
  }
  
  return dataset;
};

/**
 * Downloads a sample MODMA dataset as a JSON file
 */
export const downloadSampleDataset = () => {
  // Generate the sample dataset
  const sampleDataset = generateSampleDataset();
  
  // Convert to JSON string
  const jsonString = JSON.stringify(sampleDataset, null, 2);
  
  // Create a blob and download
  const blob = new Blob([jsonString], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = 'sample_modma_dataset.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Downloads an Excel template for MODMA dataset creation
 */
export const downloadExcelTemplate = () => {
  // Create workbook
  const wb = XLSX.utils.book_new();
  
  // Create metadata sheet
  const metadataWs = XLSX.utils.json_to_sheet([{
    format_version: "1.0.0",
    completeness: 1.0,
    consistency: 1.0,
    subject_id: "SUBJECT-ID",
    subject_age: 30,
    subject_gender: "not_specified",
    recording_date: new Date().toISOString(),
    recording_duration_seconds: 120,
    eeg_device: "Device name",
    audio_device: "Device name"
  }]);
  XLSX.utils.book_append_sheet(wb, metadataWs, "Metadata");
  
  // Create EEG data template
  const eegData = [];
  for (let i = 0; i < 10; i++) { // Just a few sample rows
    eegData.push({
      timestamp: i / 250,
      channel_1: 0,
      channel_2: 0,
      // Add a few more channels as examples
      channel_3: 0,
      channel_4: 0,
      alpha: 0,
      beta: 0,
      gamma: 0,
      delta: 0,
      theta: 0
    });
  }
  const eegWs = XLSX.utils.json_to_sheet(eegData);
  XLSX.utils.book_append_sheet(wb, eegWs, "EEG_Data");
  
  // Create audio data template
  const audioData = [];
  for (let i = 0; i < 10; i++) { // Just a few sample rows
    audioData.push({
      sample_index: i,
      value: 0
    });
  }
  const audioWs = XLSX.utils.json_to_sheet(audioData);
  XLSX.utils.book_append_sheet(wb, audioWs, "Audio_Data");
  
  // Create text data template
  const textData = [];
  for (let i = 0; i < 5; i++) {
    textData.push({
      timestamp: i * 15, // every 15 seconds
      content: "Text content goes here",
      speech_rate: 150,
      pause_duration: 0.5,
      sentiment_score: 0
    });
  }
  const textWs = XLSX.utils.json_to_sheet(textData);
  XLSX.utils.book_append_sheet(wb, textWs, "Text_Data");
  
  // Add instructions sheet
  const instructionsWs = XLSX.utils.aoa_to_sheet([
    ["MODMA Dataset Excel Template - Instructions"],
    [""],
    ["This template allows you to create a MODMA-compatible dataset for mental health analysis."],
    [""],
    ["Sheets:"],
    ["1. Metadata - Contains metadata about the recording and subject"],
    ["2. EEG_Data - For EEG recordings with timestamps and channel values"],
    ["3. Audio_Data - For audio sample values"],
    ["4. Text_Data - For transcribed speech with timestamps"],
    [""],
    ["Instructions:"],
    ["1. Fill in the Metadata sheet with recording information"],
    ["2. Add EEG data to the EEG_Data sheet (add more columns for more channels as needed)"],
    ["3. Add audio samples to the Audio_Data sheet"],
    ["4. Add transcribed speech to the Text_Data sheet if available"],
    ["5. When complete, use the 'Upload' button in the application"]
  ]);
  XLSX.utils.book_append_sheet(wb, instructionsWs, "Instructions");
  
  // Generate Excel file and download
  XLSX.writeFile(wb, "modma_template.xlsx");
};

/**
 * Converts an Excel file to MODMA JSON format
 * @param file The Excel file to convert
 * @returns Promise that resolves to a MODMA dataset
 */
export const convertExcelToModma = async (file: File): Promise<ModmaDataset> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        if (!event.target?.result) {
          reject(new Error("Failed to read file"));
          return;
        }
        
        // Parse the Excel file
        const data = new Uint8Array(event.target.result as ArrayBuffer);
        const wb = XLSX.read(data, {type: 'array'});
        
        // Extract data from each sheet
        const metadataSheet = wb.Sheets['Metadata'];
        if (!metadataSheet) {
          reject(new Error("Excel file missing Metadata sheet"));
          return;
        }
        
        const metadataJson = XLSX.utils.sheet_to_json(metadataSheet);
        if (metadataJson.length === 0) {
          reject(new Error("Metadata sheet is empty"));
          return;
        }
        
        const metadataRow = metadataJson[0] as any;
        
        // Extract EEG data
        const eegSheet = wb.Sheets['EEG_Data'];
        if (!eegSheet) {
          reject(new Error("Excel file missing EEG_Data sheet"));
          return;
        }
        
        const eegData = XLSX.utils.sheet_to_json(eegSheet) as any[];
        
        // Extract audio data
        const audioSheet = wb.Sheets['Audio_Data'];
        if (!audioSheet) {
          reject(new Error("Excel file missing Audio_Data sheet"));
          return;
        }
        
        const audioData = XLSX.utils.sheet_to_json(audioSheet) as any[];
        const processedAudioData = audioData.map(row => row.value);
        
        // Extract text data if available
        let textData: any[] | undefined;
        const textSheet = wb.Sheets['Text_Data'];
        if (textSheet) {
          const rawTextData = XLSX.utils.sheet_to_json(textSheet) as any[];
          textData = rawTextData.map(row => ({
            timestamp: row.timestamp,
            content: row.content,
            metadata: {
              speech_rate: row.speech_rate,
              pause_duration: row.pause_duration,
              sentiment_score: row.sentiment_score
            }
          }));
        }
        
        // Construct the MODMA dataset
        const modmaDataset: ModmaDataset = {
          metadata: {
            format_version: metadataRow.format_version || "1.0.0",
            data_quality: {
              completeness: metadataRow.completeness || 1.0,
              consistency: metadataRow.consistency || 1.0
            },
            subject: {
              id: metadataRow.subject_id || "unknown",
              age: metadataRow.subject_age || 0,
              gender: metadataRow.subject_gender || "not_specified"
            },
            recording: {
              date: metadataRow.recording_date || new Date().toISOString(),
              duration_seconds: metadataRow.recording_duration_seconds || 0,
              device_info: {
                eeg: metadataRow.eeg_device || "unknown",
                audio: metadataRow.audio_device || "unknown"
              }
            }
          },
          eeg_data: eegData,
          audio_data: processedAudioData
        };
        
        if (textData && textData.length > 0) {
          modmaDataset.text_data = textData;
        }
        
        resolve(modmaDataset);
      } catch (error) {
        console.error("Error converting Excel to MODMA:", error);
        reject(new Error(`Excel conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`));
      }
    };
    
    reader.onerror = () => {
      reject(new Error("Error reading Excel file"));
    };
    
    reader.readAsArrayBuffer(file);
  });
};