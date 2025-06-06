
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { VSMEMetricsTable } from "./VSMEMetricsTable";
import { VSMEMetric } from "@/types/vsmeMetrics";

interface VSMEMetricsTabsProps {
  topics: string[];
  metricsByTopic: Record<string, VSMEMetric[]>;
}

export const VSMEMetricsTabs = ({
  topics,
  metricsByTopic,
}: VSMEMetricsTabsProps) => {
  // Convert topic names to safe tab IDs
  const getTabId = (topic: string) => topic.toLowerCase().replace(/\s+/g, '-');
  
  return (
    <Tabs defaultValue={getTabId(topics[0])} className="space-y-4">
      <TabsList className="flex flex-wrap">
        {topics.map(topic => (
          <TabsTrigger key={topic} value={getTabId(topic)} className="whitespace-nowrap">
            {topic.replace("Enviornment", "Environment")}
          </TabsTrigger>
        ))}
      </TabsList>

      {topics.map(topic => (
        <TabsContent key={topic} value={getTabId(topic)} className="mt-0">
          <Card className="shadow-sm">
            <CardContent className="p-4">
              <VSMEMetricsTable metrics={metricsByTopic[topic]} />
            </CardContent>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  );
};
