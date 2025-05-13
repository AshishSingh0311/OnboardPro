import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { PerformanceMetrics } from '@/services/mockDataService';
import { formatPercentage } from '@/lib/utils';

interface ModelPerformanceCardProps {
  metrics: PerformanceMetrics;
  isLoading: boolean;
}

const ModelPerformanceCard: React.FC<ModelPerformanceCardProps> = ({ metrics, isLoading }) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Model Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="text-xs text-gray-500">Accuracy</div>
            <div className="text-xl font-medium">{formatPercentage(metrics.accuracy, 1)}</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="text-xs text-gray-500">Precision</div>
            <div className="text-xl font-medium">{formatPercentage(metrics.precision, 1)}</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="text-xs text-gray-500">Recall</div>
            <div className="text-xl font-medium">{formatPercentage(metrics.recall, 1)}</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="text-xs text-gray-500">F1 Score</div>
            <div className="text-xl font-medium">{formatPercentage(metrics.f1Score, 1)}</div>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="text-xs font-medium text-gray-700 mb-1">Robustness Index</div>
          <Progress value={metrics.robustnessIndex * 100} className="h-2" />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0</span>
            <span>Robust ({metrics.robustnessIndex.toFixed(2)})</span>
            <span>1.0</span>
          </div>
        </div>
        
        <div className="mt-4 text-xs text-gray-500">
          <div className="flex justify-between mb-1">
            <span>Inference Time:</span>
            <span className="font-medium">{metrics.inferenceTime.toFixed(0)}ms</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>GPU Usage:</span>
            <span className="font-medium">{metrics.gpuUsage.toFixed(0)}%</span>
          </div>
          <div className="flex justify-between">
            <span>FLOPs:</span>
            <span className="font-medium">{metrics.flops.toFixed(1)}B</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModelPerformanceCard;
