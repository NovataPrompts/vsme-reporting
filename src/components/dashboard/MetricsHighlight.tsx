
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

export const MetricsHighlight = () => {
  // Updated emissions data with scope 1, 2, and 3
  const emissionsData = [
    { month: 'Jan', scope1: 80, scope2: 120, scope3: 240 },
    { month: 'Feb', scope1: 90, scope2: 140, scope3: 270 },
    { month: 'Mar', scope1: 85, scope2: 130, scope3: 255 },
    { month: 'Apr', scope1: 70, scope2: 110, scope3: 280 },
    { month: 'May', scope1: 75, scope2: 125, scope3: 290 },
    { month: 'Jun', scope1: 65, scope2: 115, scope3: 260 },
  ];

  // Donut chart data for emissions by scope
  const scopeData = [
    { name: 'Scope 1', value: 465 },
    { name: 'Scope 2', value: 740 },
    { name: 'Scope 3', value: 1595 },
  ];

  const COLORS = ['#00f5f3', '#d8f225', '#00344d'];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-white dark:bg-gray-800 shadow-md rounded-md border border-gray-200 dark:border-gray-700">
          <p className="font-medium">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>{`${entry.name}: ${entry.value} tons`}</p>
          ))}
        </div>
      );
    }
    return null;
  };

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="shadow-sm glass-card">
        <CardHeader className="pb-0">
          <CardTitle className="text-lg font-medium">GHG Emissions by Scope</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={emissionsData} margin={{ top: 20, right: 20, left: -20, bottom: 5 }}>
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="scope1" name="Scope 1" fill="#00f5f3" radius={[4, 4, 0, 0]} stackId="a" />
                <Bar dataKey="scope2" name="Scope 2" fill="#d8f225" radius={[4, 4, 0, 0]} stackId="a" />
                <Bar dataKey="scope3" name="Scope 3" fill="#00344d" radius={[4, 4, 0, 0]} stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm glass-card">
        <CardHeader className="pb-0">
          <CardTitle className="text-lg font-medium">Emissions Distribution</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  );
};
