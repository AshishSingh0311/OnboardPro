
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { EEGData } from "@/types/analysis";

interface EEGVisualizationProps {
  eegData: EEGData;
  isLoading?: boolean;
}

const EEGVisualization: React.FC<EEGVisualizationProps> = ({ eegData, isLoading = false }) => {
  // Transform the EEG data for Recharts
  const transformedData = eegData.timestamp.map((time, index) => ({
    time,
    alpha: eegData.alpha[index],
    beta: eegData.beta[index],
    gamma: eegData.gamma[index],
    delta: eegData.delta[index],
    theta: eegData.theta[index],
  }));

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">EEG Wave Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[300px] w-full flex items-center justify-center bg-gray-50 rounded-md">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mind-blue-500 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-500">Processing EEG data...</p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={transformedData}
              margin={{
                top: 5,
                right: 30,
                left: 5,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis 
                dataKey="time" 
                label={{ value: 'Time (ms)', position: 'insideBottomRight', offset: -10 }}
                tick={{ fontSize: 10 }}
              />
              <YAxis 
                label={{ value: 'Amplitude (μV)', angle: -90, position: 'insideLeft', offset: -5 }}
                tick={{ fontSize: 10 }}
              />
              <Tooltip 
                formatter={(value) => [`${Number(value).toFixed(3)} μV`, ""]}
                labelFormatter={(label) => `Time: ${label}ms`}
                contentStyle={{ fontSize: '12px' }}
              />
              <Legend verticalAlign="bottom" height={36} />
              <Line type="monotone" dataKey="alpha" stroke="#3498db" name="Alpha" dot={false} strokeWidth={1.5} />
              <Line type="monotone" dataKey="beta" stroke="#2ecc71" name="Beta" dot={false} strokeWidth={1.5} />
              <Line type="monotone" dataKey="gamma" stroke="#9b59b6" name="Gamma" dot={false} strokeWidth={1.5} />
              <Line type="monotone" dataKey="delta" stroke="#e74c3c" name="Delta" dot={false} strokeWidth={1.5} />
              <Line type="monotone" dataKey="theta" stroke="#f39c12" name="Theta" dot={false} strokeWidth={1.5} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default EEGVisualization;
