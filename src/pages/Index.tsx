
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ProgressOverview } from "@/components/dashboard/ProgressOverview";
import { RecentReports } from "@/components/dashboard/RecentReports";
import { MetricsHighlight } from "@/components/dashboard/MetricsHighlight";
import { DataSharingCard } from "@/components/dashboard/DataSharingCard";
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
          <div className="absolute inset-0 z-0 opacity-50">
            <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-accent/20 to-transparent"></div>
            <div className="absolute top-1/4 -left-10 w-72 h-72 bg-secondary/30 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-accent/30 rounded-full blur-3xl"></div>
          </div>
          
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="max-w-3xl mx-auto text-center py-12 md:py-20">
              <h1 className="text-3xl md:text-5xl font-bold mb-6 animate-fadeIn leading-tight">
                Modern VSME Sustainability Reporting for Forward-Thinking Companies
              </h1>
              <p className="text-lg md:text-xl mb-8 text-gray-600 dark:text-gray-300 animate-slideUp">
                Create beautiful, professional, and compliant sustainability reports following the European voluntary standard for non-listed SMEs.
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
                  className="rounded-full px-6 py-6 border-2 hover:bg-white/20 dark:hover:bg-white/10 hover:text-foreground"
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
              <div className="bg-white dark:bg-primary/80 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-white/10 transition-all-ease hover:shadow-md animate-fadeIn">
                <div className="h-12 w-12 rounded-full bg-secondary/20 flex items-center justify-center mb-4">
                  <LineChart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Effortless Data Collection</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Upload your data in various formats and automatically map it to VSME requirements.
                </p>
              </div>
              
              <div className="bg-white dark:bg-primary/80 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-white/10 transition-all-ease hover:shadow-md animate-fadeIn" style={{ animationDelay: "0.2s" }}>
                <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Beautiful Reports</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Generate professional, ready-to-publish reports that meet all VSME requirements.
                </p>
              </div>
              
              <div className="bg-white dark:bg-primary/80 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-white/10 transition-all-ease hover:shadow-md animate-fadeIn" style={{ animationDelay: "0.4s" }}>
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <Share2 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Seamless Sharing</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Easily share your sustainability data with stakeholders, suppliers, and partners.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Dashboard Overview */}
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Your Sustainability Dashboard</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <MetricsHighlight />
                <DataSharingCard />
              </div>
              <div className="space-y-6">
                <ProgressOverview />
                <RecentReports />
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
