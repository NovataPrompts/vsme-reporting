
import React, { useState } from 'react';
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, PlusCircle, FileSpreadsheet, FileText, Share } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const reportSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

type ReportFormValues = z.infer<typeof reportSchema>;

const Reports = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const handleCreateReport = () => {
    setDialogOpen(true);
  };

  const handleExportClick = () => {
    toast({
      title: "Export Started",
      description: "Your data is being exported to an Excel file.",
      duration: 3000,
    });
  };

  const handleGenerateReportClick = () => {
    toast({
      title: "Report Generation",
      description: "Your VSME compliant report is being generated.",
      duration: 3000,
    });
  };

  const handleShareReportClick = () => {
    toast({
      title: "Share Report",
      description: "A private sharing link is being generated.",
      duration: 3000,
    });
  };

  const onSubmit = (data: ReportFormValues) => {
    toast({
      title: "Report Created",
      description: `${data.title} has been created successfully.`,
      duration: 3000,
    });
    
    setDialogOpen(false);
    form.reset();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Reports</h1>
              <p className="text-gray-600 dark:text-gray-300">
                Create, manage, and share your sustainability reports
              </p>
            </div>
            <Button 
              onClick={handleCreateReport}
              className="bg-accent hover:bg-accent/90 text-primary rounded-full flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Create New Report</span>
            </Button>
          </div>
          
          {/* Report Options Boxes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Export Box */}
            <Card className="shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={handleExportClick}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-[#057cc1]">
                  <FileSpreadsheet className="h-5 w-5" />
                  <span>Generate Export</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Simple, structured data file in .xlsx or .csv format
                </p>
              </CardContent>
            </Card>

            {/* Generate Report Box */}
            <Card className="shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={handleGenerateReportClick}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-[#057cc1]">
                  <FileText className="h-5 w-5" />
                  <span>Generate Report</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Generate a full VSME compliant report for .docx, .pdf, or google sheets
                </p>
              </CardContent>
            </Card>

            {/* Share Report Box */}
            <Card className="shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={handleShareReportClick}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-[#057cc1]">
                  <Share className="h-5 w-5" />
                  <span>Share my VSME Report</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Generate a link to privately invite partners, suppliers, or board members to view your report
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search reports..." 
                className="pl-10 rounded-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
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
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Report Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Annual Sustainability Report 2024" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Comprehensive review of our sustainability initiatives" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter className="pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Create Report</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Reports;
