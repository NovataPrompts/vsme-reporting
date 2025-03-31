
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { metrics } from "@/components/dashboard/CalculatedMetrics";

const MetricDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const metric = metrics.find(m => m.id === Number(id));
  
  if (!metric) {
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
  }
  
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

          <Card className="shadow-sm border-[#008099]/30">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="h-16 w-16 flex items-center justify-center rounded-full bg-[#e3ecec] border border-[#008099]/30">
                <metric.icon className="h-8 w-8 text-[#008099]" />
              </div>
              <div>
                <CardTitle 
                  className="text-3xl font-bold" 
                  style={{ color: metric.titleColor || '#008099' }}
                >
                  {metric.title}
                </CardTitle>
                <p className="text-sm text-gray-500 mt-1">{metric.reference}</p>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="mt-2 mb-6">
                <p className="text-3xl font-bold text-[#00344d]">{metric.value}</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Description</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    {metric.description || "This metric tracks " + metric.title.toLowerCase() + " across the organization."}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-2">Calculation Method</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    {metric.calculationMethod || "Standard calculation methodology for " + metric.title + " according to VSME guidelines."}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-2">Reporting Period</h3>
                  <p className="text-gray-700 dark:text-gray-300">Annual (January - December 2023)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MetricDetail;
