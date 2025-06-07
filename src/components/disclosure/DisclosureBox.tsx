
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useVSMEMetrics } from "@/hooks/useVSMEMetrics";

interface Disclosure {
  id: string;
  title: string;
  description: string;
}

interface DisclosureBoxProps {
  disclosure: Disclosure;
}

export const DisclosureBox = ({ disclosure }: DisclosureBoxProps) => {
  const [response, setResponse] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const { vsmeMetricsData } = useVSMEMetrics();

  const handleGenerateResponse = async () => {
    setIsGenerating(true);
    
    try {
      // Filter metrics relevant to this disclosure
      const relevantMetrics = vsmeMetricsData.filter(metric => 
        metric.response || metric.responseData
      );

      const response = await fetch('/api/generate-disclosure', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          disclosureId: disclosure.id,
          disclosureTitle: disclosure.title,
          disclosureDescription: disclosure.description,
          metrics: relevantMetrics
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate disclosure response');
      }

      const data = await response.json();
      setResponse(data.generatedResponse);

      toast({
        title: "Response Generated",
        description: `Disclosure response for ${disclosure.title} has been generated successfully.`,
      });
    } catch (error) {
      console.error('Error generating response:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate disclosure response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
              {disclosure.id}
            </div>
            <span>{disclosure.title}</span>
          </div>
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
        </CardTitle>
        <CardDescription>
          {disclosure.description}
        </CardDescription>
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
