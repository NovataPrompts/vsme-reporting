
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProgressOverview } from "@/components/dashboard/ProgressOverview";
import { DataSharingCard } from "@/components/dashboard/DataSharingCard";
import { CalculatedMetrics } from "@/components/dashboard/CalculatedMetrics";
import { RecentReports } from "@/components/dashboard/RecentReports";

const Dashboard = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24">
        {/* Dashboard Overview */}
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-white">VSME Report Dashboard</h2>
              <p className="mt-2 text-gray-300 dark:text-gray-400 max-w-2xl mx-auto">
                Manage your sustainability metrics, share data with stakeholders, and track your reporting progress all in one place.
              </p>
            </div>
            
            <div className="space-y-6">
              {/* Data Sharing Hub - Full Width */}
              <DataSharingCard />
              
              {/* Calculated Metrics with Emissions Charts - Full Width */}
              <CalculatedMetrics />
              
              {/* Progress Overview */}
              <ProgressOverview />
              
              {/* Recent Reports */}
              <RecentReports />
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
