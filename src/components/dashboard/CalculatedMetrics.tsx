
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, Users, Gauge, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const CalculatedMetrics = () => {
  const navigate = useNavigate();
  
  const metrics = [
    {
      id: 1,
      title: "Unadjusted Gender Pay Gap",
      value: "23.4%",
      change: "+2.1%",
      trend: "negative",
      icon: Users
    },
    {
      id: 2,
      title: "GHG Intensity",
      value: "3.2 tCO₂e/M€",
      change: "-5.7%", 
      trend: "positive",
      icon: Gauge
    },
    {
      id: 3,
      title: "Employee Turnover Rate",
      value: "14.8%",
      change: "-1.2%",
      trend: "positive",
      icon: RotateCcw
    }
  ];

  return (
    <Card className="shadow-sm glass-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center justify-between">
          <span>Calculated Metrics</span>
          <span 
            className="text-sm text-accent font-normal flex items-center gap-1 cursor-pointer hover:underline"
            onClick={() => navigate("/metrics")}
          >
            View All
            <ArrowUpRight className="h-3 w-3" />
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          {metrics.map((metric) => (
            <div 
              key={metric.id} 
              className="flex items-center justify-between p-3 rounded-lg bg-white/30 dark:bg-white/5 hover:bg-white/50 dark:hover:bg-white/10 transition-all-ease border border-gray-100 dark:border-white/10"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 dark:bg-white/10 flex items-center justify-center">
                  <metric.icon className="h-5 w-5 text-primary dark:text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium">{metric.title}</p>
                  <p className="text-xl font-semibold">{metric.value}</p>
                </div>
              </div>
              <div className={`text-sm font-medium ${metric.trend === 'positive' ? 'text-green-500' : 'text-red-500'}`}>
                {metric.change}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
