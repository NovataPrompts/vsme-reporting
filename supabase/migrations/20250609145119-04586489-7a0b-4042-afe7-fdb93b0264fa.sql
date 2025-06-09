
-- Create a table to store parsed tabular data
CREATE TABLE public.tabular_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  novata_reference TEXT NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  original_filename TEXT,
  sheet_name TEXT,
  column_order TEXT[], -- Array to store the original column order
  data JSONB NOT NULL, -- The actual tabular data
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.tabular_data ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
CREATE POLICY "Users can view their own tabular data" 
  ON public.tabular_data 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tabular data" 
  ON public.tabular_data 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tabular data" 
  ON public.tabular_data 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tabular data" 
  ON public.tabular_data 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create an index for faster lookups
CREATE INDEX idx_tabular_data_novata_reference ON public.tabular_data(novata_reference);
CREATE INDEX idx_tabular_data_user_id ON public.tabular_data(user_id);
