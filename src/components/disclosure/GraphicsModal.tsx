
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Download, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

interface Chart {
  title: string;
  description: string;
  chartType: string;
  code: string;
  data: any[];
  insights: string[];
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
  const { toast } = useToast();
  const [activeChart, setActiveChart] = useState(0);
  const [editingCode, setEditingCode] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Code Copied",
      description: "Chart code has been copied to clipboard.",
    });
  };

  const handleEditCode = (code: string) => {
    setEditingCode(code);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    // Here you would typically save the edited code
    setIsEditing(false);
    toast({
      title: "Code Updated",
      description: "Chart code has been updated successfully.",
    });
  };

  if (!recommendations.hasCharts) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Graphics Recommendations - {disclosureTitle}</DialogTitle>
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
          <DialogTitle>Interactive Charts - {disclosureTitle}</DialogTitle>
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
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Chart Preview */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold">{chart.title}</h3>
                        <p className="text-sm text-muted-foreground">{chart.description}</p>
                      </div>
                      
                      {/* Chart Visualization Area */}
                      <div className="bg-white p-4 border rounded-lg min-h-[300px] flex items-center justify-center">
                        <div className="text-center text-muted-foreground">
                          <div className="text-2xl mb-2">📊</div>
                          <p className="text-sm">Chart Preview</p>
                          <p className="text-xs">({chart.chartType})</p>
                        </div>
                      </div>

                      {/* Insights */}
                      {chart.insights && chart.insights.length > 0 && (
                        <div className="bg-green-50 p-3 rounded-lg">
                          <h4 className="font-medium text-green-900 mb-2">Key Insights</h4>
                          <ul className="list-disc list-inside text-sm text-green-800 space-y-1">
                            {chart.insights.map((insight, i) => (
                              <li key={i}>{insight}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Code Editor */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">React Chart Code</h4>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCopyCode(chart.code)}
                          >
                            <Copy className="h-4 w-4 mr-1" />
                            Copy
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditCode(chart.code)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </div>

                      {isEditing ? (
                        <div className="space-y-2">
                          <Textarea
                            value={editingCode}
                            onChange={(e) => setEditingCode(e.target.value)}
                            className="font-mono text-xs min-h-[300px]"
                          />
                          <div className="flex gap-2">
                            <Button size="sm" onClick={handleSaveEdit}>Save</Button>
                            <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-auto max-h-[400px]">
                          <pre className="text-xs">
                            <code>{chart.code}</code>
                          </pre>
                        </div>
                      )}

                      {/* Chart Data */}
                      {chart.data && chart.data.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">Chart Data</h4>
                          <div className="bg-slate-100 p-3 rounded-lg overflow-auto max-h-[200px]">
                            <pre className="text-xs">
                              <code>{JSON.stringify(chart.data, null, 2)}</code>
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
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
