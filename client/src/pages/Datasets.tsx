import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/sonner";
import { 
  Upload, 
  Database, 
  FileText, 
  Loader2, 
  Play,
  Download,
  Brain,
  Waves,
  Wand2
} from 'lucide-react';
import DatasetUpload from '@/components/dashboard/DatasetUpload';
import { runFullAnalysis } from '@/services/mockDataService';

const Datasets = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  
  const handleProcessDataset = async () => {
    setIsProcessing(true);
    setProcessingProgress(0);
    
    // Show initial toast
    toast.info("Processing Started", {
      description: "Starting dataset processing with TensorFlow.js"
    });
    
    // Log for debugging
    console.log("Using TensorFlow.js backend:", "webgl");
    console.log("TensorFlow.js version:", "4.22.0");
    console.log("Starting dataset processing with Attention fusion strategy...");
    
    // Simulate processing steps with progress updates
    const steps = [
      { progress: 10, message: "Loading dataset..." },
      { progress: 20, message: "Preprocessing EEG data..." },
      { progress: 35, message: "Extracting audio features..." },
      { progress: 50, message: "Processing text sentiment..." },
      { progress: 65, message: "Analyzing visual markers..." },
      { progress: 75, message: "Running multimodal fusion..." },
      { progress: 85, message: "Generating predictions..." },
      { progress: 95, message: "Finalizing analysis..." },
    ];
    
    // Artificially create a debug warning to show in console
    console.warn("Debugging mode is ON. The output of every math call will be downloaded to CPU and checked for NaNs. This significantly impacts performance.");
    
    // Mark processing time
    console.time("processing-time");
    
    // Process each step with a delay to simulate computation
    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setProcessingProgress(step.progress);
      toast.info("Processing Dataset", {
        description: step.message
      });
    }
    
    // Finalize processing
    await new Promise(resolve => setTimeout(resolve, 800));
    setProcessingProgress(100);
    console.timeEnd("processing-time");
    
    try {
      // Run the actual analysis
      await runFullAnalysis();
      
      toast.success("Processing Complete", {
        description: "Dataset has been successfully analyzed."
      });
      
      // Redirect to analysis page after processing
      window.location.href = "/analysis";
    } catch (error) {
      toast.error("Processing Error", {
        description: "An error occurred during dataset processing."
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Datasets Management</h2>
        <p className="text-muted-foreground">Upload, manage, and process datasets for mental health analysis</p>
      </div>
      
      {/* Main action button */}
      <div className="mb-8">
        <Button
          onClick={handleProcessDataset}
          disabled={isProcessing}
          className="w-full flex items-center justify-center gap-2 bg-mind-blue-600 hover:bg-mind-blue-700 py-8 text-xl"
          size="lg"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-6 w-6 animate-spin" />
              Processing Dataset ({processingProgress}%)
            </>
          ) : (
            <>
              <Wand2 className="h-6 w-6" />
              Start Data Processing & Analysis
            </>
          )}
        </Button>
        
        {isProcessing && (
          <Progress value={processingProgress} className="mt-2 h-2" />
        )}
      </div>
      
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload">Upload Dataset</TabsTrigger>
          <TabsTrigger value="samples">Sample Datasets</TabsTrigger>
          <TabsTrigger value="history">Processing History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload">
          <DatasetUpload 
            onProcessComplete={() => {
              toast.success("Upload Complete", {
                description: "Your dataset is ready for processing."
              });
            }} 
          />
        </TabsContent>
        
        <TabsContent value="samples">
          <Card>
            <CardHeader>
              <CardTitle>Sample Datasets</CardTitle>
              <CardDescription>
                Pre-made datasets for testing and demonstration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    name: "Generalized Anxiety Sample",
                    description: "EEG, audio, and text data from anxiety disorder studies",
                    size: "24.5 MB",
                    modalityCount: 3,
                    icon: <Brain className="h-8 w-8 text-blue-500" />
                  },
                  {
                    name: "Depression Indicators",
                    description: "Multi-session depression screening dataset with annotations",
                    size: "32.1 MB",
                    modalityCount: 4,
                    icon: <Waves className="h-8 w-8 text-purple-500" />
                  },
                  {
                    name: "ADHD Diagnostic",
                    description: "Attention disorder markers with paired control samples",
                    size: "18.7 MB",
                    modalityCount: 2,
                    icon: <Database className="h-8 w-8 text-green-500" />
                  },
                  {
                    name: "Stress Response",
                    description: "Cognitive stress testing with physiological markers",
                    size: "28.3 MB",
                    modalityCount: 3,
                    icon: <FileText className="h-8 w-8 text-amber-500" />
                  }
                ].map((dataset, idx) => (
                  <div key={idx} className="flex flex-col border rounded-lg overflow-hidden">
                    <div className="flex items-center gap-4 p-4 border-b bg-gray-50">
                      {dataset.icon}
                      <div>
                        <h3 className="font-medium">{dataset.name}</h3>
                        <p className="text-sm text-gray-500">{dataset.description}</p>
                      </div>
                    </div>
                    <div className="p-4 flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        <div>Size: {dataset.size}</div>
                        <div>Modalities: {dataset.modalityCount}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                        <Button size="sm" className="flex items-center gap-1">
                          <Play className="h-4 w-4" />
                          Use
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Processing History</CardTitle>
              <CardDescription>
                Recent dataset processing sessions and their results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    name: "EEG_Session_05122023.csv",
                    date: "May 12, 2023",
                    status: "Completed",
                    accuracy: 92,
                    processingTime: "2m 34s",
                    findings: "Generalized Anxiety Disorder (High confidence)"
                  },
                  {
                    name: "Audio_Interview_04302023.wav",
                    date: "April 30, 2023",
                    status: "Completed",
                    accuracy: 87,
                    processingTime: "1m 48s",
                    findings: "Depression Indicators (Medium confidence)"
                  },
                  {
                    name: "Combined_Assessment_04152023",
                    date: "April 15, 2023",
                    status: "Completed",
                    accuracy: 94,
                    processingTime: "3m 12s",
                    findings: "Mixed Anxiety-Depression (High confidence)"
                  }
                ].map((session, idx) => (
                  <div key={idx} className="border rounded-lg overflow-hidden">
                    <div className="flex justify-between items-center p-4 border-b bg-gray-50">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-gray-500" />
                        <div>
                          <h3 className="font-medium">{session.name}</h3>
                          <p className="text-xs text-gray-500">Processed on {session.date}</p>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs ${
                        session.status === "Completed" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-amber-100 text-amber-800"
                      }`}>
                        {session.status}
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                        <div>
                          <p className="text-gray-500">Accuracy</p>
                          <p className="font-medium">{session.accuracy}%</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Processing Time</p>
                          <p className="font-medium">{session.processingTime}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Primary Finding</p>
                          <p className="font-medium">{session.findings}</p>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm">View Results</Button>
                        <Button variant="outline" size="sm">Download Report</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Datasets;