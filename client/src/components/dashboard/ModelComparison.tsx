import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';

interface ModelComparisonProps {
  isLoading: boolean;
}

const ModelComparison: React.FC<ModelComparisonProps> = ({ isLoading }) => {
  // Mock model comparison data for radar chart
  const modelComparisonData = [
    { metric: 'Accuracy', model1: 0.94, model2: 0.91, model3: 0.85 },
    { metric: 'Precision', model1: 0.93, model2: 0.89, model3: 0.82 },
    { metric: 'Recall', model1: 0.92, model2: 0.88, model3: 0.80 },
    { metric: 'F1 Score', model1: 0.92, model2: 0.88, model3: 0.81 },
    { metric: 'Inference Speed', model1: 0.88, model2: 0.95, model3: 0.75 },
    { metric: 'Robustness', model1: 0.90, model2: 0.85, model3: 0.70 },
  ];
  
  // Mock model details
  const modelDetails = [
    {
      name: 'Multimodal Fusion (Current)',
      architecture: 'Attention-based Multimodal Transformer',
      modalities: ['EEG', 'Audio', 'Text', 'Visual'],
      parameters: '127M',
      trained: '2023-08-15',
      status: 'Active'
    },
    {
      name: 'EEG-Audio Fusion (Previous)',
      architecture: 'LSTM+CNN Ensemble',
      modalities: ['EEG', 'Audio'],
      parameters: '84M',
      trained: '2023-05-22',
      status: 'Archived'
    },
    {
      name: 'Unimodal EEG (Baseline)',
      architecture: 'EEGNet',
      modalities: ['EEG'],
      parameters: '22M',
      trained: '2023-02-10',
      status: 'Archived'
    }
  ];
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-40" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Model Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium mb-4">Performance Comparison</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart cx="50%" cy="50%" outerRadius={100} data={modelComparisonData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" />
                <PolarRadiusAxis angle={90} domain={[0, 1]} />
                <Tooltip formatter={(value) => [`${(value * 100).toFixed(1)}%`, ""]} />
                <Radar 
                  name="Multimodal Fusion (Current)" 
                  dataKey="model1" 
                  stroke="#3498db" 
                  fill="#3498db" 
                  fillOpacity={0.3} 
                />
                <Radar 
                  name="EEG-Audio Fusion" 
                  dataKey="model2" 
                  stroke="#e74c3c" 
                  fill="#e74c3c" 
                  fillOpacity={0.3} 
                />
                <Radar 
                  name="Unimodal EEG" 
                  dataKey="model3" 
                  stroke="#2ecc71" 
                  fill="#2ecc71" 
                  fillOpacity={0.3} 
                />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-4">Model Details</h3>
            <div className="space-y-4">
              {modelDetails.map((model, idx) => (
                <div key={idx} className={`p-3 rounded-md ${idx === 0 ? 'bg-blue-50 border border-blue-100' : 'bg-gray-50 border border-gray-200'}`}>
                  <div className="flex justify-between mb-1">
                    <h4 className="font-medium text-sm">{model.name}</h4>
                    <Badge variant={idx === 0 ? "default" : "outline"}>
                      {model.status}
                    </Badge>
                  </div>
                  <div className="text-xs space-y-1">
                    <div className="flex">
                      <span className="w-24 text-muted-foreground">Architecture:</span>
                      <span>{model.architecture}</span>
                    </div>
                    <div className="flex">
                      <span className="w-24 text-muted-foreground">Modalities:</span>
                      <span>{model.modalities.join(', ')}</span>
                    </div>
                    <div className="flex">
                      <span className="w-24 text-muted-foreground">Parameters:</span>
                      <span>{model.parameters}</span>
                    </div>
                    <div className="flex">
                      <span className="w-24 text-muted-foreground">Trained:</span>
                      <span>{model.trained}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModelComparison;
