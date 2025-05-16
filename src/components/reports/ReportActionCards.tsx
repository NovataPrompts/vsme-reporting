
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Database, Share } from "lucide-react";

type ReportActionCardProps = {
  onGenerateReportClick: () => void;
  onExportClick: () => void;
  onShareReportClick: () => void;
};

const ReportActionCards = ({ 
  onGenerateReportClick, 
  onExportClick, 
  onShareReportClick 
}: ReportActionCardProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-8">
      {/* Generate Report Box */}
      <Card className="border-2 border-[#077bc0]/20 hover:border-[#077bc0]/80 transition-all duration-300 group">
        <div className="p-6 flex flex-col items-center text-center h-full">
          <div className="bg-[#077bc0]/20 p-4 rounded-full mb-4 group-hover:bg-[#077bc0]/30 transition-all duration-300">
            <FileText className="h-8 w-8 text-[#077bc0]" />
          </div>
          <h3 className="text-xl font-semibold mb-4">Generate Report</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6 flex-1">
            Generate a full VSME compliant report for .docx, .pdf, or google sheets
          </p>
          <Button onClick={onGenerateReportClick} className="w-full bg-[#077bc0] hover:bg-[#077bc0]/90 text-white">
            Create Report
          </Button>
        </div>
      </Card>

      {/* Export Box */}
      <Card className="border-2 border-[#077bc0]/20 hover:border-[#077bc0]/80 transition-all duration-300 group">
        <div className="p-6 flex flex-col items-center text-center h-full">
          <div className="bg-[#077bc0]/20 p-4 rounded-full mb-4 group-hover:bg-[#077bc0]/30 transition-all duration-300">
            <Database className="h-8 w-8 text-[#077bc0]" />
          </div>
          <h3 className="text-xl font-semibold mb-4">Export Data</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6 flex-1">
            Simple, structured data file in .xlsx or .csv format
          </p>
          <Button onClick={onExportClick} className="w-full bg-[#077bc0] hover:bg-[#077bc0]/90 text-white">
            Export Data
          </Button>
        </div>
      </Card>

      {/* Share Report Box */}
      <Card className="border-2 border-[#077bc0]/20 hover:border-[#077bc0]/80 transition-all duration-300 group">
        <div className="p-6 flex flex-col items-center text-center h-full">
          <div className="bg-[#077bc0]/20 p-4 rounded-full mb-4 group-hover:bg-[#077bc0]/30 transition-all duration-300">
            <Share className="h-8 w-8 text-[#077bc0]" />
          </div>
          <h3 className="text-xl font-semibold mb-4">Share my VSME Report</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6 flex-1">
            Generate a link to privately invite partners, suppliers, or board members to view your report
          </p>
          <Button onClick={onShareReportClick} className="w-full bg-[#077bc0] hover:bg-[#077bc0]/90 text-white">
            Share Report
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ReportActionCards;
