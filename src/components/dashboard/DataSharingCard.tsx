
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Upload, UserPlus, Share } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export const DataSharingCard = () => {
  const { toast } = useToast();

  const handleUploadClick = () => {
    toast({
      title: "Upload Data",
      description: "The upload feature will be available soon.",
      duration: 3000,
    });
  };

  const handleInviteClick = () => {
    toast({
      title: "Invite Partners",
      description: "Invite feature will be available soon.",
      duration: 3000,
    });
  };

  const handleShareClick = () => {
    toast({
      title: "Share Reports",
      description: "Sharing feature will be available soon.",
      duration: 3000,
    });
  };

  return (
    <Card className="shadow-sm glass-card relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-accent/10 dark:bg-accent/5 rounded-full blur-2xl"></div>
      <div className="absolute -left-16 -top-16 w-48 h-48 bg-secondary/10 dark:bg-secondary/5 rounded-full blur-2xl"></div>
      
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center justify-between text-primary dark:text-white">
          <span>Data Sharing Hub</span>
          <span className="text-sm text-accent font-normal flex items-center gap-1 cursor-pointer hover:underline">
            Learn More
            <ArrowUpRight className="h-3 w-3" />
          </span>
        </CardTitle>
        <CardDescription className="text-base">
          Share your sustainability data with partners, suppliers, and other stakeholders.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            onClick={handleUploadClick}
            className="flex h-28 items-center justify-center gap-3 bg-white/50 dark:bg-white/5 hover:bg-accent/20 hover:scale-105 text-primary dark:text-white border border-gray-100 dark:border-white/10 rounded-lg transition-all-ease"
            variant="ghost"
          >
            <Upload className="h-8 w-8" />
            <div className="flex flex-col items-start">
              <span className="font-semibold text-lg">Upload Data</span>
              <span className="text-sm opacity-70">CSV, Excel, or JSON</span>
            </div>
          </Button>
          
          <Button 
            onClick={handleInviteClick}
            className="flex h-28 items-center justify-center gap-3 bg-white/50 dark:bg-white/5 hover:bg-accent/20 hover:scale-105 text-primary dark:text-white border border-gray-100 dark:border-white/10 rounded-lg transition-all-ease"
            variant="ghost"
          >
            <UserPlus className="h-8 w-8" />
            <div className="flex flex-col items-start">
              <span className="font-semibold text-lg">Invite Partners</span>
              <span className="text-sm opacity-70">Share with collaborators</span>
            </div>
          </Button>
          
          <Button 
            onClick={handleShareClick}
            className="flex h-28 items-center justify-center gap-3 bg-white/50 dark:bg-white/5 hover:bg-accent/20 hover:scale-105 text-primary dark:text-white border border-gray-100 dark:border-white/10 rounded-lg transition-all-ease"
            variant="ghost"
          >
            <Share className="h-8 w-8" />
            <div className="flex flex-col items-start">
              <span className="font-semibold text-lg">Share Reports</span>
              <span className="text-sm opacity-70">Generate shareable links</span>
            </div>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
