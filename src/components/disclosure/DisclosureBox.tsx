

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles } from "lucide-react";
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
  const [isGenerating, setIsGenerating] = useState(false);
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
          <Button 
            onClick={handleGenerateResponse} 
            disabled={isGenerating} 
            className="flex items-center gap-2 flex-shrink-0"
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {isGenerating ? "Generating..." : "Generate Response"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Textarea 
            placeholder={`Enter or generate disclosure response for ${disclosure.title}...`}
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            className="min-h-[200px] resize-y"
          />
        </div>
      </CardContent>
    </Card>
  );
};

