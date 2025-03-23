
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export const RecentReports = () => {
  const { toast } = useToast();

  const reports = [
    {
      id: 1,
      title: "Annual Sustainability Report 2023",
      date: "April 15, 2023",
      status: "published"
    },
    {
      id: 2,
      title: "Q2 Carbon Emissions Report",
      date: "July 3, 2023",
      status: "draft"
    },
    {
      id: 3,
      title: "Supply Chain Assessment",
      date: "September 18, 2023",
      status: "published"
    }
  ];

  const handleDownload = (reportTitle: string) => {
    toast({
      title: "Download started",
      description: `${reportTitle} is being downloaded...`,
      duration: 3000,
    });
  };

  const handleShare = (reportTitle: string) => {
    toast({
      title: "Share report",
      description: `Share options for ${reportTitle} will appear here soon.`,
      duration: 3000,
    });
  };

  return (
    <Card className="shadow-sm glass-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center justify-between">
          <span>Recent Reports</span>
          <span className="text-sm text-accent font-normal flex items-center gap-1 cursor-pointer hover:underline">
            View All
            <ArrowUpRight className="h-3 w-3" />
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reports.map((report) => (
            <div 
              key={report.id} 
              className="p-3 rounded-lg bg-white/50 dark:bg-primary/20 border border-gray-100 dark:border-white/5 transition-all-ease hover:shadow-md"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-1">
                  <h3 className="font-medium">{report.title}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">{report.date}</span>
                    <Badge 
                      variant={report.status === "published" ? "default" : "outline"}
                      className={report.status === "published" ? "bg-secondary text-primary" : ""}
                    >
                      {report.status}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-primary/10 dark:hover:bg-white/10"
                    onClick={() => handleDownload(report.title)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-primary/10 dark:hover:bg-white/10"
                    onClick={() => handleShare(report.title)}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
