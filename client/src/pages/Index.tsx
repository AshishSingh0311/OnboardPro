
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import AnalysisSummaryCard from '@/components/dashboard/AnalysisSummaryCard';
import EEGVisualization from '@/components/dashboard/EEGVisualization';
import FeatureImportanceChart from '@/components/dashboard/FeatureImportanceChart';
import ModelPerformanceCard from '@/components/dashboard/ModelPerformanceCard';
import RecommendationsPanel from '@/components/dashboard/RecommendationsPanel';
import ModelComparison from '@/components/dashboard/ModelComparison';
import DatasetDetails from '@/components/dashboard/DatasetDetails';
import ModelMetricsTable from '@/components/dashboard/ModelMetricsTable';
import DatasetUpload from '@/components/dashboard/DatasetUpload';
import PerformanceEvaluation from '@/components/dashboard/PerformanceEvaluation';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/sonner';
import { runFullAnalysis } from '@/services/mockDataService';

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const runAnalysis = async () => {
    setIsLoading(true);
    try {
      const result = await runFullAnalysis();
      setAnalysisResult(result);
      toast.success("Analysis Complete", {
        description: "Mental health analysis has been processed successfully."
      });
    } catch (error) {
      toast.error("Analysis Failed", {
        description: "There was an error processing the mental health analysis."
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Auto-run analysis on first load
    runAnalysis();
  }, []);

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Mental Health AI Dashboard</h2>
        <Button 
          onClick={runAnalysis} 
          disabled={isLoading}
          className="bg-mind-blue-500 hover:bg-mind-blue-600"
        >
          {isLoading ? (
            <>
              <span className="animate-spin mr-2">⟳</span>
              Processing...
            </>
          ) : (
            "Run New Analysis"
          )}
        </Button>
      </div>

      {/* Dataset Upload Section */}
      <div className="mb-6">
        <DatasetUpload />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-2">
          <AnalysisSummaryCard 
            modelOutput={analysisResult?.modelOutput || {
              prediction: { label: "", probability: 0 },
              severity: 0,
              confidence: 0,
              attention: { eeg: 0, audio: 0, text: 0, visual: 0 },
              featureImportance: {}
            }} 
            isLoading={isLoading} 
          />
        </div>
        <div>
          <ModelPerformanceCard 
            metrics={analysisResult?.performanceMetrics || {
              accuracy: 0,
              precision: 0,
              recall: 0,
              f1Score: 0,
              specificity: 0,
              robustnessIndex: 0,
              gpuUsage: 0,
              inferenceTime: 0,
              flops: 0
            }} 
            isLoading={isLoading} 
          />
        </div>
      </div>

      {/* Performance Evaluation Section */}
      <div className="mb-6">
        <PerformanceEvaluation isLoading={isLoading} />
      </div>

      {/* Dataset Details Section */}
      <div className="mb-6">
        <DatasetDetails isLoading={isLoading} />
      </div>

      {/* Model Comparison Section */}
      <div className="mb-6">
        <ModelComparison isLoading={isLoading} />
      </div>

      <Tabs defaultValue="visualizations" className="mb-6">
        <TabsList>
          <TabsTrigger value="visualizations">AI Visualizations</TabsTrigger>
          <TabsTrigger value="metrics">Model Metrics</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="visualizations">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <EEGVisualization 
                eegData={analysisResult?.eegData || {
                  alpha: [],
                  beta: [],
                  gamma: [],
                  delta: [],
                  theta: [],
                  timestamp: []
                }} 
                isLoading={isLoading} 
              />
            </div>
            <div>
              <FeatureImportanceChart 
                modelOutput={analysisResult?.modelOutput || {
                  prediction: { label: "", probability: 0 },
                  severity: 0,
                  confidence: 0,
                  attention: { eeg: 0, audio: 0, text: 0, visual: 0 },
                  featureImportance: {}
                }} 
                isLoading={isLoading}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="metrics">
          <ModelMetricsTable 
            metrics={analysisResult?.performanceMetrics || {
              accuracy: 0,
              precision: 0,
              recall: 0,
              f1Score: 0,
              specificity: 0,
              robustnessIndex: 0,
              gpuUsage: 0,
              inferenceTime: 0,
              flops: 0
            }}
            isLoading={isLoading}
          />
        </TabsContent>
        
        <TabsContent value="recommendations">
          <RecommendationsPanel 
            recommendations={analysisResult?.recommendations || {
              therapyRecommendations: [],
              specialistReferrals: [],
              wellnessTips: []
            }} 
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>

      <div className="text-sm text-muted-foreground p-4 bg-gray-50 rounded-md">
        <p className="font-medium mb-1">About this project</p>
        <p>
          This AI system combines multimodal data (EEG, audio, visual, and text) using deep learning 
          to assess mental health conditions. The analysis includes attention-based fusion of different modalities 
          and provides XAI-based explanations of the predictions.
        </p>
      </div>
    </DashboardLayout>
  );
};

export default Index;
