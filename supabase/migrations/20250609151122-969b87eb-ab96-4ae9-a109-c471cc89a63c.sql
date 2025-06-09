
-- Create a table for company profiles
CREATE TABLE public.company_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  company_structure TEXT,
  dba_name TEXT,
  year_of_incorporation INTEGER,
  company_description TEXT,
  website TEXT,
  country_of_domicile TEXT NOT NULL,
  primary_currency TEXT NOT NULL DEFAULT 'USD',
  fiscal_year_end DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.company_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
CREATE POLICY "Users can view their own company profile" 
  ON public.company_profiles 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own company profile" 
  ON public.company_profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own company profile" 
  ON public.company_profiles 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own company profile" 
  ON public.company_profiles 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create an index for faster lookups
CREATE INDEX idx_company_profiles_user_id ON public.company_profiles(user_id);
