
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ImportButtonProps {
  className?: string;
}

export const ImportButton = ({ className }: ImportButtonProps) => {
  const navigate = useNavigate();

  const handleImportClick = () => {
    navigate("/import");
  };

  return (
    <Button 
      onClick={handleImportClick} 
      className={`flex items-center gap-2 bg-accent hover:bg-accent/90 text-primary rounded-full ${className || ""}`}
    >
      <Download className="h-4 w-4" />
      <span>Import Novata Metrics</span>
    </Button>
  );
};
