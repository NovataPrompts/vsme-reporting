
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
    if (!data || data.length === 0) {
      return (
        <div className="w-full text-center p-8">
          <p className="text-muted-foreground">No data available for table visualization</p>
        </div>
      );
    }

    // Get all unique keys from the data to create dynamic columns
    const allKeys = Array.from(new Set(data.flatMap(item => Object.keys(item))));
    
    // Filter out empty keys and sort them logically
    const columns = allKeys.filter(key => key.trim() !== '').sort((a, b) => {
      // Put implementation status columns first
      if (a.toLowerCase().includes('implement') && !b.toLowerCase().includes('implement')) return -1;
      if (b.toLowerCase().includes('implement') && !a.toLowerCase().includes('implement')) return 1;
      // Then practice/area columns
      if (a.toLowerCase().includes('practice') || a.toLowerCase().includes('area')) return -1;
      if (b.toLowerCase().includes('practice') || b.toLowerCase().includes('area')) return 1;
      return a.localeCompare(b);
    });

    const renderCellContent = (value: any, columnKey: string) => {
      if (value === null || value === undefined || value === '') {
        return <span className="text-muted-foreground">-</span>;
      }

      // Check if this is an implementation status column
      const isImplementationColumn = columnKey.toLowerCase().includes('implement') || 
                                   columnKey.toLowerCase().includes('status');

      if (isImplementationColumn) {
        const isImplemented = value === 'Yes' || 
                             value === 'Implemented' || 
                             value === true || 
                             value?.toString().toLowerCase() === 'yes' ||
                             value?.toString().toLowerCase() === 'implemented';

        return (
          <div className="flex justify-center">
            {isImplemented ? (
              <Check className="h-5 w-5 text-green-600" />
            ) : (
              <X className="h-5 w-5 text-red-600" />
            )}
          </div>
        );
      }

      return <span>{value.toString()}</span>;
    };

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
                  <TableHead key={column} className={column.toLowerCase().includes('implement') || column.toLowerCase().includes('status') ? 'text-center' : ''}>
                    {column.replace(/[_-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={column} className={column.toLowerCase().includes('implement') || column.toLowerCase().includes('status') ? 'text-center' : ''}>
                      {renderCellContent(item[column], column)}
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
