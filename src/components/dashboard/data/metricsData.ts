
import { RotateCcw, RefreshCcwDot } from 'lucide-react';

const PersonStanding = () => null;
const Gauge = () => null;
const AlertTriangle = () => null;
const Users = () => null;
const UserSquare2 = () => null;

export interface Metric {
  id: number;
  title: string;
  value: string;
  icon: React.FC;
  reference: string;
  description: string;
  calculationMethod: string;
  titleColor: string;
}

export const metrics: Metric[] = [
  {
    id: 1,
    title: "Gender Diversity Ratio (VSME.C5.60)",
    value: "3:1 (75%)",
    icon: PersonStanding,
    reference: "VSME.C5.60",
    description: "Measures the gender balance across the organization's workforce.",
    calculationMethod: "Ratio of female to male employees, calculated by total headcount.",
    titleColor: "#00f5f3"
  },
  {
    id: 2,
    title: "GHG Intensity (VSME.B3.31)",
    value: "3.2 tCO₂e/M€",
    icon: Gauge,
    reference: "VSME.B3.31",
    description: "Measures greenhouse gas emissions relative to revenue.",
    calculationMethod: "Total greenhouse gas emissions divided by total revenue in millions of euros.",
    titleColor: "#00f5f3"
  },
  {
    id: 3,
    title: "Employee Turnover Rate (VSME.B8.40)",
    value: "14.8%",
    icon: RefreshCcwDot,
    reference: "VSME.B8.40",
    description: "Percentage of employees who leave the organization in a given period.",
    calculationMethod: "Number of employees who left divided by total number of employees, multiplied by 100.",
    titleColor: "#00f5f3"
  },
  {
    id: 4,
    title: "Rate of Work-Related Accidents (VSME.B9.41a)",
    value: "2.1%",
    icon: AlertTriangle,
    reference: "VSME.B9.41a",
    description: "Frequency of work-related accidents within the organization.",
    calculationMethod: "Number of work-related accidents divided by total employee hours worked, multiplied by 200,000.",
    titleColor: "#00f5f3"
  },
  {
    id: 5,
    title: "Unadjusted Gender Pay Gap (VSME.B10.42.b)",
    value: "23.4%",
    icon: Users,
    reference: "VSME.B10.42.b",
    description: "Difference in average earnings between men and women in the organization.",
    calculationMethod: "Median earnings of men minus median earnings of women, divided by median earnings of men.",
    titleColor: "#00f5f3"
  },
  {
    id: 6,
    title: "Board Gender Ratio (VSME.C9.65)",
    value: "7:3 (70%:30%)",
    icon: UserSquare2,
    reference: "VSME.C9.65",
    description: "Gender composition of the organization's board of directors.",
    calculationMethod: "Proportion of board members by gender, calculated by total board headcount.",
    titleColor: "#00f5f3"
  }
];

export const emissionsData = [
  { name: 'Scope 1', value: 465 },
  { name: 'Scope 2', value: 740 },
  { name: 'Scope 3', value: 1595 },
];

// Updated colors as requested
export const COLORS = ['#00344d', '#008099', '#539db5'];

