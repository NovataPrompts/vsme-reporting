
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export const MetricsHighlight = () => {
  const emissionsData = [
    { month: 'Jan', value: 240 },
    { month: 'Feb', value: 300 },
    { month: 'Mar', value: 270 },
    { month: 'Apr', value: 260 },
    { month: 'May', value: 290 },
    { month: 'Jun', value: 240 },
  ];

  const resourceData = [
    { name: 'Water', value: 35 },
    { name: 'Electricity', value: 40 },
    { name: 'Materials', value: 25 },
  ];

  const COLORS = ['#00f5f3', '#d8f225', '#00344d'];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-white dark:bg-gray-800 shadow-md rounded-md border border-gray-200 dark:border-gray-700">
          <p className="font-medium">{`${label}: ${payload[0].value} tons`}</p>
        </div>
      );
    }
    return null;
  };

  const PieCustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-white dark:bg-gray-800 shadow-md rounded-md border border-gray-200 dark:border-gray-700">
          <p className="font-medium">{`${payload[0].name}: ${payload[0].value}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="shadow-sm glass-card">
        <CardHeader className="pb-0">
          <CardTitle className="text-lg font-medium">Carbon Emissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={emissionsData} margin={{ top: 20, right: 20, left: -20, bottom: 5 }}>
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#00f5f3" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm glass-card">
        <CardHeader className="pb-0">
          <CardTitle className="text-lg font-medium">Resource Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={resourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {resourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<PieCustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
