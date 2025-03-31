
import { MetricCalculator } from "./MetricCalculator";
import { employeeTurnoverCalculator } from "./calculators/calculatorConfigs";

interface EmployeeTurnoverCalculatorProps {
  onCalculate: (value: string, timestamp: string | null) => void;
}

export const EmployeeTurnoverCalculator = ({ onCalculate }: EmployeeTurnoverCalculatorProps) => {
  return (
    <MetricCalculator 
      config={employeeTurnoverCalculator}
      onCalculate={onCalculate}
    />
  );
};
