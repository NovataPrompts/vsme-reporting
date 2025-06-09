
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
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
      // Use the preserved column order - filter out any empty columns
      columns = originalColumnOrder.filter(col => col && col.trim() !== '');
      console.log('Using original column order:', columns);
    } else {
      // Fallback to existing logic for data that doesn't have preserved order
      const allKeys = Array.from(new Set(data.flatMap(item => Object.keys(item))));
      columns = allKeys.filter(key => key.trim() !== '');
      console.log('Using fallback column order:', columns);
    }

    console.log('Table data sample:', data[0]);
    console.log('Available columns in data:', Object.keys(data[0] || {}));

    return (
      <div className="w-full">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="overflow-auto max-h-[400px]">
          <Table className="table-fixed">
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column} className="w-1/4">
                    {column}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={column} className="w-1/4">
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

  if (chartType === "PieChart") {
    if (!data || data.length === 0) {
      return (
        <div className="w-full text-center p-8">
          <p className="text-muted-foreground">No data available for pie chart visualization</p>
        </div>
      );
    }

    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088aa', '#00C49F'];

    return (
      <div className="w-full">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ category, value, unit }) => `${category}: ${value} ${unit || ''}`}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value, name) => [`${value} ${data[0]?.unit || ''}`, name]} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (chartType === "StackedBarChart") {
    if (!data || data.length === 0) {
      return (
        <div className="w-full text-center p-8">
          <p className="text-muted-foreground">No data available for stacked bar chart visualization</p>
        </div>
      );
    }

    return (
      <div className="w-full">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis label={{ value: `Energy (${data[0]?.unit || ''})`, angle: -90, position: 'insideLeft' }} />
            <Tooltip formatter={(value, name) => [`${value} ${data[0]?.unit || ''}`, name]} />
            <Bar dataKey="renewable" stackId="energy" fill="#82ca9d" name="Renewable" />
            <Bar dataKey="nonRenewable" stackId="energy" fill="#ff7300" name="Non-renewable" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (chartType === "BarChart") {
    if (!data || data.length === 0) {
      return (
        <div className="w-full text-center p-8">
          <p className="text-muted-foreground">No data available for chart visualization</p>
        </div>
      );
    }

    return (
      <div className="w-full">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis label={{ value: `Value (${data[0]?.unit || ''})`, angle: -90, position: 'insideLeft' }} />
            <Tooltip formatter={(value, name) => [`${value} ${data[0]?.unit || ''}`, name]} />
            <Bar dataKey="value" fill="#8884d8" />
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
