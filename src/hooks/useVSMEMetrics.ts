
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
        metric.reference.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Group metrics by topic
  const metricsByTopic: Record<string, VSMEMetric[]> = {};
  topics.forEach(topic => {
    metricsByTopic[topic] = vsmeMetricsData.filter(metric => metric.topic === topic);
  });

  const handleSaveMetric = (metricReference: string) => {
    toast({
      title: "Metric Saved",
      description: `Metric ${metricReference} data has been saved successfully.`,
      duration: 3000,
    });
  };

  const handleLearnMore = (metricReference: string) => {
    toast({
      title: "Learn More",
      description: `Additional information about metric ${metricReference} will be available soon.`,
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
    lastUpdated
  };
};
