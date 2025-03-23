import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { ArrowUpRight, Users, Gauge, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const CalculatedMetrics = () => {
  const navigate = useNavigate();
  
  const metrics = [
    {
      id: 1,
      title: "Unadjusted Gender Pay Gap",
      value: "23.4%",
      icon: Users
    },
    {
      id: 2,
      title: "GHG Intensity",
      value: "3.2 tCO₂e/M€",
      icon: Gauge
    },
    {
      id: 3,
      title: "Employee Turnover Rate",
      value: "14.8%",
      icon: RotateCcw
    }
  ];

  // Emissions data for the pie chart (simplified, no monthly data)
  const scopeData = [
    { name: 'Scope 1', value: 465 },
    { name: 'Scope 2', value: 740 },
    { name: 'Scope 3', value: 1595 },
  ];

  const COLORS = ['#00f5f3', '#d8f225', '#539db5']; // Updated Scope 3 color to #539db5

  const PieCustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-white dark:bg-gray-800 shadow-md rounded-md border border-gray-200 dark:border-gray-700">
          <p className="font-medium">{`${payload[0].name}: ${payload[0].value} tons (${((payload[0].value / 2800) * 100).toFixed(1)}%)`}</p>
        </div>
      );
    }
    return null;
  };

  // Simplified data for the bar chart (just scopes, no monthly data)
  const emissionsData = [
    { name: 'Scope 1', value: 465 },
    { name: 'Scope 2', value: 740 },
    { name: 'Scope 3', value: 1595 },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-white dark:bg-gray-800 shadow-md rounded-md border border-gray-200 dark:border-gray-700">
          <p className="font-medium">{`${payload[0].name}: ${payload[0].value} tons`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="shadow-sm glass-card relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-accent/10 dark:bg-accent/5 rounded-full blur-2xl"></div>
      <div className="absolute -left-16 -top-16 w-48 h-48 bg-secondary/10 dark:bg-secondary/5 rounded-full blur-2xl"></div>
      
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center justify-between text-white">
          <span>Calculated Metrics</span>
          <span 
            className="text-sm text-accent font-normal flex items-center gap-1 cursor-pointer hover:underline"
            onClick={() => navigate("/metrics")}
          >
            View All
            <ArrowUpRight className="h-3 w-3" />
          </span>
        </CardTitle>
        <CardDescription className="text-base">
          Key sustainability metrics and emissions data for your organization.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* GHG Emissions Chart - Simplified Bar Chart */}
          <div className="bg-white/30 dark:bg-white/5 p-4 rounded-lg border border-gray-100 dark:border-white/10">
            <h3 className="text-lg font-medium mb-2">GHG Emissions by Scope</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={emissionsData} margin={{ top: 20, right: 20, left: -20, bottom: 5 }}>
                  <XAxis dataKey="name" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} fillOpacity={0.9}>
                    {emissionsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Emissions Distribution Chart */}
          <div className="bg-white/30 dark:bg-white/5 p-4 rounded-lg border border-gray-100 dark:border-white/10">
            <h3 className="text-lg font-medium mb-2">Emissions Distribution</h3>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={scopeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {scopeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieCustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Metrics Grid - Simplified without change indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {metrics.map((metric) => (
            <div 
              key={metric.id} 
              className="flex items-center p-4 rounded-lg bg-white/30 dark:bg-white/5 hover:bg-white/50 dark:hover:bg-white/10 transition-all-ease border border-gray-100 dark:border-white/10"
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
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
