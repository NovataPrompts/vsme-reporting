import React, { useState } from 'react';
import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, PlusCircle } from "lucide-react";
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
