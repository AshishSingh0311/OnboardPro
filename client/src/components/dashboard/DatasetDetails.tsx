import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface DatasetDetailsProps {
  isLoading: boolean;
}

const DatasetDetails: React.FC<DatasetDetailsProps> = ({ isLoading }) => {
  // Mock dataset distribution data
  const dataDistribution = [
    { name: 'Anxiety', value: 35 },
    { name: 'Depression', value: 30 },
    { name: 'Bipolar', value: 15 },
    { name: 'ADHD', value: 10 },
    { name: 'Control', value: 10 },
  ];
  
  // Mock modality coverage data
  const modalityCoverage = [
    { name: 'EEG', value: 95 },
    { name: 'Audio', value: 85 },
    { name: 'Text', value: 100 },
    { name: 'Visual', value: 75 },
  ];
  
  const COLORS = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6'];
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-36" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-48 col-span-1" />
            <Skeleton className="h-48 col-span-2" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dataset Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="mb-3">
              <h3 className="text-sm font-medium">Dataset Statistics</h3>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Total Samples:</span>
                  <span className="font-medium">2,483</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Conditions:</span>
                  <span className="font-medium">5</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Subjects:</span>
                  <span className="font-medium">745</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Modalities:</span>
                  <span className="font-medium">4</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Data Quality:</span>
                  <Badge variant="outline" className="font-normal">High</Badge>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Modality Coverage</h3>
              <div className="space-y-2">
                {modalityCoverage.map((item, idx) => (
                  <div key={idx} className="flex items-center">
                    <div className="w-16 text-xs text-muted-foreground">{item.name}</div>
                    <div className="flex-1 mx-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-mind-blue-500 h-2 rounded-full" 
                          style={{ width: `${item.value}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-8 text-xs text-right">{item.value}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <h3 className="text-sm font-medium mb-3">Condition Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={dataDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {dataDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, ""]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="bg-gray-50 p-3 rounded-md mt-3">
              <h4 className="text-sm font-medium mb-1">Dataset Sources</h4>
              <p className="text-xs text-muted-foreground">
                Data collected from multiple clinical sources including university hospitals, 
                research institutions, and mental health centers. All data is de-identified 
                and complies with HIPAA regulations and ethical guidelines.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DatasetDetails;
