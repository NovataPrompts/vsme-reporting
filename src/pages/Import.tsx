
import { Button } from "@/components/ui/button";
import { ChevronRight, RefreshCw, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";

const Import = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSynced, setIsSynced] = useState(false);
  
  useEffect(() => {
    // Check if data was previously synced
    const lastUpdated = localStorage.getItem('metricsLastUpdated');
    if (lastUpdated) {
      setIsSynced(true);
    }
  }, []);
  
  const handleLearnMore = (topic: string) => {
    toast({
      title: "Learn More",
      description: `Additional information about ${topic} will be available soon.`,
      duration: 3000
    });
  };
  
  const goToMetrics = () => {
    navigate("/metrics#metrics-content");
  };

  const handleSyncData = async () => {
    setIsLoading(true);
    
    // Simulate API call
    try {
      // In a real implementation, this would be an actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update local storage to indicate metrics were updated
      localStorage.setItem('metricsLastUpdated', new Date().toISOString());
      setIsSynced(true);
      
      toast({
        title: "Data Synced Successfully",
        description: "Your sustainability metrics data has been updated from the API.",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Sync Failed",
        description: "There was an error syncing your data. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 pt-12 pb-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold mb-2">Import Data</h1>
              <p className="text-base text-gray-600 dark:text-gray-300">
                Sync your sustainability metrics data from the API
              </p>
            </div>
          </div>
          
          <div className="w-full mb-8">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Sync Sustainability Data</CardTitle>
                <CardDescription>
                  Connect to the API to automatically sync your latest sustainability metrics data.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12">
                  <div className={`h-16 w-16 rounded-full flex items-center justify-center mb-6 ${
                    isSynced ? 'bg-[#41e571]' : 'bg-transparent'
                  }`}>
                    {isSynced ? (
                      <Check className="h-8 w-8 text-white" />
                    ) : (
                      <RefreshCw className="h-16 w-16 text-[#057cc1]" />
                    )}
                  </div>
                  <h3 className="text-xl font-semibold mb-4">
                    {isSynced ? "Data Synced Successfully" : "Ready to Sync Data"}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-center mb-8 max-w-md">
                    {isSynced 
                      ? "Your sustainability metrics data has been successfully synced from the API."
                      : "Click the button below to fetch the latest sustainability metrics data from your connected data source."
                    }
                  </p>
                  {!isSynced && (
                    <Button 
                      onClick={handleSyncData}
                      disabled={isLoading}
                      className="bg-[#057cc1] hover:bg-[#057cc1]/90 text-white flex items-center gap-2 px-8 py-3"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          Syncing Data...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-4 w-4" />
                          Sync Data
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Go to Step 2 button at bottom right */}
          <div className="mt-12 flex justify-end">
            <Button onClick={goToMetrics} className="bg-[#057cc0] hover:bg-[#057cc0]/90 text-white flex items-center gap-2">
              Go to Step 2 <ChevronRight className="h-4 w-4" /> View Metrics
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Import;
