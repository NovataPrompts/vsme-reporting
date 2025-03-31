
import { LucideIcon } from "lucide-react";

export interface Metric {
  id: string;
  name: string;
  description: string;
  category?: string;
  categoryId?: string;
}

export interface MetricCategory {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  metrics: Metric[];
}

export interface CalculatorInput {
  id: string;
  label: string;
  placeholder: string;
  type: "number" | "text" | "select";
  options?: Array<{ value: string; label: string }>;
}

export interface CalculatorConfig {
  id: string;
  title: string;
  description: string;
  guidance: string;
  formula: string;
  formulaDescription: string;
  vsmeReference: string;
  inputs: CalculatorInput[];
  calculateFunction: (inputs: Record<string, string>) => string;
}

