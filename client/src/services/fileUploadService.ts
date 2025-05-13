import * as tf from '@tensorflow/tfjs';

// Supported file types
export const supportedFileTypes = {
  eeg: ['.edf', '.csv'],
  audio: ['.wav', '.mp3'],
  text: ['.txt', '.csv', '.json'],
  visual: ['.jpg', '.jpeg', '.png']
};

// File type categories
export type FileCategory = 'eeg' | 'audio' | 'text' | 'visual' | 'other';

// Upload state for tracking file uploads
export interface FileUploadState {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'complete' | 'error';
  category: FileCategory;
  errorMessage?: string;
}

// Function to check if a file type is supported
export function isSupportedFileType(file: File): boolean {
  const extension = `.${file.name.split('.').pop()?.toLowerCase()}`;
  
  return Object.values(supportedFileTypes).some(types => 
    types.includes(extension)
  );
}

// Determine file category based on file extension
export function getFileCategory(file: File): FileCategory {
  const extension = `.${file.name.split('.').pop()?.toLowerCase()}`;
  
  for (const [category, extensions] of Object.entries(supportedFileTypes)) {
    if (extensions.includes(extension)) {
      return category as FileCategory;
    }
  }
  
  return 'other';
}

// Create a new file upload state object
export function createFileUploadState(file: File): FileUploadState {
  return {
    id: generateId(),
    file,
    progress: 0,
    status: 'pending',
    category: getFileCategory(file)
  };
}

// Generate a random ID for the upload
function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

// Read EEG data from file
export async function readEEGFile(file: File): Promise<number[][] | null> {
  try {
    const text = await readFileAsText(file);
    
    if (file.name.endsWith('.csv')) {
      // Parse CSV
      const lines = text.split('\n');
      return lines.map(line => 
        line.split(',').map(Number).filter(val => !isNaN(val))
      ).filter(line => line.length > 0);
    } else if (file.name.endsWith('.edf')) {
      // For EDF files, we'd need a specialized parser
      // This is a simplified placeholder
      console.warn('EDF parsing is not fully implemented');
      // Return mock data for demonstration
      return Array.from({ length: 5 }, () => 
        Array.from({ length: 100 }, () => Math.random())
      );
    }
    
    return null;
  } catch (error) {
    console.error('Error reading EEG file:', error);
    return null;
  }
}

// Read audio data from file
export async function readAudioFile(file: File): Promise<Float32Array | null> {
  try {
    const arrayBuffer = await readFileAsArrayBuffer(file);
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    const channelData = audioBuffer.getChannelData(0); // Get first channel
    
    return channelData;
  } catch (error) {
    console.error('Error reading audio file:', error);
    return null;
  }
}

// Read text data from file
export async function readTextFile(file: File): Promise<string | null> {
  try {
    return await readFileAsText(file);
  } catch (error) {
    console.error('Error reading text file:', error);
    return null;
  }
}

// Read image data from file
export async function readImageFile(file: File): Promise<HTMLImageElement | null> {
  try {
    const url = URL.createObjectURL(file);
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve(img);
        URL.revokeObjectURL(url);
      };
      img.onerror = () => {
        reject(new Error('Failed to load image'));
        URL.revokeObjectURL(url);
      };
      img.src = url;
    });
  } catch (error) {
    console.error('Error reading image file:', error);
    return null;
  }
}

// Convert image to tensor
export async function imageToTensor(image: HTMLImageElement): Promise<tf.Tensor | null> {
  try {
    return tf.browser.fromPixels(image)
      .resizeNearestNeighbor([224, 224]) // Resize to model input size
      .toFloat()
      .expandDims(0); // Add batch dimension
  } catch (error) {
    console.error('Error converting image to tensor:', error);
    return null;
  }
}

// Helper: Read file as text
function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

// Helper: Read file as array buffer
function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

// Simulated file upload function
export async function uploadFile(file: File, onProgress: (progress: number) => void): Promise<boolean> {
  // Validate file
  if (!isSupportedFileType(file)) {
    throw new Error(`Unsupported file type: ${file.type}`);
  }
  
  // Simulate upload with progress updates
  const totalChunks = 10;
  for (let i = 1; i <= totalChunks; i++) {
    await new Promise(resolve => setTimeout(resolve, 200));
    onProgress((i / totalChunks) * 100);
  }
  
  return true;
}
