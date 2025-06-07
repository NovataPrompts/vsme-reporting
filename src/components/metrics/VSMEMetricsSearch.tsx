
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { VSMEMetricsTable } from "./VSMEMetricsTable";
import { VSMEMetricsFilters } from "./VSMEMetricsFilters";
import { VSMEMetric } from "@/types/vsmeMetrics";

interface VSMEMetricsSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filteredMetrics: VSMEMetric[];
  allMetrics: VSMEMetric[];
  selectedTopic: string;
  selectedSection: string;
  selectedSubSection: string;
  selectedInputType: string;
  onTopicChange: (value: string) => void;
  onSectionChange: (value: string) => void;
  onSubSectionChange: (value: string) => void;
  onInputTypeChange: (value: string) => void;
  onClearFilters: () => void;
}

export const VSMEMetricsSearch = ({
  searchQuery,
  onSearchChange,
  filteredMetrics,
  allMetrics,
  selectedTopic,
  selectedSection,
  selectedSubSection,
  selectedInputType,
  onTopicChange,
  onSectionChange,
  onSubSectionChange,
  onInputTypeChange,
  onClearFilters,
}: VSMEMetricsSearchProps) => {
  return (
    <div className="mb-6">
      <VSMEMetricsFilters
        metrics={allMetrics}
        selectedTopic={selectedTopic}
        selectedSection={selectedSection}
        selectedSubSection={selectedSubSection}
        selectedInputType={selectedInputType}
        onTopicChange={onTopicChange}
        onSectionChange={onSectionChange}
        onSubSectionChange={onSubSectionChange}
        onInputTypeChange={onInputTypeChange}
        onClearFilters={onClearFilters}
      />
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input 
          placeholder="Search metrics by novata reference, topic, section or description..." 
          className="pl-10 rounded-full"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      {searchQuery && (
        <div className="mt-4">
          <h2 className="text-lg font-medium mb-3">Search Results</h2>
          <Card className="shadow-sm">
            <CardContent className="p-4">
              <VSMEMetricsTable metrics={filteredMetrics} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
