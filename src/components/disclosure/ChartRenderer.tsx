
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, X } from "lucide-react";

interface ChartRendererProps {
  chartType: string;
  data: any[];
  title: string;
  description: string;
  originalColumnOrder?: string[];
}

export const ChartRenderer = ({ chartType, data, title, description, originalColumnOrder }: ChartRendererProps) => {
  const renderCellContent = (value: any) => {
    if (value === null || value === undefined || value === '') {
      return <span className="text-muted-foreground">-</span>;
    }

    const valueStr = value.toString().trim();
    
    // Show green check for "Yes"
    if (valueStr === "Yes") {
      return (
        <div className="flex justify-center">
          <Check className="h-5 w-5 text-green-600" />
        </div>
      );
    }
    
    // Show red X for "No"  
    if (valueStr === "No") {
      return (
        <div className="flex justify-center">
          <X className="h-5 w-5 text-red-600" />
        </div>
      );
    }

    // For all other values, just show the text
    return <span>{valueStr}</span>;
  };

  if (chartType === "Table") {
    if (!data || data.length === 0) {
      return (
        <div className="w-full text-center p-8">
          <p className="text-muted-foreground">No data available for table visualization</p>
        </div>
      );
    }

    // Use original column order if provided, otherwise fall back to existing logic
    let columns: string[];
    
    if (originalColumnOrder && originalColumnOrder.length > 0) {
      // Use the preserved column order from Excel - filter out any empty columns
      columns = originalColumnOrder.filter(col => col && col.trim() !== '');
    } else {
      // Fallback to existing logic for data that doesn't have preserved order
      const allKeys = Array.from(new Set(data.flatMap(item => Object.keys(item))));
      columns = allKeys.filter(key => key.trim() !== '');
    }

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
                {columns.map((column) => (
                  <TableHead key={column}>
                    {column}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={column}>
                      {renderCellContent(item[column])}
                    </TableCell>
                  ))}
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
