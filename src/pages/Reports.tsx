
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

// Imported components
import ReportActionCards from '@/components/reports/ReportActionCards';
import ReportsSearch from '@/components/reports/ReportsSearch';
import ReportsTable, { Report } from '@/components/reports/ReportsTable';
import GenerateReportDialog, { ReportFormValues } from '@/components/reports/dialogs/GenerateReportDialog';
import ShareReportDialog, { 
  ShareReportFormValues,
  AvailableReport 
} from '@/components/reports/dialogs/ShareReportDialog';

const Reports = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareType, setShareType] = useState<"html" | "iframe">("html");
  
  // Sample reports for the dropdown
  const availableReports: AvailableReport[] = [
    { id: "1", title: "Annual Sustainability Report 2023" },
    { id: "2", title: "Q2 Carbon Emissions Report" },
    { id: "3", title: "Supply Chain Assessment" }
  ];
  
  // Sample data for demonstration - this would come from your API or state management
  const sampleReports: Report[] = [
    { 
      id: "1", 
      title: "Annual Sustainability Report 2023", 
      description: "Comprehensive overview of our sustainability initiatives for 2023",
      dateCreated: "2023-12-15",
      status: "Published"
    },
    { 
      id: "2", 
      title: "Q2 Carbon Emissions Report", 
      description: "Detailed analysis of Q2 carbon emissions data",
      dateCreated: "2024-04-10",
      status: "Draft"
    },
    { 
      id: "3", 
      title: "Supply Chain Assessment", 
      description: "Environmental impact assessment of our supply chain",
      dateCreated: "2024-03-22",
      status: "Published"
    }
  ];
  
  const handleStatusChange = (reportId: string, newStatus: string) => {
    toast({
      title: "Status Updated",
      description: `Report status has been updated to ${newStatus}`,
      duration: 3000
    });
  };
  
  const handleEditClick = (reportId: string) => {
    toast({
      title: "Editing Report",
      description: "Opening report editor",
      duration: 3000
    });
  };
  
  const handleExportClick = () => {
    toast({
      title: "Export Started",
      description: "Your data is being exported to an Excel file.",
      duration: 3000
    });
  };
  
  const handleGenerateReportClick = () => {
    setDialogOpen(true);
  };
  
  const handleShareReportClick = () => {
    setShareDialogOpen(true);
  };
  
  const onSubmit = (data: ReportFormValues) => {
    toast({
      title: "Report Created",
      description: `${data.title} has been created successfully.`,
      duration: 3000
    });
    setDialogOpen(false);
  };
  
  const onShareSubmit = (data: ShareReportFormValues, type: "html" | "iframe") => {
    const selectedReport = availableReports.find(report => report.id === data.reportId);
    const linkType = type === "html" ? "HTML version" : "embedded iframe";
    
    toast({
      title: "Link Generated",
      description: `A ${linkType} link for "${selectedReport?.title}" has been created.`,
      duration: 3000
    });
    setShareDialogOpen(false);
  };
  
  const handleActionClick = (action: string, reportId: string) => {
    const report = sampleReports.find(r => r.id === reportId);
    
    switch(action) {
      case 'pdf':
        toast({
          title: "Downloading PDF",
          description: `${report?.title} is being downloaded as a PDF.`,
          duration: 3000
        });
        break;
      case 'google':
        toast({
          title: "Opening in Google Docs",
          description: `${report?.title} is being opened in Google Docs.`,
          duration: 3000
        });
        break;
      case 'word':
        toast({
          title: "Downloading Word Document",
          description: `${report?.title} is being downloaded as a Word document.`,
          duration: 3000
        });
        break;
      case 'share':
        setShareDialogOpen(true);
        setShareType("html");
        break;
      case 'embed':
        setShareDialogOpen(true);
        setShareType("iframe");
        break;
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 pt-12 pb-12">
        <div className="container mx-auto px-4 md:px-6">
          
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">Reports</h1>
            <p className="text-base text-gray-600 dark:text-gray-300">
              Create, manage, and share your sustainability reports
            </p>
          </div>
          
          {/* Report Action Cards */}
          <ReportActionCards 
            onGenerateReportClick={handleGenerateReportClick}
            onExportClick={handleExportClick}
            onShareReportClick={handleShareReportClick}
          />
          
          <div className="mb-6">
            <ReportsSearch 
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>
          
          <Tabs defaultValue="all" className="mb-6">
            <TabsList className="grid grid-cols-4 w-full max-w-md mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="published">Published</TabsTrigger>
              <TabsTrigger value="draft">Drafts</TabsTrigger>
              <TabsTrigger value="archived">Archived</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              <ReportsTable
                reports={sampleReports}
                onStatusChange={handleStatusChange}
                onEditClick={handleEditClick}
                onActionClick={handleActionClick}
              />
            </TabsContent>
            
            <TabsContent value="published" className="mt-0">
              <ReportsTable
                reports={sampleReports.filter(r => r.status === 'Published')}
                onStatusChange={handleStatusChange}
                onEditClick={handleEditClick}
                onActionClick={handleActionClick}
              />
            </TabsContent>
            
            <TabsContent value="draft" className="mt-0">
              <ReportsTable
                reports={sampleReports.filter(r => r.status === 'Draft')}
                onStatusChange={handleStatusChange}
                onEditClick={handleEditClick}
                onActionClick={handleActionClick}
              />
            </TabsContent>
            
            <TabsContent value="archived" className="mt-0">
              <ReportsTable
                reports={sampleReports.filter(r => r.status === 'Archived')}
                onStatusChange={handleStatusChange}
                onEditClick={handleEditClick}
                onActionClick={handleActionClick}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Dialogs */}
      <GenerateReportDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={onSubmit}
      />

      <ShareReportDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        onSubmit={onShareSubmit}
        availableReports={availableReports}
      />
    </div>
  );
};

export default Reports;
