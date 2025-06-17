
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";

export const Logo = () => {
  const [logoLoaded, setLogoLoaded] = useState(false);
  const logoUrl = "./lovable-uploads/dc0ec24e-33a6-4f08-b694-455ce8c649fb.png";

  // Preload the logo image when component mounts
  useEffect(() => {
    setLogoLoaded(false);
    const img = new Image();
    img.src = logoUrl;
    img.onload = () => setLogoLoaded(true);
  }, [logoUrl]);

  return (
    <NavLink 
      to="/" 
      className="flex items-center gap-2 text-primary transition-all-ease"
    >
      <img 
        src={logoUrl}
        alt="Novata Logo" 
        className={`h-12 w-auto ${!logoLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
      />
    </NavLink>
  );
};
