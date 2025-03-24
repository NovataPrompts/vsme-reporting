
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProgressOverview } from "@/components/dashboard/ProgressOverview";
import { DataSharingCard } from "@/components/dashboard/DataSharingCard";
import { CalculatedMetrics } from "@/components/dashboard/CalculatedMetrics";

const Dashboard = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24">
        {/* Dashboard Overview */}
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-[#00f5f3]">Your VSME Report Dashboard</h2>
            
            <div className="space-y-6">
              {/* Data Sharing Hub - Full Width */}
              <DataSharingCard />
              
              {/* Calculated Metrics with Emissions Charts - Full Width */}
              <CalculatedMetrics />
              
              {/* Progress Overview */}
              <ProgressOverview />
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
