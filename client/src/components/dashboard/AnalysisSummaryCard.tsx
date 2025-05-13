import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ModelOutput } from '@/services/mockDataService';
import { getSeverityLabel, formatPercentage } from '@/lib/utils';

interface AnalysisSummaryCardProps {
  modelOutput: ModelOutput;
  isLoading: boolean;
}

const AnalysisSummaryCard: React.FC<AnalysisSummaryCardProps> = ({ 
  modelOutput, 
  isLoading 
}) => {
  // Get severity label (Mild, Moderate, Severe)
  const severityLabel = getSeverityLabel(modelOutput.severity);
  
  // Get badge variant based on severity
  const badgeVariant = 
    modelOutput.severity < 3 ? "outline" : 
    modelOutput.severity < 7 ? "secondary" : 
    "destructive";
  
  // Get sorted feature importance entries
  const sortedFeatures = Object.entries(modelOutput.featureImportance)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4);
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-6 w-24" />
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-7 w-56 mb-2" />
          <Skeleton className="h-5 w-full mb-5" />
          
          <Skeleton className="h-32 w-full mb-4" />
          
          <Skeleton className="h-6 w-48 mb-3" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          <span>Analysis Summary</span>
          <Badge className="ml-2" variant={badgeVariant}>
            {severityLabel}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-xl font-medium mb-2">{modelOutput.prediction.label}</div>
        <div className="text-muted-foreground mb-4">
          Condition detected based on multimodal data analysis with {formatPercentage(modelOutput.confidence)} confidence.
        </div>
        
        <div className="bg-blue-50 border border-blue-100 rounded-md p-4 mb-4">
          <h3 className="text-md font-medium mb-2 text-blue-800">Clinical Insights</h3>
          <p className="text-sm text-blue-700 mb-2">
            Based on the multimodal analysis, the following patterns were detected:
          </p>
          <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
            <li>
              {modelOutput.attention.eeg > 0.7 
                ? "Significant EEG anomalies in frontal lobe activity" 
                : "Minimal EEG pattern variations from baseline"}
            </li>
            <li>
              {modelOutput.attention.audio > 0.7 
                ? "Notable speech pattern irregularities detected" 
                : "Speech patterns show typical variations"}
            </li>
            <li>
              {modelOutput.attention.text > 0.7 
                ? "Text analysis reveals concerning emotional patterns" 
                : "Text sentiment shows moderate emotional variability"}
            </li>
            <li>
              {modelOutput.attention.visual > 0.7 
                ? "Facial expressions indicate significant emotional distress" 
                : "Facial expressions show typical emotional responses"}
            </li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-md font-medium mb-2">Key Contributing Factors</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            {sortedFeatures.map(([feature, importance], idx) => (
              <div key={idx} className="bg-gray-50 p-3 rounded-md flex justify-between items-center">
                <span className="capitalize">{feature.replace(/_/g, ' ')}</span>
                <Badge variant="secondary" className="ml-2">
                  {formatPercentage(importance, 0)} impact
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalysisSummaryCard;
