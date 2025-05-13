import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ModelOutput } from '@/services/mockDataService';
import { formatPercentage } from '@/lib/utils';

interface FeatureImportanceChartProps {
  modelOutput: ModelOutput;
  isLoading: boolean;
}

const FeatureImportanceChart: React.FC<FeatureImportanceChartProps> = ({ modelOutput, isLoading }) => {
  // Transform feature importance data for visualization
  const chartData = Object.entries(modelOutput.featureImportance)
    .sort(([, a], [, b]) => b - a)
    .map(([feature, importance]) => ({
      name: feature.replace(/_/g, ' '),
      importance: importance * 100
    }));
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-56 w-full" />
          <Skeleton className="h-4 w-full mt-4" />
          <Skeleton className="h-4 w-5/6 mt-2" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Feature Importance</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
            <YAxis 
              type="category" 
              dataKey="name" 
              width={100}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => value.length > 15 ? `${value.substring(0, 15)}...` : value}
            />
            <Tooltip 
              formatter={(value) => [`${value}%`, "Importance"]} 
              labelFormatter={(label) => `Feature: ${label}`}
            />
            <Bar 
              dataKey="importance" 
              name="Importance" 
              fill="#3498db" 
              radius={[0, 4, 4, 0]} 
            />
          </BarChart>
        </ResponsiveContainer>
        
        <div className="mt-4 text-xs text-muted-foreground">
          <p>This chart shows the relative importance of each feature in the model's prediction. 
          Higher values indicate greater influence on the outcome.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeatureImportanceChart;
