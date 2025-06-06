

export interface VSMEMetric {
  id?: string; // Making id optional since static data won't have it initially
  module: string;
  disclosure: string;
  topic: string;
  section: string;
  subSection: string;
  reference: string;
  metric: string;
  novataReference?: string;  // Making novataReference optional
  order?: number;
  number?: string;
  paragraph?: string;
  subParagraph?: string;
  definition?: string;
  question?: string;
  inputType?: string;
  unit?: string;
  response?: string;
  formattedResponse?: string;
  lastUpdated?: string;
}

export type Module = 'Basic' | 'Advanced' | 'Comprehensive';

export type InputType = 'Multiple Choice' | 'Boolean' | 'Multi-Select' | 'Tabular' | 'Text' | 'Decimal' | 'Integer';

