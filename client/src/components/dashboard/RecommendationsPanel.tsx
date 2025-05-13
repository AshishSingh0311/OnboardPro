import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Recommendations } from '@/services/mockDataService';
import { formatPercentage } from '@/lib/utils';
import { Lightbulb, Activity, Utensils, Users, Moon } from 'lucide-react';

interface RecommendationsPanelProps {
  recommendations: Recommendations;
  isLoading: boolean;
}

const RecommendationsPanel: React.FC<RecommendationsPanelProps> = ({ recommendations, isLoading }) => {
  const getIconForCategory = (category: string) => {
    switch (category.toLowerCase()) {
      case 'meditation':
        return <Lightbulb className="text-mind-blue-500" />;
      case 'exercise':
        return <Activity className="text-mind-green-500" />;
      case 'nutrition':
        return <Utensils className="text-purple-500" />;
      case 'social':
        return <Users className="text-amber-500" />;
      case 'sleep':
        return <Moon className="text-indigo-500" />;
      default:
        return <Lightbulb className="text-mind-blue-500" />;
    }
  };
  
  const getUrgencyBadgeColor = (urgency: number) => {
    if (urgency < 3) return "outline";
    if (urgency < 7) return "secondary";
    return "destructive";
  };
  
  const getUrgencyLabel = (urgency: number) => {
    if (urgency < 3) return "Low";
    if (urgency < 7) return "Medium";
    return "High";
  };
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-7 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-7 w-48" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Skeleton className="h-28 w-full" />
              <Skeleton className="h-28 w-full" />
              <Skeleton className="h-28 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Therapeutic Approaches</CardTitle>
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
      
      <Card>
        <CardHeader>
          <CardTitle>Specialist Referrals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.specialistReferrals.map((specialist, idx) => (
              <div key={idx} className="bg-white border rounded-md p-4 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{specialist.type}</h3>
                  <Badge variant={getUrgencyBadgeColor(specialist.urgency)}>
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
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Wellness Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendations.wellnessTips.map((tip, idx) => (
              <div key={idx} className="bg-white border rounded-md p-4 shadow-sm">
                <div className="flex items-start mb-2">
                  <div className="mr-2">
                    {getIconForCategory(tip.category)}
                  </div>
                  <h3 className="font-medium">{tip.title}</h3>
                </div>
                <p className="text-muted-foreground text-sm">{tip.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecommendationsPanel;
