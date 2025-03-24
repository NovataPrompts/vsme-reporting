
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, ExternalLink, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const StandardsResources = () => {
  const { toast } = useToast();

  const handleInfoClick = (section: string) => {
    toast({
      title: `${section} Information`,
      description: `Additional information about ${section} will be available soon.`,
      duration: 3000,
    });
  };

  return (
    <Card className="shadow-sm glass-card">
      <CardHeader>
        <CardTitle>Resources</CardTitle>
        <CardDescription>
          Additional resources to help you understand and implement the VSME standard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <a 
            href="https://www.efrag.org/sites/default/files/sites/webpublishing/SiteAssets/VSME%20Standard.pdf" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 bg-white/50 dark:bg-white/5 hover:bg-accent/10 rounded-lg border border-gray-200 dark:border-gray-700 transition-all-ease"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 dark:bg-white/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary dark:text-white" />
              </div>
              <div>
                <h3 className="font-medium">Official VSME Standard</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">PDF Document • 2.4 MB</p>
              </div>
            </div>
            <ExternalLink className="h-4 w-4" />
          </a>
          
          <Button 
            variant="outline" 
            className="w-full justify-between"
            onClick={() => handleInfoClick("Implementation Guides")}
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 dark:bg-white/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary dark:text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-medium">Implementation Guides</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Step-by-step implementation instructions</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-between"
            onClick={() => handleInfoClick("Webinars & Training")}
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 dark:bg-white/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary dark:text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-medium">Webinars & Training</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Educational videos and training materials</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-between"
            onClick={() => handleInfoClick("Case Studies")}
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 dark:bg-white/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary dark:text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-medium">Case Studies</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Examples of successful VSME implementation</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
