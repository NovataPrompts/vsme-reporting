
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Upload, Link, MessageCirclePlus } from "lucide-react";
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
        <CardTitle className="text-2xl font-bold flex items-center justify-between text-[#008099] dark:text-white">
          <span>Data Sharing Hub</span>
          <span className="text-sm text-accent font-normal flex items-center gap-1 cursor-pointer hover:underline">
            Learn More
            <ArrowUpRight className="h-3 w-3" />
          </span>
        </CardTitle>
        <CardDescription className="text-base text-[#00344d]/80 dark:text-white/80">
          Share your sustainability data with partners, suppliers, and other stakeholders.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            onClick={handleUploadClick}
            className="group flex items-center justify-start gap-3 enhanced-tile h-28 px-4"
            variant="ghost"
          >
            <div className="h-14 w-14 flex items-center justify-center rounded-full bg-[#e3ecec] dark:bg-white/10 border border-[#008099]/30 dark:border-white/20 group-hover:bg-[#d8f225] group-hover:border-[#d8f225] transition-colors duration-300">
              <Upload className="h-7 w-7 text-[#008099] dark:text-white group-hover:text-[#00344d] transition-colors duration-300" />
            </div>
            <div className="flex flex-col items-start">
              <span className="font-semibold text-lg">Upload Data</span>
              <span className="text-sm opacity-70">CSV, Excel, or JSON</span>
            </div>
          </Button>
          
          <Button 
            onClick={handleInviteClick}
            className="group flex items-center justify-start gap-3 enhanced-tile h-28 px-4"
            variant="ghost"
          >
            <div className="h-14 w-14 flex items-center justify-center rounded-full bg-[#e3ecec] dark:bg-white/10 border border-[#008099]/30 dark:border-white/20 group-hover:bg-[#d8f225] group-hover:border-[#d8f225] transition-colors duration-300">
              <MessageCirclePlus className="h-7 w-7 text-[#008099] dark:text-white group-hover:text-[#00344d] transition-colors duration-300" />
            </div>
            <div className="flex flex-col items-start">
              <span className="font-semibold text-lg">Invite Partners</span>
              <span className="text-sm opacity-70">Share with collaborators</span>
            </div>
          </Button>
          
          <Button 
            onClick={handleShareClick}
            className="group flex items-center justify-start gap-3 enhanced-tile h-28 px-4"
            variant="ghost"
          >
            <div className="h-14 w-14 flex items-center justify-center rounded-full bg-[#e3ecec] dark:bg-white/10 border border-[#008099]/30 dark:border-white/20 group-hover:bg-[#d8f225] group-hover:border-[#d8f225] transition-colors duration-300">
              <Link className="h-7 w-7 text-[#008099] dark:text-white group-hover:text-[#00344d] transition-colors duration-300" />
            </div>
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
