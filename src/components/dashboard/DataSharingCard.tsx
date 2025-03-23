
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
    <Card className="shadow-sm glass-card">
      <CardHeader>
        <CardTitle className="text-lg font-medium flex items-center justify-between">
          <span>Data Sharing Hub</span>
          <span className="text-sm text-accent font-normal flex items-center gap-1 cursor-pointer hover:underline">
            Learn More
            <ArrowUpRight className="h-3 w-3" />
          </span>
        </CardTitle>
        <CardDescription>
          Share your sustainability data with partners, suppliers, and other stakeholders.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            onClick={handleUploadClick}
            className="flex h-24 items-center justify-center gap-3 bg-white/50 dark:bg-white/5 hover:bg-accent/20 text-primary dark:text-white border border-gray-100 dark:border-white/10 rounded-lg transition-all-ease"
            variant="ghost"
          >
            <Upload className="h-5 w-5" />
            <div className="flex flex-col items-start">
              <span className="font-medium">Upload Data</span>
              <span className="text-xs opacity-70">CSV, Excel, or JSON</span>
            </div>
          </Button>
          
          <Button 
            onClick={handleInviteClick}
            className="flex h-24 items-center justify-center gap-3 bg-white/50 dark:bg-white/5 hover:bg-accent/20 text-primary dark:text-white border border-gray-100 dark:border-white/10 rounded-lg transition-all-ease"
            variant="ghost"
          >
            <UserPlus className="h-5 w-5" />
            <div className="flex flex-col items-start">
              <span className="font-medium">Invite Partners</span>
              <span className="text-xs opacity-70">Share with collaborators</span>
            </div>
          </Button>
          
          <Button 
            onClick={handleShareClick}
            className="flex h-24 items-center justify-center gap-3 bg-white/50 dark:bg-white/5 hover:bg-accent/20 text-primary dark:text-white border border-gray-100 dark:border-white/10 rounded-lg transition-all-ease"
            variant="ghost"
          >
            <Share className="h-5 w-5" />
            <div className="flex flex-col items-start">
              <span className="font-medium">Share Reports</span>
              <span className="text-xs opacity-70">Generate shareable links</span>
            </div>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
