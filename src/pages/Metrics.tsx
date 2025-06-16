import { VSMEMetricsSearch } from "@/components/metrics/VSMEMetricsSearch";
import { VSMEMetricsDropdown } from "@/components/metrics/VSMEMetricsDropdown";
import { useVSMEDatabase } from "@/hooks/useVSMEDatabase";
import { useVSMEUserResponses } from "@/hooks/useVSMEUserResponses";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { VSMEMetric } from "@/types/vsmeMetrics";
import { OrganizationManager } from "@/components/OrganizationManager";
import { ReportBreadcrumb } from "@/components/navigation/ReportBreadcrumb";

const Metrics = () => {
  const { loadStaticMetrics, isLoading } = useVSMEDatabase();
  const { getUserResponseByNovataReference } = useVSMEUserResponses();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [metrics, setMetrics] = useState<VSMEMetric[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  
  // Filter states
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedSubSection, setSelectedSubSection] = useState("");
  const [selectedInputType, setSelectedInputType] = useState("");

  useEffect(() => {
    const fetchMetrics = async () => {
      console.log('Fetching metrics...');
      const data = await loadStaticMetrics();
      console.log('Metrics fetched:', data.length, 'metrics');
      
      if (data.length > 0) {
        console.log('Sample metrics:', data.slice(0, 3));
        
        // Load user responses for each metric
        const metricsWithResponses = await Promise.all(
          data.map(async (metric) => {
            if (metric.novataReference) {
              const userResponse = await getUserResponseByNovataReference(metric.novataReference);
              return {
                ...metric,
                response: userResponse?.response_value || undefined,
                responseData: userResponse?.response_data || undefined
              };
            }
            return metric;
          })
        );
        
        setMetrics(metricsWithResponses);
      }
    };
    
    fetchMetrics();
    
    // Check if data was previously synced
    const metricsLastUpdated = localStorage.getItem('metricsLastUpdated');
    if (metricsLastUpdated) {
      setLastUpdated(metricsLastUpdated);
    }
  }, [loadStaticMetrics, getUserResponseByNovataReference]);

  console.log('Total metrics:', metrics.length);
  
  // Apply filters first
  let filteredByFilters = metrics;
  
  if (selectedTopic) {
    filteredByFilters = filteredByFilters.filter(metric => metric.topic === selectedTopic);
  }
  if (selectedSection) {
    filteredByFilters = filteredByFilters.filter(metric => metric.section === selectedSection);
  }
  if (selectedSubSection) {
    filteredByFilters = filteredByFilters.filter(metric => metric.subSection === selectedSubSection);
  }
  if (selectedInputType) {
    filteredByFilters = filteredByFilters.filter(metric => metric.inputType === selectedInputType);
  }
  
  console.log('Filtered by filters:', filteredByFilters.length);
  console.log('Active filters:', { selectedTopic, selectedSection, selectedSubSection, selectedInputType });
  
  // Then apply search query to filtered results
  const filteredMetrics = searchQuery
    ? filteredByFilters.filter(metric => 
        metric.disclosure?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        metric.topic?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        metric.section?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        metric.metric?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        metric.novataReference?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        metric.definition?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredByFilters;

  const goToImport = () => {
    navigate("/import");
  };

  const handleClearFilters = () => {
    setSelectedTopic("");
    setSelectedSection("");
    setSelectedSubSection("");
    setSelectedInputType("");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 pt-12 pb-12">
          <div className="container mx-auto px-4 md:px-6">
            <ReportBreadcrumb />
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

  // Show organization manager if no metrics are loaded
  if (metrics.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 pt-12 pb-12">
          <div className="container mx-auto px-4 md:px-6">
            <ReportBreadcrumb />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">VSME Metrics</h1>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Collect, manage, and report on your VSME sustainability metrics
                </p>
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={goToImport}
                >
                  <Upload className="h-4 w-4" />
                  Import Updated Data
                </Button>
              </div>
            </div>
            
            <div className="max-w-2xl mx-auto">
              <OrganizationManager />
              <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">No Metrics Data Found</h3>
                <p className="text-blue-800 mb-4">
                  It looks like there's no metrics data available. This could be because:
                </p>
                <ul className="list-disc list-inside text-blue-800 space-y-1 mb-4">
                  <li>The metrics database is empty</li>
                  <li>There's an issue with data synchronization</li>
                  <li>You need to import metrics data first</li>
                </ul>
                <Button 
                  onClick={goToImport}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Import Metrics Data
                </Button>
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
          <ReportBreadcrumb />
          
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
              allMetrics={metrics}
              selectedTopic={selectedTopic}
              selectedSection={selectedSection}
              selectedSubSection={selectedSubSection}
              selectedInputType={selectedInputType}
              onTopicChange={setSelectedTopic}
              onSectionChange={setSelectedSection}
              onSubSectionChange={setSelectedSubSection}
              onInputTypeChange={setSelectedInputType}
              onClearFilters={handleClearFilters}
              showTableAlways={true}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Metrics;
