
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { Menu, X, Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Force dark mode on app startup
  useEffect(() => {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleImportClick = () => {
    toast({
      title: "Import Novata Metrics",
      description: "Coming soon! This will allow importing metrics from Novata.",
      duration: 3000,
    });
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all-ease ${
        isScrolled 
          ? "py-2 glass-panel shadow-md" 
          : "py-4 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <NavLink 
            to="/" 
            className="flex items-center gap-2 text-primary dark:text-white transition-all-ease"
          >
            <img 
              src="/lovable-uploads/b05f0448-8c26-463d-b69b-98061b769e16.png" 
              alt="Novata Logo" 
              className="h-16 w-auto" 
            />
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <NavLink 
              to="/" 
              className={({ isActive }) => `px-4 py-2 rounded-md transition-all-ease ${
                isActive 
                  ? "text-secondary font-medium" 
                  : "text-primary/80 dark:text-white/80 hover:text-primary dark:hover:text-white"
              }`}
            >
              Dashboard
            </NavLink>
            <NavLink 
              to="/reports" 
              className={({ isActive }) => `px-4 py-2 rounded-md transition-all-ease ${
                isActive 
                  ? "text-secondary font-medium" 
                  : "text-primary/80 dark:text-white/80 hover:text-primary dark:hover:text-white"
              }`}
            >
              Reports
            </NavLink>
            <NavLink 
              to="/standards" 
              className={({ isActive }) => `px-4 py-2 rounded-md transition-all-ease ${
                isActive 
                  ? "text-secondary font-medium" 
                  : "text-primary/80 dark:text-white/80 hover:text-primary dark:hover:text-white"
              }`}
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
            >
              Metrics
            </NavLink>
          </nav>

          <div className="flex items-center gap-2">
            <Button 
              onClick={handleImportClick} 
              className="hidden md:flex items-center gap-2 bg-accent hover:bg-accent/90 text-primary rounded-full"
            >
              <Download className="h-4 w-4" />
              <span>Import Novata Metrics</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-full"
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-primary dark:text-white" />
              ) : (
                <Menu className="h-6 w-6 text-primary dark:text-white" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel mt-2 py-4 animate-slideUp">
          <nav className="flex flex-col space-y-2 px-4">
            <NavLink 
              to="/" 
              className={({ isActive }) => `px-4 py-2 rounded-md transition-all-ease ${
                isActive 
                  ? "text-secondary font-medium" 
                  : "text-primary/80 dark:text-white/80 hover:text-primary dark:hover:text-white"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </NavLink>
            <NavLink 
              to="/reports" 
              className={({ isActive }) => `px-4 py-2 rounded-md transition-all-ease ${
                isActive 
                  ? "text-secondary font-medium" 
                  : "text-primary/80 dark:text-white/80 hover:text-primary dark:hover:text-white"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Reports
            </NavLink>
            <NavLink 
              to="/standards" 
              className={({ isActive }) => `px-4 py-2 rounded-md transition-all-ease ${
                isActive 
                  ? "text-secondary font-medium" 
                  : "text-primary/80 dark:text-white/80 hover:text-primary dark:hover:text-white"
              }`}
              onClick={() => setMobileMenuOpen(false)}
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
              onClick={() => setMobileMenuOpen(false)}
            >
              Metrics
            </NavLink>
            <Button 
              onClick={() => {
                handleImportClick();
                setMobileMenuOpen(false);
              }} 
              className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-primary rounded-full w-full justify-center mt-2"
            >
              <Download className="h-4 w-4" />
              <span>Import Novata Metrics</span>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

