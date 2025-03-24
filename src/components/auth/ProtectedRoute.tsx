
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { PasswordPage } from "./PasswordPage";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  useEffect(() => {
    const authStatus = localStorage.getItem("vsme-auth") === "true";
    console.log("Authentication status:", authStatus);
    setIsAuthenticated(authStatus);
  }, []);
  
  // Still checking authentication status
  if (isAuthenticated === null) {
    return null; // or a loading spinner
  }
  
  // If not authenticated, show password page
  if (!isAuthenticated) {
    return <PasswordPage />;
  }
  
  // If authenticated, show the protected content
  return <>{children}</>;
};
