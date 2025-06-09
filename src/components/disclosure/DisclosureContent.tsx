
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { DisclosureTimestamps } from "./DisclosureTimestamps";
import { Table, ChartBarStacked, ChartPie, ChartBarBig, ChartArea } from "lucide-react";

interface DisclosureContentProps {
  disclosure: { id: string; title: string; description: string };
  response: string;
  isEditing: boolean;
  hasUnsavedChanges: boolean;
  lastGeneratedAt: Date | null;
  lastSavedAt: Date | null;
  graphicsRecommendations: any;
  showGraphicsButton: boolean;
  onResponseChange: (value: string) => void;
  onShowGraphics: () => void;
}

export const DisclosureContent = ({
  disclosure,
  response,
  isEditing,
  hasUnsavedChanges,
  lastGeneratedAt,
  lastSavedAt,
  graphicsRecommendations,
  showGraphicsButton,
  onResponseChange,
  onShowGraphics
}: DisclosureContentProps) => {
  const getGraphicsIcon = (chartType: string) => {
    switch (chartType) {
      case "Table":
        return Table;
      case "StackedBarChart":
        return ChartBarStacked;
      case "PieChart":
        return ChartPie;
      case "BarChart":
        return ChartBarBig;
      case "LineChart":
        return ChartArea;
      default:
        return Table;
    }
  };

  const getGraphicsTypeDisplay = () => {
    if (!graphicsRecommendations || !graphicsRecommendations.hasCharts) {
      return null;
    }

    const charts = graphicsRecommendations.charts || [];
    const chartTypeCounts = charts.reduce((acc: any, chart: any) => {
      const type = chart.chartType;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(chartTypeCounts).map(([type, count]) => {
      const IconComponent = getGraphicsIcon(type);
      const displayName = type === "StackedBarChart" ? "Stacked Bar" : 
                         type === "PieChart" ? "Pie" :
                         type === "BarChart" ? "Bar Chart" :
                         type === "LineChart" ? "Line" : 
                         type;
      
      return (
        <div key={type} className="flex items-center gap-2 text-sm text-muted-foreground">
          <IconComponent className="h-4 w-4" />
          <span>{count as number} {displayName} Recommended</span>
        </div>
      );
    });
  };

  const getRecommendationSummary = () => {
    if (disclosure.id === "B2") {
      return "Our recommendation is one table";
    } else if (disclosure.id === "B3") {
      return "Our recommendation includes energy consumption charts";
    }
    return "Graphics recommendations available";
  };

  return (
    <div className="space-y-4">
      <div>
        <Textarea 
          placeholder={`Enter or generate disclosure response for ${disclosure.title}...`}
          value={response}
          onChange={(e) => onResponseChange(e.target.value)}
          className="min-h-[200px] resize-y"
          readOnly={!isEditing && response !== ""}
        />
        {hasUnsavedChanges && response && (
          <p className="text-sm text-red-600 mt-2">
            You have unsaved changes. Click "Save" to preserve your work.
          </p>
        )}
        
        {/* Graphics Recommendations Section */}
        {showGraphicsButton && graphicsRecommendations && (
          <div className="mt-4 p-3 bg-slate-50 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={onShowGraphics}
                  className="flex items-center gap-2"
                >
                  <Table className="h-4 w-4" />
                  Recommended Graphics
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              For {disclosure.id} - {getRecommendationSummary()}
            </p>
            <div className="flex flex-wrap gap-4">
              {getGraphicsTypeDisplay()}
            </div>
          </div>
        )}
        
        <DisclosureTimestamps
          lastGeneratedAt={lastGeneratedAt}
          lastSavedAt={lastSavedAt}
          hasUnsavedChanges={hasUnsavedChanges}
        />
      </div>
    </div>
  );
};
