
import { ChevronDown, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from "@/components/ui/table";
import { VSMEMetric } from "@/types/vsmeMetrics";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible";
import { useState } from "react";

interface VSMEMetricsTableProps {
  metrics: VSMEMetric[];
  onLearnMore: (metricReference: string) => void;
  onSaveMetric: (metricReference: string) => void;
}

export const VSMEMetricsTable = ({
  metrics,
  onLearnMore,
  onSaveMetric,
}: VSMEMetricsTableProps) => {
  const [openMetric, setOpenMetric] = useState<string | null>(null);

  const toggleMetric = (metricRef: string) => {
    setOpenMetric(openMetric === metricRef ? null : metricRef);
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-24">Module</TableHead>
            <TableHead className="w-24">Disclosure</TableHead>
            <TableHead className="w-32">Topic</TableHead>
            <TableHead className="w-48">Section</TableHead>
            <TableHead className="w-48">Sub-Section</TableHead>
            <TableHead className="w-32">Reference</TableHead>
            <TableHead>Metric</TableHead>
            <TableHead className="w-36 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {metrics.length > 0 ? (
            metrics.map((metric, index) => (
              <React.Fragment key={`${metric.reference}-${index}`}>
                <TableRow className="hover:bg-muted/50">
                  <TableCell>{metric.module}</TableCell>
                  <TableCell>{metric.disclosure}</TableCell>
                  <TableCell>{metric.topic}</TableCell>
                  <TableCell>{metric.section}</TableCell>
                  <TableCell>{metric.subSection}</TableCell>
                  <TableCell>{metric.reference}</TableCell>
                  <TableCell>{metric.metric}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => onLearnMore(metric.reference)}
                      >
                        <Info className="h-4 w-4" />
                        <span className="sr-only">Learn More</span>
                      </Button>
                      <Collapsible 
                        open={openMetric === metric.reference}
                        onOpenChange={() => toggleMetric(metric.reference)}
                      >
                        <CollapsibleTrigger asChild>
                          <Button 
                            size="sm"
                            className="h-8 w-8 p-0 bg-accent hover:bg-accent/90 text-primary"
                          >
                            <ChevronDown className="h-4 w-4" />
                            <span className="sr-only">View Details</span>
                          </Button>
                        </CollapsibleTrigger>
                      </Collapsible>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={8} className="p-0 border-0">
                    <Collapsible open={openMetric === metric.reference}>
                      <CollapsibleContent>
                        <div className="bg-muted/30 p-4 mx-4 mb-4 rounded-md border border-border">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium mb-1">Novata Metric Reference:</p>
                              <p className="text-sm text-muted-foreground mb-3">N/A</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium mb-1">VSME Metric Reference:</p>
                              <p className="text-sm text-muted-foreground mb-3">{metric.reference}</p>
                            </div>
                            <div className="col-span-2">
                              <p className="text-sm font-medium mb-1">Definition:</p>
                              <p className="text-sm text-muted-foreground mb-3">
                                Detailed explanation of the {metric.metric} metric
                              </p>
                            </div>
                            <div className="col-span-2">
                              <p className="text-sm font-medium mb-1">Question:</p>
                              <p className="text-sm text-muted-foreground mb-3">
                                What is your organization's {metric.metric.toLowerCase()}?
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium mb-1">Input Type:</p>
                              <p className="text-sm text-muted-foreground mb-3">Numeric</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium mb-1">Unit:</p>
                              <p className="text-sm text-muted-foreground mb-3">
                                {metric.topic.includes("General") ? "N/A" : 
                                 metric.topic.includes("Environment") ? "Tonnes CO2e" : 
                                 metric.topic.includes("Social") ? "Count" : "EUR"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium mb-1">Response:</p>
                              <p className="text-sm text-muted-foreground mb-3">Not provided</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium mb-1">Formatted Response:</p>
                              <p className="text-sm text-muted-foreground mb-3">Not available</p>
                            </div>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                No metrics found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
