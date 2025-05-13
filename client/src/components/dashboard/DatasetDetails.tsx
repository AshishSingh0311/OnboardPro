
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { FileText } from 'lucide-react';

interface DatasetDetailsProps {
  isLoading?: boolean;
}

const DatasetDetails: React.FC<DatasetDetailsProps> = ({ isLoading = false }) => {
  const datasetsInfo = [
    {
      name: 'DIAC',
      fullName: 'Depression, Insomnia, Anxiety Classification',
      samples: 4850,
      modalities: 'EEG, Audio, Text',
      classes: 'Depression, Anxiety, Insomnia, Control',
      contribution: 35,
      color: '#8B5CF6'
    },
    {
      name: 'SEED',
      fullName: 'Shanghai Emotional EEG Dataset',
      samples: 5220,
      modalities: 'EEG, Video',
      classes: 'Positive, Negative, Neutral',
      contribution: 28,
      color: '#D946EF'
    },
    {
      name: 'SEED-IV',
      fullName: 'Shanghai Emotional EEG Dataset IV',
      samples: 3660,
      modalities: 'EEG, Video',
      classes: 'Happy, Sad, Fear, Neutral',
      contribution: 22,
      color: '#F97316'
    },
    {
      name: 'SAVEE',
      fullName: 'Surrey Audio-Visual Expressed Emotion',
      samples: 2180,
      modalities: 'Audio, Video',
      classes: 'Anger, Disgust, Fear, Happiness, Sadness, Surprise, Neutral',
      contribution: 15,
      color: '#0EA5E9'
    }
  ];

  const contributionData = datasetsInfo.map(dataset => ({
    name: dataset.name,
    value: dataset.contribution,
    color: dataset.color
  }));

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText size={18} />
          Dataset Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-60 bg-gray-200 rounded"></div>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">
                The model was trained on four multimodal datasets specifically focused on mental health analysis.
                Each dataset contributes different modalities and classification targets.
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Dataset Contribution to Model Training</h3>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={contributionData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <XAxis type="number" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                    <YAxis type="category" dataKey="name" width={60} />
                    <Tooltip formatter={(value) => [`${value}%`, 'Contribution']} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {contributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Dataset Details</h3>
              <div className="overflow-auto max-h-80">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Dataset</TableHead>
                      <TableHead>Samples</TableHead>
                      <TableHead>Modalities</TableHead>
                      <TableHead>Classes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {datasetsInfo.map((dataset) => (
                      <TableRow key={dataset.name}>
                        <TableCell className="font-medium">
                          <div>{dataset.name}</div>
                          <div className="text-xs text-muted-foreground">{dataset.fullName}</div>
                        </TableCell>
                        <TableCell>{dataset.samples.toLocaleString()}</TableCell>
                        <TableCell>{dataset.modalities}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {dataset.classes.split(', ').map(cls => (
                              <span 
                                key={cls} 
                                className="bg-gray-100 text-xs px-2 py-0.5 rounded-full"
                              >
                                {cls}
                              </span>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DatasetDetails;
