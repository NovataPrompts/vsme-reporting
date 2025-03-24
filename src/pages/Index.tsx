
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, LineChart, FileText, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24">
        {/* Hero Section */}
        <section className="relative overflow-hidden mb-12">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <img 
              src="/lovable-uploads/43c7e6d0-8a2f-432f-9320-55b38b1bb6b8.png" 
              alt="Northern Lights" 
              className="w-full h-full object-cover"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-primary/60 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>
          </div>
          
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="max-w-3xl mx-auto text-center py-16 md:py-32">
              <h1 className="text-3xl md:text-5xl font-bold mb-6 animate-fadeIn leading-tight text-white drop-shadow-lg">
                Smart VSME Sustainability Reporting for Forward-Thinking Companies
              </h1>
              <p className="text-lg md:text-xl mb-8 text-white/90 dark:text-white/90 animate-slideUp drop-shadow-md">
                Create beautiful, professional, and compliant sustainability reports following the voluntary standard for non-listed SMEs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slideUp">
                <Button 
                  onClick={() => navigate("/reports")}
                  className="bg-[#d8f225] hover:bg-[#d8f225]/90 text-[#00344d] rounded-full px-6 py-6 flex items-center gap-2"
                  size="lg"
                >
                  <span>Create New Report</span>
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <Button 
                  onClick={() => navigate("/standards")}
                  variant="outline" 
                  className="rounded-full px-6 py-6 border-2 bg-black/30 hover:bg-white/20 dark:hover:bg-white/10 hover:text-foreground text-white border-white/60"
                  size="lg"
                >
                  Explore VSME Standard
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-12 bg-white/50 dark:bg-primary/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="rounded-lg p-6 shadow-sm border border-gray-100 dark:border-white/10 transition-all-ease hover:shadow-md animate-fadeIn bg-[#008099] text-white">
                <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center mb-4">
                  <LineChart className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-medium mb-2">Effortless Data Collection</h3>
                <p className="text-white/90">
                  Upload your data in various formats and automatically map it to VSME requirements.
                </p>
              </div>
              
              <div className="rounded-lg p-6 shadow-sm border border-gray-100 dark:border-white/10 transition-all-ease hover:shadow-md animate-fadeIn bg-[#73c9ca] text-primary" style={{ animationDelay: "0.2s" }}>
                <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Beautiful Reports</h3>
                <p className="text-primary/90">
                  Generate professional, ready-to-publish reports that meet all VSME requirements.
                </p>
              </div>
              
              <div className="rounded-lg p-6 shadow-sm border border-gray-100 dark:border-white/10 transition-all-ease hover:shadow-md animate-fadeIn bg-[#539db5] text-white" style={{ animationDelay: "0.4s" }}>
                <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center mb-4">
                  <Share2 className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-medium mb-2">Seamless Sharing</h3>
                <p className="text-white/90">
                  Easily share your sustainability data with stakeholders, suppliers, and partners.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
