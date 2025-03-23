
import { NavLink } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="w-full py-6 mt-12 bg-primary text-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full overflow-hidden bg-accent flex items-center justify-center">
                <span className="text-primary font-bold text-xl">V</span>
              </div>
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
          <div className="mt-4 md:mt-0 flex items-center gap-4">
            <a 
              href="#" 
              className="text-white/60 hover:text-white transition-all-ease" 
              aria-label="LinkedIn"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
              </svg>
            </a>
            <a 
              href="#" 
              className="text-white/60 hover:text-white transition-all-ease" 
              aria-label="Twitter"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
