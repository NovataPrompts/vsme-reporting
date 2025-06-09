import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, Trash2, Edit, BarChart3, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useVSMEMetrics } from "@/hooks/useVSMEMetrics";
import { useDisclosureResponses } from "@/hooks/useDisclosureResponses";
import { supabase } from "@/integrations/supabase/client";
import { GraphicsModal } from "./GraphicsModal";

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
  const [graphicsRecommendations, setGraphicsRecommendations] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRecommendingGraphics, setIsRecommendingGraphics] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showGraphicsModal, setShowGraphicsModal] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastGeneratedAt, setLastGeneratedAt] = useState<Date | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const { toast } = useToast();
  const { vsmeMetricsData } = useVSMEMetrics();
  const { saveDisclosureResponse, loadDisclosureResponse, deleteDisclosureResponse, isLoading: isSaving } = useDisclosureResponses();

  // Define which disclosures need graphics
  const disclosuresWithGraphics = ['B2', 'B3'];
  const showGraphicsButton = disclosuresWithGraphics.includes(disclosure.id);

  // Load saved response on component mount
  useEffect(() => {
    const loadSavedResponse = async () => {
      const savedResponse = await loadDisclosureResponse(disclosure.id);
      if (savedResponse) {
        setResponse(savedResponse.response_content);
        if (savedResponse.graphics_recommendations) {
          setGraphicsRecommendations(savedResponse.graphics_recommendations);
        }
        setLastSavedAt(new Date(savedResponse.updated_at));
        setHasUnsavedChanges(false);
      }
    };

    loadSavedResponse();
  }, [disclosure.id, loadDisclosureResponse]);

  // Track changes to response content
  useEffect(() => {
    setHasUnsavedChanges(true);
  }, [response]);

  const formatTimestamp = (date: Date) => {
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

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
      setLastGeneratedAt(new Date());
      setIsEditing(false); // Exit edit mode after generation
      setHasUnsavedChanges(true);
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
      // Filter metrics relevant to this specific disclosure
      const relevantMetrics = vsmeMetricsData.filter(metric => {
        const hasData = metric.response || metric.responseData;
        const belongsToDisclosure = metric.disclosure === disclosure.id;
        return hasData && belongsToDisclosure;
      });

      // Get all metrics with data for contextual analysis
      const allMetricsWithData = vsmeMetricsData.filter(metric => 
        metric.response || metric.responseData
      );

      console.log(`Generating graphics recommendations for disclosure ${disclosure.id}:`, {
        relevantMetrics: relevantMetrics.length,
        totalContextualMetrics: allMetricsWithData.length
      });

      const { data, error } = await supabase.functions.invoke('recommend-graphics', {
        body: {
          disclosureId: disclosure.id,
          disclosureTitle: disclosure.title,
          disclosureDescription: disclosure.description,
          metrics: relevantMetrics,
          allMetrics: allMetricsWithData // Pass all metrics for context
        }
      });

      if (error) {
        console.error('Graphics recommendation error:', error);
        throw new Error(error.message || 'Failed to generate graphics recommendations');
      }

      setGraphicsRecommendations(data);
      setShowGraphicsModal(true);
      setHasUnsavedChanges(true);
      
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

  const handleSave = async () => {
    const success = await saveDisclosureResponse(
      disclosure.id,
      disclosure.title,
      response,
      graphicsRecommendations
    );
    
    if (success) {
      setHasUnsavedChanges(false);
      setLastSavedAt(new Date());
    }
  };

  const handleClear = async () => {
    const success = await deleteDisclosureResponse(disclosure.id);
    if (success) {
      setResponse("");
      setGraphicsRecommendations(null);
      setIsEditing(false);
      setHasUnsavedChanges(false);
      setLastGeneratedAt(null);
      setLastSavedAt(null);
    }
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
      title: "Edit Mode Disabled",
      description: "Remember to save your changes using the Save button."
    });
  };

  const handleResponseChange = (value: string) => {
    setResponse(value);
    setHasUnsavedChanges(true);
  };

  // Split title at hyphen for multi-line display
  const titleParts = disclosure.title.split(' - ');
  const mainTitle = titleParts[0];
  const subTitle = titleParts[1];

  return (
    <>
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
              {showGraphicsButton && (
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
              )}
              {response && (
                <>
                  <Button 
                    onClick={handleSave}
                    disabled={isSaving || !hasUnsavedChanges}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    {isSaving ? "Saving..." : hasUnsavedChanges ? "Save" : "Saved"}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={isEditing ? handleSaveEdit : handleEdit}
                    className="flex items-center gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    {isEditing ? "Done Editing" : "Edit"}
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
            <div>
              <Textarea 
                placeholder={`Enter or generate disclosure response for ${disclosure.title}...`}
                value={response}
                onChange={(e) => handleResponseChange(e.target.value)}
                className="min-h-[200px] resize-y"
                readOnly={!isEditing && response !== ""}
              />
              {hasUnsavedChanges && response && (
                <p className="text-sm text-red-600 mt-2">
                  You have unsaved changes. Click "Save" to preserve your work.
                </p>
              )}
              {(lastGeneratedAt || lastSavedAt) && (
                <div className="mt-3 space-y-1">
                  {lastGeneratedAt && (
                    <p className="text-sm text-green-600">
                      Generated: {formatTimestamp(lastGeneratedAt)}
                    </p>
                  )}
                  {lastSavedAt && !hasUnsavedChanges && (
                    <p className="text-sm text-green-600">
                      Last saved: {formatTimestamp(lastSavedAt)}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Graphics Modal */}
      <GraphicsModal
        isOpen={showGraphicsModal}
        onClose={() => setShowGraphicsModal(false)}
        recommendations={graphicsRecommendations || { hasCharts: false }}
        disclosureTitle={disclosure.title}
      />
    </>
  );
};
