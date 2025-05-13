
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from '@/components/ui/sonner';
import { UploadCloud, FileText, Download, HelpCircle, FileSpreadsheet } from "lucide-react";
import { processDataset } from '@/services/dataProcessingService';
import { ProcessingResult } from '@/types/dataProcessing';
import { downloadSampleDataset, downloadExcelTemplate, convertExcelToModma } from '@/services/sampleDatasetService';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const DatasetUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [processingResult, setProcessingResult] = useState<ProcessingResult | null>(null);
  const [fusionType, setFusionType] = useState<'Early' | 'Late' | 'Attention'>('Attention');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("No File Selected", {
        description: "Please select a file to upload."
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      let dataToProcess = selectedFile;
      
      // If it's an Excel file, convert it to MODMA JSON format first
      if (selectedFile.name.endsWith('.xlsx') || selectedFile.name.endsWith('.xls')) {
        try {
          const modmaData = await convertExcelToModma(selectedFile);
          const jsonBlob = new Blob([JSON.stringify(modmaData)], { type: 'application/json' });
          dataToProcess = new File([jsonBlob], 'converted-excel.json', { type: 'application/json' });
          
          toast.success("Excel File Converted", {
            description: "Successfully converted Excel file to MODMA format."
          });
        } catch (error) {
          toast.error("Conversion Error", {
            description: "Failed to convert Excel file to MODMA format."
          });
          setIsUploading(false);
          return;
        }
      }
      
      // Process the data with the selected fusion type
      const result = await processDataset(dataToProcess, fusionType);
      setProcessingResult(result);
      
      if (result.error) {
        toast.error("Processing Error", {
          description: result.error
        });
      } else {
        toast.success("Processing Complete", {
          description: "Dataset has been successfully processed."
        });
      }
    } catch (error) {
      console.error("Error processing dataset:", error);
      toast.error("Processing Error", {
        description: "An unexpected error occurred during processing."
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownloadResults = () => {
    if (!processingResult) return;
    
    // Create a JSON blob and download it
    const jsonData = JSON.stringify(processingResult, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mental-health-analysis-results.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Results Downloaded", {
      description: "Analysis results have been downloaded as JSON."
    });
  };

  const handleDownloadSample = () => {
    try {
      downloadSampleDataset();
      toast.success("Sample Dataset Generated", {
        description: "A sample MODMA dataset has been downloaded."
      });
    } catch (error) {
      toast.error("Download Failed", {
        description: "Failed to generate the sample dataset."
      });
    }
  };
  
  const handleDownloadExcelTemplate = () => {
    try {
      downloadExcelTemplate();
      toast.success("Excel Template Downloaded", {
        description: "An Excel template has been downloaded. Fill it with your data and upload."
      });
    } catch (error) {
      toast.error("Download Failed", {
        description: "Failed to generate the Excel template."
      });
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          Dataset Upload & Processing
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6 ml-2">
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-xs">
                  Upload MODMA-format datasets containing EEG, audio, and text data. 
                  Supported formats: JSON, CSV, EDF, and Excel (.xlsx).
                  You can download templates to help you format your data.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="w-full sm:w-1/2">
            <div className="border-2 border-dashed border-gray-200 rounded-md p-6 text-center hover:border-gray-300 transition-all cursor-pointer bg-gray-50" onClick={() => document.getElementById('file-upload')?.click()}>
              <UploadCloud className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm font-medium">
                {selectedFile ? selectedFile.name : "Click to upload MODMA dataset"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Supports EEG, audio, and multimodal data files (.json, .csv, .edf, .xlsx)
              </p>
              <input 
                id="file-upload" 
                type="file" 
                accept=".csv,.json,.edf,.xlsx,.xls" 
                className="hidden" 
                onChange={handleFileSelect}
              />
            </div>
            
            <div className="flex flex-wrap gap-2 mt-3 mb-3">
              <Button 
                variant="outline"
                size="sm"
                onClick={handleDownloadSample}
                className="flex-1"
              >
                <Download className="w-3 h-3 mr-1" />
                Get Sample Dataset
              </Button>
              <Button 
                variant="outline"
                size="sm"
                onClick={handleDownloadExcelTemplate}
                className="flex-1"
              >
                <FileSpreadsheet className="w-3 h-3 mr-1" />
                Excel Template
              </Button>
            </div>
            
            {/* Fusion Type Selector */}
            <div className="mt-3 mb-3">
              <label className="text-sm font-medium">Fusion Method:</label>
              <div className="grid grid-cols-3 gap-2 mt-1">
                <Button 
                  type="button" 
                  variant={fusionType === 'Early' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFusionType('Early')}
                >
                  Early
                </Button>
                <Button 
                  type="button" 
                  variant={fusionType === 'Late' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFusionType('Late')}
                >
                  Late
                </Button>
                <Button 
                  type="button" 
                  variant={fusionType === 'Attention' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFusionType('Attention')}
                >
                  Attention
                </Button>
              </div>
            </div>
            
            <Button 
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="w-full mt-3"
            >
              {isUploading ? (
                <>
                  <span className="animate-spin mr-2">⟳</span>
                  Processing...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  Process Dataset
                </>
              )}
            </Button>
          </div>
          
          <div className="w-full sm:w-1/2 bg-gray-50 p-4 rounded-md">
            <h4 className="font-medium text-sm mb-2">Processing Algorithm</h4>
            <ol className="text-xs space-y-1 text-muted-foreground list-decimal list-inside">
              <li>Validate dataset format & quality</li>
              <li>Extract EEG (128-channel & 3-channel) features</li>
              <li>Extract audio features</li>
              <li>Apply fusion method ({fusionType})</li>
              <li>Generate predictions with hybrid model</li>
              <li>Explain results with SHAP</li>
            </ol>
            
            {processingResult && !processingResult.error && (
              <Button
                variant="outline"
                size="sm"
                className="mt-3 w-full"
                onClick={handleDownloadResults}
              >
                <Download className="w-3 h-3 mr-1" />
                Download Results
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DatasetUpload;
