import { useState, useRef, useCallback } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  Check, 
  X, 
  Loader2, 
  FileText, 
  AlertCircle 
} from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { 
  isSupportedFileType, 
  createFileUploadState, 
  uploadFile, 
  FileUploadState 
} from '@/services/fileUploadService';
import { getFileTypeIcon } from '@/lib/utils';

interface DatasetUploadProps {
  onProcessComplete?: (success: boolean) => void;
}

const DatasetUpload = ({ onProcessComplete }: DatasetUploadProps) => {
  const [uploads, setUploads] = useState<FileUploadState[]>([]);
  const [processing, setProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (files.length === 0) return;
    
    // Create upload states for each file
    const newUploads = files.map(file => createFileUploadState(file));
    setUploads(prevUploads => [...prevUploads, ...newUploads]);
    
    // Start uploading each file
    for (const uploadState of newUploads) {
      setUploads(prevUploads => 
        prevUploads.map(u => 
          u.id === uploadState.id 
            ? { ...u, status: 'uploading' } 
            : u
        )
      );
      
      try {
        // Validate file type
        if (!isSupportedFileType(uploadState.file)) {
          throw new Error(`Unsupported file type: ${uploadState.file.type}`);
        }
        
        // Upload file
        await uploadFile(uploadState.file, (progress) => {
          setUploads(prevUploads => 
            prevUploads.map(u => 
              u.id === uploadState.id 
                ? { ...u, progress } 
                : u
            )
          );
        });
        
        // Mark as complete
        setUploads(prevUploads => 
          prevUploads.map(u => 
            u.id === uploadState.id 
              ? { ...u, status: 'complete', progress: 100 } 
              : u
          )
        );
        
        toast.success("File Uploaded", {
          description: `${uploadState.file.name} has been uploaded successfully.`
        });
      } catch (error) {
        // Handle error
        setUploads(prevUploads => 
          prevUploads.map(u => 
            u.id === uploadState.id 
              ? { 
                  ...u, 
                  status: 'error', 
                  errorMessage: error instanceof Error ? error.message : 'Unknown error' 
                } 
              : u
          )
        );
        
        toast.error("Upload Failed", {
          description: `Failed to upload ${uploadState.file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`
        });
      }
    }
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);
  
  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    
    const items = Array.from(event.dataTransfer.items);
    const files: File[] = [];
    
    items.forEach(item => {
      if (item.kind === 'file') {
        const file = item.getAsFile();
        if (file) files.push(file);
      }
    });
    
    if (files.length > 0) {
      const dataTransfer = new DataTransfer();
      files.forEach(file => dataTransfer.items.add(file));
      
      if (fileInputRef.current) {
        fileInputRef.current.files = dataTransfer.files;
        handleFileSelect({ target: { files: dataTransfer.files } } as React.ChangeEvent<HTMLInputElement>);
      }
    }
  }, [handleFileSelect]);
  
  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);
  
  const clearUploads = useCallback(() => {
    setUploads([]);
  }, []);
  
  const processData = useCallback(async () => {
    setProcessing(true);
    setProcessingProgress(0);
    
    // Simulate processing with progress updates
    const steps = 20;
    for (let i = 1; i <= steps; i++) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setProcessingProgress((i / steps) * 100);
    }
    
    setTimeout(() => {
      setProcessing(false);
      setProcessingProgress(100);
      
      toast.success("Data Processed", {
        description: "Files have been successfully processed and are ready for analysis."
      });
      
      if (onProcessComplete) {
        onProcessComplete(true);
      }
    }, 500);
  }, [onProcessComplete]);
  
  const uploadEmpty = uploads.length === 0;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dataset Upload</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground mb-4">
          Upload mental health data for analysis. Supported formats include EEG (.edf, .csv), 
          audio (.wav, .mp3), text (.txt), and visual data (.jpg, .png).
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div 
            className={`flex-1 border-2 border-dashed rounded-lg p-6 flex flex-col justify-center items-center
              ${uploadEmpty ? 'border-gray-300' : 'border-gray-200'} 
              hover:border-primary/50 transition-colors cursor-pointer`}
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <input 
              ref={fileInputRef}
              type="file" 
              className="hidden" 
              multiple 
              onChange={handleFileSelect}
            />
            
            <Upload className="h-10 w-10 text-gray-400 mb-3" />
            <p className="text-sm text-gray-500 text-center">
              <span className="font-medium text-primary">Click to upload</span> or drag and drop<br />
              EEG, audio, text, and visual files
            </p>
          </div>
          
          <div className="sm:w-1/3 bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Upload Status</h4>
            
            {uploadEmpty ? (
              <div className="text-center py-4">
                <p className="text-gray-500 text-sm">No files uploaded yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between text-xs text-gray-700">
                  <span>
                    Uploading files ({uploads.filter(u => u.status === 'complete').length}/{uploads.length})
                  </span>
                  <span>
                    {Math.round(
                      uploads.reduce((sum, u) => sum + u.progress, 0) / uploads.length
                    )}%
                  </span>
                </div>
                <Progress 
                  value={uploads.reduce((sum, u) => sum + u.progress, 0) / uploads.length} 
                  className="h-2 bg-gray-200"
                />
                
                <div className="space-y-2 mt-3 max-h-40 overflow-y-auto">
                  {uploads.map(upload => (
                    <div key={upload.id} className="flex items-center justify-between text-xs">
                      <div className="flex items-center">
                        {upload.status === 'complete' && <Check className="text-green-500 h-4 w-4 mr-1" />}
                        {upload.status === 'uploading' && <Loader2 className="text-blue-500 h-4 w-4 mr-1 animate-spin" />}
                        {upload.status === 'error' && <AlertCircle className="text-red-500 h-4 w-4 mr-1" />}
                        {upload.status === 'pending' && <FileText className="text-gray-500 h-4 w-4 mr-1" />}
                        <span className={upload.status === 'error' ? 'text-red-500' : ''}>
                          {upload.file.name}
                        </span>
                      </div>
                      <span className={
                        upload.status === 'complete' ? 'text-green-500' : 
                        upload.status === 'error' ? 'text-red-500' : 
                        'text-blue-500'
                      }>
                        {upload.status === 'complete' ? 'Complete' : 
                         upload.status === 'error' ? 'Failed' : 
                         upload.status === 'uploading' ? 'Uploading' : 'Pending'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-3">
              {uploads.length > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs text-gray-500 hover:text-gray-700"
                  onClick={clearUploads}
                >
                  Clear all uploads
                </Button>
              )}
              
              {uploads.length > 0 && (
                <Button 
                  onClick={processData} 
                  disabled={processing || uploads.some(u => u.status === 'uploading')}
                  className="w-full mt-3 bg-mind-green-500 hover:bg-mind-green-600"
                  size="sm"
                >
                  {processing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing ({Math.round(processingProgress)}%)
                    </>
                  ) : (
                    'Process Data'
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DatasetUpload;
