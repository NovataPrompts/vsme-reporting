
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { VSMEMetric } from "@/types/vsmeMetrics";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
interface VSMEMetricsTableProps {
  metrics: VSMEMetric[];
  onLearnMore: (metricReference: string) => void;
  onSaveMetric: (metricReference: string) => void;
}
export const VSMEMetricsTable = ({
  metrics,
  onLearnMore,
  onSaveMetric
}: VSMEMetricsTableProps) => {
  const [openMetric, setOpenMetric] = useState<string | null>(null);
  const toggleMetric = (metricRef: string) => {
    setOpenMetric(openMetric === metricRef ? null : metricRef);
  };
  return <div className="overflow-x-auto">
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
          {metrics.length > 0 ? metrics.map((metric, index) => <React.Fragment key={`${metric.reference}-${index}`}>
                <TableRow className="hover:bg-muted/50">
                  <TableCell>{metric.module}</TableCell>
                  <TableCell>{metric.disclosure}</TableCell>
                  <TableCell>{metric.topic}</TableCell>
                  <TableCell>{metric.section}</TableCell>
                  <TableCell>{metric.subSection}</TableCell>
                  <TableCell>{metric.reference}</TableCell>
                  <TableCell>{metric.metric}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end">
                      <Collapsible open={openMetric === metric.reference} onOpenChange={() => toggleMetric(metric.reference)}>
                        <CollapsibleTrigger asChild>
                          <Button size="sm" className="h-8 w-8 p-0 bg-[#057cc1] hover:bg-[#057cc1]/90 text-white">
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
                        <div className="p-4 mx-4 mb-4 rounded-md bg-[ffffff] bg-slate-200">
                          {/* Add metric name as title */}
                          <h3 className="text-lg font-semibold mb-3 text-[#057cc1]">{metric.metric}</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium mb-1 text-[#00344d]">Novata Metric Reference:</p>
                              <p className="text-sm text-[#00344d] mb-3 bg-white p-2 rounded">N/A</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium mb-1 text-[#00344d]">VSME Metric Reference:</p>
                              <p className="text-sm text-[#00344d] mb-3 bg-white p-2 rounded">{metric.reference}</p>
                            </div>
                            <div className="col-span-2">
                              <p className="text-sm font-medium mb-1 text-[#00344d]">Definition:</p>
                              <p className="text-sm text-[#00344d] mb-3 bg-white p-2 rounded">
                                Detailed explanation of the {metric.metric} metric
                              </p>
                            </div>
                            <div className="col-span-2">
                              <p className="text-sm font-medium mb-1 text-[#00344d]">Question:</p>
                              <p className="text-sm text-[#00344d] mb-3 bg-white p-2 rounded">
                                What is your organization's {metric.metric.toLowerCase()}?
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium mb-1 text-[#00344d]">Input Type:</p>
                              <p className="text-sm text-[#00344d] mb-3 bg-white p-2 rounded">Numeric</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium mb-1 text-[#00344d]">Unit:</p>
                              <p className="text-sm text-[#00344d] mb-3 bg-white p-2 rounded">
                                {metric.topic.includes("General") ? "N/A" : metric.topic.includes("Environment") ? "Tonnes CO2e" : metric.topic.includes("Social") ? "Count" : "EUR"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium mb-1 text-[#00344d]">Response:</p>
                              <p className="text-sm text-[#00344d] mb-3 bg-white p-2 rounded">Not provided</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium mb-1 text-[#00344d]">Formatted Response:</p>
                              <p className="text-sm text-[#00344d] mb-3 bg-white p-2 rounded">Not available</p>
                            </div>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </TableCell>
                </TableRow>
              </React.Fragment>) : <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                No metrics found
              </TableCell>
            </TableRow>}
        </TableBody>
      </Table>
    </div>;
};
