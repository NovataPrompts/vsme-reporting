
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
    <div className="mt-8 p-6 bg-[#539db5] border border-[#d8f225]/30 rounded-lg text-[#00344d]">
      <h3 className="font-semibold text-lg mb-4">Employee Turnover Calculator</h3>
      
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
              className="bg-white border-[#00344d]/30 text-[#00344d] placeholder:text-[#00344d]/60"
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
              className="bg-white border-[#00344d]/30 text-[#00344d] placeholder:text-[#00344d]/60"
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
      
      <div className="mt-4 text-sm text-[#00344d]/80">
        <p>Formula: (Number of employees who left / Average number of employees) × 100</p>
      </div>
    </div>
  );
};
