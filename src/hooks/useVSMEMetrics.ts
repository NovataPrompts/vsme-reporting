
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { vsmeMetricsData } from "@/data/vsmeMetricsData";
import { VSMEMetric } from "@/types/vsmeMetrics";
import { useNavigate } from "react-router-dom";

export const useVSMEMetrics = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  
  // Get unique topics for filtering
  const topics = Array.from(new Set(vsmeMetricsData.map(metric => metric.topic)));
  
  // Filter metrics based on search query
  const filteredMetrics = searchQuery
    ? vsmeMetricsData.filter(metric => 
        metric.disclosure.toLowerCase().includes(searchQuery.toLowerCase()) ||
        metric.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        metric.section.toLowerCase().includes(searchQuery.toLowerCase()) ||
        metric.metric.toLowerCase().includes(searchQuery.toLowerCase()) ||
        metric.novataReference?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (metric.definition ? metric.definition.toLowerCase().includes(searchQuery.toLowerCase()) : false)
      )
    : [];

  // Group metrics by topic
  const metricsByTopic: Record<string, VSMEMetric[]> = {};
  topics.forEach(topic => {
    metricsByTopic[topic] = vsmeMetricsData.filter(metric => metric.topic === topic);
  });

  const handleSaveMetric = (metricReference: string) => {
    // Find the metric to include in the message
    const metric = vsmeMetricsData.find(m => m.novataReference === metricReference);
    toast({
      title: "Metric Saved",
      description: `${metric?.metric || metricReference} data has been saved successfully.`,
      duration: 3000,
    });
  };

  const handleLearnMore = (metricReference: string) => {
    // Find the metric to include in the message
    const metric = vsmeMetricsData.find(m => m.novataReference === metricReference);
    toast({
      title: "Learn More",
      description: `Additional information about ${metric?.metric || metricReference} will be available soon.`,
      duration: 3000,
    });
  };

  const goToImport = () => {
    navigate("/import");
  };

  // Check if metrics have been updated
  useEffect(() => {
    const metricsLastUpdated = localStorage.getItem('metricsLastUpdated');
    if (metricsLastUpdated) {
      setLastUpdated(metricsLastUpdated);
    }
  }, []);

  const handleImportMetrics = (newMetrics: VSMEMetric[]) => {
    // This function would normally update the metrics in a real application
    // For now we'll just show a success message
    const now = new Date().toISOString();
    localStorage.setItem('metricsLastUpdated', now);
    setLastUpdated(now);
    
    toast({
      title: "Metrics Imported",
      description: `${newMetrics.length} metrics have been successfully imported.`,
      duration: 3000,
    });
  };

  return {
    searchQuery,
    setSearchQuery,
    topics,
    vsmeMetricsData,
    filteredMetrics,
    metricsByTopic,
    handleSaveMetric,
    handleLearnMore,
    goToImport,
    lastUpdated,
    handleImportMetrics
  };
};
