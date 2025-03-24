
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useToast } from "@/hooks/use-toast";
import { AboutVSME } from "@/components/standards/AboutVSME";
import { StandardsOutline } from "@/components/standards/StandardsOutline";
import { StandardsResources } from "@/components/standards/StandardsResources";
import { HowWeCanHelp } from "@/components/standards/HowWeCanHelp";
import { StandardsHeader } from "@/components/standards/StandardsHeader";

const Standards = () => {
  const { toast } = useToast();

  const handleDownload = () => {
    window.open("https://www.efrag.org/sites/default/files/sites/webpublishing/SiteAssets/VSME%20Standard.pdf", "_blank");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4 md:px-6">
          <StandardsHeader onDownload={handleDownload} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <AboutVSME />
              <StandardsOutline />
            </div>
            
            <div>
              <StandardsResources />
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
