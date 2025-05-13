import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PerformanceMetrics } from '@/services/mockDataService';
import { formatPercentage } from '@/lib/utils';

interface ModelMetricsTableProps {
  metrics: PerformanceMetrics;
  isLoading: boolean;
}

const ModelMetricsTable: React.FC<ModelMetricsTableProps> = ({ metrics, isLoading }) => {
  // Group metrics for display
  const accuracyMetrics = [
    { name: 'Accuracy', value: formatPercentage(metrics.accuracy), description: 'Overall correctness of predictions' },
    { name: 'Precision', value: formatPercentage(metrics.precision), description: 'Positive predictive value (true positives / predicted positives)' },
    { name: 'Recall', value: formatPercentage(metrics.recall), description: 'Sensitivity or true positive rate (true positives / actual positives)' },
    { name: 'F1 Score', value: formatPercentage(metrics.f1Score), description: 'Harmonic mean of precision and recall' },
    { name: 'Specificity', value: formatPercentage(metrics.specificity), description: 'True negative rate (true negatives / actual negatives)' },
  ];
  
  const performanceMetrics = [
    { name: 'Inference Time', value: `${metrics.inferenceTime.toFixed(0)}ms`, description: 'Average time to process one sample' },
    { name: 'GPU Usage', value: `${metrics.gpuUsage.toFixed(0)}%`, description: 'GPU utilization during inference' },
    { name: 'FLOPs', value: `${metrics.flops.toFixed(1)}B`, description: 'Floating point operations per inference' },
    { name: 'Robustness Index', value: metrics.robustnessIndex.toFixed(2), description: 'Model stability against input variations (0-1)' },
  ];
  
  // Helper to get badge variant based on metric value
  const getBadgeVariant = (metric: string, value: string) => {
    const numValue = parseFloat(value.replace('%', ''));
    
    if (['Accuracy', 'Precision', 'Recall', 'F1 Score', 'Specificity'].includes(metric)) {
      if (numValue >= 90) return "default";
      if (numValue >= 80) return "secondary";
      return "outline";
    }
    
    if (metric === 'Robustness Index') {
      if (numValue >= 0.8) return "default";
      if (numValue >= 0.6) return "secondary";
      return "outline";
    }
    
    return "outline";
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-40" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detailed Model Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium mb-3">Accuracy Metrics</h3>
            <table className="min-w-full">
              <tbody className="divide-y divide-gray-200">
                {accuracyMetrics.map((metric, idx) => (
                  <tr key={idx}>
                    <td className="py-2 pr-2 text-sm font-medium">{metric.name}</td>
                    <td className="py-2 px-2">
                      <Badge variant={getBadgeVariant(metric.name, metric.value)}>
                        {metric.value}
                      </Badge>
                    </td>
                    <td className="py-2 pl-2 text-xs text-muted-foreground">{metric.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-3">Performance Metrics</h3>
            <table className="min-w-full">
              <tbody className="divide-y divide-gray-200">
                {performanceMetrics.map((metric, idx) => (
                  <tr key={idx}>
                    <td className="py-2 pr-2 text-sm font-medium">{metric.name}</td>
                    <td className="py-2 px-2">
                      <Badge variant={getBadgeVariant(metric.name, metric.value)}>
                        {metric.value}
                      </Badge>
                    </td>
                    <td className="py-2 pl-2 text-xs text-muted-foreground">{metric.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="mt-6 bg-gray-50 p-3 rounded-md">
              <h4 className="text-sm font-medium mb-1">Model Card</h4>
              <p className="text-xs text-muted-foreground">
                The multimodal fusion model is trained on a diverse dataset of 2,483 samples across 5 mental health conditions.
                It combines data from EEG, audio recordings, text responses, and facial expressions to provide comprehensive
                mental health assessments. The model shows strong performance across all metrics with particular strength
                in generalization to new subjects.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModelMetricsTable;
