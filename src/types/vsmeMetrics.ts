
export interface VSMEMetric {
  module: string;
  disclosure: string;
  topic: string;
  section: string;
  subSection: string;
  reference: string;
  metric: string;
  novataReference?: string;
  definition?: string;
  question?: string;
  inputType?: string;
  unit?: string;
  response?: string;
  lastUpdated?: string;
}

export type Module = 'Basic' | 'Advanced' | 'Comprehensive';
