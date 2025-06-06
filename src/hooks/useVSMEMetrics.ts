
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { VSMEMetric } from "@/types/vsmeMetrics";
import { useNavigate } from "react-router-dom";
import { useVSMEDatabase } from "./useVSMEDatabase";

export const useVSMEMetrics = () => {
  const { toast } = useToast();
  const { loadStaticMetrics } = useVSMEDatabase();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<VSMEMetric[]>([]);

  useEffect(() => {
    const fetchMetrics = async () => {
      const data = await loadStaticMetrics();
      setMetrics(data);
    };
    
    fetchMetrics();
  }, []);
  
  // Get unique topics for filtering
  const topics = Array.from(new Set(metrics.map(metric => metric.topic).filter(Boolean)));
  
  // Filter metrics based on search query
  const filteredMetrics = searchQuery
    ? metrics.filter(metric => 
        metric.disclosure?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        metric.topic?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        metric.section?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        metric.metric?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        metric.novataReference?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        metric.definition?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Group metrics by topic
  const metricsByTopic: Record<string, VSMEMetric[]> = {};
  topics.forEach(topic => {
    metricsByTopic[topic] = metrics.filter(metric => metric.topic === topic);
  });

  const handleSaveMetric = (metricReference: string) => {
    const metric = metrics.find(m => m.novataReference === metricReference);
    toast({
      title: "Metric Saved",
      description: `${metric?.metric || metricReference} data has been saved successfully.`,
      duration: 3000,
    });
  };

  const handleLearnMore = (metricReference: string) => {
    const metric = metrics.find(m => m.novataReference === metricReference);
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
    vsmeMetricsData: metrics,
    filteredMetrics,
    metricsByTopic,
    handleSaveMetric,
    handleLearnMore,
    goToImport,
    lastUpdated,
    handleImportMetrics
  };
};
