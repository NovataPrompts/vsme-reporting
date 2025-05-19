
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNavigation = ({ isOpen, onClose }: MobileNavigationProps) => {
  const navigate = useNavigate();
  
  const handleImportClick = () => {
    navigate("/import");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="md:hidden glass-panel mt-2 py-4 animate-slideUp">
      <nav className="flex flex-col space-y-2 px-4">
        <NavLink 
          to="/welcome" 
          className={({ isActive }) => `px-4 py-2 rounded-md transition-all-ease ${
            isActive 
              ? "text-secondary font-medium" 
              : "text-primary/80 dark:text-white/80 hover:text-primary dark:hover:text-white"
          }`}
          onClick={onClose}
        >
          Home
        </NavLink>
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => `px-4 py-2 rounded-md transition-all-ease ${
            isActive 
              ? "text-secondary font-medium" 
              : "text-primary/80 dark:text-white/80 hover:text-primary dark:hover:text-white"
          }`}
          onClick={onClose}
        >
          Dashboard
        </NavLink>
        <NavLink 
          to="/standards" 
          className={({ isActive }) => `px-4 py-2 rounded-md transition-all-ease ${
            isActive 
              ? "text-secondary font-medium" 
              : "text-primary/80 dark:text-white/80 hover:text-primary dark:hover:text-white"
          }`}
          onClick={onClose}
        >
          VSME Standard
        </NavLink>
        <NavLink 
          to="/metrics" 
          className={({ isActive }) => `px-4 py-2 rounded-md transition-all-ease ${
            isActive 
              ? "text-secondary font-medium" 
              : "text-primary/80 dark:text-white/80 hover:text-primary dark:hover:text-white"
          }`}
          onClick={onClose}
        >
          Metrics
        </NavLink>
        <NavLink 
          to="/reports" 
          className={({ isActive }) => `px-4 py-2 rounded-md transition-all-ease ${
            isActive 
              ? "text-secondary font-medium" 
              : "text-primary/80 dark:text-white/80 hover:text-primary dark:hover:text-white"
          }`}
          onClick={onClose}
        >
          Reports
        </NavLink>
        <Button 
          onClick={handleImportClick} 
          className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-primary rounded-full w-full justify-center mt-2"
        >
          <Download className="h-4 w-4" />
          <span>Import Novata Metrics</span>
        </Button>
      </nav>
    </div>
  );
};
