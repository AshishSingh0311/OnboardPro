import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { EEGData } from '@/services/mockDataService';

interface EEGVisualizationProps {
  eegData: EEGData;
  isLoading: boolean;
}

const EEGVisualization: React.FC<EEGVisualizationProps> = ({ eegData, isLoading }) => {
  // Transform data for visualization
  const transformedData = eegData.timestamp.map((time, index) => ({
    time,
    alpha: eegData.alpha[index],
    beta: eegData.beta[index],
    gamma: eegData.gamma[index],
    delta: eegData.delta[index],
    theta: eegData.theta[index],
  }));
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-56" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-56 w-full" />
          <div className="mt-3 grid grid-cols-5 gap-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>EEG Brain Wave Patterns</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-white">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart
              data={transformedData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis 
                dataKey="time" 
                label={{ value: 'Time (ms)', position: 'insideBottomRight', offset: -10 }}
              />
              <YAxis 
                label={{ value: 'Amplitude (μV)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip formatter={(value) => [`${Number(value).toFixed(3)} μV`, ""]} />
              <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              <Line type="monotone" dataKey="alpha" stroke="#3498db" name="Alpha (8-13 Hz)" dot={false} strokeWidth={2} />
              <Line type="monotone" dataKey="beta" stroke="#2ecc71" name="Beta (13-30 Hz)" dot={false} strokeWidth={2} />
              <Line type="monotone" dataKey="gamma" stroke="#9b59b6" name="Gamma (30-100 Hz)" dot={false} strokeWidth={2} />
              <Line type="monotone" dataKey="delta" stroke="#e74c3c" name="Delta (0.5-4 Hz)" dot={false} strokeWidth={2} />
              <Line type="monotone" dataKey="theta" stroke="#f39c12" name="Theta (4-8 Hz)" dot={false} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 grid grid-cols-5 gap-2 text-xs">
          <div className="bg-blue-50 p-2 rounded text-blue-700 text-center">Alpha</div>
          <div className="bg-green-50 p-2 rounded text-green-700 text-center">Beta</div>
          <div className="bg-purple-50 p-2 rounded text-purple-700 text-center">Gamma</div>
          <div className="bg-red-50 p-2 rounded text-red-700 text-center">Delta</div>
          <div className="bg-amber-50 p-2 rounded text-amber-700 text-center">Theta</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EEGVisualization;
