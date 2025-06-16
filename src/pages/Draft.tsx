
import { Header } from "@/components/layout/Header";
import { DraftViewer } from "@/components/draft/DraftViewer";
import { ReportBreadcrumb } from "@/components/navigation/ReportBreadcrumb";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useVSMEMetrics } from "@/hooks/useVSMEMetrics";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Draft = () => {
  const { refreshMetrics } = useVSMEMetrics();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshMetrics();
      toast({
        title: "Data Refreshed",
        description: "All metrics data has been reloaded from the database.",
      });
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh metrics data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4 md:px-6">
          <ReportBreadcrumb />
          
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">Draft Report</h1>
              <p className="text-muted-foreground">
                Review your disclosure report in a printable format.
              </p>
            </div>
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? "Refreshing..." : "Refresh Data"}
            </Button>
          </div>

          <DraftViewer />
        </div>
      </main>
    </div>
  );
};

export default Draft;
