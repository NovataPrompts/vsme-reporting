import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { metrics } from "@/components/dashboard/CalculatedMetrics";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const MetricDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const metric = metrics.find(m => m.id === Number(id));
  const [employeesLeft, setEmployeesLeft] = useState<string>("");
  const [averageEmployees, setAverageEmployees] = useState<string>("");
  const [calculatedValue, setCalculatedValue] = useState<string | null>(null);
  
  const calculateTurnoverRate = () => {
    const left = parseFloat(employeesLeft);
    const average = parseFloat(averageEmployees);
    
    if (isNaN(left) || isNaN(average) || average === 0) {
      setCalculatedValue("Invalid input");
      return;
    }
    
    const turnoverRate = (left / average) * 100;
    setCalculatedValue(turnoverRate.toFixed(1) + "%");
  };
  
  if (!metric) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-12">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex items-center mb-6">
              <Button 
                variant="ghost" 
                className="mr-2" 
                onClick={() => navigate("/metrics/calculated")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Metrics
              </Button>
            </div>
            <h1 className="text-3xl font-bold mb-6">Metric Not Found</h1>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const cleanTitle = metric.title.includes('(') 
    ? metric.title.substring(0, metric.title.indexOf('(')).trim() 
    : metric.title;

  const renderEmployeeTurnoverCalculator = () => {
    if (metric.id !== 3) return null; // Only show calculator for Employee Turnover Rate
    
    return (
      <div className="mt-8 p-6 bg-[#e3ecec] border border-[#008099]/30 rounded-lg">
        <h3 className="font-semibold text-lg mb-4">Employee Turnover Calculator</h3>
        
        <div className="space-y-4 mb-6">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            <p>According to VSME guidance:</p>
            <p className="mt-2">Employee turnover refers to employees who leave the undertaking voluntarily or due to dismissal, retirement, or death in service.</p>
            <p className="mt-2">An employee is defined as an individual who is in an employment relationship with the undertaking according to national law or practice.</p>
          </div>
          
          <div className="space-y-4">
            <div className="grid w-full gap-1.5">
              <Label htmlFor="employeesLeft">Number of employees who left during the reporting year</Label>
              <Input
                id="employeesLeft"
                type="number"
                value={employeesLeft}
                onChange={(e) => setEmployeesLeft(e.target.value)}
                placeholder="Enter number"
              />
            </div>
            
            <div className="grid w-full gap-1.5">
              <Label htmlFor="averageEmployees">Average number of employees during the reporting year</Label>
              <Input
                id="averageEmployees"
                type="number"
                value={averageEmployees}
                onChange={(e) => setAverageEmployees(e.target.value)}
                placeholder="Enter number"
              />
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Button onClick={calculateTurnoverRate}>Calculate</Button>
          
          {calculatedValue && (
            <div className="text-lg font-medium">
              <span>Turnover Rate: </span>
              <span className="font-bold text-[#00344d]">{calculatedValue}</span>
            </div>
          )}
        </div>
        
        <div className="mt-4 text-sm text-gray-600">
          <p>Formula: (Number of employees who left / Average number of employees) × 100</p>
        </div>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              className="mr-2" 
              onClick={() => navigate("/metrics/calculated")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Metrics
            </Button>
          </div>

          <Card className="shadow-sm border-[#008099]/30">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="h-16 w-16 flex items-center justify-center rounded-full bg-[#d8f225] border border-[#d8f225] text-[#00344d]">
                <metric.icon />
              </div>
              <div>
                <CardTitle 
                  className="text-3xl font-bold" 
                  style={{ color: metric.titleColor || '#008099' }}
                >
                  {cleanTitle}
                </CardTitle>
                <Badge 
                  variant="outline" 
                  className="mt-2 text-lg px-3 py-1 bg-[#e3ecec] border-[#008099]/30 text-[#008099]"
                >
                  {metric.reference}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="mt-2 mb-6">
                <p className="text-3xl font-bold text-[#00344d]">{metric.value}</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Description</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    {metric.description || "This metric tracks " + cleanTitle.toLowerCase() + " across the organization."}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-2">Calculation Method</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    {metric.calculationMethod || "Standard calculation methodology for " + cleanTitle + " according to VSME guidelines."}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-2">Reporting Period</h3>
                  <p className="text-gray-700 dark:text-gray-300">Annual (January - December 2023)</p>
                </div>
                
                {renderEmployeeTurnoverCalculator()}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MetricDetail;
