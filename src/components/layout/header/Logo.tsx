
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";

export const Logo = () => {
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  const darkLogoUrl = "/lovable-uploads/b05f0448-8c26-463d-b69b-98061b769e16.png";
  const lightLogoUrl = "/lovable-uploads/dc0ec24e-33a6-4f08-b694-455ce8c649fb.png";
  
  // Determine which logo to use based on theme
  const logoUrl = isDarkMode ? darkLogoUrl : lightLogoUrl;

  // Check current theme and update when it changes
  useEffect(() => {
    const updateTheme = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
    };
    
    // Initial check
    updateTheme();
    
    // Set up mutation observer to detect theme changes
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });
    
    return () => observer.disconnect();
  }, []);

  // Preload the logo image when component mounts or logoUrl changes
  useEffect(() => {
    setLogoLoaded(false);
    const img = new Image();
    img.src = logoUrl;
    img.onload = () => setLogoLoaded(true);
  }, [logoUrl]);

  return (
    <NavLink 
      to="/" 
      className="flex items-center gap-2 text-primary dark:text-white transition-all-ease"
    >
      <img 
        src={logoUrl}
        alt="Novata Logo" 
        className={`h-16 w-auto ${!logoLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
      />
    </NavLink>
  );
};
