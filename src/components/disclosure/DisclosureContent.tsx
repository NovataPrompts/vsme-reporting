
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { DisclosureTimestamps } from "./DisclosureTimestamps";
import { Table, ChartBarStacked, ChartPie, ChartBarBig, ChartArea, Loader2 } from "lucide-react";

interface DisclosureContentProps {
  disclosure: { id: string; title: string; description: string };
  response: string;
  isEditing: boolean;
  hasUnsavedChanges: boolean;
  lastGeneratedAt: Date | null;
  lastSavedAt: Date | null;
  graphicsRecommendations: any;
  showGraphicsButton: boolean;
  isRecommendingGraphics: boolean;
  onResponseChange: (value: string) => void;
  onRecommendGraphics: () => void;
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
  isRecommendingGraphics,
  onResponseChange,
  onRecommendGraphics
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
    if (disclosure.id === "B1") {
      return "No graphics required for this disclosure";
    } else if (disclosure.id === "B2") {
      return "Our recommendation is one table";
    } else if (disclosure.id === "B3") {
      if (graphicsRecommendations && graphicsRecommendations.hasCharts) {
        const charts = graphicsRecommendations.charts || [];
        const tableCount = charts.filter(chart => chart.chartType === "Table").length;
        const barChartCount = charts.filter(chart => chart.chartType === "BarChart").length;
        return `Our recommendation includes ${tableCount} table${tableCount !== 1 ? 's' : ''} and ${barChartCount} bar chart${barChartCount !== 1 ? 's' : ''}`;
      } else {
        return "Our recommendation includes 2 tables and 1 bar chart";
      }
    }
    return "Graphics recommendations available";
  };

  const getDefaultRecommendationDisplay = () => {
    if (disclosure.id === "B1") {
      return null;
    } else if (disclosure.id === "B2") {
      return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Table className="h-4 w-4" />
          <span>1 Table Recommended</span>
        </div>
      );
    } else if (disclosure.id === "B3") {
      return (
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Table className="h-4 w-4" />
            <span>2 Tables Recommended</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ChartBarBig className="h-4 w-4" />
            <span>1 Bar Chart Recommended</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <div>
        <Textarea 
          placeholder={`Enter or generate disclosure response for ${disclosure.title}...`}
          value={response}
          onChange={(e) => onResponseChange(e.target.value)}
          className="min-h-[200px] resize-y border-2 border-[#0088CC] bg-white"
          readOnly={!isEditing && response !== ""}
        />
        {hasUnsavedChanges && response && (
          <p className="text-sm text-red-600 mt-2">
            You have unsaved changes. Click "Save" to preserve your work.
          </p>
        )}
        
        {/* Graphics Recommendations Section */}
        {showGraphicsButton && (
          <div className="mt-4 p-3 bg-slate-50 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={onRecommendGraphics}
                  disabled={isRecommendingGraphics}
                  className="flex items-center gap-2"
                >
                  {isRecommendingGraphics ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Table className="h-4 w-4" />
                  )}
                  {isRecommendingGraphics ? "Analyzing..." : "Recommended Graphics"}
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              For {disclosure.id} - {getRecommendationSummary()}
            </p>
            <div className="flex flex-wrap gap-4">
              {graphicsRecommendations && graphicsRecommendations.hasCharts 
                ? getGraphicsTypeDisplay()
                : getDefaultRecommendationDisplay()
              }
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
