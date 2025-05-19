
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface MetricHeaderProps {
  icon: LucideIcon;  // Updated to LucideIcon type
  title: string;
  reference: string;
  titleColor?: string;
}

export const MetricHeader = ({ icon: Icon, title, reference, titleColor = '#008099' }: MetricHeaderProps) => {
  const navigate = useNavigate();
  
  // Clean title if it contains parentheses
  const cleanTitle = title.includes('(') 
    ? title.substring(0, title.indexOf('(')).trim() 
    : title;
    
  return (
    <>
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          className="mr-2 hover:bg-opacity-10 hover:bg-gray-400" 
          onClick={() => navigate("/metrics/calculated")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Metrics
        </Button>
      </div>

      <CardHeader className="flex flex-row items-center gap-4">
        <div className="h-16 w-16 flex items-center justify-center rounded-full bg-[#e3ecec] border border-[#008099]/30 text-[#00344d]">
          <Icon />
        </div>
        <div>
          <CardTitle 
            className="text-3xl font-bold" 
            style={{ color: titleColor }}
          >
            {cleanTitle}
          </CardTitle>
          <Badge 
            variant="outline" 
            className="mt-2 text-lg px-3 py-1 bg-[#e3ecec] border-[#008099]/30 text-[#008099]"
          >
            {reference}
          </Badge>
        </div>
      </CardHeader>
    </>
  );
};

