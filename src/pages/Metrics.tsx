
import { VSMEMetricsSearch } from "@/components/metrics/VSMEMetricsSearch";
import { VSMEMetricsTabs } from "@/components/metrics/VSMEMetricsTabs";
import { VSMEMetricsDropdown } from "@/components/metrics/VSMEMetricsDropdown";
import { useVSMEMetrics } from "@/hooks/useVSMEMetrics";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

const Metrics = () => {
  const {
    searchQuery,
    setSearchQuery,
    topics,
    filteredMetrics,
    metricsByTopic,
    goToImport,
    lastUpdated
  } = useVSMEMetrics();

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
