
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmissionsBarChart } from "./charts/EmissionsBarChart";
import { EmissionsPieChart } from "./charts/EmissionsPieChart";
import { emissionsData, COLORS } from "./data/metricsData";

export const EmissionsCharts = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
      <div className="chart-container">
        <h3 className="text-lg font-medium mb-2 text-[#008099] dark:text-white">GHG Emissions by Scope</h3>
        <EmissionsBarChart emissionsData={emissionsData} colors={COLORS} />
      </div>

      <div className="chart-container">
        <h3 className="text-lg font-medium mb-2 text-[#008099] dark:text-white">Emissions Distribution</h3>
        <EmissionsPieChart scopeData={emissionsData} colors={COLORS} />
      </div>
    </div>
  );
};
