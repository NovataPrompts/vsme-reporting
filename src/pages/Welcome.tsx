
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, BarChart3, RefreshCw, SquarePen } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 pt-12 pb-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-2">Welcome to VSME Sustainability Reporting</h1>
                <p className="text-base text-gray-600 dark:text-gray-300 max-w-2xl">Complete these four steps to create your VSME report.</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {/* Step 1: Sync Data */}
            <Card className="border-2 border-[#077bc0]/20 hover:border-[#077bc0]/80 transition-all duration-300 group">
              <div className="p-6 flex flex-col items-center text-center h-full">
                <div className="bg-[#077bc0]/20 p-4 rounded-full mb-4 group-hover:bg-[#077bc0]/30 transition-all duration-300">
                  <RefreshCw className="h-8 w-8 text-[#077bc0]" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Step 1</h2>
                <h3 className="text-xl font-semibold mb-4">Sync Data</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 flex-1">Pull in your responses into the report generator.</p>
                <Button onClick={() => navigate("/import")} className="w-full bg-[#077bc0] hover:bg-[#077bc0]/90 text-white">
                  Sync Data
                </Button>
              </div>
            </Card>
            
            {/* Step 2: View Metrics */}
            <Card className="border-2 border-[#077bc0]/20 hover:border-[#077bc0]/80 transition-all duration-300 group">
              <div className="p-6 flex flex-col items-center text-center h-full">
                <div className="bg-[#077bc0]/20 p-4 rounded-full mb-4 group-hover:bg-[#077bc0]/30 transition-all duration-300">
                  <BarChart3 className="h-8 w-8 text-[#077bc0]" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Step 2</h2>
                <h3 className="text-xl font-semibold mb-4">View Metrics</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 flex-1">
                  View, manage and calculate your sustainability metrics based on the VSME standard requirements.
                </p>
                <Button onClick={() => navigate("/metrics")} className="w-full bg-[#077bc0] hover:bg-[#077bc0]/90 text-white">
                  Explore Metrics
                </Button>
              </div>
            </Card>

            {/* Step 3: Prepare Disclosure */}
            <Card className="border-2 border-[#077bc0]/20 hover:border-[#077bc0]/80 transition-all duration-300 group">
              <div className="p-6 flex flex-col items-center text-center h-full">
                <div className="bg-[#077bc0]/20 p-4 rounded-full mb-4 group-hover:bg-[#077bc0]/30 transition-all duration-300">
                  <SquarePen className="h-8 w-8 text-[#077bc0]" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Step 3</h2>
                <h3 className="text-xl font-semibold mb-4">Prepare Disclosure</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 flex-1">Use our AI integration to draft VSME disclosures, generate tables and graphics, and populate your data.</p>
                <Button onClick={() => navigate("/disclosure")} className="w-full bg-[#077bc0] hover:bg-[#077bc0]/90 text-white">
                  Prep Disclosure
                </Button>
              </div>
            </Card>
            
            {/* Step 4: Generate Report */}
            <Card className="border-2 border-[#077bc0]/20 hover:border-[#077bc0]/80 transition-all duration-300 group">
              <div className="p-6 flex flex-col items-center text-center h-full">
                <div className="bg-[#077bc0]/20 p-4 rounded-full mb-4 group-hover:bg-[#077bc0]/30 transition-all duration-300">
                  <FileText className="h-8 w-8 text-[#077bc0]" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Step 4</h2>
                <h3 className="text-xl font-semibold mb-4">Generate Report</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 flex-1">Create compliant, professional sustainability reports that are fully compliant with the VSME standard.</p>
                <Button onClick={() => navigate("/reports")} className="w-full bg-[#077bc0] hover:bg-[#077bc0]/90 text-white">
                  Create Report
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Welcome;
