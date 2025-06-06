
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { VSMEMetricsTable } from "./VSMEMetricsTable";
import { VSMEMetric } from "@/types/vsmeMetrics";

interface VSMEMetricsSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filteredMetrics: VSMEMetric[];
}

export const VSMEMetricsSearch = ({
  searchQuery,
  onSearchChange,
  filteredMetrics,
}: VSMEMetricsSearchProps) => {
  return (
    <div className="mb-6">
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
