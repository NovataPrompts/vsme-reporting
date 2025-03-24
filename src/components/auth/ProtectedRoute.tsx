
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { PasswordPage } from "./PasswordPage";
import { QuickNav } from "../navigation/QuickNav";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();
  
  useEffect(() => {
    const authStatus = localStorage.getItem("vsme-auth") === "true";
    console.log("Authentication status:", authStatus);
    setIsAuthenticated(authStatus);
  }, [location.pathname]); // Re-check when pathname changes (like after logout)
  
  // Still checking authentication status
  if (isAuthenticated === null) {
    return null; // or a loading spinner
  }
  
  // If not authenticated, show password page
  if (!isAuthenticated) {
    return <PasswordPage />;
  }
  
  // If authenticated, show the protected content with QuickNav
  return (
    <>
      {children}
      <QuickNav />
    </>
  );
};
