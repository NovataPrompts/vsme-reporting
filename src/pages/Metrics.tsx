
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useNavigate } from "react-router-dom";
import { MetricsSearch } from "@/components/metrics/MetricsSearch";
import { MetricsTabs } from "@/components/metrics/MetricsTabs";
import { useMetrics } from "@/hooks/useMetrics";

const Metrics = () => {
  const navigate = useNavigate();
  const {
    searchQuery,
    setSearchQuery,
    metricCategories,
    filteredMetrics,
    handleSaveMetric,
    handleLearnMore
  } = useMetrics();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Metrics</h1>
              <p className="text-gray-600 dark:text-gray-300">
                Collect, manage, and report on your VSME sustainability metrics
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-3">
              <MetricsSearch
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                filteredMetrics={filteredMetrics}
                onLearnMore={handleLearnMore}
                onSaveMetric={handleSaveMetric}
              />

              <MetricsTabs
                metricCategories={metricCategories}
                onLearnMore={handleLearnMore}
                onSaveMetric={handleSaveMetric}
              />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Metrics;
