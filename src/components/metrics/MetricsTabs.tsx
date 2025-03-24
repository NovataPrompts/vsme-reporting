
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MetricsCategoryTab } from "./MetricsCategoryTab";
import { MetricCategory } from "@/types/metrics";

interface MetricsTabsProps {
  metricCategories: MetricCategory[];
  onLearnMore: (metricName: string) => void;
  onSaveMetric: (metricName: string) => void;
}

export const MetricsTabs = ({
  metricCategories,
  onLearnMore,
  onSaveMetric,
}: MetricsTabsProps) => {
  return (
    <Tabs defaultValue="general" className="space-y-4">
      <TabsList className="grid grid-cols-4 w-full">
        <TabsTrigger value="general">General Information</TabsTrigger>
        <TabsTrigger value="environmental">Environmental</TabsTrigger>
        <TabsTrigger value="social">Social</TabsTrigger>
        <TabsTrigger value="governance">Governance</TabsTrigger>
      </TabsList>

      {metricCategories.map((category) => (
        <MetricsCategoryTab 
          key={category.id}
          category={category}
          onLearnMore={onLearnMore}
          onSaveMetric={onSaveMetric}
        />
      ))}
    </Tabs>
  );
};
