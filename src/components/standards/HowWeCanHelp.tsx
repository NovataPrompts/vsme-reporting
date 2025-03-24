
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const HowWeCanHelp = () => {
  return (
    <Card className="shadow-sm glass-card mt-6">
      <CardHeader>
        <CardTitle>How We Can Help</CardTitle>
        <CardDescription>
          Let us assist you in creating compliant VSME sustainability reports
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm">
          Our platform simplifies the VSME reporting process by providing tools to collect,
          manage, and present your sustainability data in a professional format that meets all standard requirements.
        </p>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center gap-2">
            <div className="h-5 w-5 rounded-full bg-secondary flex items-center justify-center">
              <CheckIcon className="h-3 w-3 text-primary" />
            </div>
            <span>Automated data collection and validation</span>
          </li>
          <li className="flex items-center gap-2">
            <div className="h-5 w-5 rounded-full bg-secondary flex items-center justify-center">
              <CheckIcon className="h-3 w-3 text-primary" />
            </div>
            <span>Compliant report templates and visualizations</span>
          </li>
          <li className="flex items-center gap-2">
            <div className="h-5 w-5 rounded-full bg-secondary flex items-center justify-center">
              <CheckIcon className="h-3 w-3 text-primary" />
            </div>
            <span>Secure data sharing with stakeholders</span>
          </li>
          <li className="flex items-center gap-2">
            <div className="h-5 w-5 rounded-full bg-secondary flex items-center justify-center">
              <CheckIcon className="h-3 w-3 text-primary" />
            </div>
            <span>Year-over-year performance tracking</span>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
};

const CheckIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="3" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
