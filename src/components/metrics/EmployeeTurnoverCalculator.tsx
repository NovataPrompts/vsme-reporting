
import { useState } from "react";
import { Calculator } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface EmployeeTurnoverCalculatorProps {
  onCalculate: (value: string, timestamp: string | null) => void;
}

export const EmployeeTurnoverCalculator = ({ onCalculate }: EmployeeTurnoverCalculatorProps) => {
  const [employeesLeft, setEmployeesLeft] = useState<string>("");
  const [averageEmployees, setAverageEmployees] = useState<string>("");
  
  const calculateTurnoverRate = () => {
    const left = parseFloat(employeesLeft);
    const average = parseFloat(averageEmployees);
    
    if (isNaN(left) || isNaN(average) || average === 0) {
      onCalculate("Invalid input", null);
      return;
    }
    
    const turnoverRate = (left / average) * 100;
    
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
    
    onCalculate(turnoverRate.toFixed(1) + "%", `${formattedDate} at ${formattedTime}`);
  };
  
  return (
    <div className="mt-8 p-6 bg-white border border-[#008099] rounded-lg text-[#00344d]">
      <div className="flex items-center gap-3 mb-4">
        <Calculator className="h-6 w-6 text-[#008099]" />
        <h3 className="font-semibold text-xl">Employee Turnover Calculator</h3>
      </div>
      
      <div className="space-y-4 mb-6">
        <div className="text-sm text-[#00344d] mb-4">
          <p>According to VSME guidance:</p>
          <p className="mt-2">Employee turnover refers to employees who leave the undertaking voluntarily or due to dismissal, retirement, or death in service.</p>
          <p className="mt-2">An employee is defined as an individual who is in an employment relationship with the undertaking according to national law or practice.</p>
        </div>
        
        <div className="space-y-4">
          <div className="grid w-full gap-1.5">
            <Label htmlFor="employeesLeft" className="text-[#00344d] font-medium">Number of employees who left during the reporting year</Label>
            <Input
              id="employeesLeft"
              type="number"
              value={employeesLeft}
              onChange={(e) => setEmployeesLeft(e.target.value)}
              placeholder="Enter number"
              className="bg-[#e3ecec] border-[#008099] text-[#00344d] placeholder:text-[#00344d]/60"
            />
          </div>
          
          <div className="grid w-full gap-1.5">
            <Label htmlFor="averageEmployees" className="text-[#00344d] font-medium">Average number of employees during the reporting year</Label>
            <Input
              id="averageEmployees"
              type="number"
              value={averageEmployees}
              onChange={(e) => setAverageEmployees(e.target.value)}
              placeholder="Enter number"
              className="bg-[#e3ecec] border-[#008099] text-[#00344d] placeholder:text-[#00344d]/60"
            />
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <Button 
          onClick={calculateTurnoverRate}
          className="bg-[#00344d] hover:bg-[#002a3e] text-white font-medium"
        >
          Calculate
        </Button>
      </div>
      
      <div className="mt-4 p-3 bg-[#e3ecec] border border-[#008099]/60 rounded text-md text-[#00344d] font-medium">
        <p className="text-center">Formula: <span className="font-bold">(Number of employees who left / Average number of employees) × 100</span></p>
      </div>
    </div>
  );
};
