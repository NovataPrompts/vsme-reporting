
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Calculator, ChevronDown, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const VSMEMetricsDropdown = () => {
  const navigate = useNavigate();

  const handleReportGeneration = () => {
    navigate("/reports");
  };

  return (
    <div className="flex flex-col gap-3">
      <Button 
        onClick={handleReportGeneration} 
        className="bg-[#057cc1] hover:bg-[#057cc1]/90 text-white flex items-center gap-2"
      >
        Go to Step 3 <ChevronRight className="h-4 w-4" /> Generate Report
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2 rounded-full bg-slate-100 hover:bg-slate-200 text-[#057cc1] border-[#057cc1] focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:outline-none">
            <span>More Options</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/metrics/calculated")}
          >
            <Calculator className="h-4 w-4" />
            <span>Calculated Metrics</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
