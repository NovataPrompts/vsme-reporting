
import { Calculator } from "lucide-react";

interface MetricDetailsProps {
  description?: string;
  calculationMethod?: string;
  title: string;
  value: string;
  calculatedValue: string | null;
  calculationTimestamp: string | null;
  isCalculatorMetric: boolean;
}

export const MetricDetails = ({ 
  description, 
  calculationMethod, 
  title, 
  value, 
  calculatedValue, 
  calculationTimestamp,
  isCalculatorMetric
}: MetricDetailsProps) => {
  const cleanTitle = title.includes('(') 
    ? title.substring(0, title.indexOf('(')).trim() 
    : title;
    
  return (
    <>
      <div className="mt-2 mb-2">
        <p className="text-3xl font-bold text-[#d8f225]">
          {isCalculatorMetric && calculatedValue ? calculatedValue : value}
        </p>
        {isCalculatorMetric && calculationTimestamp && (
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
            <Calculator className="h-4 w-4" />
            <span>Last calculated: {calculationTimestamp}</span>
          </div>
        )}
      </div>
      
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
