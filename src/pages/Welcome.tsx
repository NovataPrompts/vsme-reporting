import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, BarChart3, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
const Welcome = () => {
  const navigate = useNavigate();
  return <div className="min-h-screen flex flex-col">
      <main className="flex-1 pt-12 pb-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">Welcome to VSME Sustainability Reporting</h1>
            <p className="text-base text-gray-600 dark:text-gray-300 max-w-2xl">Complete these three steps to create your VSME report.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Step 1: Upload Data */}
            <Card className="border-2 border-[#077bc0]/20 hover:border-[#077bc0]/80 transition-all duration-300 group">
              <div className="p-6 flex flex-col items-center text-center h-full">
                <div className="bg-[#077bc0]/20 p-4 rounded-full mb-4 group-hover:bg-[#077bc0]/30 transition-all duration-300">
                  <Upload className="h-8 w-8 text-[#077bc0]" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Step 1</h2>
                <h3 className="text-xl font-semibold mb-4">Upload Data</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 flex-1">Import your sustainability data from Novata.</p>
                <Button onClick={() => navigate("/import")} className="w-full bg-[#077bc0] hover:bg-[#077bc0]/90 text-white">
                  Start Data Import
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
            
            {/* Step 3: Generate Report */}
            <Card className="border-2 border-[#077bc0]/20 hover:border-[#077bc0]/80 transition-all duration-300 group">
              <div className="p-6 flex flex-col items-center text-center h-full">
                <div className="bg-[#077bc0]/20 p-4 rounded-full mb-4 group-hover:bg-[#077bc0]/30 transition-all duration-300">
                  <FileText className="h-8 w-8 text-[#077bc0]" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Step 3</h2>
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
    </div>;
};
export default Welcome;