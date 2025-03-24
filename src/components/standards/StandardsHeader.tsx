
import { Button } from "@/components/ui/button";
import { Download, ExternalLink } from "lucide-react";

interface StandardsHeaderProps {
  onDownload: () => void;
}

export const StandardsHeader = ({ onDownload }: StandardsHeaderProps) => {
  return (
    <div className="max-w-3xl mx-auto text-center mb-12">
      <h1 className="text-3xl font-bold mb-4">VSME Reporting Standard</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
        A comprehensive guide to the voluntary sustainability reporting standard for non-listed SMEs
      </p>
      <Button 
        onClick={onDownload}
        className="bg-primary hover:bg-primary/90 text-white rounded-full flex items-center gap-2 mx-auto"
      >
        <Download className="h-4 w-4" />
        <span>Download Full Standard</span>
      </Button>
    </div>
  );
};
