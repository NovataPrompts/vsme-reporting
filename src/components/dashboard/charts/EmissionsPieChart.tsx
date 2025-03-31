
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

interface EmissionsPieChartProps {
  scopeData: { name: string; value: number }[];
  colors: string[];
}

interface PieCustomTooltipProps {
  active?: boolean;
  payload?: any[];
}

const PieCustomTooltip = ({ active, payload }: PieCustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-white dark:bg-gray-800 shadow-md rounded-md border border-gray-200 dark:border-gray-700">
        <p className="font-medium">{`${payload[0].name}: ${payload[0].value} tons (${((payload[0].value / 2800) * 100).toFixed(1)}%)`}</p>
      </div>
    );
  }
  return null;
};

export const EmissionsPieChart = ({ scopeData, colors }: EmissionsPieChartProps) => {
  return (
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
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip content={<PieCustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
