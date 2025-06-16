
import { ChevronRight } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Breadcrumb, 
  BreadcrumbList, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";

const breadcrumbSteps = [
  { label: "Sync Data", path: "/import", key: "sync" },
  { label: "View Metrics", path: "/metrics", key: "metrics" },
  { label: "Prepare Disclosure", path: "/disclosure", key: "disclosure" },
  { label: "Draft", path: "/draft", key: "draft" },
  { label: "Generate Report", path: "/reports", key: "reports" }
];

export const ReportBreadcrumb = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getCurrentStepIndex = () => {
    // For HashRouter, check both pathname and hash
    let currentPath = location.pathname;
    
    // If there's a hash that starts with #/, use that as the path
    if (location.hash && location.hash.startsWith('#/')) {
      currentPath = location.hash.substring(1);
    }
    
    // Clean any query parameters
    currentPath = currentPath.split('?')[0];
    
    console.log('Current path for breadcrumb:', currentPath);
    console.log('Location object:', location);
    console.log('Available breadcrumb paths:', breadcrumbSteps.map(s => s.path));
    
    return breadcrumbSteps.findIndex(step => step.path === currentPath);
  };

  const currentStepIndex = getCurrentStepIndex();
  console.log('Current step index:', currentStepIndex);

  const handleStepClick = (path: string, event: React.MouseEvent) => {
    event.preventDefault();
    navigate(path);
  };

  // Show breadcrumb for all defined workflow steps
  if (currentStepIndex === -1) {
    return null;
  }

  return (
    <div className="mb-6">
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbSteps.map((step, index) => {
            const isActive = index === currentStepIndex;
            
            return (
              <div key={step.key} className="flex items-center">
                <BreadcrumbItem>
                  {isActive ? (
                    <BreadcrumbPage className="font-semibold text-primary">
                      {step.label}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink
                      onClick={(e) => handleStepClick(step.path, e)}
                      className="cursor-pointer hover:text-primary transition-colors"
                    >
                      {step.label}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {index < breadcrumbSteps.length - 1 && (
                  <BreadcrumbSeparator>
                    <ChevronRight className="h-4 w-4" />
                  </BreadcrumbSeparator>
                )}
              </div>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};
