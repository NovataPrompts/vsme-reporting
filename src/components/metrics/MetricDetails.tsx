
import { Calculator } from "lucide-react";

interface MetricDetailsProps {
  description?: string;
  calculationMethod?: string;
  title: string;
  value: string;
  calculatedValue: string | null;
  calculationTimestamp: string | null;
  isCalculatorMetric: boolean;
  addedToMetrics?: boolean;
}

export const MetricDetails = ({ 
  description, 
  calculationMethod, 
  title, 
  value, 
  calculatedValue, 
  calculationTimestamp,
  isCalculatorMetric,
  addedToMetrics = false
}: MetricDetailsProps) => {
  const cleanTitle = title.includes('(') 
    ? title.substring(0, title.indexOf('(')).trim() 
    : title;
    
  return (
    <>
      {/* Only show the default value if it's NOT a calculator metric or if a value has been calculated */}
      {!isCalculatorMetric && (
        <div className="mt-2 mb-2">
          <p className="text-3xl font-bold text-[#077bc0]">
            {value}
          </p>
        </div>
      )}
      
      {isCalculatorMetric && calculatedValue && (
        <div className="mt-2 mb-2">
          <p className="text-3xl font-bold text-[#077bc0]">
            {calculatedValue}
          </p>
        </div>
      )}
      
      {addedToMetrics && calculationTimestamp && (
        <div className="text-white/70 text-sm mb-4">
          Added to VSME.B8.40 report • {calculationTimestamp}
        </div>
      )}
      
      <div className="space-y-4 mt-6">
        <div>
          <h3 className="font-semibold text-lg mb-2">Description</h3>
          <p className="text-gray-700 dark:text-gray-300">
            {description || "This metric tracks " + cleanTitle.toLowerCase() + " across the organization."}
          </p>
        </div>
        
        <div>
          <h3 className="font-semibold text-lg mb-2">Calculation Method</h3>
          <p className="text-gray-700 dark:text-gray-300">
            {calculationMethod || "Standard calculation methodology for " + cleanTitle + " according to VSME guidelines."}
          </p>
        </div>
        
        <div>
          <h3 className="font-semibold text-lg mb-2">Reporting Period</h3>
          <p className="text-gray-700 dark:text-gray-300">Annual (January - December 2023)</p>
        </div>
      </div>
    </>
  );
};
