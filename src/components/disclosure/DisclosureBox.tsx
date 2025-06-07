
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, Trash2, Edit, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useVSMEMetrics } from "@/hooks/useVSMEMetrics";
import { supabase } from "@/integrations/supabase/client";

interface Disclosure {
  id: string;
  title: string;
  description: string;
}

interface DisclosureBoxProps {
  disclosure: Disclosure;
}

export const DisclosureBox = ({
  disclosure
}: DisclosureBoxProps) => {
  const [response, setResponse] = useState("");
  const [graphicsRecommendations, setGraphicsRecommendations] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRecommendingGraphics, setIsRecommendingGraphics] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const { vsmeMetricsData } = useVSMEMetrics();

  const handleGenerateResponse = async () => {
    setIsGenerating(true);
    try {
      // Filter metrics relevant to this specific disclosure only
      const relevantMetrics = vsmeMetricsData.filter(metric => {
        // Check if metric has a response or responseData
        const hasData = metric.response || metric.responseData;
        
        // Check if metric belongs to this disclosure
        const belongsToDisclosure = metric.disclosure === disclosure.id;
        
        return hasData && belongsToDisclosure;
      });

      console.log(`Filtering metrics for disclosure ${disclosure.id}:`, {
        totalMetrics: vsmeMetricsData.length,
        relevantMetrics: relevantMetrics.length,
        filteredMetrics: relevantMetrics.map(m => ({ 
          metric: m.metric, 
          disclosure: m.disclosure, 
          hasResponse: !!m.response,
          hasResponseData: !!m.responseData 
        }))
      });

      const { data, error } = await supabase.functions.invoke('generate-disclosure', {
        body: {
          disclosureId: disclosure.id,
          disclosureTitle: disclosure.title,
          disclosureDescription: disclosure.description,
          metrics: relevantMetrics
        }
      });

      if (error) {
        throw new Error(error.message || 'Failed to generate disclosure response');
      }

      setResponse(data.generatedResponse);
      setIsEditing(false); // Exit edit mode after generation
      toast({
        title: "Response Generated",
        description: `Disclosure response for ${disclosure.title} has been generated successfully using ${relevantMetrics.length} relevant metrics.`
      });
    } catch (error) {
      console.error('Error generating response:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate disclosure response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRecommendGraphics = async () => {
    setIsRecommendingGraphics(true);
    try {
      // Filter metrics relevant to this specific disclosure only
      const relevantMetrics = vsmeMetricsData.filter(metric => {
        // Check if metric has a response or responseData
        const hasData = metric.response || metric.responseData;
        
        // Check if metric belongs to this disclosure
        const belongsToDisclosure = metric.disclosure === disclosure.id;
        
        return hasData && belongsToDisclosure;
      });

      console.log(`Generating graphics recommendations for disclosure ${disclosure.id} with ${relevantMetrics.length} metrics`);

      const { data, error } = await supabase.functions.invoke('recommend-graphics', {
        body: {
          disclosureId: disclosure.id,
          disclosureTitle: disclosure.title,
          disclosureDescription: disclosure.description,
          metrics: relevantMetrics
        }
      });

      if (error) {
        console.error('Graphics recommendation error:', error);
        throw new Error(error.message || 'Failed to generate graphics recommendations');
      }

      setGraphicsRecommendations(data.recommendations);
      
      toast({
        title: "Graphics Recommendations Generated",
        description: `Visualization recommendations for ${disclosure.title} have been generated.`
      });
      
    } catch (error) {
      console.error('Error generating graphics recommendations:', error);
      toast({
        title: "Recommendation Failed",
        description: "Failed to generate graphics recommendations. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsRecommendingGraphics(false);
    }
  };

  const handleClear = () => {
    setResponse("");
    setGraphicsRecommendations("");
    setIsEditing(false);
    toast({
      title: "Content Cleared",
      description: `All content for ${disclosure.title} has been cleared.`
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
    toast({
      title: "Edit Mode",
      description: "You can now edit the disclosure response."
    });
  };

  const handleSaveEdit = () => {
    setIsEditing(false);
    toast({
      title: "Changes Saved",
      description: "Your changes have been saved."
    });
  };

  // Split title at hyphen for multi-line display
  const titleParts = disclosure.title.split(' - ');
  const mainTitle = titleParts[0];
  const subTitle = titleParts[1];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm flex-shrink-0 mt-1">
              {disclosure.id}
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-lg text-primary leading-tight">
                {mainTitle}
              </span>
              {subTitle && (
                <span className="font-medium text-base text-muted-foreground leading-tight mt-1">
                  {subTitle}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button 
              onClick={handleGenerateResponse} 
              disabled={isGenerating} 
              className="flex items-center gap-2"
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {isGenerating ? "Generating..." : "Generate Response"}
            </Button>
            <Button 
              onClick={handleRecommendGraphics} 
              disabled={isRecommendingGraphics} 
              variant="outline"
              className="flex items-center gap-2"
            >
              {isRecommendingGraphics ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <BarChart3 className="h-4 w-4" />
              )}
              {isRecommendingGraphics ? "Analyzing..." : "Recommend Graphics"}
            </Button>
            {(response || graphicsRecommendations) && (
              <>
                <Button 
                  variant="outline"
                  onClick={isEditing ? handleSaveEdit : handleEdit}
                  className="flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  {isEditing ? "Save" : "Edit"}
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleClear}
                  className="flex items-center gap-2 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear
                </Button>
              </>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Disclosure Response Section */}
          <div>
            <Textarea 
              placeholder={`Enter or generate disclosure response for ${disclosure.title}...`}
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              className="min-h-[200px] resize-y"
              readOnly={!isEditing && response !== ""}
            />
          </div>

          {/* Graphics Recommendations Section */}
          {graphicsRecommendations && (
            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Graphics Recommendations
              </h4>
              <div className="bg-slate-50 p-4 rounded-lg border">
                <pre className="whitespace-pre-wrap text-sm font-mono">
                  {graphicsRecommendations}
                </pre>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
