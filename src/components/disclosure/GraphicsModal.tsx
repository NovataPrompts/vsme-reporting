
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { ChartRenderer } from "./ChartRenderer";

interface Chart {
  title: string;
  description: string;
  chartType: string;
  code: string;
  data: any[];
  insights: string[];
  originalColumnOrder?: string[];
}

interface GraphicsModalProps {
  isOpen: boolean;
  onClose: () => void;
  recommendations: {
    hasCharts: boolean;
    charts?: Chart[];
    contextualAnalysis?: string;
    message?: string;
  };
  disclosureTitle: string;
}

export const GraphicsModal = ({ isOpen, onClose, recommendations, disclosureTitle }: GraphicsModalProps) => {
  const [activeChart, setActiveChart] = useState(0);

  // Extract disclosure ID from title (e.g., "B2" from "General Information - Practices, policies...")
  const getDisclosureId = (title: string) => {
    // Look for pattern like "B2", "B3", etc. at start or in title
    const match = title.match(/\b([B][0-9]+)\b/);
    return match ? match[1] : '';
  };

  const disclosureId = getDisclosureId(disclosureTitle);
  const mainTitle = disclosureId ? `${disclosureId} - General Information` : disclosureTitle;

  if (!recommendations.hasCharts) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Recommended Graphics</DialogTitle>
            <p className="text-sm text-muted-foreground">{mainTitle}</p>
          </DialogHeader>
          <div className="mt-4">
            <div className="bg-slate-50 p-4 rounded-lg border">
              <pre className="whitespace-pre-wrap text-sm font-mono">
                {recommendations.message}
              </pre>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const charts = recommendations.charts || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Recommended Graphics</DialogTitle>
          <p className="text-sm text-muted-foreground">{mainTitle}</p>
        </DialogHeader>
        
        <div className="mt-4 space-y-6">
          {/* Contextual Analysis */}
          {recommendations.contextualAnalysis && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">Contextual Analysis</h4>
              <p className="text-blue-800 text-sm">{recommendations.contextualAnalysis}</p>
            </div>
          )}

          {/* Charts Tabs */}
          {charts.length > 0 && (
            <Tabs value={activeChart.toString()} onValueChange={(value) => setActiveChart(parseInt(value))}>
              <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {charts.map((chart, index) => (
                  <TabsTrigger key={index} value={index.toString()}>
                    {chart.title}
                  </TabsTrigger>
                ))}
              </TabsList>

              {charts.map((chart, index) => (
                <TabsContent key={index} value={index.toString()} className="space-y-4">
                  <div className="space-y-6">
                    {/* Chart Visualization */}
                    <div className="bg-white p-6 border rounded-lg">
                      <ChartRenderer
                        chartType={chart.chartType}
                        data={chart.data}
                        title={chart.title}
                        description={chart.description}
                        originalColumnOrder={chart.originalColumnOrder}
                      />
                    </div>

                    {/* Insights */}
                    {chart.insights && chart.insights.length > 0 && (
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <h4 className="font-medium text-green-900 mb-2">Key Insights</h4>
                        <ul className="list-disc list-inside text-sm text-green-800 space-y-1">
                          {chart.insights.map((insight, i) => (
                            <li key={i}>{insight}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
