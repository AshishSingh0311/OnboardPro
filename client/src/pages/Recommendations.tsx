import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/sonner';
import { Loader2 } from 'lucide-react';
import { getMockModelOutput, getMockRecommendations } from '@/services/mockDataService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
         RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { formatPercentage, getSeverityLabel, getUrgencyLabel } from '@/lib/utils';

const Recommendations = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [modelOutput, setModelOutput] = useState(getMockModelOutput());
  const [recommendations, setRecommendations] = useState(getMockRecommendations(modelOutput));

  const generateNewRecommendations = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      const newModelOutput = getMockModelOutput();
      setModelOutput(newModelOutput);
      setRecommendations(getMockRecommendations(newModelOutput));
      setIsLoading(false);
      
      toast.success("Recommendations Updated", {
        description: "New mental health recommendations generated based on latest analysis.",
      });
    }, 1500);
  };
  
  // Transform data for visualization
  const therapyData = recommendations.therapyRecommendations.map(therapy => ({
    name: therapy.type.split(' ').slice(0, 2).join(' '),
    value: therapy.confidence * 100
  }));
  
  const specialistData = recommendations.specialistReferrals.map(specialist => ({
    name: specialist.type,
    value: specialist.urgency
  }));
  
  // Radar chart data
  const wellnessRadarData = [
    { subject: 'Sleep', A: Math.random() * 0.5 + 0.5, fullMark: 1 },
    { subject: 'Exercise', A: Math.random() * 0.7 + 0.3, fullMark: 1 },
    { subject: 'Nutrition', A: Math.random() * 0.6 + 0.4, fullMark: 1 },
    { subject: 'Social', A: Math.random() * 0.5 + 0.2, fullMark: 1 },
    { subject: 'Mindfulness', A: Math.random() * 0.7 + 0.3, fullMark: 1 },
    { subject: 'Purpose', A: Math.random() * 0.6 + 0.4, fullMark: 1 },
  ];

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">AI-Generated Recommendations</h2>
          <p className="text-muted-foreground">Personalized mental health suggestions based on multimodal analysis</p>
        </div>
        <Button 
          onClick={generateNewRecommendations} 
          disabled={isLoading}
          className="bg-mind-green-500 hover:bg-mind-green-600"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Refresh Recommendations"
          )}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-2">
          <Card className="shadow-md h-full">
            <CardHeader className="pb-2">
              <CardTitle className="flex justify-between items-center">
                <span>Diagnosis Summary</span>
                <Badge className="ml-2" variant={modelOutput.severity < 5 ? "outline" : "destructive"}>
                  {getSeverityLabel(modelOutput.severity)}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-medium mb-2">{modelOutput.prediction.label}</div>
              <div className="text-muted-foreground mb-4">
                Condition detected based on multimodal data analysis with {formatPercentage(modelOutput.confidence)} confidence.
              </div>
              
              <div className="bg-blue-50 border border-blue-100 rounded-md p-4 mb-4">
                <h3 className="text-md font-medium mb-2 text-blue-800">Clinical Insights</h3>
                <p className="text-sm text-blue-700 mb-2">
                  Based on the multimodal analysis, the following patterns were detected:
                </p>
                <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                  <li>
                    {modelOutput.attention.eeg > 0.7 
                      ? "Significant EEG anomalies in frontal lobe activity" 
                      : "Minimal EEG pattern variations from baseline"}
                  </li>
                  <li>
                    {modelOutput.attention.audio > 0.7 
                      ? "Notable speech pattern irregularities detected" 
                      : "Speech patterns show typical variations"}
                  </li>
                  <li>
                    {modelOutput.attention.text > 0.7 
                      ? "Text analysis reveals concerning emotional patterns" 
                      : "Text sentiment shows moderate emotional variability"}
                  </li>
                  <li>
                    {modelOutput.attention.visual > 0.7 
                      ? "Facial expressions indicate significant emotional distress" 
                      : "Facial expressions show typical emotional responses"}
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-md font-medium mb-2">Key Contributing Factors</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  {Object.entries(modelOutput.featureImportance)
                    .sort(([, a], [, b]) => Number(b) - Number(a))
                    .slice(0, 4)
                    .map(([feature, importance], idx) => (
                      <div key={idx} className="bg-gray-50 p-3 rounded-md flex justify-between items-center">
                        <span className="capitalize">{feature.replace(/_/g, ' ')}</span>
                        <Badge variant="secondary" className="ml-2">
                          {formatPercentage(Number(importance), 0)} impact
                        </Badge>
                      </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="shadow-md h-full">
            <CardHeader className="pb-2">
              <CardTitle>Wellness Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <ResponsiveContainer width="100%" height={220}>
                  <RadarChart outerRadius={70} data={wellnessRadarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 1]} />
                    <Radar
                      name="Current State"
                      dataKey="A"
                      stroke="#3498db"
                      fill="#3498db"
                      fillOpacity={0.6}
                    />
                    <Tooltip />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium mb-1">Overall Wellness Score</div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                  <div 
                    className="bg-mind-blue-500 h-2.5 rounded-full" 
                    style={{ width: `${(wellnessRadarData.reduce((acc, item) => acc + item.A, 0) / wellnessRadarData.length) * 100}%` }}
                  ></div>
                </div>
                <div className="text-xs text-muted-foreground">
                  This radar chart shows current wellness across key dimensions. 
                  Areas closer to the outer edge indicate better functioning.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Tabs defaultValue="therapy">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="therapy">Therapy Recommendations</TabsTrigger>
          <TabsTrigger value="specialist">Specialist Referrals</TabsTrigger>
          <TabsTrigger value="wellness">Wellness Tips</TabsTrigger>
        </TabsList>
        
        <TabsContent value="therapy" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recommended Therapeutic Approaches</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recommendations.therapyRecommendations.map((therapy, idx) => (
                    <div key={idx} className="bg-white border rounded-md p-4 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{therapy.type}</h3>
                        <Badge variant="secondary">
                          {formatPercentage(therapy.confidence, 0)} match
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-sm">{therapy.description}</p>
                      
                      {idx === 0 && therapy.expectedBenefits && (
                        <div className="mt-3 bg-gray-50 p-3 rounded-md text-sm">
                          <span className="font-medium block mb-1">Expected Benefits</span>
                          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                            {therapy.expectedBenefits.map((benefit, i) => (
                              <li key={i}>{benefit}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Therapy Effectiveness</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      layout="vertical"
                      data={therapyData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                      <YAxis type="category" dataKey="name" />
                      <Tooltip formatter={(value) => [`${value}%`, "Match Score"]} />
                      <Legend />
                      <Bar dataKey="value" name="Match Score" fill="#3498db" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="mt-4 text-xs text-muted-foreground">
                    Match scores indicate predicted effectiveness based on condition, symptom profile, and empirical evidence.
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="specialist" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Specialist Referral Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recommendations.specialistReferrals.map((specialist, idx) => (
                    <div key={idx} className="bg-white border rounded-md p-4 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{specialist.type}</h3>
                        <Badge 
                          variant={specialist.urgency < 3 ? "outline" : specialist.urgency < 7 ? "secondary" : "destructive"}
                        >
                          {getUrgencyLabel(specialist.urgency)} priority
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-sm mb-2">{specialist.description}</p>
                      <div className="bg-gray-50 p-3 rounded-md text-sm">
                        <span className="font-medium block mb-1">Rationale</span>
                        <p className="text-muted-foreground">{specialist.rationale}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Referral Urgency</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={specialistData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 10]} label={{ value: 'Urgency (0-10)', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Legend />
                      <Bar 
                        dataKey="value" 
                        name="Urgency" 
                        fill="#e74c3c" 
                        background={{ fill: '#eee' }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="mt-4 text-xs text-muted-foreground">
                    <p>Urgency rating scale:</p>
                    <ul className="list-disc list-inside mt-1">
                      <li>0-3: Low priority (routine follow-up)</li>
                      <li>4-7: Medium priority (within weeks)</li>
                      <li>8-10: High priority (immediate attention)</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="wellness" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Personalized Wellness Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recommendations.wellnessTips.map((tip, idx) => (
                  <div key={idx} className="bg-white border rounded-md p-4 shadow-sm">
                    <div className="flex items-center mb-2">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                        <span className="material-icons text-mind-blue-500">{tip.icon}</span>
                      </div>
                      <h3 className="font-medium">{tip.title}</h3>
                    </div>
                    <p className="text-muted-foreground text-sm">{tip.description}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 bg-blue-50 p-4 rounded-md border border-blue-100">
                <h3 className="text-md font-medium mb-2 text-blue-800">Implementation Strategy</h3>
                <p className="text-sm text-blue-700 mb-3">
                  For optimal results, we recommend gradually integrating these wellness practices:
                </p>
                <ol className="list-decimal list-inside text-sm text-blue-700 space-y-2">
                  <li>Start with one practice that feels most manageable</li>
                  <li>Aim for consistency rather than duration or intensity</li>
                  <li>Track your progress using the wellness assessment tool</li>
                  <li>Add additional practices every 1-2 weeks</li>
                  <li>Consider working with a wellness coach for accountability</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 bg-gray-50 p-4 rounded-md">
        <div className="flex items-start">
          <div className="flex-shrink-0 bg-blue-100 rounded-full p-1 mr-3">
            <span className="material-icons text-blue-500">info</span>
          </div>
          <div className="text-sm">
            <h3 className="font-medium mb-1">About These Recommendations</h3>
            <p className="text-muted-foreground">
              These recommendations are generated by our AI system based on patterns detected in your multimodal data. 
              They are intended to supplement, not replace, professional clinical judgment. Always consult with qualified 
              healthcare providers before making significant changes to treatment approaches.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Recommendations;
