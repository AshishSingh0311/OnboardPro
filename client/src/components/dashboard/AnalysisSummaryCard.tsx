
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ModelOutput } from "@/types/analysis";

interface AnalysisSummaryCardProps {
  modelOutput: ModelOutput;
  isLoading?: boolean;
}

const AnalysisSummaryCard: React.FC<AnalysisSummaryCardProps> = ({ modelOutput, isLoading = false }) => {
  const getSeverityColor = (severity: number) => {
    if (severity < 3) return "text-mind-green-500";
    if (severity < 7) return "text-amber-500";
    return "text-mind-red-500";
  };
  
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex justify-between items-center">
          <span>Analysis Summary</span>
          <span className="text-sm font-normal bg-mind-blue-50 text-mind-blue-700 px-2 py-1 rounded-full">
            {isLoading ? "Analyzing..." : "Confidence: " + (modelOutput.confidence * 100).toFixed(1) + "%"}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-6 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <div className="text-xl font-medium">{modelOutput.prediction.label}</div>
              <div className="text-sm text-muted-foreground">
                Predicted with {(modelOutput.prediction.probability * 100).toFixed(1)}% probability
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Severity Assessment</span>
                <span className={`text-sm font-medium ${getSeverityColor(modelOutput.severity)}`}>
                  {modelOutput.severity.toFixed(1)}/10
                </span>
              </div>
              <Progress 
                value={modelOutput.severity * 10} 
                className="h-2" 
                indicatorClassName={`
                  ${modelOutput.severity < 3 ? "bg-mind-green-500" : ""}
                  ${modelOutput.severity >= 3 && modelOutput.severity < 7 ? "bg-amber-500" : ""}
                  ${modelOutput.severity >= 7 ? "bg-mind-red-500" : ""}
                `}
              />
            </div>
            
            <div>
              <div className="text-sm font-medium mb-2">Modality Contribution</div>
              <div className="grid grid-cols-4 gap-2">
                <div className="text-center">
                  <div className="h-20 flex items-end">
                    <div 
                      className="w-full bg-mind-blue-400 rounded-t" 
                      style={{height: `${modelOutput.attention.eeg * 100}%`}}
                    ></div>
                  </div>
                  <div className="text-xs mt-1">EEG</div>
                </div>
                <div className="text-center">
                  <div className="h-20 flex items-end">
                    <div 
                      className="w-full bg-mind-green-400 rounded-t" 
                      style={{height: `${modelOutput.attention.audio * 100}%`}}
                    ></div>
                  </div>
                  <div className="text-xs mt-1">Audio</div>
                </div>
                <div className="text-center">
                  <div className="h-20 flex items-end">
                    <div 
                      className="w-full bg-purple-400 rounded-t" 
                      style={{height: `${modelOutput.attention.text * 100}%`}}
                    ></div>
                  </div>
                  <div className="text-xs mt-1">Text</div>
                </div>
                <div className="text-center">
                  <div className="h-20 flex items-end">
                    <div 
                      className="w-full bg-amber-400 rounded-t" 
                      style={{height: `${modelOutput.attention.visual * 100}%`}}
                    ></div>
                  </div>
                  <div className="text-xs mt-1">Visual</div>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AnalysisSummaryCard;
