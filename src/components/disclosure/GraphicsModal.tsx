
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { ChartRenderer } from "./ChartRenderer";
import { BarChart3, PieChart, Table } from "lucide-react";

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

  // Function to get the appropriate icon and count for chart types
  const getChartIcon = (chartType: string) => {
    switch (chartType.toLowerCase()) {
      case 'table':
        return <Table className="h-4 w-4" />;
      case 'piechart':
        return <PieChart className="h-4 w-4" />;
      case 'barchart':
      case 'stackedbarchart':
        return <BarChart3 className="h-4 w-4" />;
      default:
        return <BarChart3 className="h-4 w-4" />;
    }
  };

  // Function to get chart type counts and generate labels
  const getChartLabels = (charts: Chart[]) => {
    const typeCounts: { [key: string]: number } = {};
    
    return charts.map((chart, index) => {
      const chartType = chart.chartType.toLowerCase();
      typeCounts[chartType] = (typeCounts[chartType] || 0) + 1;
      
      return {
        icon: getChartIcon(chart.chartType),
        label: typeCounts[chartType] > 1 ? `${typeCounts[chartType]}` : '',
        index
      };
    });
  };

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
  const chartLabels = getChartLabels(charts);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Recommended Graphics</DialogTitle>
          <p className="text-sm text-muted-foreground">{mainTitle}</p>
        </DialogHeader>
        
        <div className="mt-4 space-y-6">
          {/* Charts Tabs */}
          {charts.length > 0 && (
            <Tabs value={activeChart.toString()} onValueChange={(value) => setActiveChart(parseInt(value))}>
              <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {charts.map((chart, index) => (
                  <TabsTrigger key={index} value={index.toString()} className="flex items-center gap-2">
                    {getChartIcon(chart.chartType)}
                    {chartLabels[index].label && (
                      <span className="text-xs">{chartLabels[index].label}</span>
                    )}
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

                    {/* Combined Contextual Analysis and Insights */}
                    {(recommendations.contextualAnalysis || (charts.length > 0 && charts[activeChart]?.insights)) && (
                      <div className="p-4 rounded-lg border" style={{ backgroundColor: '#aed6f1', color: '#1e40af' }}>
                        {recommendations.contextualAnalysis && (
                          <>
                            <h4 className="font-semibold mb-2">Contextual Analysis</h4>
                            <p className="text-sm mb-4">{recommendations.contextualAnalysis}</p>
                          </>
                        )}
                        
                        {charts.length > 0 && charts[activeChart]?.insights && charts[activeChart].insights.length > 0 && (
                          <>
                            <h4 className="font-medium mb-2">Key Insights</h4>
                            <ul className="list-disc list-inside text-sm space-y-1">
                              {charts[activeChart].insights.map((insight, i) => (
                                <li key={i}>{insight}</li>
                              ))}
                            </ul>
                          </>
                        )}
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
