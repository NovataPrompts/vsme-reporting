
import { Calculator } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Metric } from "./data/metricsData";

interface MetricCardProps {
  metric: Metric;
}

export const MetricCard = ({ metric }: MetricCardProps) => {
  const navigate = useNavigate();
  
  // Extract the main title without the reference in parentheses
  const mainTitle = metric.title.includes('(') 
    ? metric.title.substring(0, metric.title.indexOf('(')).trim() 
    : metric.title;

  // Extract the main value without the reference in parentheses
  const mainValue = metric.value.includes('(') 
    ? metric.value.substring(0, metric.value.indexOf('(')).trim() 
    : metric.value;
  
  const handleMetricClick = () => {
    navigate(`/metric/${metric.id}`);
  };

  return (
    <div 
      key={metric.id} 
      className="group metric-card flex items-center p-5 bg-[#e3ecec] dark:bg-white/5 border border-[#008099]/30 dark:border-white/20 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:!bg-white hover:!text-[#00344d] h-28 relative cursor-pointer"
      onClick={handleMetricClick}
    >
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 flex items-center justify-center rounded-full bg-[#e3ecec] dark:bg-white/10 border border-[#008099]/30 dark:border-white/20 group-hover:bg-[#d8f225] group-hover:border-[#d8f225] transition-colors duration-300">
          {/* Render icon without passing any props, with consistent sizing */}
          <metric.icon className="h-8 w-8" />
        </div>
        <div>
          <p className="text-xl font-medium text-[#00344d] dark:text-white/80 group-hover:text-[#00344d]">{mainTitle}</p>
          <p className="text-2xl font-semibold text-[#008099] dark:text-white mt-1 group-hover:text-[#00344d]">{mainValue}</p>
        </div>
      </div>
      
      <div className="absolute bottom-3 right-3">
        <div 
          className="p-1.5 rounded-full bg-white/80 dark:bg-gray-800/80 hover:bg-[#d8f225] cursor-pointer transition-colors duration-300 flex items-center justify-center"
          onClick={(e) => {
            e.stopPropagation();
            navigate("/metrics/calculated");
          }}
          title="View metric details"
        >
          <Calculator className="h-3.5 w-3.5 text-[#008099] dark:text-white" />
        </div>
      </div>
    </div>
  );
};

