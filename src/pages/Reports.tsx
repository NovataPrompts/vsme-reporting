
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, PlusCircle, Download, Share2, MoreHorizontal, FileText, File, FileCog } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const Reports = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  const reports = [
    { 
      id: 1, 
      title: "Annual Sustainability Report 2023", 
      description: "Comprehensive annual report covering all VSME metrics.",
      date: "Apr 15, 2023", 
      status: "published",
      type: "annual"
    },
    { 
      id: 2, 
      title: "Q2 Carbon Emissions Report", 
      description: "Detailed analysis of Q2 2023 carbon emissions.",
      date: "Jul 3, 2023", 
      status: "draft",
      type: "quarterly"
    },
    { 
      id: 3, 
      title: "Supply Chain Assessment", 
      description: "Assessment of sustainability across our supply chain.",
      date: "Sep 18, 2023", 
      status: "published",
      type: "special"
    },
    { 
      id: 4, 
      title: "Environmental Impact Analysis", 
      description: "Analysis of our overall environmental footprint.",
      date: "Oct 5, 2023", 
      status: "draft",
      type: "annual"
    },
    { 
      id: 5, 
      title: "Social Performance Report", 
      description: "Overview of social sustainability measures.",
      date: "Nov 12, 2023", 
      status: "archived",
      type: "quarterly"
    },
    { 
      id: 6, 
      title: "Governance Standards Review", 
      description: "Review of governance practices against VSME criteria.",
      date: "Dec 1, 2023", 
      status: "published",
      type: "special"
    }
  ];

  const filteredReports = reports.filter(report => 
    report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateReport = () => {
    toast({
      title: "Create New Report",
      description: "The report creation wizard will be available soon.",
      duration: 3000,
    });
  };

  const handleReportAction = (action: string, title: string) => {
    toast({
      title: `${action} Report`,
      description: `${action} for ${title} will be available soon.`,
      duration: 3000,
    });
  };

  const statusIcon = (type: string) => {
    switch (type) {
      case "annual":
        return <FileText className="h-5 w-5 text-blue-500" />;
      case "quarterly":
        return <File className="h-5 w-5 text-green-500" />;
      case "special":
        return <FileCog className="h-5 w-5 text-purple-500" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
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
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredReports.length > 0 ? (
                      filteredReports.map((report) => (
                        <div key={report.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all-ease">
                          <div className="flex items-start md:items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                              {statusIcon(report.type)}
                            </div>
                            <div className="flex-1">
                              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                <div>
                                  <h3 className="font-medium">{report.title}</h3>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">{report.description}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge 
                                    variant={report.status === "published" ? "default" : "outline"}
                                    className={
                                      report.status === "published" 
                                        ? "bg-secondary text-primary" 
                                        : report.status === "archived"
                                          ? "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                                          : ""
                                    }
                                  >
                                    {report.status}
                                  </Badge>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">{report.date}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                onClick={() => handleReportAction("Download", report.title)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                onClick={() => handleReportAction("Share", report.title)}
                              >
                                <Share2 className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                onClick={() => handleReportAction("More options", report.title)}
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center">
                        <p className="text-gray-500 dark:text-gray-400">No reports found matching your search criteria.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="published" className="mt-0">
              <Card className="shadow-sm">
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredReports.filter(r => r.status === "published").length > 0 ? (
                      filteredReports
                        .filter(r => r.status === "published")
                        .map((report) => (
                          <div key={report.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all-ease">
                            <div className="flex items-start md:items-center gap-4">
                              <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                {statusIcon(report.type)}
                              </div>
                              <div className="flex-1">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                  <div>
                                    <h3 className="font-medium">{report.title}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{report.description}</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge className="bg-secondary text-primary">
                                      {report.status}
                                    </Badge>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">{report.date}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                  onClick={() => handleReportAction("Download", report.title)}
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                  onClick={() => handleReportAction("Share", report.title)}
                                >
                                  <Share2 className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                  onClick={() => handleReportAction("More options", report.title)}
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))
                    ) : (
                      <div className="p-8 text-center">
                        <p className="text-gray-500 dark:text-gray-400">No published reports found.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="draft" className="mt-0">
              <Card className="shadow-sm">
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredReports.filter(r => r.status === "draft").length > 0 ? (
                      filteredReports
                        .filter(r => r.status === "draft")
                        .map((report) => (
                          <div key={report.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all-ease">
                            <div className="flex items-start md:items-center gap-4">
                              <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                {statusIcon(report.type)}
                              </div>
                              <div className="flex-1">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                  <div>
                                    <h3 className="font-medium">{report.title}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{report.description}</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline">
                                      {report.status}
                                    </Badge>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">{report.date}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                  onClick={() => handleReportAction("Download", report.title)}
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                  onClick={() => handleReportAction("Share", report.title)}
                                >
                                  <Share2 className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                  onClick={() => handleReportAction("More options", report.title)}
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))
                    ) : (
                      <div className="p-8 text-center">
                        <p className="text-gray-500 dark:text-gray-400">No draft reports found.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="archived" className="mt-0">
              <Card className="shadow-sm">
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredReports.filter(r => r.status === "archived").length > 0 ? (
                      filteredReports
                        .filter(r => r.status === "archived")
                        .map((report) => (
                          <div key={report.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all-ease">
                            <div className="flex items-start md:items-center gap-4">
                              <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                {statusIcon(report.type)}
                              </div>
                              <div className="flex-1">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                  <div>
                                    <h3 className="font-medium">{report.title}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{report.description}</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge 
                                      variant="outline"
                                      className="bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                                    >
                                      {report.status}
                                    </Badge>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">{report.date}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                  onClick={() => handleReportAction("Download", report.title)}
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                  onClick={() => handleReportAction("Share", report.title)}
                                >
                                  <Share2 className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                  onClick={() => handleReportAction("More options", report.title)}
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))
                    ) : (
                      <div className="p-8 text-center">
                        <p className="text-gray-500 dark:text-gray-400">No archived reports found.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Reports;
