
import { MetricsUpload } from "@/components/metrics/MetricsUpload";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const Import = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleLearnMore = (topic: string) => {
    toast({
      title: "Learn More",
      description: `Additional information about ${topic} will be available soon.`,
      duration: 3000
    });
  };
  
  return <div className="min-h-screen flex flex-col">
      <main className="flex-1 pt-12 pb-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold mb-2">Import Data</h1>
              <p className="text-base text-gray-600 dark:text-gray-300">
                Import your sustainability metrics data from Novata or upload your own files
              </p>
            </div>
          </div>
          
          <div className="w-full mb-8">
            <MetricsUpload />
          </div>
          
          {/* Go to Step 2 button at bottom right */}
          <div className="mt-12 flex justify-end">
            <Button onClick={() => navigate("/metrics")} className="bg-[#057cc0] hover:bg-[#057cc0]/90 text-white flex items-center gap-2">
              Go to Step 2 <ChevronRight className="h-4 w-4" /> View Metrics
            </Button>
          </div>
        </div>
      </main>
    </div>;
};

export default Import;
