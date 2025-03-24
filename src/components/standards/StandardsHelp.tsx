
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface StandardsHelpProps {
  onLearnMore: (topic: string) => void;
}

export const StandardsHelp = ({ onLearnMore }: StandardsHelpProps) => {
  return (
    <Card className="shadow-sm mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Need Help?</CardTitle>
        <CardDescription>
          Learn more about VSME sustainability metrics and how to report them.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button 
            variant="outline" 
            className="w-full justify-between"
            onClick={() => onLearnMore("VSME Documentation")}
          >
            <span>VSME Documentation</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-between"
            onClick={() => onLearnMore("Metrics Guide")}
          >
            <span>Metrics Guide</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-between"
            onClick={() => onLearnMore("Data Collection Tips")}
          >
            <span>Data Collection Tips</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
