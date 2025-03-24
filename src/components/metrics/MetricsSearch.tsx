
import { Search, Info, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Metric } from "@/types/metrics";

interface MetricsSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filteredMetrics: Metric[];
  onLearnMore: (metricName: string) => void;
  onSaveMetric: (metricName: string) => void;
}

export const MetricsSearch = ({
  searchQuery,
  onSearchChange,
  filteredMetrics,
  onLearnMore,
  onSaveMetric,
}: MetricsSearchProps) => {
  return (
    <div className="mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input 
          placeholder="Search metrics..." 
          className="pl-10 rounded-full"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      {searchQuery && (
        <div className="mt-4">
          <h2 className="text-lg font-medium mb-3">Search Results</h2>
          <Card className="shadow-sm">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredMetrics.length > 0 ? (
                  filteredMetrics.map((metric) => (
                    <div key={metric.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all-ease">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700">
                              {metric.category}
                            </span>
                          </div>
                          <h3 className="font-medium mt-1">{metric.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{metric.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="flex gap-1 items-center text-xs"
                            onClick={() => onLearnMore(metric.name)}
                          >
                            <Info className="h-3 w-3" />
                            <span>Learn More</span>
                          </Button>
                          <Button 
                            size="sm"
                            className="flex gap-1 items-center text-xs bg-accent hover:bg-accent/90 text-primary"
                            onClick={() => onSaveMetric(metric.name)}
                          >
                            <Save className="h-3 w-3" />
                            <span>Enter Data</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-gray-500 dark:text-gray-400">No metrics found matching your search criteria.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
