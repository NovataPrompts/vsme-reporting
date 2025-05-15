import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export const Footer = () => {
  const handleLogout = () => {
    localStorage.removeItem("vsme-auth");
    window.location.href = "/password";
  };

  return (
    <footer className="w-full py-6 mt-12 bg-primary text-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <img 
                src="/lovable-uploads/dc0ec24e-33a6-4f08-b694-455ce8c649fb.png" 
                alt="Novata Logo" 
                className="h-11 w-auto" 
              />
              <span className="font-semibold text-xl">VSME Reporting</span>
            </div>
            <p className="text-sm text-white/80">
              Modern and intuitive sustainability reporting tool for non-listed SMEs following the VSME standard
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium text-lg">Platform</h3>
            <ul className="space-y-2">
              <li>
                <NavLink to="/" className="text-sm text-white/80 hover:text-white transition-all-ease">
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink to="/reports" className="text-sm text-white/80 hover:text-white transition-all-ease">
                  Reports
                </NavLink>
              </li>
              <li>
                <NavLink to="/metrics" className="text-sm text-white/80 hover:text-white transition-all-ease">
                  Metrics
                </NavLink>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium text-lg">Resources</h3>
            <ul className="space-y-2">
              <li>
                <NavLink to="/standards" className="text-sm text-white/80 hover:text-white transition-all-ease">
                  VSME Standard
                </NavLink>
              </li>
              <li>
                <a 
                  href="https://www.efrag.org/sites/default/files/sites/webpublishing/SiteAssets/VSME%20Standard.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-white/80 hover:text-white transition-all-ease"
                >
                  Official VSME Documentation
                </a>
              </li>
              <li>
                <NavLink to="/faq" className="text-sm text-white/80 hover:text-white transition-all-ease">
                  FAQ
                </NavLink>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium text-lg">Company</h3>
            <ul className="space-y-2">
              <li>
                <NavLink to="/about" className="text-sm text-white/80 hover:text-white transition-all-ease">
                  About
                </NavLink>
              </li>
              <li>
                <NavLink to="/contact" className="text-sm text-white/80 hover:text-white transition-all-ease">
                  Contact
                </NavLink>
              </li>
              <li>
                <NavLink to="/privacy" className="text-sm text-white/80 hover:text-white transition-all-ease">
                  Privacy Policy
                </NavLink>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/20 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-white/60">
            © {new Date().getFullYear()} VSME Reporting. All rights reserved.
          </p>
          <div className="flex items-center">
            <Button 
              variant="outline" 
              size="sm" 
              className="border-white/20 text-white hover:bg-white/10 hover:text-white"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};
