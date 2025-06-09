import { useState, useEffect } from "react";
import { Logo } from "./header/Logo";
import { DesktopNavigation } from "./header/DesktopNavigation";
import { MobileNavigation } from "./header/MobileNavigation";
import { ImportButton } from "./header/ImportButton";
import { MobileMenuToggle } from "./header/MobileMenuToggle";
import { useLocation } from "react-router-dom";
export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isReportsPage = location.pathname === "/reports";
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

  // Force light mode on app startup
  useEffect(() => {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }, []);
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  return <header className={`fixed top-0 inset-x-0 z-50 bg-white ${isScrolled ? 'shadow-md' : ''}`}>
      <div className="container mx-auto px-4 md:px-6">
        
      </div>
      {!isReportsPage && <MobileNavigation isOpen={mobileMenuOpen} onClose={toggleMobileMenu} />}
    </header>;
};