
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const MetricNotFound = () => {
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
              onClick={() => navigate("/metrics/calculated")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Metrics
            </Button>
          </div>
          <h1 className="text-3xl font-bold mb-6">Metric Not Found</h1>
        </div>
      </main>
      <Footer />
    </div>
  );
};
