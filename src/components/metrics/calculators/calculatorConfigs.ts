
import { CalculatorConfig } from "@/types/metrics";

// Employee Turnover Calculator Config
export const employeeTurnoverCalculator: CalculatorConfig = {
  id: "employee-turnover",
  title: "Employee Turnover Calculator",
  description: "Calculate your employee turnover rate",
  guidance: "Employee turnover refers to employees who leave the undertaking voluntarily or due to dismissal, retirement, or death in service. An employee is defined as an individual who is in an employment relationship with the undertaking according to national law or practice.",
  formula: "(left / average) * 100",
  formulaDescription: "(Number of employees who left / Average number of employees) × 100",
  vsmeReference: "VSME.B8.40",
  inputs: [
    {
      id: "employeesLeft",
      label: "Number of employees who left during the reporting year",
      placeholder: "Enter number",
      type: "number",
    },
    {
      id: "averageEmployees",
      label: "Average number of employees during the reporting year",
      placeholder: "Enter number",
      type: "number",
    }
  ],
  calculateFunction: (inputs) => {
    const left = parseFloat(inputs.employeesLeft);
    const average = parseFloat(inputs.averageEmployees);
    
    if (isNaN(left) || isNaN(average) || average === 0) {
      return "Invalid input";
    }
    
    const turnoverRate = (left / average) * 100;
    return turnoverRate.toFixed(1) + "%";
  }
};

// Gender Pay Gap Calculator Config
export const genderPayGapCalculator: CalculatorConfig = {
  id: "gender-pay-gap",
  title: "Gender Pay Gap Calculator",
  description: "Calculate your unadjusted gender pay gap",
  guidance: "The unadjusted gender pay gap represents the difference between average gross hourly earnings of male and female employees as a percentage of male gross earnings.",
  formula: "((male - female) / male) * 100",
  formulaDescription: "((Male median earnings - Female median earnings) / Male median earnings) × 100",
  vsmeReference: "VSME.B10.42.b",
  inputs: [
    {
      id: "maleMeanEarnings",
      label: "Median hourly earnings of male employees (€)",
      placeholder: "Enter amount",
      type: "number",
    },
    {
      id: "femaleMeanEarnings",
      label: "Median hourly earnings of female employees (€)",
      placeholder: "Enter amount",
      type: "number",
    }
  ],
  calculateFunction: (inputs) => {
    const male = parseFloat(inputs.maleMeanEarnings);
    const female = parseFloat(inputs.femaleMeanEarnings);
    
    if (isNaN(male) || isNaN(female) || male === 0) {
      return "Invalid input";
    }
    
    const payGap = ((male - female) / male) * 100;
    return payGap.toFixed(1) + "%";
  }
};

// GHG Intensity Calculator
export const ghgIntensityCalculator: CalculatorConfig = {
  id: "ghg-intensity",
  title: "GHG Intensity Calculator",
  description: "Calculate your greenhouse gas emissions intensity",
  guidance: "Greenhouse gas intensity measures the amount of greenhouse gas (GHG) emissions per unit of economic output, typically measured in tonnes of CO2 equivalent per million euros revenue.",
  formula: "totalEmissions / revenue",
  formulaDescription: "Total GHG emissions (tCO₂e) / Revenue (M€)",
  vsmeReference: "VSME.B3.31",
  inputs: [
    {
      id: "scope1Emissions",
      label: "Scope 1 GHG emissions (tCO₂e)",
      placeholder: "Enter amount",
      type: "number",
    },
    {
      id: "scope2Emissions",
      label: "Scope 2 GHG emissions (tCO₂e)",
      placeholder: "Enter amount",
      type: "number",
    },
    {
      id: "scope3Emissions",
      label: "Scope 3 GHG emissions (tCO₂e)",
      placeholder: "Enter amount", 
      type: "number",
    },
    {
      id: "annualRevenue",
      label: "Annual revenue (million €)",
      placeholder: "Enter amount",
      type: "number",
    }
  ],
  calculateFunction: (inputs) => {
    const scope1 = parseFloat(inputs.scope1Emissions) || 0;
    const scope2 = parseFloat(inputs.scope2Emissions) || 0;
    const scope3 = parseFloat(inputs.scope3Emissions) || 0;
    const revenue = parseFloat(inputs.annualRevenue);
    
    const totalEmissions = scope1 + scope2 + scope3;
    
    if (isNaN(revenue) || revenue <= 0 || isNaN(totalEmissions)) {
      return "Invalid input";
    }
    
    const intensity = totalEmissions / revenue;
    return intensity.toFixed(1) + " tCO₂e/M€";
  }
};

// Work-Related Accidents Calculator
export const workAccidentsCalculator: CalculatorConfig = {
  id: "work-accidents",
  title: "Work-Related Accidents Calculator",
  description: "Calculate your rate of work-related accidents",
  guidance: "The rate of work-related accidents represents the frequency of accidents in relation to the total number of hours worked by all employees.",
  formula: "(accidents / hoursWorked) * 200000",
  formulaDescription: "(Number of accidents / Total hours worked) × 200,000",
  vsmeReference: "VSME.B9.41a",
  inputs: [
    {
      id: "accidents",
      label: "Number of work-related accidents",
      placeholder: "Enter number",
      type: "number",
    },
    {
      id: "employees",
      label: "Number of full-time equivalent employees",
      placeholder: "Enter number",
      type: "number",
    },
    {
      id: "weeklyHours",
      label: "Average weekly hours worked per employee",
      placeholder: "Enter number (e.g., 40)",
      type: "number",
    },
    {
      id: "weeksWorked",
      label: "Number of working weeks in the year",
      placeholder: "Enter number (e.g., 48)",
      type: "number",
    }
  ],
  calculateFunction: (inputs) => {
    const accidents = parseFloat(inputs.accidents);
    const employees = parseFloat(inputs.employees);
    const weeklyHours = parseFloat(inputs.weeklyHours);
    const weeksWorked = parseFloat(inputs.weeksWorked);
    
    if (isNaN(accidents) || isNaN(employees) || isNaN(weeklyHours) || isNaN(weeksWorked) || 
        employees <= 0 || weeklyHours <= 0 || weeksWorked <= 0) {
      return "Invalid input";
    }
    
    const totalHoursWorked = employees * weeklyHours * weeksWorked;
    const accidentRate = (accidents / totalHoursWorked) * 200000; // 200,000 represents 100 employees working 40 hours per week, 50 weeks per year
    
    return accidentRate.toFixed(2);
  }
};

// Map metric IDs to calculator configs
export const calculatorConfigsMap: Record<number, CalculatorConfig> = {
  3: employeeTurnoverCalculator,
  2: ghgIntensityCalculator, 
  4: workAccidentsCalculator,
  5: genderPayGapCalculator,
};

// Get all calculator configs as an array
export const getAllCalculatorConfigs = (): CalculatorConfig[] => {
  return Object.values(calculatorConfigsMap);
};

// Get a calculator config by metric ID
export const getCalculatorConfigByMetricId = (id: number): CalculatorConfig | undefined => {
  return calculatorConfigsMap[id];
};

// Check if a metric has a calculator
export const hasCalculator = (id: number): boolean => {
  return !!calculatorConfigsMap[id];
};
