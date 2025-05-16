import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, PlusCircle, FileSpreadsheet, FileText, Share, ChevronDown, Link, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const reportSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters")
});

type ReportFormValues = z.infer<typeof reportSchema>;

const shareReportSchema = z.object({
  reportId: z.string().min(1, "Please select a report")
});

type ShareReportFormValues = z.infer<typeof shareReportSchema>;

const Reports = () => {
  const {
    toast
  } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareType, setShareType] = useState<"html" | "iframe">("html");
  
  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      title: "",
      companyName: "",
      description: ""
    }
  });
  
  const shareForm = useForm<ShareReportFormValues>({
    resolver: zodResolver(shareReportSchema),
    defaultValues: {
      reportId: ""
    }
  });
  
  // Sample reports for the dropdown
  const availableReports = [
    { id: "1", title: "Annual Sustainability Report 2023" },
    { id: "2", title: "Q2 Carbon Emissions Report" },
    { id: "3", title: "Supply Chain Assessment" }
  ];
  
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
    form.reset();
  };
  
  const onShareSubmit = (data: ShareReportFormValues) => {
    const selectedReport = availableReports.find(report => report.id === data.reportId);
    const linkType = shareType === "html" ? "HTML version" : "embedded iframe";
    
    toast({
      title: "Link Generated",
      description: `A ${linkType} link for "${selectedReport?.title}" has been created.`,
      duration: 3000
    });
    setShareDialogOpen(false);
    shareForm.reset();
  };
  
  return <div className="min-h-screen flex flex-col">
      <main className="flex-1 pt-12 pb-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">Reports</h1>
            <p className="text-base text-gray-600 dark:text-gray-300">
              Create, manage, and share your sustainability reports
            </p>
          </div>
          
          {/* Report Options Boxes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-8">
            {/* Export Box */}
            <Card className="border-2 border-[#077bc0]/20 hover:border-[#077bc0]/80 transition-all duration-300 group">
              <div className="p-6 flex flex-col items-center text-center h-full" onClick={handleExportClick}>
                <div className="bg-[#077bc0]/20 p-4 rounded-full mb-4 group-hover:bg-[#077bc0]/30 transition-all duration-300">
                  <FileSpreadsheet className="h-8 w-8 text-[#077bc0]" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Export Data</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 flex-1">
                  Simple, structured data file in .xlsx or .csv format
                </p>
                <Button onClick={handleExportClick} className="w-full bg-[#077bc0] hover:bg-[#077bc0]/90 text-white">
                  Export Data
                </Button>
              </div>
            </Card>

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
                <Button onClick={handleGenerateReportClick} className="w-full bg-[#077bc0] hover:bg-[#077bc0]/90 text-white">
                  Create Report
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
                <Button onClick={handleShareReportClick} className="w-full bg-[#077bc0] hover:bg-[#077bc0]/90 text-white">
                  Share Report
                </Button>
              </div>
            </Card>
          </div>
          
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Search reports..." className="pl-10 rounded-full" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            </div>
          </div>
          
          <Tabs defaultValue="all" className="mb-6">
            <TabsList className="grid grid-cols-4 w-full max-w-md mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="published">Published</TabsTrigger>
              <TabsTrigger value="draft">Drafts</TabsTrigger>
              <TabsTrigger value="archived">Archived</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              <Card className="shadow-sm">
                <CardContent className="p-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {/* Empty table body - no rows */}
                    </TableBody>
                  </Table>
                  
                  <div className="text-center py-8 text-gray-500">
                    <p>No reports available</p>
                    <p className="text-sm mt-2">Create your first report to get started</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="published" className="mt-0">
              <Card className="shadow-sm">
                <CardContent className="p-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {/* Empty table body - no rows */}
                    </TableBody>
                  </Table>
                  
                  <div className="text-center py-8 text-gray-500">
                    <p>No published reports available</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="draft" className="mt-0">
              <Card className="shadow-sm">
                <CardContent className="p-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {/* Empty table body - no rows */}
                    </TableBody>
                  </Table>
                  
                  <div className="text-center py-8 text-gray-500">
                    <p>No draft reports available</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="archived" className="mt-0">
              <Card className="shadow-sm">
                <CardContent className="p-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {/* Empty table body - no rows */}
                    </TableBody>
                  </Table>
                  
                  <div className="text-center py-8 text-gray-500">
                    <p>No archived reports available</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Create Report Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Report</DialogTitle>
            <DialogDescription>
              Enter the details for your new sustainability report.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
              <FormField control={form.control} name="title" render={({
              field
            }) => <FormItem>
                    <FormLabel>Report Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Annual Sustainability Report 2024" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />

              <FormField control={form.control} name="companyName" render={({
              field
            }) => <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Company Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />

              <FormField control={form.control} name="description" render={({
              field
            }) => <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Comprehensive review of our sustainability initiatives" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />
              
              <DialogFooter className="pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setDialogOpen(false)}
                  className="hover:bg-[#f3f5f7]"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="bg-[#057cc1] hover:bg-[#057cc1]/90"
                >
                  Create Report
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Share Report Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Share Report</DialogTitle>
            <DialogDescription>
              Create a shareable link for your sustainability report.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...shareForm}>
            <form onSubmit={shareForm.handleSubmit(onShareSubmit)} className="space-y-4 py-4">
              <FormField
                control={shareForm.control}
                name="reportId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Report</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a report to share" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableReports.map((report) => (
                          <SelectItem key={report.id} value={report.id}>
                            {report.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex flex-col space-y-1.5">
                <FormLabel>Sharing Format</FormLabel>
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant={shareType === "html" ? "default" : "outline"}
                    onClick={() => setShareType("html")}
                    className={`flex-1 ${shareType === "html" ? "bg-[#057cc1] hover:bg-[#057cc1]/90" : ""}`}
                  >
                    <Link className="mr-2 h-4 w-4" />
                    HTML Link
                  </Button>
                  <Button
                    type="button"
                    variant={shareType === "iframe" ? "default" : "outline"}
                    onClick={() => setShareType("iframe")}
                    className={`flex-1 ${shareType === "iframe" ? "bg-[#057cc1] hover:bg-[#057cc1]/90" : ""}`}
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Embed Code
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {shareType === "html" 
                    ? "Creates an HTML version that can be shared via URL" 
                    : "Creates code for embedding the report in other websites"}
                </p>
              </div>
              
              <DialogFooter className="pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShareDialogOpen(false)}
                  className="hover:bg-[#f3f5f7]"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="bg-[#057cc1] hover:bg-[#057cc1]/90"
                >
                  Create Link
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>;
};
export default Reports;
