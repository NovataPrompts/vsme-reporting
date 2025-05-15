
import { NavLink } from "react-router-dom";
import { Home, LayoutDashboard, BookMarked, ListTodo } from "lucide-react";
import { cn } from "@/lib/utils";

export const QuickNav = () => {
  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
      <div className="flex items-center gap-4 bg-[#077bc0]/90 backdrop-blur-sm py-3 px-6 rounded-full shadow-lg border border-white/10">
        <NavLink 
          to="/" 
          className={({ isActive }) => cn(
            "p-2 rounded-full transition-all duration-200 hover:bg-white/20", 
            isActive ? "bg-white/20 text-white" : "text-white/80"
          )}
        >
          <Home className="w-5 h-5" />
          <span className="sr-only">Home</span>
        </NavLink>
        
        <NavLink 
          to="/welcome" 
          className={({ isActive }) => cn(
            "p-2 rounded-full transition-all duration-200 hover:bg-white/20", 
            isActive ? "bg-white/20 text-white" : "text-white/80"
          )}
        >
          <ListTodo className="w-5 h-5" />
          <span className="sr-only">Get Started</span>
        </NavLink>
        
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => cn(
            "p-2 rounded-full transition-all duration-200 hover:bg-white/20", 
            isActive ? "bg-white/20 text-white" : "text-white/80"
          )}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="sr-only">Dashboard</span>
        </NavLink>
        
        <NavLink 
          to="/standards" 
          className={({ isActive }) => cn(
            "p-2 rounded-full transition-all duration-200 hover:bg-white/20", 
            isActive ? "bg-white/20 text-white" : "text-white/80"
          )}
        >
          <BookMarked className="w-5 h-5" />
          <span className="sr-only">VSME Standard</span>
        </NavLink>
      </div>
    </div>
  );
};
