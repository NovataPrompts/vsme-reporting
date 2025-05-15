import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { metrics } from "@/components/dashboard/data/metricsData";
import { MetricHeader } from "@/components/metrics/MetricHeader";
import { MetricDetails } from "@/components/metrics/MetricDetails";
import { MetricCalculator } from "@/components/metrics/MetricCalculator";
import { MetricNotFound } from "@/components/metrics/MetricNotFound";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { hasCalculator, getCalculatorConfigByMetricId } from "@/components/metrics/calculators/calculatorConfigs";
import { saveCalculatedMetric, getCalculatedMetric } from "@/utils/metricStorage";

const MetricDetail = () => {
  const { id } = useParams();
  const metric = metrics.find(m => m.id === Number(id));
  
  const [calculatedValue, setCalculatedValue] = useState<string | null>(null);
  const [calculationTimestamp, setCalculationTimestamp] = useState<string | null>(null);
  const [addedToMetrics, setAddedToMetrics] = useState<boolean>(false);
  
  // Load saved metric data on component mount
  useEffect(() => {
    if (metric) {
      const savedMetric = getCalculatedMetric(metric.id);
      if (savedMetric) {
        setCalculatedValue(savedMetric.value);
        setCalculationTimestamp(savedMetric.timestamp);
        setAddedToMetrics(savedMetric.addedToMetrics);
      }
    }
  }, [metric]);
  
  const handleCalculation = (value: string, timestamp: string | null) => {
    setCalculatedValue(value);
    setCalculationTimestamp(timestamp);
    setAddedToMetrics(false); // Reset when recalculating
    
    // Save to local storage
    if (metric && timestamp) {
      saveCalculatedMetric(metric.id, value, timestamp, false);
    }
  };
  
  const handleAddToMetrics = () => {
    setAddedToMetrics(true);
    
    // Update storage with addedToMetrics flag
    if (metric && calculationTimestamp) {
      saveCalculatedMetric(metric.id, calculatedValue || "", calculationTimestamp, true);
    }
  };
  
  if (!metric) {
    return <MetricNotFound />;
  }

  const hasMetricCalculator = hasCalculator(metric.id);
  const calculatorConfig = hasMetricCalculator ? getCalculatorConfigByMetricId(metric.id) : null;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4 md:px-6">
          <Card className="shadow-sm border-[#008099]/30">
            <MetricHeader 
              icon={metric.icon}
              title={metric.title}
              reference={metric.reference}
              titleColor={metric.titleColor}
            />
            
            <CardContent>
              {/* Display calculation result in a prominent box if available */}
              {hasMetricCalculator && calculatedValue && calculatedValue !== "Invalid input" && calculatedValue !== "Error in calculation" && (
                <Alert className="mb-6 bg-[#539db5]/10 border-[#d8f225]">
                  <AlertTitle className="text-4xl font-bold text-[#d8f225]">
                    {calculatedValue}
                  </AlertTitle>
                  {calculationTimestamp && (
                    <AlertDescription className="text-sm text-white">
                      Last calculated: {calculationTimestamp}
                      {addedToMetrics && <span> • Added to {calculatorConfig?.vsmeReference || metric.reference} report</span>}
                    </AlertDescription>
                  )}
                </Alert>
              )}
              
              {/* Metric Calculator */}
              {hasMetricCalculator && calculatorConfig && (
                <MetricCalculator 
                  config={calculatorConfig}
                  onCalculate={handleCalculation}
                  onAddToMetrics={handleAddToMetrics}
                  addedToMetrics={addedToMetrics} 
                />
              )}
              
              <MetricDetails 
                description={metric.description}
                calculationMethod={metric.calculationMethod}
                title={metric.title}
                value={metric.value}
                calculatedValue={calculatedValue}
                calculationTimestamp={calculationTimestamp}
                isCalculatorMetric={hasMetricCalculator}
                addedToMetrics={addedToMetrics}
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default MetricDetail;
