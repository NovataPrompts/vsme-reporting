
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { metrics } from "./data/metricsData";
import { EmissionsCharts } from "./EmissionsCharts";
import { MetricCard } from "./MetricCard";

export const CalculatedMetrics = () => {
  const navigate = useNavigate();
  
  return (
    <Card className="shadow-sm glass-card relative overflow-hidden">
      <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-accent/10 dark:bg-accent/5 rounded-full blur-2xl"></div>
      <div className="absolute -left-16 -top-16 w-48 h-48 bg-secondary/10 dark:bg-secondary/5 rounded-full blur-2xl"></div>
      
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center justify-between text-[#008099] dark:text-white">
          <span>Calculated Metrics</span>
          <span 
            className="text-sm text-accent font-normal flex items-center gap-1 cursor-pointer hover:underline"
            onClick={() => navigate("/metrics/calculated")}
          >
            View All
            <ArrowUpRight className="h-3 w-3" />
          </span>
        </CardTitle>
        <CardDescription className="text-base">
          Key sustainability metrics and emissions data for your organization.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <EmissionsCharts />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {metrics.map((metric) => (
            <MetricCard key={metric.id} metric={metric} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
