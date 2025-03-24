
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";

export const Logo = () => {
  const [logoLoaded, setLogoLoaded] = useState(false);
  const logoUrl = "/lovable-uploads/b05f0448-8c26-463d-b69b-98061b769e16.png";

  // Preload the logo image when component mounts
  useEffect(() => {
    const img = new Image();
    img.src = logoUrl;
    img.onload = () => setLogoLoaded(true);
  }, []);

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
