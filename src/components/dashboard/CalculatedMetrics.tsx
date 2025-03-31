import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { ArrowUpRight, Users, Gauge, RotateCcw, AlertTriangle, UserSquare2, PersonStanding, Calculator } from "lucide-react";
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
    },
    {
      id: 4,
      title: "Work-Related Accidents Rate",
      value: "2.1%",
      icon: AlertTriangle
    },
    {
      id: 5,
      title: "Diversity Ratio",
      value: "3:1 (75%)",
      icon: PersonStanding
    },
    {
      id: 6,
      title: "Board Gender Ratio (M:F)",
      value: "7:3 (70%:30%)",
      icon: UserSquare2
    }
  ];

  const scopeData = [
    { name: 'Scope 1', value: 465 },
    { name: 'Scope 2', value: 740 },
    { name: 'Scope 3', value: 1595 },
  ];

  const COLORS = ['#00f5f3', '#d8f225', '#539db5'];

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

  const handleMetricClick = () => {
    navigate("/metrics/calculated");
  };

  return (
    <Card className="shadow-sm glass-card relative overflow-hidden">
      <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-accent/10 dark:bg-accent/5 rounded-full blur-2xl"></div>
      <div className="absolute -left-16 -top-16 w-48 h-48 bg-secondary/10 dark:bg-secondary/5 rounded-full blur-2xl"></div>
      
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center justify-between text-[#008099] dark:text-white">
          <span>Calculated Metrics</span>
          <span 
            className="text-sm text-accent font-normal flex items-center gap-1 cursor-pointer hover:underline"
            onClick={() => navigate("/metrics/calculated")}
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
          <div className="chart-container">
            <h3 className="text-lg font-medium mb-2 text-[#008099] dark:text-white">GHG Emissions by Scope</h3>
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

          <div className="chart-container">
            <h3 className="text-lg font-medium mb-2 text-[#008099] dark:text-white">Emissions Distribution</h3>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {metrics.map((metric) => (
            <div 
              key={metric.id} 
              className="group metric-card flex items-center p-5 bg-[#e3ecec] dark:bg-white/5 border border-[#008099]/30 dark:border-white/20 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:!bg-white hover:!text-[#00344d] h-28 relative"
            >
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 flex items-center justify-center rounded-full bg-[#e3ecec] dark:bg-white/10 border border-[#008099]/30 dark:border-white/20 group-hover:bg-[#d8f225] group-hover:border-[#d8f225] transition-colors duration-300">
                  <metric.icon className="h-6 w-6 text-[#008099] dark:text-white group-hover:text-[#00344d] transition-colors duration-300" />
                </div>
                <div>
                  <p className="text-xl font-medium text-[#00344d] dark:text-white/80 group-hover:text-[#00344d]">{metric.title}</p>
                  <p className="text-2xl font-semibold text-[#008099] dark:text-white mt-1 group-hover:text-[#00344d]">{metric.value}</p>
                </div>
              </div>
              
              <div className="absolute bottom-3 right-3">
                <div 
                  className="p-1.5 rounded-full bg-white/80 dark:bg-gray-800/80 hover:bg-[#d8f225] cursor-pointer transition-colors duration-300 flex items-center justify-center"
                  onClick={handleMetricClick}
                  title="Calculate"
                >
                  <Calculator className="h-3.5 w-3.5 text-[#008099] dark:text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
