
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
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
  // Blue and navy color scheme using design system colors
  const chartColors = ['#00344d', '#008099', '#539db5', '#0088aa', '#00C49F', '#82ca9d'];

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

    // Enhanced label function positioned outside the pie with larger, more legible text
    const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value, category, percentage }) => {
      const RADIAN = Math.PI / 180;
      // Position labels further outside the pie chart
      const radius = outerRadius + 60;
      const x = cx + radius * Math.cos(-midAngle * RADIAN);
      const y = cy + radius * Math.sin(-midAngle * RADIAN);

      // Multi-line label showing category, value, and percentage with larger text
      return (
        <g>
          <text 
            x={x} 
            y={y - 12} 
            fill="hsl(var(--foreground))" 
            textAnchor={x > cx ? 'start' : 'end'} 
            dominantBaseline="central"
            fontSize="14"
            fontWeight="600"
          >
            {category}
          </text>
          <text 
            x={x} 
            y={y + 2} 
            fill="hsl(var(--muted-foreground))" 
            textAnchor={x > cx ? 'start' : 'end'} 
            dominantBaseline="central"
            fontSize="13"
            fontWeight="500"
          >
            {`${value} MWh`}
          </text>
          <text 
            x={x} 
            y={y + 18} 
            fill="hsl(var(--foreground))" 
            textAnchor={x > cx ? 'start' : 'end'} 
            dominantBaseline="central"
            fontSize="13"
            fontWeight="600"
          >
            {percentage}
          </text>
        </g>
      );
    };

    return (
      <div className="w-full">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <ResponsiveContainer width="100%" height={500}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value, name) => [`${value} ${data[0]?.unit || ''}`, name]} 
              labelFormatter={(label, payload) => {
                if (payload && payload.length > 0) {
                  const item = payload[0].payload;
                  return `${item.category}: ${item.percentage}`;
                }
                return label;
              }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value, entry) => {
                const item = entry.payload;
                return `${item.category}: ${item.value} ${item.unit || ''} (${item.percentage})`;
              }}
            />
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

    // Custom label function for bars
    const renderBarLabel = (props: any) => {
      const { x, y, width, height, value } = props;
      if (value === 0) return null;
      
      return (
        <text 
          x={x + width / 2} 
          y={y + height / 2} 
          fill="white" 
          textAnchor="middle" 
          dy={3}
          fontSize="11"
          fontWeight="bold"
        >
          {`${value} MWh`}
        </text>
      );
    };

    return (
      <div className="w-full">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis label={{ value: `Energy (${data[0]?.unit || ''})`, angle: -90, position: 'insideLeft' }} />
            <Tooltip formatter={(value, name) => [`${value} ${data[0]?.unit || ''}`, name]} />
            <Legend />
            <Bar dataKey="renewable" stackId="energy" fill="#008099" name="Renewable" label={renderBarLabel} />
            <Bar dataKey="nonRenewable" stackId="energy" fill="#00344d" name="Non-renewable" label={renderBarLabel} />
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
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis label={{ value: `Value (${data[0]?.unit || ''})`, angle: -90, position: 'insideLeft' }} />
            <Tooltip formatter={(value, name) => [`${value} ${data[0]?.unit || ''}`, name]} />
            <Legend />
            <Bar dataKey="value" fill="#00344d" />
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
