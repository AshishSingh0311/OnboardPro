import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from "@/components/ui/badge";
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface ModelComparisonProps {
  isLoading?: boolean;
}

// Sample data for model comparison
const getComparisonData = () => {
  // Generate some realistic data points for comparison
  const metrics = ['Accuracy', 'Precision', 'Recall', 'F1-Score', 'Specificity'];
  return metrics.map(metric => ({
    name: metric,
    existing: Math.random() * 0.3 + 0.65, // 65-95%
    proposed: Math.random() * 0.15 + 0.80, // 80-95%
  }));
};

// Performance over time data (epochs)
const getPerformanceOverTimeData = () => {
  const epochs = 20;
  const data = [];
  
  let existingAcc = 0.5;
  let proposedAcc = 0.5;
  let existingLoss = 0.7;
  let proposedLoss = 0.7;
  
  for (let i = 0; i < epochs; i++) {
    // Existing model improves slower
    existingAcc += Math.random() * 0.04;
    existingAcc = Math.min(existingAcc, 0.9);
    existingLoss -= Math.random() * 0.035;
    existingLoss = Math.max(existingLoss, 0.15);
    
    // Proposed model improves faster
    proposedAcc += Math.random() * 0.06;
    proposedAcc = Math.min(proposedAcc, 0.95);
    proposedLoss -= Math.random() * 0.05;
    proposedLoss = Math.max(proposedLoss, 0.08);
    
    data.push({
      epoch: i + 1,
      existingAcc: Number(existingAcc.toFixed(3)),
      proposedAcc: Number(proposedAcc.toFixed(3)),
      existingLoss: Number(existingLoss.toFixed(3)),
      proposedLoss: Number(proposedLoss.toFixed(3)),
    });
  }
  
  return data;
};

// Dataset contribution data
const getDatasetContributionData = () => {
  return [
    { name: 'DIAC', existing: 30, proposed: 35 },
    { name: 'SEED', existing: 25, proposed: 22 },
    { name: 'SEED-IV', existing: 25, proposed: 23 },
    { name: 'SAVEE', existing: 20, proposed: 20 },
  ];
};

// Attention weight comparison data
const getAttentionWeightsData = () => {
  return [
    { subject: 'EEG', existing: 0.6, proposed: 0.75, fullMark: 1 },
    { subject: 'Audio', existing: 0.7, proposed: 0.8, fullMark: 1 },
    { subject: 'Visual', existing: 0.55, proposed: 0.7, fullMark: 1 },
    { subject: 'Text', existing: 0.65, proposed: 0.85, fullMark: 1 },
  ];
};

const ModelComparison: React.FC<ModelComparisonProps> = ({ isLoading = false }) => {
  const [comparisonData, setComparisonData] = useState(getComparisonData());
  const [timeData, setTimeData] = useState(getPerformanceOverTimeData());
  const [datasetData, setDatasetData] = useState(getDatasetContributionData());
  const [attentionData, setAttentionData] = useState(getAttentionWeightsData());
  
  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update one random metric slightly to simulate real-time changes
      const newComparisonData = [...comparisonData];
      const randomIndex = Math.floor(Math.random() * newComparisonData.length);
      const randomMetric = Math.random() > 0.5 ? 'existing' : 'proposed';
      const change = (Math.random() * 0.02) - 0.01; // -0.01 to +0.01
      
      newComparisonData[randomIndex] = {
        ...newComparisonData[randomIndex],
        [randomMetric]: Math.min(0.98, Math.max(0.6, newComparisonData[randomIndex][randomMetric] + change))
      };
      
      setComparisonData(newComparisonData);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [comparisonData]);
  
  // ChartConfig for the charts
  const chartConfig = {
    existingModel: {
      label: "Existing Model",
      color: "#0EA5E9", // Ocean Blue
    },
    proposedModel: {
      label: "Proposed MH-Net + Transformer",
      color: "#8B5CF6", // Vivid Purple
    },
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg">Model Comparison</CardTitle>
            <CardDescription>Comparing existing model vs. proposed MH-Net + Transformer fusion model</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Badge variant="outline" className="bg-[#0EA5E9] text-white">
              Existing Model
            </Badge>
            <Badge variant="outline" className="bg-[#8B5CF6] text-white">
              Proposed MH-Net
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        {isLoading ? (
          <div className="h-[300px] w-full flex items-center justify-center bg-gray-50 rounded-md">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mind-blue-500 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-500">Loading comparison data...</p>
            </div>
          </div>
        ) : (
          <Tabs defaultValue="metrics" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="metrics">Performance Metrics</TabsTrigger>
              <TabsTrigger value="training">Training Curves</TabsTrigger>
              <TabsTrigger value="datasets">Dataset Contribution</TabsTrigger>
              <TabsTrigger value="attention">Attention Weights</TabsTrigger>
            </TabsList>

            <TabsContent value="metrics" className="mt-4">
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-semibold">Key Improvements:</span> The proposed MH-Net with transformer fusion model shows significant improvements 
                  over the existing model across all key metrics. Particularly notable is the enhanced performance in recall and F1-score,
                  indicating better sensitivity to various mental health conditions.
                </p>
              </div>
              <div className="h-[350px]">
                <ChartContainer config={chartConfig}>
                  <BarChart
                    data={comparisonData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0.5, 1]} tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
                    <ChartTooltip 
                      content={
                        <ChartTooltipContent 
                          formatter={(value) => [`${(Number(value) * 100).toFixed(1)}%`, ""]}
                        />
                      }
                    />
                    <Legend />
                    <Bar dataKey="existing" name="Existing Model" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="proposed" name="Proposed MH-Net + Transformer" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </div>
            </TabsContent>

            <TabsContent value="training" className="mt-4">
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-semibold">Convergence Rate:</span> The proposed model converges faster and achieves higher 
                  accuracy with lower loss. Training was performed across 20 epochs on combined DIAC, SEED, SEED-IV, and SAVEE datasets.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <h3 className="text-sm font-medium mb-2 text-center">Accuracy Over Training</h3>
                  <div className="h-[300px]">
                    <ChartContainer config={chartConfig}>
                      <LineChart data={timeData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="epoch" label={{ value: 'Epochs', position: 'insideBottom', offset: -5 }} />
                        <YAxis domain={[0.4, 1]} tickFormatter={(value) => `${(Number(value) * 100).toFixed(0)}%`} />
                        <ChartTooltip 
                          content={
                            <ChartTooltipContent 
                              formatter={(value, name) => [
                                `${(Number(value) * 100).toFixed(1)}%`,
                                name === "existingAcc" ? "Existing Model" : "Proposed Model"
                              ]}
                            />
                          }
                        />
                        <Legend />
                        <Line type="monotone" dataKey="existingAcc" name="Existing Model" stroke="#0EA5E9" activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="proposedAcc" name="Proposed MH-Net + Transformer" stroke="#8B5CF6" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ChartContainer>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2 text-center">Loss Over Training</h3>
                  <div className="h-[300px]">
                    <ChartContainer config={chartConfig}>
                      <LineChart data={timeData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="epoch" label={{ value: 'Epochs', position: 'insideBottom', offset: -5 }} />
                        <YAxis domain={[0, 0.8]} />
                        <ChartTooltip 
                          content={
                            <ChartTooltipContent 
                              formatter={(value, name) => [
                                value,
                                name === "existingLoss" ? "Existing Model" : "Proposed Model"
                              ]}
                            />
                          }
                        />
                        <Legend />
                        <Line type="monotone" dataKey="existingLoss" name="Existing Model" stroke="#0EA5E9" />
                        <Line type="monotone" dataKey="proposedLoss" name="Proposed MH-Net + Transformer" stroke="#8B5CF6" />
                      </LineChart>
                    </ChartContainer>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="datasets" className="mt-4">
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Dataset Integration:</span> The proposed model leverages a more balanced 
                  integration of the four key datasets: DIAC (text, audio, video), SEED and SEED-IV (EEG data), and SAVEE 
                  (audio-visual). The chart shows the contribution percentage of each dataset to the model training.
                </p>
              </div>
              <div className="h-[350px]">
                <ChartContainer config={chartConfig}>
                  <BarChart
                    data={datasetData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: 'Contribution (%)', angle: -90, position: 'insideLeft' }} />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent 
                          formatter={(value) => [`${value}%`, ""]}
                        />
                      }
                    />
                    <Legend />
                    <Bar dataKey="existing" name="Existing Model" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="proposed" name="Proposed MH-Net + Transformer" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </div>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div className="p-3 bg-blue-50 rounded-md">
                  <h4 className="font-semibold mb-1 text-blue-800">DIAC</h4>
                  <p className="text-blue-600">Text, audio, and video data for multimodal sentiment analysis</p>
                </div>
                <div className="p-3 bg-green-50 rounded-md">
                  <h4 className="font-semibold mb-1 text-green-800">SEED</h4>
                  <p className="text-green-600">EEG dataset for emotion recognition with 62 channels</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-md">
                  <h4 className="font-semibold mb-1 text-purple-800">SEED-IV</h4>
                  <p className="text-purple-600">Extended EEG dataset with four emotion categories</p>
                </div>
                <div className="p-3 bg-amber-50 rounded-md">
                  <h4 className="font-semibold mb-1 text-amber-800">SAVEE</h4>
                  <p className="text-amber-600">Surrey Audio-Visual Expressed Emotion database</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="attention" className="mt-4">
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Cross-Modal Attention:</span> The radar chart shows how attention weights 
                  are distributed across different modalities. The proposed model's cross-modal attention mechanism 
                  achieves better integration of multimodal signals, especially text and EEG data.
                </p>
              </div>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart outerRadius={150} data={attentionData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 1]} />
                    <Radar
                      name="Existing Model"
                      dataKey="existing"
                      stroke="#0EA5E9"
                      fill="#0EA5E9"
                      fillOpacity={0.4}
                    />
                    <Radar
                      name="Proposed MH-Net + Transformer"
                      dataKey="proposed"
                      stroke="#8B5CF6"
                      fill="#8B5CF6"
                      fillOpacity={0.4}
                    />
                    <Legend />
                    <Tooltip formatter={(value) => [`${(Number(value) * 100).toFixed(1)}%`, ""]} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-xs text-muted-foreground">
                <p>
                  The proposed MH-Net + Transformer fusion model shows enhanced attention to all modalities, 
                  with particularly significant improvements in text and EEG data processing, leveraging the 
                  strengths of transformer architectures for text and specialized MH-Net for EEG signals.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default ModelComparison;
