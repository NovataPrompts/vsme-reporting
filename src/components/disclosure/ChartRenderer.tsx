
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, X } from "lucide-react";

interface ChartRendererProps {
  chartType: string;
  data: any[];
  title: string;
  description: string;
}

export const ChartRenderer = ({ chartType, data, title, description }: ChartRendererProps) => {
  if (chartType === "Table") {
    return (
      <div className="w-full">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="overflow-auto max-h-[400px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Practice/Policy Area</TableHead>
                <TableHead className="text-center">Implementation Status</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {item.practice || item.area || item.category || item.name || `Item ${index + 1}`}
                  </TableCell>
                  <TableCell className="text-center">
                    {(item.implemented === 'Yes' || item.status === 'Implemented' || item.implemented === true) ? (
                      <Check className="h-5 w-5 text-green-600 mx-auto" />
                    ) : (
                      <X className="h-5 w-5 text-red-600 mx-auto" />
                    )}
                  </TableCell>
                  <TableCell>
                    {item.details || item.description || item.notes || 'No additional details'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  if (chartType === "StackedBarChart") {
    // Process data for stacked bar chart
    const chartData = [{ name: 'Energy Consumption' }];
    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088aa', '#00C49F'];
    let totalMWh = 0;

    data.forEach((item, index) => {
      if (item.value > 0) {
        chartData[0][item.category] = item.value;
        totalMWh += item.value;
      }
    });

    return (
      <div className="w-full">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
          <div className="text-center mt-2">
            <span className="text-lg font-semibold">Total Energy Consumption: {totalMWh.toFixed(2)} MWh</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis label={{ value: 'Energy (MWh)', angle: -90, position: 'insideLeft' }} />
            <Tooltip 
              formatter={(value, name) => [`${value} MWh`, name]}
              labelFormatter={() => 'Energy Breakdown'}
            />
            {data.map((item, index) => (
              <Bar 
                key={item.category}
                dataKey={item.category} 
                stackId="energy" 
                fill={colors[index % colors.length]} 
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div className="text-center text-muted-foreground">
      <div className="text-2xl mb-2">📊</div>
      <p className="text-sm">Chart type not supported</p>
    </div>
  );
};
