
import { Header } from "@/components/layout/Header";
import { MetricsUpload } from "@/components/metrics/MetricsUpload";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Import = () => {
  const { toast } = useToast();

  const handleLearnMore = (topic: string) => {
    toast({
      title: "Learn More",
      description: `Additional information about ${topic} will be available soon.`,
      duration: 3000,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Import Data</h1>
              <p className="text-gray-600 dark:text-gray-300">
                Import your sustainability metrics data from Novata or upload your own files
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <MetricsUpload />
            </div>
            
            <div>
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Need Help?</CardTitle>
                  <CardDescription>
                    Learn more about data import options and formats
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button 
                      variant="outline" 
                      className="w-full justify-between"
                      onClick={() => handleLearnMore("Novata Integration")}
                    >
                      <span>Novata Integration Guide</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-between"
                      onClick={() => handleLearnMore("File Formats")}
                    >
                      <span>Supported File Formats</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-between"
                      onClick={() => handleLearnMore("Data Mapping")}
                    >
                      <span>Data Mapping Guide</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Import;
