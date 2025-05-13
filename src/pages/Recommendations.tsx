import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import { getMockModelOutput, getMockRecommendations } from '@/services/mockDataService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
         RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

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
      
      toast({
        title: "Recommendations Updated",
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
              <span className="animate-spin mr-2">⟳</span>
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
                  {modelOutput.severity < 3 ? "Mild" : 
                   modelOutput.severity < 7 ? "Moderate" : "Severe"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-medium mb-2">{modelOutput.prediction.label}</div>
              <div className="text-muted-foreground mb-4">
                Condition detected based on multimodal data analysis with {(modelOutput.confidence * 100).toFixed(1)}% confidence.
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
                          {(Number(importance) * 100).toFixed(0)}% impact
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
                          {(therapy.confidence * 100).toFixed(0)}% match
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-sm">{therapy.description}</p>
                      
                      {idx === 0 && (
                        <div className="mt-3 bg-gray-50 p-3 rounded-md text-sm">
                          <span className="font-medium block mb-1">Expected Benefits</span>
                          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                            <li>Reduction in primary symptom severity</li>
                            <li>Development of adaptive coping strategies</li>
                            <li>Improved emotional regulation capacity</li>
                            <li>Enhanced resilience to stressors</li>
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
                          {specialist.urgency < 3 ? "Low" : specialist.urgency < 7 ? "Moderate" : "High"} Urgency
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-sm">{specialist.reason}</p>
                      
                      {idx === 0 && (
                        <div className="mt-3 bg-gray-50 p-3 rounded-md text-sm">
                          <span className="font-medium block mb-1">What to Expect</span>
                          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                            <li>Initial assessment and evaluation</li>
                            <li>Development of a personalized treatment plan</li>
                            <li>Regular follow-ups to monitor progress</li>
                            <li>Coordination with other healthcare providers if needed</li>
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
                  <CardTitle>Referral Urgency</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      layout="vertical"
                      data={specialistData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis 
                        type="number" 
                        domain={[0, 10]} 
                        ticks={[0, 2, 4, 6, 8, 10]} 
                        label={{ value: 'Urgency Level', position: 'insideBottom', offset: -5 }} 
                      />
                      <YAxis type="category" dataKey="name" />
                      <Tooltip />
                      <Legend />
                      <Bar 
                        dataKey="value" 
                        name="Urgency Level" 
                        fill="#f39c12"
                        radius={[0, 4, 4, 0]} 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="mt-4 text-xs text-muted-foreground">
                    <span className="block font-medium mb-1">Urgency Scale:</span>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="w-3 h-3 inline-block bg-green-500 rounded-full"></span>
                      <span>1-3: Routine follow-up (within weeks)</span>
                    </div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="w-3 h-3 inline-block bg-amber-500 rounded-full"></span>
                      <span>4-7: Prompt attention (within days)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-3 h-3 inline-block bg-red-500 rounded-full"></span>
                      <span>8-10: Immediate care recommended</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="wellness" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations.wellnessTips.map((tip, idx) => (
              <Card key={idx}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex justify-between items-center">
                    <span>{tip.title}</span>
                    <Badge variant="outline" className="text-xs">
                      {(tip.relevance * 100).toFixed(0)}% relevance
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{tip.content}</p>
                  
                  <div className="bg-gray-50 p-3 rounded-md">
                    <h4 className="text-sm font-medium mb-2">Implementation Suggestions</h4>
                    {tip.title === "Daily Mindfulness" && (
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        <li>Start with 5-minute sessions and gradually increase</li>
                        <li>Use guided meditation apps for structure</li>
                        <li>Practice at the same time each day to build habit</li>
                        <li>Focus on breath awareness as a foundation</li>
                      </ul>
                    )}
                    
                    {tip.title === "Sleep Hygiene" && (
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        <li>Maintain consistent sleep and wake times</li>
                        <li>Create a relaxing bedtime routine</li>
                        <li>Keep bedroom cool, dark, and quiet</li>
                        <li>Avoid screens 1-2 hours before bedtime</li>
                      </ul>
                    )}
                    
                    {tip.title === "Physical Activity" && (
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        <li>Choose activities you enjoy to maintain consistency</li>
                        <li>Start with short sessions and gradually increase</li>
                        <li>Include both aerobic and strength training</li>
                        <li>Schedule workouts at consistent times</li>
                      </ul>
                    )}
                    
                    {tip.title === "Social Connection" && (
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        <li>Schedule regular check-ins with supportive people</li>
                        <li>Join groups based on interests or hobbies</li>
                        <li>Practice active listening in conversations</li>
                        <li>Consider volunteering to meet like-minded people</li>
                      </ul>
                    )}
                    
                    {tip.title === "Nature Exposure" && (
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        <li>Spend at least 20 minutes outdoors daily</li>
                        <li>Visit local parks or natural areas weekly</li>
                        <li>Incorporate plants into your living space</li>
                        <li>Practice mindfulness while in natural settings</li>
                      </ul>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle>Integrated Wellness Approach</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Mental health is best supported through an integrated approach addressing multiple dimensions of wellness. 
                  The recommendations above are designed to work together as a comprehensive system.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-md">
                    <h3 className="text-blue-800 font-medium mb-2">Biological</h3>
                    <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                      <li>Regular physical activity</li>
                      <li>Nutritious diet</li>
                      <li>Consistent sleep schedule</li>
                      <li>Limited substance use</li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-md">
                    <h3 className="text-green-800 font-medium mb-2">Psychological</h3>
                    <ul className="list-disc list-inside text-sm text-green-700 space-y-1">
                      <li>Mindfulness practices</li>
                      <li>Stress management techniques</li>
                      <li>Cognitive reframing</li>
                      <li>Emotional regulation skills</li>
                    </ul>
                  </div>
                  
                  <div className="bg-amber-50 p-4 rounded-md">
                    <h3 className="text-amber-800 font-medium mb-2">Social</h3>
                    <ul className="list-disc list-inside text-sm text-amber-700 space-y-1">
                      <li>Meaningful relationships</li>
                      <li>Community involvement</li>
                      <li>Communication skills</li>
                      <li>Boundary setting</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Recommendations;
