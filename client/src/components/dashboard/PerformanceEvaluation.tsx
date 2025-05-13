
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChartBarIcon, TrophyIcon, GaugeIcon } from 'lucide-react';
import { 
  ChartContainer, 
  ChartLegend,
  ChartLegendContent
} from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface PerformanceEvaluationProps {
  isLoading?: boolean;
}

const modelTypes = [
  { id: 'multimodal', name: 'Multi-Modal (Proposed)', color: '#3b82f6' },
  { id: 'eegOnly', name: 'EEG Only', color: '#10b981' },
  { id: 'audioOnly', name: 'Audio Only', color: '#f59e0b' },
  { id: 'textOnly', name: 'Text Only', color: '#6366f1' },
  { id: 'baselineML', name: 'Baseline ML', color: '#ef4444' },
];

const PerformanceEvaluation: React.FC<PerformanceEvaluationProps> = ({ isLoading = false }) => {
  const [activeTab, setActiveTab] = useState('dataset-specific');
  
  // Table 2: Performance Evaluation Data
  const performanceData = [
    { 
      metric: 'Accuracy', 
      multimodal: 91.3, 
      eegOnly: 84.2, 
      audioOnly: 78.5, 
      textOnly: 76.3, 
      baselineML: 72.1,
      target: '≥90.0%',
      achievement: 'Pass'
    },
    { 
      metric: 'Precision', 
      multimodal: 89.7, 
      eegOnly: 82.5, 
      audioOnly: 77.2, 
      textOnly: 75.4, 
      baselineML: 70.8,
      target: '≥85.0%',
      achievement: 'Pass'
    },
    { 
      metric: 'Recall', 
      multimodal: 92.1, 
      eegOnly: 83.7, 
      audioOnly: 76.9, 
      textOnly: 74.1, 
      baselineML: 69.5,
      target: '≥90.0%',
      achievement: 'Pass'
    },
    { 
      metric: 'F1 Score', 
      multimodal: 90.9, 
      eegOnly: 83.1, 
      audioOnly: 77.0, 
      textOnly: 74.7, 
      baselineML: 70.1,
      target: '≥87.5%',
      achievement: 'Pass'
    },
    { 
      metric: 'Specificity', 
      multimodal: 94.5, 
      eegOnly: 86.3, 
      audioOnly: 80.2, 
      textOnly: 78.5, 
      baselineML: 75.4,
      target: '≥92.0%',
      achievement: 'Pass'
    },
    { 
      metric: 'False Positive Rate', 
      multimodal: 5.5, 
      eegOnly: 13.7, 
      audioOnly: 19.8, 
      textOnly: 21.5, 
      baselineML: 24.6,
      target: '≤7.5%',
      achievement: 'Pass'
    }
  ];
  
  // Table 3: Robustness & Generalization Data
  const robustnessData = [
    { 
      metric: 'Cross-Validation Variance', 
      multimodal: 1.8, 
      eegOnly: 3.4, 
      audioOnly: 4.2, 
      textOnly: 4.6, 
      baselineML: 5.8,
      target: '≤2.0%',
      achievement: 'Pass'
    },
    { 
      metric: 'Noise Sensitivity', 
      multimodal: 2.7, 
      eegOnly: 4.5, 
      audioOnly: 5.3, 
      textOnly: 5.8, 
      baselineML: 7.2,
      target: '≤4.5%',
      achievement: 'Pass'
    },
    { 
      metric: 'Demographic Bias', 
      multimodal: 0.9, 
      eegOnly: 2.1, 
      audioOnly: 2.7, 
      textOnly: 2.9, 
      baselineML: 3.5,
      target: '≤1.3%',
      achievement: 'Pass'
    },
    { 
      metric: 'Dataset Generalization', 
      multimodal: 1.5, 
      eegOnly: 3.2, 
      audioOnly: 3.9, 
      textOnly: 4.1, 
      baselineML: 4.8,
      target: '≤3.0%',
      achievement: 'Pass'
    },
    { 
      metric: 'Robustness Index', 
      multimodal: 0.92, 
      eegOnly: 0.81, 
      audioOnly: 0.76, 
      textOnly: 0.74, 
      baselineML: 0.69,
      target: '≥0.90',
      achievement: 'Pass'
    }
  ];
  
  // Table 4: Computational Efficiency Data
  const efficiencyData = [
    { 
      metric: 'Inference Time', 
      multimodal: '45ms', 
      eegOnly: '36ms', 
      audioOnly: '32ms', 
      textOnly: '30ms', 
      baselineML: '25ms',
      target: '≤50ms',
      achievement: 'Pass'
    },
    { 
      metric: 'GPU Memory Usage', 
      multimodal: '3.2GB', 
      eegOnly: '2.8GB', 
      audioOnly: '2.5GB', 
      textOnly: '2.3GB', 
      baselineML: '1.8GB',
      target: '≤4.0GB',
      achievement: 'Pass'
    },
    { 
      metric: 'Computational Cost', 
      multimodal: '12.5B FLOPs', 
      eegOnly: '9.2B FLOPs', 
      audioOnly: '7.8B FLOPs', 
      textOnly: '6.5B FLOPs', 
      baselineML: '3.2B FLOPs',
      target: '≤15.0B FLOPs',
      achievement: 'Pass'
    },
    { 
      metric: 'Power Consumption', 
      multimodal: '5.2mW', 
      eegOnly: '4.6mW', 
      audioOnly: '4.1mW', 
      textOnly: '3.8mW', 
      baselineML: '2.5mW',
      target: '≤6.0mW',
      achievement: 'Pass'
    },
    { 
      metric: 'Cloud Deployment Readiness', 
      multimodal: '98.1%', 
      eegOnly: '96.2%', 
      audioOnly: '95.4%', 
      textOnly: '94.8%', 
      baselineML: '97.5%',
      target: '≥95.0%',
      achievement: 'Pass'
    },
    { 
      metric: 'Edge Device Compatibility', 
      multimodal: '92.3%', 
      eegOnly: '94.1%', 
      audioOnly: '94.8%', 
      textOnly: '95.3%', 
      baselineML: '97.2%',
      target: '≥90.0%',
      achievement: 'Pass'
    }
  ];
  
  // Generate chart data for visual comparison
  const generateChartData = () => {
    let chartData = [];
    
    // Create chart data based on active tab
    if (activeTab === 'dataset-specific') {
      // Only include key metrics for chart
      const metrics = ['Accuracy', 'Precision', 'Recall', 'Specificity'];
      performanceData
        .filter(item => metrics.includes(item.metric))
        .forEach(item => {
          chartData.push({
            name: item.metric,
            multimodal: item.multimodal,
            eegOnly: item.eegOnly,
            audioOnly: item.audioOnly,
            textOnly: item.textOnly,
            baselineML: item.baselineML
          });
        });
    } else if (activeTab === 'robustness') {
      // For robustness, lower values are better for first 4 metrics, higher for the last
      robustnessData.forEach(item => {
        if (item.metric === 'Robustness Index') {
          chartData.push({
            name: item.metric,
            multimodal: item.multimodal * 100, // Multiply by 100 to make it comparable on chart
            eegOnly: item.eegOnly * 100,
            audioOnly: item.audioOnly * 100,
            textOnly: item.textOnly * 100,
            baselineML: item.baselineML * 100
          });
        } else {
          chartData.push({
            name: item.metric.replace('Cross-Validation ', '').replace(' Sensitivity', ''),
            multimodal: item.multimodal,
            eegOnly: item.eegOnly,
            audioOnly: item.audioOnly,
            textOnly: item.textOnly,
            baselineML: item.baselineML
          });
        }
      });
    } else {
      // For computational efficiency, extract numeric values
      efficiencyData.forEach(item => {
        let value = item.metric;
        if (value !== 'Inference Time' && value !== 'GPU Memory Usage' && 
            value !== 'Computational Cost' && value !== 'Power Consumption') {
          chartData.push({
            name: value.replace(' Readiness', '').replace(' Compatibility', ''),
            multimodal: parseFloat(item.multimodal),
            eegOnly: parseFloat(item.eegOnly),
            audioOnly: parseFloat(item.audioOnly),
            textOnly: parseFloat(item.textOnly),
            baselineML: parseFloat(item.baselineML)
          });
        }
      });
    }
    
    return chartData;
  };
  
  const chartData = generateChartData();
  
  // Function to determine if a value should display with a percentage sign
  const shouldDisplayAsPercentage = (value: any, activeTab: string) => {
    // For robustness tab, check if the value is numeric and less than 10
    if (activeTab === 'robustness') {
      const numValue = Number(value);
      return !isNaN(numValue) && numValue < 10;
    }
    return false;
  };
  
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <TrophyIcon size={18} />
          Performance Evaluation
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-60 bg-gray-200 rounded"></div>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-4">
              Comprehensive evaluation of the model's performance across different metrics and modalities.
            </p>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="dataset-specific" className="text-xs">
                  <ChartBarIcon className="w-4 h-4 mr-1" />
                  Performance Metrics
                </TabsTrigger>
                <TabsTrigger value="robustness" className="text-xs">
                  <TrophyIcon className="w-4 h-4 mr-1" />
                  Robustness
                </TabsTrigger>
                <TabsTrigger value="efficiency" className="text-xs">
                  <GaugeIcon className="w-4 h-4 mr-1" />
                  Efficiency
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="dataset-specific" className="p-1">
                <div className="rounded-lg border">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[150px]">Metric</TableHead>
                          <TableHead>Multi-Modal</TableHead>
                          <TableHead>EEG Only</TableHead>
                          <TableHead>Audio Only</TableHead>
                          <TableHead>Text Only</TableHead>
                          <TableHead>Baseline ML</TableHead>
                          <TableHead>Target</TableHead>
                          <TableHead>Achievement</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {performanceData.map((row, i) => (
                          <TableRow key={i}>
                            <TableCell className="font-medium">{row.metric}</TableCell>
                            <TableCell className="font-semibold text-blue-600">
                              {row.metric === 'False Positive Rate' ? `${row.multimodal}%` : `${row.multimodal}%`}
                            </TableCell>
                            <TableCell>{row.eegOnly}%</TableCell>
                            <TableCell>{row.audioOnly}%</TableCell>
                            <TableCell>{row.textOnly}%</TableCell>
                            <TableCell>{row.baselineML}%</TableCell>
                            <TableCell>{row.target}</TableCell>
                            <TableCell className="text-green-600">{row.achievement}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  <strong>Table 2:</strong> Performance Evaluation (Dataset-Specific Optimization & Advanced Metrics).
                  The multi-modal model outperforms single-modality and baseline ML models on all metrics.
                </div>
              </TabsContent>
              
              <TabsContent value="robustness" className="p-1">
                <div className="rounded-lg border">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[180px]">Metric</TableHead>
                          <TableHead>Multi-Modal</TableHead>
                          <TableHead>EEG Only</TableHead>
                          <TableHead>Audio Only</TableHead>
                          <TableHead>Text Only</TableHead>
                          <TableHead>Baseline ML</TableHead>
                          <TableHead>Target</TableHead>
                          <TableHead>Achievement</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {robustnessData.map((row, i) => (
                          <TableRow key={i}>
                            <TableCell className="font-medium">{row.metric}</TableCell>
                            <TableCell className="font-semibold text-blue-600">
                              {row.metric === 'Robustness Index' ? row.multimodal : `${row.multimodal}%`}
                            </TableCell>
                            <TableCell>
                              {row.metric === 'Robustness Index' ? row.eegOnly : `${row.eegOnly}%`}
                            </TableCell>
                            <TableCell>
                              {row.metric === 'Robustness Index' ? row.audioOnly : `${row.audioOnly}%`}
                            </TableCell>
                            <TableCell>
                              {row.metric === 'Robustness Index' ? row.textOnly : `${row.textOnly}%`}
                            </TableCell>
                            <TableCell>
                              {row.metric === 'Robustness Index' ? row.baselineML : `${row.baselineML}%`}
                            </TableCell>
                            <TableCell>{row.target}</TableCell>
                            <TableCell className="text-green-600">{row.achievement}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  <strong>Table 3:</strong> Robustness & Generalization Enhancements.
                  The hybrid model demonstrates lower variance, lower bias, better generalization,
                  and a robustness index of 0.92.
                </div>
              </TabsContent>
              
              <TabsContent value="efficiency" className="p-1">
                <div className="rounded-lg border">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[180px]">Metric</TableHead>
                          <TableHead>Multi-Modal</TableHead>
                          <TableHead>EEG Only</TableHead>
                          <TableHead>Audio Only</TableHead>
                          <TableHead>Text Only</TableHead>
                          <TableHead>Baseline ML</TableHead>
                          <TableHead>Target</TableHead>
                          <TableHead>Achievement</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {efficiencyData.map((row, i) => (
                          <TableRow key={i}>
                            <TableCell className="font-medium">{row.metric}</TableCell>
                            <TableCell className="font-semibold text-blue-600">{row.multimodal}</TableCell>
                            <TableCell>{row.eegOnly}</TableCell>
                            <TableCell>{row.audioOnly}</TableCell>
                            <TableCell>{row.textOnly}</TableCell>
                            <TableCell>{row.baselineML}</TableCell>
                            <TableCell>{row.target}</TableCell>
                            <TableCell className="text-green-600">{row.achievement}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  <strong>Table 4:</strong> Computational Efficiency & Deployment Readiness.
                  The proposed model achieves good inference speed (45ms), GPU efficiency (3.2GB),
                  with high cloud deployment readiness (98.1%) and edge device compatibility (92.3%).
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="mb-2 mt-6">
              <h3 className="text-sm font-medium mb-4">Visual Comparison of Key Metrics</h3>
              <div className="h-96">
                <ChartContainer config={{
                  multimodal: { color: modelTypes[0].color },
                  eegOnly: { color: modelTypes[1].color },
                  audioOnly: { color: modelTypes[2].color },
                  textOnly: { color: modelTypes[3].color },
                  baselineML: { color: modelTypes[4].color },
                }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={chartData} 
                      margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                      barSize={18}
                      barGap={4}
                      maxBarSize={25}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fontSize: 11 }} 
                        height={60}
                        angle={-45}
                        textAnchor="end"
                        tickMargin={10}
                      />
                      <YAxis 
                        tick={{ fontSize: 11 }}
                        domain={[0, 'dataMax + 5']}
                      />
                      <Tooltip 
                        formatter={(value: any) => {
                          // Convert value to number to ensure proper comparison
                          const numValue = typeof value === 'number' ? value : Number(value);
                          // Add percentage sign for small values in robustness tab
                          if (activeTab === 'robustness' && !isNaN(numValue) && numValue < 10) {
                            return [`${value}%`];
                          }
                          return [`${value}`];
                        }}
                        labelFormatter={(label) => `Metric: ${label}`}
                        contentStyle={{ backgroundColor: '#fff', borderRadius: '6px' }}
                      />
                      <Bar 
                        dataKey="multimodal" 
                        name="Multi-Modal" 
                        fill={modelTypes[0].color} 
                        radius={[2, 2, 0, 0]} 
                      />
                      <Bar 
                        dataKey="eegOnly" 
                        name="EEG Only" 
                        fill={modelTypes[1].color} 
                        radius={[2, 2, 0, 0]} 
                      />
                      <Bar 
                        dataKey="audioOnly" 
                        name="Audio Only" 
                        fill={modelTypes[2].color} 
                        radius={[2, 2, 0, 0]} 
                      />
                      <Bar 
                        dataKey="textOnly" 
                        name="Text Only" 
                        fill={modelTypes[3].color} 
                        radius={[2, 2, 0, 0]} 
                      />
                      <Bar 
                        dataKey="baselineML" 
                        name="Baseline ML" 
                        fill={modelTypes[4].color} 
                        radius={[2, 2, 0, 0]} 
                      />
                      <Legend 
                        verticalAlign="bottom" 
                        height={60} 
                        wrapperStyle={{ paddingTop: "20px", fontSize: "12px" }}
                        layout="horizontal"
                        align="center"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
              <div className="text-xs text-muted-foreground mt-2 text-center">
                Fig. 1: Visual comparison of {activeTab === 'dataset-specific' ? 'performance metrics' : 
                activeTab === 'robustness' ? 'robustness & generalization metrics' : 'computational efficiency metrics'} 
                across different models.
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PerformanceEvaluation;
