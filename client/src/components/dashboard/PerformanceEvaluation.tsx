import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PerformanceEvaluationProps {
  isLoading: boolean;
}

const PerformanceEvaluation: React.FC<PerformanceEvaluationProps> = ({ isLoading }) => {
  // Mock comparison data for current vs previous model
  const comparisonData = [
    { name: 'Accuracy', current: 94.2, previous: 93.1, change: 1.1 },
    { name: 'Precision', current: 92.8, previous: 91.5, change: 1.3 },
    { name: 'Recall', current: 91.5, previous: 90.8, change: 0.7 },
    { name: 'F1 Score', current: 92.1, previous: 91.2, change: 0.9 },
    { name: 'Specificity', current: 93.5, previous: 92.7, change: 0.8 },
  ];
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-64" />
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
        <CardTitle>Model Performance Evaluation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Model comparison chart */}
          <div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={comparisonData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" />
                <YAxis domain={[80, 100]} />
                <Tooltip 
                  formatter={(value) => [`${value}%`, ""]}
                  labelFormatter={(label) => `Metric: ${label}`}
                />
                <Legend />
                <Bar dataKey="current" name="Current Model" fill="#3498db" />
                <Bar dataKey="previous" name="Previous Model" fill="#95a5a6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Performance metrics table */}
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metric</th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current</th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Previous</th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {comparisonData.map((item, idx) => (
                  <tr key={idx}>
                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{item.current}%</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{item.previous}%</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-green-500">+{item.change}%</td>
                  </tr>
                ))}
                <tr>
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">Inference Time</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">215ms</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">248ms</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-green-500">-33ms</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceEvaluation;
