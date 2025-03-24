
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CalculatedMetrics as CalculatedMetricsComponent } from "@/components/dashboard/CalculatedMetrics";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CalculatedMetrics = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              className="mr-2" 
              onClick={() => navigate("/metrics")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Metrics
            </Button>
          </div>

          <h1 className="text-3xl font-bold mb-6">Calculated Metrics</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            These metrics are automatically calculated based on your reported data.
          </p>
          
          <CalculatedMetricsComponent />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CalculatedMetrics;
