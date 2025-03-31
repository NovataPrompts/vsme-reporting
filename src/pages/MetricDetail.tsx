
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { metrics } from "@/components/dashboard/data/metricsData";
import { MetricHeader } from "@/components/metrics/MetricHeader";
import { MetricDetails } from "@/components/metrics/MetricDetails";
import { EmployeeTurnoverCalculator } from "@/components/metrics/EmployeeTurnoverCalculator";
import { MetricNotFound } from "@/components/metrics/MetricNotFound";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const MetricDetail = () => {
  const { id } = useParams();
  const metric = metrics.find(m => m.id === Number(id));
  
  const [calculatedValue, setCalculatedValue] = useState<string | null>(null);
  const [calculationTimestamp, setCalculationTimestamp] = useState<string | null>(null);
  
  const handleCalculation = (value: string, timestamp: string | null) => {
    setCalculatedValue(value);
    setCalculationTimestamp(timestamp);
  };
  
  if (!metric) {
    return <MetricNotFound />;
  }

  const isEmployeeTurnoverMetric = metric.id === 3;
  
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
              {isEmployeeTurnoverMetric && calculatedValue && (
                <Alert className="mb-6 bg-[#539db5]/10 border-[#d8f225]">
                  <AlertTitle className="text-3xl font-bold text-[#d8f225]">
                    {calculatedValue}
                  </AlertTitle>
                  {calculationTimestamp && (
                    <AlertDescription className="text-sm text-white">
                      Last calculated: {calculationTimestamp}
                    </AlertDescription>
                  )}
                </Alert>
              )}
              
              {/* Employee Turnover Calculator */}
              {isEmployeeTurnoverMetric && (
                <EmployeeTurnoverCalculator onCalculate={handleCalculation} />
              )}
              
              <MetricDetails 
                description={metric.description}
                calculationMethod={metric.calculationMethod}
                title={metric.title}
                value={metric.value}
                calculatedValue={calculatedValue}
                calculationTimestamp={calculationTimestamp}
                isCalculatorMetric={isEmployeeTurnoverMetric}
              />
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MetricDetail;
