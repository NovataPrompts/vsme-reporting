
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  const [openSubSections, setOpenSubSections] = useState<Set<string>>(new Set());
  
  // Filter out any undefined or empty topics and convert to safe tab IDs
  const validTopics = topics.filter(topic => topic && topic.trim() !== '');
  const getTabId = (topic: string) => topic.toLowerCase().replace(/\s+/g, '-');
  
  const toggleSubSection = (subSectionKey: string) => {
    const newOpenSubSections = new Set(openSubSections);
    if (newOpenSubSections.has(subSectionKey)) {
      newOpenSubSections.delete(subSectionKey);
    } else {
      newOpenSubSections.add(subSectionKey);
    }
    setOpenSubSections(newOpenSubSections);
  };

  // Group metrics by sub-section within each topic
  const getMetricsBySubSection = (topicMetrics: VSMEMetric[]) => {
    const subSectionGroups: Record<string, VSMEMetric[]> = {};
    
    topicMetrics.forEach(metric => {
      const subSection = metric.subSection || 'General';
      if (!subSectionGroups[subSection]) {
        subSectionGroups[subSection] = [];
      }
      subSectionGroups[subSection].push(metric);
    });
    
    return subSectionGroups;
  };
  
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
        const subSectionGroups = getMetricsBySubSection(topicMetrics);
        const subSections = Object.keys(subSectionGroups);
        
        return (
          <TabsContent key={topic} value={getTabId(topic)} className="mt-0">
            <Card className="shadow-sm">
              <CardContent className="p-4">
                {subSections.length > 1 ? (
                  // Multiple sub-sections: show collapsible groups
                  <div className="space-y-4">
                    {subSections.map(subSection => {
                      const subSectionKey = `${topic}-${subSection}`;
                      const isOpen = openSubSections.has(subSectionKey);
                      
                      return (
                        <div key={subSection}>
                          <Collapsible open={isOpen} onOpenChange={() => toggleSubSection(subSectionKey)}>
                            <CollapsibleTrigger asChild>
                              <Button
                                variant="ghost"
                                className="flex items-center justify-between w-full p-3 mb-3 text-left bg-slate-50 hover:bg-slate-100 rounded-lg border"
                              >
                                <h3 className="text-lg font-semibold text-[#057cc1]">
                                  {subSection}
                                </h3>
                                <ChevronDown 
                                  className={`h-5 w-5 text-[#057cc1] transition-transform duration-200 ${
                                    isOpen ? 'transform rotate-180' : ''
                                  }`} 
                                />
                              </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <VSMEMetricsTable metrics={subSectionGroups[subSection]} />
                            </CollapsibleContent>
                          </Collapsible>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  // Single sub-section: show directly without collapsible
                  <VSMEMetricsTable metrics={topicMetrics} />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        );
      })}
    </Tabs>
  );
};
