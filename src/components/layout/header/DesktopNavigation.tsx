
import { NavLink } from "react-router-dom";

export const DesktopNavigation = () => {
  return (
    <nav className="hidden md:flex items-center space-x-1">
      <NavLink 
        to="/welcome" 
        className={({ isActive }) => `px-4 py-2 rounded-md transition-all-ease ${
          isActive 
            ? "text-secondary font-medium" 
            : "text-primary/80 dark:text-white/80 hover:text-primary dark:hover:text-white"
        }`}
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
    </nav>
  );
};
