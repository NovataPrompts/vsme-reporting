
import React, { useState } from "react";
import { ChevronDown, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { VSMEMetric } from "@/types/vsmeMetrics";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { UserResponseDialog } from "./UserResponseDialog";

interface VSMEMetricsTableProps {
  metrics: VSMEMetric[];
}

export const VSMEMetricsTable = ({ metrics }: VSMEMetricsTableProps) => {
  const [openMetric, setOpenMetric] = useState<string | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<VSMEMetric | null>(null);
  const [selectedMetricId, setSelectedMetricId] = useState<string | null>(null);
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false);
  
  const toggleMetric = (metricRef: string) => {
    setOpenMetric(openMetric === metricRef ? null : metricRef);
  };

  const handleViewResponse = (metric: VSMEMetric) => {
    setSelectedMetric(metric);
    setSelectedMetricId(metric.id);
    setIsResponseDialogOpen(true);
  };
  
  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">Module</TableHead>
              <TableHead className="w-24">Disclosure</TableHead>
              <TableHead className="w-32">Topic</TableHead>
              <TableHead className="w-48">Section</TableHead>
              <TableHead className="w-40">Sub-Section</TableHead>
              <TableHead className="w-32">Reference</TableHead>
              <TableHead>Metric</TableHead>
              <TableHead className="w-20 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {metrics.length > 0 ? (
              metrics.map((metric, index) => (
                <React.Fragment key={metric.id || `${metric.reference}-${index}`}>
                  <TableRow className="hover:bg-muted/50">
                    <TableCell>{metric.module}</TableCell>
                    <TableCell>{metric.disclosure}</TableCell>
                    <TableCell>{metric.topic.replace("Enviornment", "Environment")}</TableCell>
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
                          <div className="p-4 mx-4 mb-4 rounded-md bg-[ffffff] bg-slate-50 shadow-sm border border-slate-200">
                            <h3 className="text-lg font-semibold mb-3 text-[#057cc1]">{metric.metric}</h3>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm font-medium mb-1 text-[#00344d]">Novata Metric Reference:</p>
                                <p className="text-sm text-[#00344d] mb-3">
                                  {metric.novataReference || "N/A"}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-medium mb-1 text-[#00344d]">VSME Metric Reference:</p>
                                <p className="text-sm text-[#00344d] mb-3">
                                  {metric.reference}
                                </p>
                              </div>
                              <div className="col-span-2">
                                <p className="text-sm font-medium mb-1 text-[#00344d]">Definition:</p>
                                <p className="text-sm text-[#00344d] mb-3">
                                  {metric.definition || "No definition provided"}
                                </p>
                              </div>
                              <div className="col-span-2">
                                <p className="text-sm font-medium mb-1 text-[#00344d]">Question:</p>
                                <p className="text-sm text-[#00344d] mb-3 whitespace-pre-line">
                                  {metric.question || "No question provided"}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-medium mb-1 text-[#00344d]">Input Type:</p>
                                <p className="text-sm text-[#00344d] mb-3">
                                  {metric.inputType || "Not specified"}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-medium mb-1 text-[#00344d]">Unit:</p>
                                <p className="text-sm text-[#00344d] mb-3">
                                  {metric.unit || "N/A"}
                                </p>
                              </div>
                              <div className="col-span-2 mt-2">
                                <Button 
                                  className="bg-[#057cc1] hover:bg-[#057cc1]/90 text-white flex items-center gap-2"
                                  onClick={() => handleViewResponse(metric)}
                                >
                                  <Eye className="h-4 w-4" />
                                  View Response
                                </Button>
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

      <UserResponseDialog
        isOpen={isResponseDialogOpen}
        onClose={() => setIsResponseDialogOpen(false)}
        metric={selectedMetric}
        metricId={selectedMetricId}
      />
    </>
  );
};
