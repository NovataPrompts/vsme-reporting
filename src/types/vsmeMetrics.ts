
export interface VSMEMetric {
  module: string;
  disclosure: string;
  topic: string;
  section: string;
  subSection: string;
  reference: string;
  metric: string;
}

export type Module = 'Basic' | 'Advanced' | 'Comprehensive';
