import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  Waves, 
  Mic, 
  FileText, 
  Eye, 
  Shield, 
  Download,
  Play,
  BarChart3,
  RefreshCw,
  Clock
} from 'lucide-react';
import { toast } from "@/components/ui/sonner";

interface Model {
  id: string;
  name: string;
  description: string;
  type: 'eeg' | 'audio' | 'text' | 'visual' | 'multimodal';
  performance: {
    accuracy: number;
    f1Score: number;
    robustness: number;
  };
  size: string;
  lastUpdated: string;
  isActive: boolean;
}

// Sample data for models
const modelData: Model[] = [
  {
    id: 'eeg-lstm',
    name: 'EEG-LSTM Classifier',
    description: 'Long Short-Term Memory neural network for EEG signal classification',
    type: 'eeg',
    performance: {
      accuracy: 0.89,
      f1Score: 0.87,
      robustness: 0.83,
    },
    size: '4.2 MB',
    lastUpdated: '2023-04-15',
    isActive: true
  },
  {
    id: 'eeg-transformer',
    name: 'EEG-Transformer',
    description: 'Transformer architecture optimized for EEG data processing',
    type: 'eeg',
    performance: {
      accuracy: 0.92,
      f1Score: 0.90,
      robustness: 0.85,
    },
    size: '7.8 MB',
    lastUpdated: '2023-05-22',
    isActive: false
  },
  {
    id: 'audio-cnn',
    name: 'Audio CNN',
    description: 'Convolutional neural network for audio feature extraction',
    type: 'audio',
    performance: {
      accuracy: 0.84,
      f1Score: 0.82,
      robustness: 0.79,
    },
    size: '3.5 MB',
    lastUpdated: '2023-03-18',
    isActive: true
  },
  {
    id: 'nlp-bert',
    name: 'NLP-BERT Mini',
    description: 'Compressed BERT model for text sentiment analysis',
    type: 'text',
    performance: {
      accuracy: 0.88,
      f1Score: 0.86,
      robustness: 0.81,
    },
    size: '25.6 MB',
    lastUpdated: '2023-06-10',
    isActive: false
  },
  {
    id: 'facial-expression',
    name: 'Facial Expression Analyzer',
    description: 'Visual model for detecting facial expressions and emotions',
    type: 'visual',
    performance: {
      accuracy: 0.86,
      f1Score: 0.84,
      robustness: 0.77,
    },
    size: '12.4 MB',
    lastUpdated: '2023-02-28',
    isActive: false
  },
  {
    id: 'multimodal-fusion',
    name: 'Multimodal Fusion Model',
    description: 'Attention-based fusion model combining all data modalities',
    type: 'multimodal',
    performance: {
      accuracy: 0.94,
      f1Score: 0.93,
      robustness: 0.89,
    },
    size: '18.7 MB',
    lastUpdated: '2023-07-05',
    isActive: true
  }
];

const Models = () => {
  const [models, setModels] = useState<Model[]>(modelData);
  const [activating, setActivating] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);

  // Toggle model activation
  const toggleModelActivation = (modelId: string) => {
    setActivating(modelId);
    
    // Simulate activation process
    setTimeout(() => {
      setModels(models.map(model => 
        model.id === modelId 
          ? { ...model, isActive: !model.isActive } 
          : model
      ));
      setActivating(null);
      
      const model = models.find(m => m.id === modelId);
      if (model) {
        toast.success(`Model ${model.isActive ? 'Deactivated' : 'Activated'}`, {
          description: `${model.name} has been ${model.isActive ? 'deactivated' : 'activated'} successfully.`
        });
      }
    }, 1500);
  };
  
  // Download model
  const downloadModel = (modelId: string) => {
    setDownloading(modelId);
    
    // Simulate download process
    setTimeout(() => {
      setDownloading(null);
      
      const model = models.find(m => m.id === modelId);
      if (model) {
        toast.success(`Model Downloaded`, {
          description: `${model.name} (${model.size}) has been downloaded successfully.`
        });
      }
    }, 2000);
  };
  
  // Get icon for model type
  const getModelIcon = (type: Model['type']) => {
    switch (type) {
      case 'eeg':
        return <Brain className="h-5 w-5" />;
      case 'audio':
        return <Mic className="h-5 w-5" />;
      case 'text':
        return <FileText className="h-5 w-5" />;
      case 'visual':
        return <Eye className="h-5 w-5" />;
      case 'multimodal':
        return <Waves className="h-5 w-5" />;
      default:
        return <Shield className="h-5 w-5" />;
    }
  };
  
  // Get color for model type
  const getModelTypeColor = (type: Model['type']) => {
    switch (type) {
      case 'eeg':
        return 'bg-blue-100 text-blue-800';
      case 'audio':
        return 'bg-green-100 text-green-800';
      case 'text':
        return 'bg-purple-100 text-purple-800';
      case 'visual':
        return 'bg-amber-100 text-amber-800';
      case 'multimodal':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">AI Models</h2>
        <p className="text-muted-foreground">Manage and monitor AI models used for mental health analysis</p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">All Models</TabsTrigger>
          <TabsTrigger value="eeg">EEG Models</TabsTrigger>
          <TabsTrigger value="audio">Audio Models</TabsTrigger>
          <TabsTrigger value="text">Text Models</TabsTrigger>
          <TabsTrigger value="visual">Visual Models</TabsTrigger>
          <TabsTrigger value="multimodal">Multimodal</TabsTrigger>
        </TabsList>
        
        {['all', 'eeg', 'audio', 'text', 'visual', 'multimodal'].map((tab) => (
          <TabsContent key={tab} value={tab}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {models
                .filter(model => tab === 'all' || model.type === tab)
                .map(model => (
                  <Card key={model.id} className={model.isActive ? 'border-primary/50' : ''}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <div className={`p-2 rounded-full ${getModelTypeColor(model.type)}`}>
                            {getModelIcon(model.type)}
                          </div>
                          <div>
                            <CardTitle className="text-lg">{model.name}</CardTitle>
                            <CardDescription>{model.description}</CardDescription>
                          </div>
                        </div>
                        <Badge variant={model.isActive ? "default" : "outline"}>
                          {model.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Accuracy</span>
                            <span className="font-medium">{(model.performance.accuracy * 100).toFixed(1)}%</span>
                          </div>
                          <Progress value={model.performance.accuracy * 100} />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>F1 Score</span>
                            <span className="font-medium">{(model.performance.f1Score * 100).toFixed(1)}%</span>
                          </div>
                          <Progress value={model.performance.f1Score * 100} />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Robustness</span>
                            <span className="font-medium">{(model.performance.robustness * 100).toFixed(1)}%</span>
                          </div>
                          <Progress value={model.performance.robustness * 100} />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>Updated: {model.lastUpdated}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BarChart3 className="h-4 w-4" />
                          <span>Size: {model.size}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1"
                        disabled={downloading === model.id}
                        onClick={() => downloadModel(model.id)}
                      >
                        {downloading === model.id ? (
                          <>
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            Downloading...
                          </>
                        ) : (
                          <>
                            <Download className="h-4 w-4" />
                            Download
                          </>
                        )}
                      </Button>
                      <Button
                        variant={model.isActive ? "destructive" : "default"}
                        size="sm"
                        className="gap-1"
                        disabled={activating === model.id}
                        onClick={() => toggleModelActivation(model.id)}
                      >
                        {activating === model.id ? (
                          <>
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            {model.isActive ? 'Deactivating...' : 'Activating...'}
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4" />
                            {model.isActive ? 'Deactivate' : 'Activate'}
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </DashboardLayout>
  );
};

export default Models;