
import { useState } from "react";
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
  // Filter out any undefined or empty topics and convert to safe tab IDs
  const validTopics = topics.filter(topic => topic && topic.trim() !== '');
  const getTabId = (topic: string) => topic.toLowerCase().replace(/\s+/g, '-');
  
  // If no valid topics, show a message
  if (validTopics.length === 0) {
    return (
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <p className="text-center text-gray-500">No metrics available</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Tabs defaultValue={getTabId(validTopics[0])} className="space-y-4">
      <TabsList className="flex flex-wrap">
        {validTopics.map(topic => (
          <TabsTrigger key={topic} value={getTabId(topic)} className="whitespace-nowrap">
            {topic.replace("Enviornment", "Environment")}
          </TabsTrigger>
        ))}
      </TabsList>

      {validTopics.map(topic => {
        const topicMetrics = metricsByTopic[topic] || [];
        
        return (
          <TabsContent key={topic} value={getTabId(topic)} className="mt-0">
            <Card className="shadow-sm">
              <CardContent className="p-4">
                <VSMEMetricsTable metrics={topicMetrics} />
              </CardContent>
            </Card>
          </TabsContent>
        );
      })}
    </Tabs>
  );
};
