
import { VSMEMetricsSearch } from "@/components/metrics/VSMEMetricsSearch";
import { VSMEMetricsTabs } from "@/components/metrics/VSMEMetricsTabs";
import { VSMEMetricsDropdown } from "@/components/metrics/VSMEMetricsDropdown";
import { useVSMEDatabase } from "@/hooks/useVSMEDatabase";
import { Button } from "@/components/ui/button";
import { Upload, Database } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { VSMEMetric } from "@/types/vsmeMetrics";

const Metrics = () => {
  const { loadStaticMetrics, insertProvidedMetrics, isLoading } = useVSMEDatabase();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [metrics, setMetrics] = useState<VSMEMetric[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      console.log('Fetching metrics...');
      const data = await loadStaticMetrics();
      console.log('Metrics fetched:', data.length, 'metrics');
      if (data.length > 0) {
        console.log('Sample metrics:', data.slice(0, 3));
        setMetrics(data);
      }
    };
    
    fetchMetrics();
    
    // Check if data was previously synced
    const metricsLastUpdated = localStorage.getItem('metricsLastUpdated');
    if (metricsLastUpdated) {
      setLastUpdated(metricsLastUpdated);
    }
  }, [loadStaticMetrics]);

  // Get unique topics for filtering - only include valid topics
  const topics = Array.from(new Set(
    metrics
      .map(metric => metric.topic)
      .filter((topic): topic is string => Boolean(topic && topic.trim() !== ''))
  ));

  console.log('Topics:', topics);
  console.log('Total metrics:', metrics.length);
  
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

  // Group metrics by topic - only include metrics with valid topics
  const metricsByTopic: Record<string, VSMEMetric[]> = {};
  topics.forEach(topic => {
    metricsByTopic[topic] = metrics.filter(metric => metric.topic === topic);
  });

  console.log('Metrics by topic:', metricsByTopic);

  const goToImport = () => {
    navigate("/import");
  };

  const handleInsertProvidedMetrics = async () => {
    const success = await insertProvidedMetrics();
    if (success) {
      // Refresh metrics after successful insertion
      const updatedMetrics = await loadStaticMetrics();
      setMetrics(updatedMetrics);
      
      const now = new Date().toISOString();
      localStorage.setItem('metricsLastUpdated', now);
      setLastUpdated(now);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 pt-12 pb-12">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#057cc1] mx-auto mb-4"></div>
                <p className="text-gray-600">Loading metrics...</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 pt-12 pb-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">VSME Metrics</h1>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Collect, manage, and report on your VSME sustainability metrics
                {lastUpdated && (
                  <span className="ml-2 text-sm text-gray-500">
                    (Last updated: {new Date(lastUpdated).toLocaleDateString()})
                  </span>
                )}
              </p>
              <div className="mt-2">
                <VSMEMetricsDropdown onlyShowMoreOptions={true} />
              </div>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={handleInsertProvidedMetrics}
                disabled={isLoading}
              >
                <Database className="h-4 w-4" />
                Insert Provided Data
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={goToImport}
              >
                <Upload className="h-4 w-4" />
                Import Updated Data
              </Button>
              <VSMEMetricsDropdown onlyShowStepButton={true} />
            </div>
          </div>
          
          <div id="metrics-content" className="mb-8">
            <VSMEMetricsSearch
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              filteredMetrics={filteredMetrics}
            />

            <VSMEMetricsTabs
              topics={topics}
              metricsByTopic={metricsByTopic}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Metrics;
