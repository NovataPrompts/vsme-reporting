
import { NavLink } from "react-router-dom";

export const Logo = () => {
  return (
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
  );
};
