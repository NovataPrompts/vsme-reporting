import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useVSMEMetrics } from "@/hooks/useVSMEMetrics";
import { useDisclosureResponses } from "@/hooks/useDisclosureResponses";
import { supabase } from "@/integrations/supabase/client";
import { GraphicsModal } from "./GraphicsModal";
import { DisclosureHeader } from "./DisclosureHeader";
import { DisclosureContent } from "./DisclosureContent";
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
  const [initialResponse, setInitialResponse] = useState("");
  const isLoadingRef = useRef(false);
  const {
    toast
  } = useToast();
  const {
    vsmeMetricsData
  } = useVSMEMetrics();
  const {
    saveDisclosureResponse,
    loadDisclosureResponse,
    deleteDisclosureResponse,
    isLoading: isSaving
  } = useDisclosureResponses();

  // Define which disclosures need graphics - now includes B3
  const disclosuresWithGraphics = ['B2', 'B3'];
  const showGraphicsButton = disclosuresWithGraphics.includes(disclosure.id);

  // Load saved response on component mount
  useEffect(() => {
    const loadSavedResponse = async () => {
      isLoadingRef.current = true;
      const savedResponse = await loadDisclosureResponse(disclosure.id);
      if (savedResponse) {
        setResponse(savedResponse.response_content);
        setInitialResponse(savedResponse.response_content);
        if (savedResponse.graphics_recommendations) {
          setGraphicsRecommendations(savedResponse.graphics_recommendations);
        }
        setLastSavedAt(new Date(savedResponse.updated_at));
        setHasUnsavedChanges(false);
      }
      isLoadingRef.current = false;
    };
    loadSavedResponse();
  }, [disclosure.id, loadDisclosureResponse]);

  // Track changes to response content only when not loading
  useEffect(() => {
    if (!isLoadingRef.current && response !== initialResponse) {
      setHasUnsavedChanges(true);
    }
  }, [response, initialResponse]);
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
      const {
        data,
        error
      } = await supabase.functions.invoke('generate-disclosure', {
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
      const allMetricsWithData = vsmeMetricsData.filter(metric => metric.response || metric.responseData);
      console.log(`Generating graphics recommendations for disclosure ${disclosure.id}:`, {
        relevantMetrics: relevantMetrics.length,
        totalContextualMetrics: allMetricsWithData.length
      });
      const {
        data,
        error
      } = await supabase.functions.invoke('recommend-graphics', {
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
    const success = await saveDisclosureResponse(disclosure.id, disclosure.title, response, graphicsRecommendations);
    if (success) {
      setHasUnsavedChanges(false);
      setInitialResponse(response);
      setLastSavedAt(new Date());
    }
  };
  const handleClear = async () => {
    const success = await deleteDisclosureResponse(disclosure.id);
    if (success) {
      setResponse("");
      setInitialResponse("");
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
  };
  const handleShowGraphics = () => {
    setShowGraphicsModal(true);
  };
  return <>
      <Card>
        <CardHeader className="bg-gray-100">
          <DisclosureHeader disclosure={disclosure} response={response} isGenerating={isGenerating} isRecommendingGraphics={isRecommendingGraphics} isSaving={isSaving} hasUnsavedChanges={hasUnsavedChanges} isEditing={isEditing} showGraphicsButton={showGraphicsButton} onGenerateResponse={handleGenerateResponse} onRecommendGraphics={handleRecommendGraphics} onSave={handleSave} onEdit={handleEdit} onSaveEdit={handleSaveEdit} onClear={handleClear} />
        </CardHeader>
        <CardContent className="bg-gray-100">
          <DisclosureContent disclosure={disclosure} response={response} isEditing={isEditing} hasUnsavedChanges={hasUnsavedChanges} lastGeneratedAt={lastGeneratedAt} lastSavedAt={lastSavedAt} graphicsRecommendations={graphicsRecommendations} showGraphicsButton={showGraphicsButton} onResponseChange={handleResponseChange} onShowGraphics={handleShowGraphics} />
        </CardContent>
      </Card>

      {/* Graphics Modal */}
      <GraphicsModal isOpen={showGraphicsModal} onClose={() => setShowGraphicsModal(false)} recommendations={graphicsRecommendations || {
      hasCharts: false
    }} disclosureTitle={disclosure.title} />
    </>;
};