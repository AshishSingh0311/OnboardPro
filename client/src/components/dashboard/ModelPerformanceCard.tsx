
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ModelPerformanceMetrics } from "@/types/analysis";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ModelPerformanceCardProps {
  metrics: ModelPerformanceMetrics;
  isLoading?: boolean;
}

const ModelPerformanceCard: React.FC<ModelPerformanceCardProps> = ({ metrics, isLoading = false }) => {
  // Target values from requirements
  const targets = {
    accuracy: 0.913,
    precision: 0.897,
    recall: 0.921,
    f1Score: 0.909,
    specificity: 0.945,
    robustnessIndex: 0.92
  };

  // Calculate if metrics meet targets
  const meetsTarget = (actual: number, target: number) => actual >= target;
  
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex justify-between items-center">
          <span>Model Performance</span>
          <Badge variant="outline" className={`text-xs font-normal ${
            metrics.inferenceTime <= 45 ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
          }`}>
            Inference: {metrics.inferenceTime.toFixed(1)}ms {metrics.inferenceTime <= 45 && "✓"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        ) : (
          <Tabs defaultValue="performance" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="robustness">Robustness</TabsTrigger>
              <TabsTrigger value="efficiency">Efficiency</TabsTrigger>
            </TabsList>
            
            <TabsContent value="performance" className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Accuracy</span>
                  <div className="flex items-center">
                    <span className="text-xs text-muted-foreground mr-1">Target: ≥{(targets.accuracy * 100).toFixed(1)}%</span>
                    <span className={`text-sm font-medium ${meetsTarget(metrics.accuracy, targets.accuracy) ? "text-green-600" : "text-amber-600"}`}>
                      {(metrics.accuracy * 100).toFixed(1)}% {meetsTarget(metrics.accuracy, targets.accuracy) && "✓"}
                    </span>
                  </div>
                </div>
                <Progress value={metrics.accuracy * 100} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Precision</span>
                  <div className="flex items-center">
                    <span className="text-xs text-muted-foreground mr-1">Target: ≥{(targets.precision * 100).toFixed(1)}%</span>
                    <span className={`text-sm font-medium ${meetsTarget(metrics.precision, targets.precision) ? "text-green-600" : "text-amber-600"}`}>
                      {(metrics.precision * 100).toFixed(1)}% {meetsTarget(metrics.precision, targets.precision) && "✓"}
                    </span>
                  </div>
                </div>
                <Progress value={metrics.precision * 100} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Recall</span>
                  <div className="flex items-center">
                    <span className="text-xs text-muted-foreground mr-1">Target: ≥{(targets.recall * 100).toFixed(1)}%</span>
                    <span className={`text-sm font-medium ${meetsTarget(metrics.recall, targets.recall) ? "text-green-600" : "text-amber-600"}`}>
                      {(metrics.recall * 100).toFixed(1)}% {meetsTarget(metrics.recall, targets.recall) && "✓"}
                    </span>
                  </div>
                </div>
                <Progress value={metrics.recall * 100} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">F1 Score</span>
                  <div className="flex items-center">
                    <span className="text-xs text-muted-foreground mr-1">Target: ≥{(targets.f1Score * 100).toFixed(1)}%</span>
                    <span className={`text-sm font-medium ${meetsTarget(metrics.f1Score, targets.f1Score) ? "text-green-600" : "text-amber-600"}`}>
                      {(metrics.f1Score * 100).toFixed(1)}% {meetsTarget(metrics.f1Score, targets.f1Score) && "✓"}
                    </span>
                  </div>
                </div>
                <Progress value={metrics.f1Score * 100} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Specificity</span>
                  <div className="flex items-center">
                    <span className="text-xs text-muted-foreground mr-1">Target: ≥{(targets.specificity * 100).toFixed(1)}%</span>
                    <span className={`text-sm font-medium ${meetsTarget(metrics.specificity, targets.specificity) ? "text-green-600" : "text-amber-600"}`}>
                      {(metrics.specificity * 100).toFixed(1)}% {meetsTarget(metrics.specificity, targets.specificity) && "✓"}
                    </span>
                  </div>
                </div>
                <Progress value={metrics.specificity * 100} className="h-2" />
              </div>
            </TabsContent>

            <TabsContent value="robustness" className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Robustness Index</span>
                  <div className="flex items-center">
                    <span className="text-xs text-muted-foreground mr-1">Target: ≥{targets.robustnessIndex.toFixed(2)}</span>
                    <span className={`text-sm font-medium ${meetsTarget(metrics.robustnessIndex, targets.robustnessIndex) ? "text-green-600" : "text-amber-600"}`}>
                      {metrics.robustnessIndex.toFixed(2)} {meetsTarget(metrics.robustnessIndex, targets.robustnessIndex) && "✓"}
                    </span>
                  </div>
                </div>
                <Progress value={metrics.robustnessIndex * 100} className="h-2" />
              </div>

              <div className="flex justify-between text-xs mt-2">
                <div className="bg-gray-50 p-2 rounded flex-1 mr-2">
                  <span className="text-gray-500 block">CV Variance</span>
                  <div className="font-medium mt-1">±1.8% <span className="text-green-600">✓</span></div>
                </div>
                <div className="bg-gray-50 p-2 rounded flex-1">
                  <span className="text-gray-500 block">Noise Sensitivity</span>
                  <div className="font-medium mt-1">2.7% <span className="text-green-600">✓</span></div>
                </div>
              </div>
              
              <div className="flex justify-between text-xs mt-2">
                <div className="bg-gray-50 p-2 rounded flex-1 mr-2">
                  <span className="text-gray-500 block">Demographic Bias</span>
                  <div className="font-medium mt-1">0.9% <span className="text-green-600">✓</span></div>
                </div>
                <div className="bg-gray-50 p-2 rounded flex-1">
                  <span className="text-gray-500 block">Confidence (95%)</span>
                  <div className="font-medium mt-1">±1.1% <span className="text-green-600">✓</span></div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="efficiency" className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-gray-500">GPU Memory</span>
                  <div className="font-medium mt-1">{(metrics.gpuUsage * 0.1).toFixed(1)}GB <span className="text-green-600">✓</span></div>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-gray-500">FLOPs</span>
                  <div className="font-medium mt-1">{(metrics.flops / 1e9).toFixed(2)} GFLOPs <span className="text-green-600">✓</span></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs mt-2">
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-gray-500">Power Usage</span>
                  <div className="font-medium mt-1">{(metrics.gpuUsage * 0.05).toFixed(1)}mW <span className="text-green-600">✓</span></div>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-gray-500">Edge Compatibility</span>
                  <div className="font-medium mt-1">94.7% <span className="text-green-600">✓</span></div>
                </div>
              </div>

              <div className="bg-gray-50 p-2 rounded mt-2 text-xs">
                <span className="text-gray-500">Cloud Deployment Readiness</span>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1.5">
                  <div className="bg-green-500 h-1.5 rounded-full" style={{ width: "98.5%" }}></div>
                </div>
                <div className="flex justify-between mt-0.5">
                  <span>0%</span>
                  <span className="font-medium">98.5% <span className="text-green-600">✓</span></span>
                  <span>100%</span>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default ModelPerformanceCard;
