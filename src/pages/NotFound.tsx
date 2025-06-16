
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { ReportBreadcrumb } from "@/components/navigation/ReportBreadcrumb";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-12 flex items-center justify-center">
        <div className="container mx-auto px-4 md:px-6">
          <ReportBreadcrumb />
          
          <div className="text-center max-w-md mx-auto px-4">
            <div className="text-accent text-8xl font-bold mb-4 animate-float">404</div>
            <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              The page you're looking for doesn't exist or has been moved.
            </p>
            <Button
              onClick={() => navigate("/")}
              className="bg-primary hover:bg-primary/90 text-white rounded-full flex items-center gap-2 mx-auto"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Return to Dashboard</span>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
