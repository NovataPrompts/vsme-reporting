
import { Button } from "@/components/ui/button";
import { Download, ExternalLink } from "lucide-react";
import { useState } from "react";

interface StandardsHeaderProps {
  onDownload: () => void;
}

export const StandardsHeader = ({ onDownload }: StandardsHeaderProps) => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div className="max-w-3xl mx-auto text-center mb-12">
      <h1 className="text-3xl font-bold mb-4">VSME Reporting Standard</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
        A comprehensive guide to the voluntary sustainability reporting standard for non-listed SMEs
      </p>
      <Button 
        onClick={onDownload}
        className="bg-primary hover:bg-secondary hover:text-primary transition-all duration-300 ease-in-out transform hover:scale-105 text-white rounded-full flex items-center gap-2 mx-auto"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <Download className={`h-4 w-4 ${isHovering ? 'animate-bounce' : ''}`} />
        <span>Download Full Standard</span>
      </Button>
    </div>
  );
};
