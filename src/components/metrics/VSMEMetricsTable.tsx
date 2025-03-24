
import { Info, Save } from "lucide-react";
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
              <TableRow key={`${metric.reference}-${index}`} className="hover:bg-muted/50">
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
                    <Button 
                      size="sm"
                      className="h-8 w-8 p-0 bg-accent hover:bg-accent/90 text-primary"
                      onClick={() => onSaveMetric(metric.reference)}
                    >
                      <Save className="h-4 w-4" />
                      <span className="sr-only">Enter Data</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
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
