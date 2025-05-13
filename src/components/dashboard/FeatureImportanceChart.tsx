
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ModelOutput } from "@/types/analysis";

interface FeatureImportanceChartProps {
  modelOutput: ModelOutput;
  isLoading?: boolean;
}

const FeatureImportanceChart: React.FC<FeatureImportanceChartProps> = ({ modelOutput, isLoading = false }) => {
  // Transform the feature importance data for Recharts
  const chartData = useMemo(() => {
    if (!modelOutput.featureImportance) return [];
    
    return Object.entries(modelOutput.featureImportance)
      .map(([feature, importance]) => ({
        feature: feature.replace(/_/g, ' '),
        importance
      }))
      .sort((a, b) => b.importance - a.importance);
  }, [modelOutput.featureImportance]);
  
  const getFeatureColor = (feature: string) => {
    if (feature.includes('eeg') || feature.includes('alpha') || feature.includes('beta') || 
        feature.includes('gamma') || feature.includes('theta') || feature.includes('delta')) {
      return "#3498db";
    } else if (feature.includes('speech') || feature.includes('voice') || feature.includes('audio')) {
      return "#2ecc71";
    } else if (feature.includes('text') || feature.includes('sentiment')) {
      return "#9b59b6";
    } else if (feature.includes('facial') || feature.includes('eye')) {
      return "#f39c12";
    }
    return "#95a5a6";
  };
  
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Feature Importance (SHAP Values)</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[300px] w-full flex items-center justify-center bg-gray-50 rounded-md">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mind-blue-500 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-500">Calculating feature importance...</p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{
                top: 5,
                right: 30,
                left: 100,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} horizontal={false} />
              <XAxis 
                type="number" 
                domain={[0, 1]}
                tickFormatter={(value) => value.toFixed(2)}
              />
              <YAxis 
                type="category" 
                dataKey="feature"
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                formatter={(value) => [`Impact: ${Number(value).toFixed(3)}`, ""]}
                contentStyle={{ fontSize: '12px' }}
              />
              <Bar 
                dataKey="importance" 
                fill="#3498db" 
                radius={[0, 4, 4, 0]}
                barSize={20}
                name="Feature Impact"
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default FeatureImportanceChart;
