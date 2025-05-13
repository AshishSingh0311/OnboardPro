
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RecommendationOutput } from "@/types/analysis";

interface RecommendationsPanelProps {
  recommendations: RecommendationOutput;
  isLoading?: boolean;
}

const RecommendationsPanel: React.FC<RecommendationsPanelProps> = ({ recommendations, isLoading = false }) => {
  const getUrgencyColor = (urgency: number) => {
    if (urgency < 3) return "bg-green-100 text-green-800";
    if (urgency < 7) return "bg-amber-100 text-amber-800";
    return "bg-red-100 text-red-800";
  };
  
  const getUrgencyLabel = (urgency: number) => {
    if (urgency < 3) return "Low";
    if (urgency < 7) return "Moderate";
    return "High";
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">AI-Generated Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-6 animate-pulse">
            <div>
              <div className="h-5 bg-gray-200 rounded w-1/3 mb-3"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
            <div>
              <div className="h-5 bg-gray-200 rounded w-1/3 mb-3"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-2">Therapy Recommendations</h3>
              <div className="space-y-3">
                {recommendations.therapyRecommendations.map((therapy, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded">
                    <div className="flex justify-between items-start mb-1">
                      <div className="font-medium">{therapy.type}</div>
                      <Badge variant="secondary" className="text-xs">
                        {(therapy.confidence * 100).toFixed(0)}% match
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">{therapy.description}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Specialist Referrals</h3>
              <div className="space-y-3">
                {recommendations.specialistReferrals.map((specialist, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded">
                    <div className="flex justify-between items-start mb-1">
                      <div className="font-medium">{specialist.type}</div>
                      <Badge variant="outline" className={`text-xs ${getUrgencyColor(specialist.urgency)}`}>
                        {getUrgencyLabel(specialist.urgency)} Urgency
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">{specialist.reason}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Wellness Tips</h3>
              <div className="space-y-3">
                {recommendations.wellnessTips.map((tip, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded">
                    <div className="font-medium mb-1">{tip.title}</div>
                    <div className="text-sm text-gray-600">{tip.content}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecommendationsPanel;
