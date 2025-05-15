
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useToast } from "@/hooks/use-toast";
import { AboutVSME } from "@/components/standards/AboutVSME";
import { StandardsOutline } from "@/components/standards/StandardsOutline";
import { StandardsResources } from "@/components/standards/StandardsResources";
import { HowWeCanHelp } from "@/components/standards/HowWeCanHelp";
import { StandardsHeader } from "@/components/standards/StandardsHeader";
import { StandardsHelp } from "@/components/standards/StandardsHelp";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

const Standards = () => {
  const { toast } = useToast();
  const [iframeLoaded, setIframeLoaded] = useState(false);

  const handleDownload = () => {
    window.open("https://www.efrag.org/sites/default/files/sites/webpublishing/SiteAssets/VSME%20Standard.pdf", "_blank");
  };

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
          <StandardsHeader onDownload={handleDownload} />
          
          {/* Novata-style interface with iframe */}
          <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            <div className="flex">
              {/* Left sidebar - mimicking the Novata UI */}
              <div className="w-64 bg-gray-50 p-4 border-r border-gray-200 hidden md:block">
                <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded-md mb-4">
                  <div className="w-8 h-8 bg-blue-700 text-white rounded flex items-center justify-center text-xs">
                    CSRD
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">CSRD</div>
                    <div className="text-xs text-gray-600">2024</div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <div className="bg-blue-50 text-blue-800 p-2 rounded-md mb-2 flex items-center">
                    <span className="material-icons text-sm mr-2">&#9632;</span>
                    Overview
                  </div>
                  
                  <div className="mt-4">
                    <div className="text-sm font-medium text-gray-500 mb-2">Segments</div>
                    <div className="space-y-2">
                      <div className="text-gray-700 p-2 hover:bg-gray-100 rounded-md flex items-center">
                        <span className="material-icons text-sm mr-2">&#9679;</span>
                        Double Materiality
                      </div>
                      <div className="text-gray-700 p-2 hover:bg-gray-100 rounded-md flex items-center">
                        <span className="material-icons text-sm mr-2">&#9679;</span>
                        Data Points
                      </div>
                      <div className="text-gray-700 p-2 hover:bg-gray-100 rounded-md flex items-center">
                        <span className="material-icons text-sm mr-2">&#9679;</span>
                        EU Taxonomy
                      </div>
                      <div className="text-gray-700 p-2 hover:bg-gray-100 rounded-md flex items-center">
                        <span className="material-icons text-sm mr-2">&#9679;</span>
                        Disclosure Prep
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Main content area */}
              <div className="flex-1 p-6">
                <div className="mb-6">
                  <div className="text-sm text-gray-500 mb-2">
                    <span className="hover:underline cursor-pointer">CSRD</span> / <span className="hover:underline cursor-pointer">Overview</span>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-800">Overview</h1>
                </div>
                
                {/* Planning Section - This is where the iframe starts */}
                <div className="mt-8">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Planning</h2>
                  <p className="text-gray-600 mb-6">
                    This timeline is an estimation based on the average time to complete each CSRD segment
                  </p>
                  
                  {/* Iframe showing the metrics page */}
                  <div className="border border-gray-200 rounded-lg overflow-hidden shadow-md bg-white">
                    <iframe 
                      src="/metrics" 
                      className={`w-full h-[600px] transition-opacity duration-300 ${iframeLoaded ? 'opacity-100' : 'opacity-0'}`}
                      title="Metrics Dashboard"
                      style={{ border: "none" }}
                      onLoad={() => setIframeLoaded(true)}
                    ></iframe>
                  </div>
                  
                  <div className="mt-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Assignments</h2>
                    <div className="flex border-b border-gray-200">
                      <div className="px-4 py-2 font-medium text-blue-600 border-b-2 border-blue-600">Tasks</div>
                      <div className="px-4 py-2 text-gray-600">Data Points</div>
                    </div>
                    <div className="py-12 text-center text-gray-500">
                      <p>Add tasks and assign responsibilities</p>
                      <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
                        Add task
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
            <div className="lg:col-span-2">
              <AboutVSME />
              <StandardsOutline />
            </div>
            
            <div>
              <StandardsResources />
              <StandardsHelp onLearnMore={handleLearnMore} />
              <HowWeCanHelp />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Standards;
