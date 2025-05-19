
import { useState } from "react";
import { Calculator, Check } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CalculatorConfig } from "@/types/metrics";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MetricCalculatorProps {
  config: CalculatorConfig;
  onCalculate: (value: string, timestamp: string | null) => void;
  onAddToMetrics?: () => void;
  addedToMetrics?: boolean;
}

export const MetricCalculator = ({ 
  config, 
  onCalculate, 
  onAddToMetrics,
  addedToMetrics = false
}: MetricCalculatorProps) => {
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [calculatedValue, setCalculatedValue] = useState<string | null>(null);
  const [localAddedToMetrics, setLocalAddedToMetrics] = useState<boolean>(false);
  const { toast } = useToast();
  
  const handleInputChange = (id: string, value: string) => {
    setInputValues(prev => ({ ...prev, [id]: value }));
  };
  
  const calculateMetric = () => {
    try {
      // Check if all required inputs are provided
      const allInputsProvided = config.inputs.every(input => 
        inputValues[input.id] !== undefined && inputValues[input.id] !== ""
      );
      
      if (!allInputsProvided) {
        onCalculate("Invalid input", null);
        setCalculatedValue("Invalid input");
        return;
      }
      
      const result = config.calculateFunction(inputValues);
      
      // Set the current date and time
      const now = new Date();
      const formattedDate = now.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
      const formattedTime = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit'
      });
      
      setCalculatedValue(result);
      onCalculate(result, `${formattedDate} at ${formattedTime}`);
    } catch (error) {
      console.error("Calculation error:", error);
      onCalculate("Error in calculation", null);
      setCalculatedValue("Error in calculation");
    }
  };
  
  const handleAddToMetrics = () => {
    setLocalAddedToMetrics(true);
    
    // Call the parent component's handler if provided
    if (onAddToMetrics) {
      onAddToMetrics();
    }
    
    toast({
      title: "Added to Metrics",
      description: `${config.title} (${calculatedValue}) has been added to ${config.vsmeReference}`,
    });
  };
  
  // Use the external addedToMetrics prop if provided, otherwise use the local state
  const isAddedToMetrics = addedToMetrics !== undefined ? addedToMetrics : localAddedToMetrics;
  
  return (
    <div className="mt-8 p-6 bg-white border border-[#008099] rounded-lg text-[#00344d]">
      <div className="flex items-center gap-3 mb-4">
        <Calculator className="h-6 w-6 text-[#008099]" />
        <h3 className="font-semibold text-xl">{config.title}</h3>
      </div>
      
      <div className="space-y-4 mb-6">
        <div className="text-base text-[#00344d] mb-4">
          <p>According to VSME guidance:</p>
          <p className="mt-2">{config.guidance}</p>
        </div>
        
        <div className="space-y-4">
          {config.inputs.map((input) => (
            <div key={input.id} className="grid w-full gap-1.5">
              <Label htmlFor={input.id} className="text-[#008099] font-medium">{input.label}</Label>
              {input.type === "select" ? (
                <Select 
                  value={inputValues[input.id] || ""}
                  onValueChange={(value) => handleInputChange(input.id, value)}
                >
                  <SelectTrigger 
                    id={input.id}
                    className="bg-[#e3ecec] border-[#008099] text-[#00344d] placeholder:text-[#00344d]/60"
                  >
                    <SelectValue placeholder={input.placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {input.options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id={input.id}
                  type={input.type}
                  value={inputValues[input.id] || ""}
                  onChange={(e) => handleInputChange(input.id, e.target.value)}
                  placeholder={input.placeholder}
                  className="bg-[#e3ecec] border-[#008099] text-[#00344d] placeholder:text-[#00344d]/60"
                />
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex flex-wrap items-center gap-4">
        <Button 
          onClick={calculateMetric}
          className="bg-[#00344d] hover:bg-[#002a3e] text-white font-medium"
        >
          Calculate
        </Button>
        
        {calculatedValue && calculatedValue !== "Invalid input" && calculatedValue !== "Error in calculation" && (
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-[#008099]">{calculatedValue}</span>
            
            {!isAddedToMetrics ? (
              <Button 
                onClick={handleAddToMetrics}
                className="ml-4 bg-[#077bc0] hover:bg-[#056aa6] text-white font-medium"
              >
                Add to Metrics
              </Button>
            ) : (
              <div className="flex items-center gap-1 ml-4">
                <Check className="h-5 w-5 text-green-600" />
                <span className="text-green-600 font-medium">Added to metrics</span>
              </div>
            )}
          </div>
        )}
      </div>
      
      {calculatedValue && calculatedValue !== "Invalid input" && calculatedValue !== "Error in calculation" && !isAddedToMetrics && (
        <div className="mt-2 text-gray-500 text-sm">
          This value will be added as a response to {config.vsmeReference}
        </div>
      )}
      
      <div className="mt-4 p-3 bg-[#077bc0] border border-[#008099]/60 rounded text-md text-white font-medium">
        <p className="text-center">Formula: <span className="font-bold">{config.formulaDescription}</span></p>
      </div>
    </div>
  );
};
