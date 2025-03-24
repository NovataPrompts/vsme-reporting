
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
