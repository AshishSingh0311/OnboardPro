import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
         BarChart, Bar, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { getMockEEGData, getMockAudioFeatures, getMockTextAnalysis, getMockVisualFeatures } from '@/services/mockDataService';

const Analysis = () => {
  const [eegData] = useState(getMockEEGData());
  const [audioFeatures] = useState(getMockAudioFeatures());
  const [textAnalysis] = useState(getMockTextAnalysis());
  const [visualFeatures] = useState(getMockVisualFeatures());
  
  // Transform data for visualization
  const transformedEEGData = eegData.timestamp.map((time, index) => ({
    time,
    alpha: eegData.alpha[index],
    beta: eegData.beta[index],
    gamma: eegData.gamma[index],
    delta: eegData.delta[index],
    theta: eegData.theta[index],
  }));
  
  // Audio data transformation
  const audioZCRData = audioFeatures.zeroCrossingRate.map((value, index) => ({
    index,
    value
  }));
  
  // Text emotion data
  const emotionData = [
    { name: "Joy", value: textAnalysis.emotions.joy },
    { name: "Sadness", value: textAnalysis.emotions.sadness },
    { name: "Anger", value: textAnalysis.emotions.anger },
    { name: "Fear", value: textAnalysis.emotions.fear },
    { name: "Surprise", value: textAnalysis.emotions.surprise },
  ];
  
  const COLORS = ['#2ecc71', '#3498db', '#e74c3c', '#f39c12', '#9b59b6'];
  
  // Visual features data
  const expressionData = [
    { subject: 'Happy', A: visualFeatures.expressions.happy, fullMark: 1 },
    { subject: 'Sad', A: visualFeatures.expressions.sad, fullMark: 1 },
    { subject: 'Angry', A: visualFeatures.expressions.angry, fullMark: 1 },
    { subject: 'Fearful', A: visualFeatures.expressions.fearful, fullMark: 1 },
    { subject: 'Surprised', A: visualFeatures.expressions.surprised, fullMark: 1 },
    { subject: 'Neutral', A: visualFeatures.expressions.neutral, fullMark: 1 },
  ];

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Detailed Modality Analysis</h2>
        <p className="text-muted-foreground">Explore data from each modality and how they contribute to the overall analysis</p>
      </div>
      
      <Tabs defaultValue="eeg">
        <TabsList className="w-full grid grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="eeg">EEG Data</TabsTrigger>
          <TabsTrigger value="audio">Audio Data</TabsTrigger>
          <TabsTrigger value="text">Text Analysis</TabsTrigger>
          <TabsTrigger value="visual">Visual Features</TabsTrigger>
        </TabsList>
        
        <TabsContent value="eeg" className="mt-4">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>EEG Brain Wave Patterns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-white p-4 rounded-md">
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart
                      data={transformedEEGData}
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
                      <Legend verticalAlign="top" height={36} />
                      <Line type="monotone" dataKey="alpha" stroke="#3498db" name="Alpha (8-13 Hz)" dot={false} strokeWidth={2} />
                      <Line type="monotone" dataKey="beta" stroke="#2ecc71" name="Beta (13-30 Hz)" dot={false} strokeWidth={2} />
                      <Line type="monotone" dataKey="gamma" stroke="#9b59b6" name="Gamma (30-100 Hz)" dot={false} strokeWidth={2} />
                      <Line type="monotone" dataKey="delta" stroke="#e74c3c" name="Delta (0.5-4 Hz)" dot={false} strokeWidth={2} />
                      <Line type="monotone" dataKey="theta" stroke="#f39c12" name="Theta (4-8 Hz)" dot={false} strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-5 gap-4 text-sm">
                  <div className="bg-blue-50 p-3 rounded border border-blue-100">
                    <div className="font-medium text-blue-700">Alpha Waves</div>
                    <p className="text-blue-600">Associated with relaxation, calmness</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded border border-green-100">
                    <div className="font-medium text-green-700">Beta Waves</div>
                    <p className="text-green-600">Active, alert mental state</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded border border-purple-100">
                    <div className="font-medium text-purple-700">Gamma Waves</div>
                    <p className="text-purple-600">Higher cognitive functions</p>
                  </div>
                  <div className="bg-red-50 p-3 rounded border border-red-100">
                    <div className="font-medium text-red-700">Delta Waves</div>
                    <p className="text-red-600">Deep sleep, unconsciousness</p>
                  </div>
                  <div className="bg-amber-50 p-3 rounded border border-amber-100">
                    <div className="font-medium text-amber-700">Theta Waves</div>
                    <p className="text-amber-600">Drowsiness, meditation</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="audio" className="mt-4">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Audio Signal Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-white p-4 rounded-md">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={audioZCRData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="index" label={{ value: 'Time Frames', position: 'insideBottomRight', offset: -10 }} />
                      <YAxis label={{ value: 'Zero Crossing Rate', angle: -90, position: 'insideLeft' }} />
                      <Tooltip formatter={(value) => [`${Number(value).toFixed(4)}`, "Zero Crossing Rate"]} />
                      <Bar dataKey="value" fill="#3498db" name="Zero Crossing Rate" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Audio Feature Extraction</h3>
                  <p className="text-muted-foreground mb-4">
                    The audio processing includes extraction of MFCCs, Zero-Crossing Rate, and spectrograms for comprehensive speech analysis. 
                    These features help detect emotional patterns in voice recordings.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded border border-gray-100">
                      <h4 className="font-medium mb-1">Voice Biomarkers for Mental Health</h4>
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        <li>Prosody variation correlates with mood disorders</li>
                        <li>Slower speech rate may indicate depression</li>
                        <li>Voice jitter and shimmer patterns</li>
                        <li>Pausing patterns and speech energy</li>
                      </ul>
                    </div>
                    <div className="bg-gray-50 p-4 rounded border border-gray-100">
                      <h4 className="font-medium mb-1">Signal Processing Techniques</h4>
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        <li>Mel-Frequency Cepstral Coefficients (MFCCs)</li>
                        <li>Short-Time Fourier Transform (STFT)</li>
                        <li>Wavelet Decomposition for time-frequency analysis</li>
                        <li>Harmonic-to-Noise Ratio (HNR) measurement</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="text" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Text Emotion Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <div className="w-full max-w-md">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={emotionData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                        >
                          {emotionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Legend />
                        <Tooltip formatter={(value) => [`${Number(value).toFixed(3)}`, ""]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="bg-gray-50 p-3 rounded border border-gray-200">
                    <h4 className="font-medium mb-1">Sentiment Analysis</h4>
                    <div className="flex items-center mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${
                            textAnalysis.sentiment > 0 ? 'bg-mind-green-500' : 
                            textAnalysis.sentiment < 0 ? 'bg-mind-red-500' : 'bg-gray-400'
                          }`} 
                          style={{ width: `${Math.abs(textAnalysis.sentiment) * 100}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-sm">
                        {textAnalysis.sentiment > 0.2 ? 'Positive' : 
                         textAnalysis.sentiment < -0.2 ? 'Negative' : 'Neutral'}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Text Analysis Methods</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-md font-medium mb-2">BERT Embeddings</h3>
                    <p className="text-sm text-gray-600">
                      Bidirectional Encoder Representations from Transformers (BERT) captures context-dependent semantic relationships in text. 
                      These embeddings help identify subtle linguistic markers of mental health conditions.
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-md">
                    <h3 className="text-md font-medium mb-2">Key Phrases Detected</h3>
                    <div className="flex flex-wrap gap-2">
                      {textAnalysis.keyPhrases.map((phrase, idx) => (
                        <span key={idx} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          {phrase}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-md font-medium mb-2">Topic Distribution</h3>
                    <div className="space-y-2">
                      {Object.entries(textAnalysis.topics).map(([topic, value], idx) => (
                        <div key={idx}>
                          <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>{topic}</span>
                            <span>{(value * 100).toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div 
                              className="bg-mind-blue-500 h-1.5 rounded-full" 
                              style={{ width: `${value * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="visual" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Facial Expression Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart outerRadius={90} data={expressionData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={30} domain={[0, 1]} />
                      <Radar
                        name="Expression Intensity"
                        dataKey="A"
                        stroke="#3498db"
                        fill="#3498db"
                        fillOpacity={0.6}
                      />
                      <Tooltip formatter={(value) => [`${Number(value).toFixed(2)}`, ""]} />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 bg-gray-50 p-3 rounded border border-gray-200">
                  <h4 className="font-medium mb-1">Eye Movement Metrics</h4>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="bg-white p-2 rounded shadow-sm text-center">
                      <div className="text-gray-500 text-xs">Fixations</div>
                      <div className="font-medium">{visualFeatures.eyeMovements.fixations.toFixed(1)}</div>
                    </div>
                    <div className="bg-white p-2 rounded shadow-sm text-center">
                      <div className="text-gray-500 text-xs">Saccades</div>
                      <div className="font-medium">{visualFeatures.eyeMovements.saccades.toFixed(1)}</div>
                    </div>
                    <div className="bg-white p-2 rounded shadow-sm text-center">
                      <div className="text-gray-500 text-xs">Dwell Time</div>
                      <div className="font-medium">{visualFeatures.eyeMovements.dwellTime.toFixed(2)}s</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Visual Analysis Methods</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-md font-medium mb-2">Computer Vision Techniques</h3>
                    <p className="text-sm text-gray-600">
                      We use deep learning models to extract facial landmarks, analyze micro-expressions, 
                      and track eye movements that may indicate various mental health conditions.
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-md">
                    <h3 className="text-md font-medium mb-2">Clinical Correlates</h3>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      <li>Reduced expression variation may indicate depression</li>
                      <li>Increased blinking and scanning behaviors linked to anxiety</li>
                      <li>Asymmetrical expressions may suggest neurological factors</li>
                      <li>Diminished emotional reactivity in certain conditions</li>
                    </ul>
                  </div>
                  
                  <div className="bg-blue-50 p-3 rounded border border-blue-100">
                    <h3 className="text-md font-medium mb-2 text-blue-800">Processing Pipeline</h3>
                    <ol className="list-decimal list-inside text-sm text-blue-700 space-y-1">
                      <li>Facial detection and alignment</li>
                      <li>Landmark extraction (68 points)</li>
                      <li>Expression classification</li>
                      <li>Eye movement tracking</li>
                      <li>Feature fusion with other modalities</li>
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 bg-gray-50 p-4 rounded-md text-sm text-gray-600">
        <p className="font-medium mb-1">About Multimodal Analysis</p>
        <p>
          Our approach combines multiple data modalities (EEG, audio, text, and visual) to create a comprehensive 
          assessment of mental health status. This multimodal fusion allows for more accurate detection of subtle 
          patterns that might be missed when analyzing a single data type in isolation.
        </p>
      </div>
    </DashboardLayout>
  );
};

export default Analysis;
