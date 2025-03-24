
import { Info, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { MetricCategory } from "@/types/metrics";

interface MetricsCategoryTabProps {
  category: MetricCategory;
  onLearnMore: (metricName: string) => void;
  onSaveMetric: (metricName: string) => void;
}

export const MetricsCategoryTab = ({
  category,
  onLearnMore,
  onSaveMetric,
}: MetricsCategoryTabProps) => {
  return (
    <TabsContent key={category.id} value={category.id} className="mt-0 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <category.icon className="h-5 w-5" />
            <span>{category.name}</span>
          </CardTitle>
          <CardDescription>{category.description}</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-1 divide-y divide-gray-200 dark:divide-gray-700">
            {category.metrics.map((metric) => (
              <div key={metric.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all-ease">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-medium">{metric.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{metric.description}</p>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="flex gap-1 items-center"
                      onClick={() => onLearnMore(metric.name)}
                    >
                      <Info className="h-4 w-4" />
                      <span>Learn More</span>
                    </Button>
                    <Button 
                      size="sm"
                      className="flex gap-1 items-center bg-accent hover:bg-accent/90 text-primary"
                      onClick={() => onSaveMetric(metric.name)}
                    >
                      <Save className="h-4 w-4" />
                      <span>Enter Data</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};
