
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
    // Clean the pathname by removing hash and query parameters
    const currentPath = location.pathname.split('?')[0].split('#')[0];
    console.log('Current cleaned path:', currentPath);
    return breadcrumbSteps.findIndex(step => step.path === currentPath);
  };

  const currentStepIndex = getCurrentStepIndex();

  const handleStepClick = (path: string, event: React.MouseEvent) => {
    event.preventDefault();
    // Navigate without replace to maintain normal navigation behavior
    navigate(path);
  };

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
