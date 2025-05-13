import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { Download, Save, RefreshCw } from 'lucide-react';

const Settings = () => {
  // General settings
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [dataRetention, setDataRetention] = useState("30");
  
  // Model settings
  const [selectedModel, setSelectedModel] = useState("hybrid");
  const [confidenceThreshold, setConfidenceThreshold] = useState([0.7]);
  const [useGPU, setUseGPU] = useState(true);
  
  // Data processing settings
  const [fusionStrategy, setFusionStrategy] = useState("attention");
  const [eegWeight, setEegWeight] = useState([0.4]);
  const [audioWeight, setAudioWeight] = useState([0.3]);
  const [textWeight, setTextWeight] = useState([0.2]);
  const [visualWeight, setVisualWeight] = useState([0.1]);

  // Save settings
  const saveSettings = () => {
    toast.success("Settings Saved", {
      description: "Your settings have been updated successfully."
    });
  };

  // Reset settings to defaults
  const resetSettings = () => {
    setDarkMode(false);
    setNotifications(true);
    setDataRetention("30");
    setSelectedModel("hybrid");
    setConfidenceThreshold([0.7]);
    setUseGPU(true);
    setFusionStrategy("attention");
    setEegWeight([0.4]);
    setAudioWeight([0.3]);
    setTextWeight([0.2]);
    setVisualWeight([0.1]);
    
    toast.info("Settings Reset", {
      description: "All settings have been reset to default values."
    });
  };

  // Export settings
  const exportSettings = () => {
    const settings = {
      general: {
        darkMode,
        notifications,
        dataRetention
      },
      model: {
        selectedModel,
        confidenceThreshold: confidenceThreshold[0],
        useGPU
      },
      dataProcessing: {
        fusionStrategy,
        modalityWeights: {
          eeg: eegWeight[0],
          audio: audioWeight[0],
          text: textWeight[0],
          visual: visualWeight[0]
        }
      }
    };

    // Create a download link for the settings
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mindbloom-settings.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Settings Exported", {
      description: "Your settings have been exported to mindbloom-settings.json"
    });
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Settings</h2>
        <p className="text-muted-foreground">Configure application settings and preferences</p>
      </div>

      <div className="flex justify-between mb-6">
        <div></div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetSettings} className="flex items-center gap-1">
            <RefreshCw className="h-4 w-4" />
            Reset to Defaults
          </Button>
          <Button variant="outline" onClick={exportSettings} className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            Export Settings
          </Button>
          <Button onClick={saveSettings} className="flex items-center gap-1">
            <Save className="h-4 w-4" />
            Save Settings
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="model">Model Settings</TabsTrigger>
          <TabsTrigger value="data">Data Processing</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure appearance, notifications, and data retention
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Dark Mode</h3>
                  <p className="text-sm text-muted-foreground">
                    Enable dark mode for the application
                  </p>
                </div>
                <Switch 
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Notifications</h3>
                  <p className="text-sm text-muted-foreground">
                    Enable notifications for analysis results
                  </p>
                </div>
                <Switch 
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="data-retention">Data Retention Period (days)</Label>
                <Select 
                  value={dataRetention}
                  onValueChange={setDataRetention}
                >
                  <SelectTrigger id="data-retention">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 Days</SelectItem>
                    <SelectItem value="30">30 Days</SelectItem>
                    <SelectItem value="90">90 Days</SelectItem>
                    <SelectItem value="180">180 Days</SelectItem>
                    <SelectItem value="365">1 Year</SelectItem>
                    <SelectItem value="0">Indefinite</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="model">
          <Card>
            <CardHeader>
              <CardTitle>Model Settings</CardTitle>
              <CardDescription>
                Configure AI model parameters and inference settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="model-selection">Model Selection</Label>
                <Select 
                  value={selectedModel}
                  onValueChange={setSelectedModel}
                >
                  <SelectTrigger id="model-selection">
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eeg_only">EEG Only</SelectItem>
                    <SelectItem value="audio_only">Audio Only</SelectItem>
                    <SelectItem value="ensemble">Ensemble Model</SelectItem>
                    <SelectItem value="hybrid">Hybrid Model (Recommended)</SelectItem>
                    <SelectItem value="attention">Attention Model</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="threshold">Confidence Threshold</Label>
                  <span className="text-sm text-muted-foreground">
                    {confidenceThreshold[0].toFixed(2)}
                  </span>
                </div>
                <Slider
                  id="threshold"
                  min={0}
                  max={1}
                  step={0.01}
                  value={confidenceThreshold}
                  onValueChange={setConfidenceThreshold}
                />
                <p className="text-xs text-muted-foreground">
                  Minimum confidence required for model predictions (higher = more selective)
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Enable GPU Acceleration</h3>
                  <p className="text-sm text-muted-foreground">
                    Use GPU for faster model inference (when available)
                  </p>
                </div>
                <Switch 
                  checked={useGPU}
                  onCheckedChange={setUseGPU}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="data">
          <Card>
            <CardHeader>
              <CardTitle>Data Processing Settings</CardTitle>
              <CardDescription>
                Configure how multimodal data is processed and fused
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fusion-strategy">Fusion Strategy</Label>
                <Select 
                  value={fusionStrategy}
                  onValueChange={setFusionStrategy}
                >
                  <SelectTrigger id="fusion-strategy">
                    <SelectValue placeholder="Select fusion strategy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="early">Early Fusion</SelectItem>
                    <SelectItem value="late">Late Fusion</SelectItem>
                    <SelectItem value="attention">Attention-based Fusion (Recommended)</SelectItem>
                    <SelectItem value="hybrid">Hybrid Fusion</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-6 pt-2">
                <h3 className="font-medium">Modality Weights</h3>
                <p className="text-sm text-muted-foreground">
                  Adjust the importance of each data modality in the fusion process
                </p>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="eeg-weight">EEG Weight</Label>
                      <span className="text-sm text-muted-foreground">
                        {eegWeight[0].toFixed(2)}
                      </span>
                    </div>
                    <Slider
                      id="eeg-weight"
                      min={0}
                      max={1}
                      step={0.01}
                      value={eegWeight}
                      onValueChange={setEegWeight}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="audio-weight">Audio Weight</Label>
                      <span className="text-sm text-muted-foreground">
                        {audioWeight[0].toFixed(2)}
                      </span>
                    </div>
                    <Slider
                      id="audio-weight"
                      min={0}
                      max={1}
                      step={0.01}
                      value={audioWeight}
                      onValueChange={setAudioWeight}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="text-weight">Text Weight</Label>
                      <span className="text-sm text-muted-foreground">
                        {textWeight[0].toFixed(2)}
                      </span>
                    </div>
                    <Slider
                      id="text-weight"
                      min={0}
                      max={1}
                      step={0.01}
                      value={textWeight}
                      onValueChange={setTextWeight}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="visual-weight">Visual Weight</Label>
                      <span className="text-sm text-muted-foreground">
                        {visualWeight[0].toFixed(2)}
                      </span>
                    </div>
                    <Slider
                      id="visual-weight"
                      min={0}
                      max={1}
                      step={0.01}
                      value={visualWeight}
                      onValueChange={setVisualWeight}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Settings;